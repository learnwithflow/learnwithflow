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

async function callAI(messages) {
    const providers = [
        { url: 'https://api.groq.com/openai/v1/chat/completions', key: process.env.GROQ_EXAM_KEY, model: 'llama-3.3-70b-versatile', name: 'Groq' },
        { url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', key: getNextGeminiKey(), model: 'gemini-2.0-flash', name: 'Gemini' },
        { url: 'https://openrouter.ai/api/v1/chat/completions', key: process.env.OPENROUTER_EXAM_KEY, model: 'meta-llama/llama-3.3-70b-instruct:free', name: 'OpenRouter' },
    ];
    for (const p of providers) {
        if (!p.key) continue;
        try {
            const res = await fetch(p.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${p.key}` },
                body: JSON.stringify({ model: p.model, messages, max_tokens: 2000, temperature: 0.9 })
            });
            if (!res.ok) {
                console.error(`${p.name} failed:`, res.status);
                continue;
            }
            const data = await res.json();
            const content = data.choices?.[0]?.message?.content;
            if (content) return content;
        } catch (e) {
            console.error(`${p.name} error:`, e.message);
            continue;
        }
    }
    return null;
}

// Generate a batch of questions using a specific Gemini key
async function generateBatch({ examType, chapter, count, excludeTexts, batchSeed }) {
    const { generateText } = await import('ai');
    const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
    const { createGroq } = await import('@ai-sdk/groq');
    const { createOpenAI } = await import('@ai-sdk/openai');
    const { z } = await import('zod');

    const excludeNote = excludeTexts && excludeTexts.length > 0
        ? `\nSTRICTLY AVOID generating questions similar to these (already used): ${excludeTexts.slice(0, 60).join(' | ')}`
        : '';

    const chapterNote = chapter === 'FULL_MOCK'
        ? '. Cover an equal, balanced mix of ALL subjects for this exam type.'
        : chapter
            ? ` on topic: ${chapter}`
            : '';

    const dynamicInstruction = batchSeed.includes('-') && parseInt(batchSeed.split('-')[1]) > 1 
        ? `\nThis is a re-attempt. You MUST focus on completely DIFFERENT, rare, and obscure subtopics that you haven't used yet.` 
        : '';

    const system = `You are an exam question generator. Generate EXACTLY ${count} brand new, UNIQUE multiple choice questions for the ${examType || 'general'} exam${chapterNote}. Every question MUST be completely different from each other and from the excluded list. Use varied difficulty levels and different subtopics. Seed: ${batchSeed}.${dynamicInstruction}${excludeNote}

Return ONLY a valid JSON object with format:
{"questions": [{"s": "Subject", "b": "Question text", "o": ["Option A", "Option B", "Option C", "Option D"], "a": 0, "e": "Short explanation"}]}`;

    const prompt = `Generate ${count} unique questions now. Return ONLY JSON.`;

    // Try all available Gemini keys + Groq + OpenRouter
    const keys = [
        process.env.GEMINI_EXAM_KEY,
        process.env.GEMINI_EXAM_KEY_2, 
        process.env.GEMINI_EXAM_KEY_3,
        process.env.GEMINI_EXAM_KEY_4,
    ].filter(Boolean);

    const providers = [
        ...keys.map((key, i) => ({
            model: createGoogleGenerativeAI({ apiKey: key })('gemini-2.0-flash'),
            name: `Gemini-${i + 1}`
        })),
        { model: createGroq({ apiKey: process.env.GROQ_EXAM_KEY })('llama-3.3-70b-versatile'), name: 'Groq' },
        { model: createOpenAI({ baseURL: 'https://openrouter.ai/api/v1', apiKey: process.env.OPENROUTER_EXAM_KEY })('meta-llama/llama-3.3-70b-instruct:free'), name: 'OpenRouter' }
    ].sort(() => Math.random() - 0.5); // Shuffle to avoid hitting the exact same model every time

    for (const p of providers) {
        try {
            const result = await generateText({
                model: p.model,
                system,
                prompt,
                temperature: 0.9,
                maxTokens: 8192,
            });

            const text = result.text.trim();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('No JSON in response');

            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
                console.log(`${p.name} generated ${parsed.questions.length} questions`);
                return parsed.questions;
            }
            throw new Error('Invalid format');
        } catch (err) {
            console.error(`${p.name} batch failed:`, err.message);
            continue;
        }
    }
    return [];
}

export async function POST(req) {
    const secError = await checkSecurity(req);
    if (secError) return secError;

    try {
        const { messages, action, examType, chapter, count, exclude } = await req.json();

        if (action === 'generate') {
            const needed = count || 10;
            const excludeTexts = exclude && Array.isArray(exclude) ? exclude : [];

            // Track seen question texts to deduplicate within this request
            const uniqueQMap = new Map(); // key: normalized question text -> question object
            const BATCH_SIZE = Math.min(needed, 45); // AI generates up to 45 per call
            const MAX_ATTEMPTS = Math.ceil(needed / BATCH_SIZE) + 5; // Extra attempts to fill

            let attempts = 0;

            while (uniqueQMap.size < needed && attempts < MAX_ATTEMPTS) {
                attempts++;
                const stillNeeded = needed - uniqueQMap.size;
                const batchCount = Math.min(BATCH_SIZE, stillNeeded + 3); // Request a few extra
                const currentExclude = [
                    ...excludeTexts,
                    ...Array.from(uniqueQMap.values()).map(q => q.b.substring(0, 80))
                ];

                console.log(`Attempt ${attempts}: need ${stillNeeded} more, requesting ${batchCount}`);

                const batch = await generateBatch({
                    examType,
                    chapter,
                    count: batchCount,
                    excludeTexts: currentExclude,
                    batchSeed: `${Date.now()}-${attempts}`,
                });

                let addedThisBatch = 0;
                for (const q of batch) {
                    if (!q.b || !q.o || q.o.length < 4 || typeof q.a !== 'number') continue;
                    const key = q.b.trim().toLowerCase().substring(0, 100);
                    // Check it's not already in our map and not in exclude list
                    const alreadySeen = excludeTexts.some(ex => 
                        ex.toLowerCase().substring(0, 80) === key.substring(0, 80)
                    );
                    if (!uniqueQMap.has(key) && !alreadySeen) {
                        uniqueQMap.set(key, q);
                        addedThisBatch++;
                    }
                }
                console.log(`Added ${addedThisBatch} new questions. Total: ${uniqueQMap.size}/${needed}`);

                if (addedThisBatch === 0 && attempts > 3) {
                    console.log('No new questions added, stopping early');
                    break;
                }
            }

            const finalQuestions = Array.from(uniqueQMap.values()).slice(0, needed);
            console.log(`Final: returning ${finalQuestions.length} questions`);
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
