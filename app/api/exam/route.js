import { checkSecurity } from '../../../lib/apiSecurity';

export const maxDuration = 60;

// Round-robin key index stored in module scope (resets per cold start, good enough)
let geminiKeyIndex = 0;

function getNextGeminiKey() {
    const keys = [
        process.env.GEMINI_EXAM_KEY,
        process.env.GEMINI_EXAM_KEY_2,
        process.env.GEMINI_EXAM_KEY_3,
        process.env.GEMINI_EXAM_KEY_4,
    ].filter(Boolean);
    if (keys.length === 0) return null;
    const key = keys[geminiKeyIndex % keys.length];
    geminiKeyIndex++;
    return key;
}

// Direct fetch to AI providers (no AI SDK overhead)
async function callProvider(provider, systemPrompt, userPrompt) {
    const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
    ];

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 45000); // 45s hard timeout per provider

        const res = await fetch(provider.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${provider.key}` },
            body: JSON.stringify({ model: provider.model, messages, max_tokens: 16384, temperature: 0.9 }),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!res.ok) {
            console.error(`${provider.name} failed: ${res.status}`);
            return null;
        }

        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content) return null;

        // Parse JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return null;

        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            console.log(`${provider.name} generated ${parsed.questions.length} questions`);
            return parsed.questions;
        }
        return null;
    } catch (e) {
        console.error(`${provider.name} error:`, e.message);
        return null;
    }
}

// Build prompt for question generation
function buildPrompts({ examType, chapter, count, excludeTexts, batchIndex }) {
    const excludeNote = excludeTexts && excludeTexts.length > 0
        ? `\nCRITICAL: Do NOT generate questions similar to these:\n${excludeTexts.slice(0, 200).map(t => `- ${t}`).join('\n')}`
        : '';

    const chapterNote = chapter === 'FULL_MOCK'
        ? '. Cover a balanced mix of ALL subjects.'
        : chapter ? ` on topic: ${chapter}` : '';

    const system = `You are an expert exam question generator. Generate EXACTLY ${count} unique multiple choice questions for the ${examType || 'general'} exam${chapterNote}. 
Every question MUST be completely different. Use varied difficulty levels. Batch: ${batchIndex + 1}, Seed: ${Date.now()}.${excludeNote}

Return ONLY a valid JSON object:
{"questions": [{"s": "Subject", "b": "Question text", "o": ["A", "B", "C", "D"], "a": 0, "e": "Short explanation"}]}`;

    const prompt = `Generate ${count} unique questions now. Return ONLY JSON.`;
    return { system, prompt };
}

// Get all available providers in priority order
function getAllProviders() {
    const keys = [
        process.env.GEMINI_EXAM_KEY,
        process.env.GEMINI_EXAM_KEY_2,
        process.env.GEMINI_EXAM_KEY_3,
        process.env.GEMINI_EXAM_KEY_4,
    ].filter(Boolean);

    const providers = [];

    // Add all Gemini keys (rotated)
    for (let i = 0; i < keys.length; i++) {
        const keyIdx = (geminiKeyIndex + i) % keys.length;
        providers.push({
            url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
            key: keys[keyIdx],
            model: 'gemini-2.0-flash',
            name: `Gemini-${keyIdx + 1}`
        });
    }

    if (process.env.GROQ_EXAM_KEY) {
        providers.push({
            url: 'https://api.groq.com/openai/v1/chat/completions',
            key: process.env.GROQ_EXAM_KEY,
            model: 'llama-3.3-70b-versatile',
            name: 'Groq'
        });
    }

    if (process.env.OPENROUTER_EXAM_KEY) {
        providers.push({
            url: 'https://openrouter.ai/api/v1/chat/completions',
            key: process.env.OPENROUTER_EXAM_KEY,
            model: 'meta-llama/llama-3.3-70b-instruct:free',
            name: 'OpenRouter'
        });
    }

    return providers;
}

// Generate questions using parallel calls with NO delays
async function generateAllQuestions({ examType, chapter, totalNeeded, excludeTexts }) {
    const keys = [
        process.env.GEMINI_EXAM_KEY,
        process.env.GEMINI_EXAM_KEY_2,
        process.env.GEMINI_EXAM_KEY_3,
        process.env.GEMINI_EXAM_KEY_4,
    ].filter(Boolean);

    // Split into batches: 1 batch per Gemini key (each generates totalNeeded/numKeys questions)
    // For 30 qs with 4 keys: 4 parallel calls of ~8 questions each
    // For 60 qs with 4 keys: 4 parallel calls of 15 each
    // For 90 qs with 4 keys: 4 parallel calls of ~23 each
    const numBatches = Math.max(1, Math.min(keys.length, 4));
    const perBatch = Math.ceil((totalNeeded + 5) / numBatches); // +5 padding for dedup losses

    console.log(`Splitting ${totalNeeded} questions into ${numBatches} PARALLEL batches of ~${perBatch} each (no delays)`);

    const fallbackProviders = getAllProviders().filter(p => !p.name.startsWith('Gemini'));

    const batchPromises = [];
    for (let i = 0; i < numBatches; i++) {
        const keyIdx = (geminiKeyIndex + i) % Math.max(1, keys.length);
        const primaryProvider = keys.length > 0 ? {
            url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
            key: keys[keyIdx],
            model: 'gemini-2.0-flash',
            name: `Gemini-${keyIdx + 1}`
        } : null;

        batchPromises.push((async (batchIndex) => {
            const { system, prompt } = buildPrompts({ examType, chapter, count: perBatch, excludeTexts, batchIndex });

            // Try primary provider first, then fallbacks
            const tryProviders = primaryProvider ? [primaryProvider, ...fallbackProviders] : fallbackProviders;

            for (const provider of tryProviders) {
                const questions = await callProvider(provider, system, prompt);
                if (questions && questions.length > 0) return questions;
                console.warn(`Batch ${batchIndex + 1}: ${provider.name} failed, trying next...`);
            }

            console.error(`Batch ${batchIndex + 1}: ALL providers failed`);
            return [];
        })(i));
    }

    // Wait for ALL batches simultaneously (no stagger!)
    const batchResults = await Promise.all(batchPromises);

    // Advance key index for next request
    if (keys.length > 0) {
        geminiKeyIndex = (geminiKeyIndex + numBatches) % keys.length;
    }

    // Merge & deduplicate
    const uniqueQMap = new Map();
    const excludeSet = new Set((excludeTexts || []).map(t => t.toLowerCase().substring(0, 80)));

    for (const batch of batchResults) {
        for (const q of batch) {
            if (!q.b || !q.o || q.o.length < 4 || typeof q.a !== 'number') continue;
            const key = q.b.trim().toLowerCase().substring(0, 100);
            if (!uniqueQMap.has(key) && !excludeSet.has(key.substring(0, 80))) {
                uniqueQMap.set(key, q);
            }
        }
    }

    console.log(`Merged ${uniqueQMap.size} unique questions from ${numBatches} parallel batches`);
    return Array.from(uniqueQMap.values());
}

// Regular AI call (for explanations etc.)
async function callAI(messages) {
    const providers = getAllProviders();

    for (const p of providers) {
        if (!p.key) continue;
        try {
            const res = await fetch(p.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${p.key}` },
                body: JSON.stringify({ model: p.model, messages, max_tokens: 4000, temperature: 0.9 })
            });
            if (!res.ok) continue;
            const data = await res.json();
            const content = data.choices?.[0]?.message?.content;
            if (content) return content;
        } catch (e) {
            continue;
        }
    }
    return null;
}


export async function POST(req) {
    const secError = await checkSecurity(req);
    if (secError) return secError;

    try {
        const { messages, action, examType, chapter, count, exclude } = await req.json();

        if (action === 'generate') {
            const needed = count || 10;
            const excludeTexts = exclude && Array.isArray(exclude) ? exclude : [];

            let finalQuestions = [];
            let attempts = 0;
            const MAX_ITERATIONS = 2;
            let currentExclude = [...excludeTexts];

            while (finalQuestions.length < needed && attempts < MAX_ITERATIONS) {
                attempts++;
                const stillNeeded = needed - finalQuestions.length;
                console.log(`Iteration ${attempts}: Need ${stillNeeded} more questions`);

                const latestBatch = await generateAllQuestions({
                    examType,
                    chapter,
                    totalNeeded: stillNeeded,
                    excludeTexts: currentExclude
                });

                for (const q of latestBatch) {
                    const key = q.b.trim().toLowerCase().substring(0, 100);
                    const alreadyExists = finalQuestions.some(ex => ex.b.trim().toLowerCase().substring(0, 100) === key);
                    if (!alreadyExists && finalQuestions.length < needed) {
                        finalQuestions.push(q);
                        currentExclude.push(q.b.substring(0, 80));
                    }
                }

                console.log(`Iteration ${attempts} done. Total: ${finalQuestions.length}/${needed}`);
                if (latestBatch.length === 0) break;
            }

            console.log(`Returning ${finalQuestions.length} questions`);
            return Response.json(finalQuestions);
        }

        // Regular AI call (for explanations etc.)
        const content = await callAI(messages);
        return Response.json({ content: content || 'Explanation unavailable.' });

    } catch (e) {
        console.error('Exam API error:', e.message || e);
        return Response.json({ content: 'Error processing request.' }, { status: 500 });
    }
}
