import { checkSecurity } from '../../../lib/apiSecurity';

export const maxDuration = 120;

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
    const keys = [
        process.env.GEMINI_EXAM_KEY,
        process.env.GEMINI_EXAM_KEY_2,
        process.env.GEMINI_EXAM_KEY_3,
        process.env.GEMINI_EXAM_KEY_4,
    ].filter(Boolean);

    // Build ordered list of providers: All available Gemini keys (rotated), then Groq, then OpenRouter
    const providers = [];
    
    // Rotate Gemini keys based on global index
    for (let i = 0; i < keys.length; i++) {
        const keyVal = keys[(geminiKeyIndex + i) % keys.length];
        providers.push({ url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', key: keyVal, model: 'gemini-2.0-flash', name: `Gemini-${i+1}` });
    }
    // Increment index so next overarching call gets a different starting key
    if (keys.length > 0) geminiKeyIndex++;
    providers.push({ url: 'https://api.groq.com/openai/v1/chat/completions', key: process.env.GROQ_EXAM_KEY, model: 'llama3-70b-8192', name: 'Groq' });
    providers.push({ url: 'https://openrouter.ai/api/v1/chat/completions', key: process.env.OPENROUTER_EXAM_KEY, model: 'mistralai/mistral-7b-instruct', name: 'OpenRouter' });

    for (const p of providers) {
        if (!p.key) continue;
        try {
            const res = await fetch(p.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${p.key}` },
                body: JSON.stringify({ model: p.model, messages, max_tokens: 4000, temperature: 0.9 })
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

// Generate a batch of questions using a specific Provider model
async function generateBatchWorker({ provider, examType, chapter, count, excludeTexts, batchSeed, batchIndex }) {
    const { generateText } = await import('ai');

    const excludeNote = excludeTexts && excludeTexts.length > 0
        ? `\nCRITICAL CONSTRAINT: You MUST NOT generate any questions similar to these previously used topics/questions:\n${excludeTexts.slice(0, 300).map(t => `- ${t}`).join('\n')}\nIt is strictly forbidden to repeat them.`
        : '';

    const chapterNote = chapter === 'FULL_MOCK'
        ? '. Cover an equal, balanced mix of ALL subjects for this exam type.'
        : chapter
            ? ` on topic: ${chapter}`
            : '';

    const setNote = `\nInclude completely new questions for Set ${batchIndex + 1}.`;
    const dynamicInstruction = batchSeed.includes('-') && parseInt(batchSeed.split('-')[1]) > 1 
        ? `\nThis is a re-attempt. You MUST focus on completely DIFFERENT, rare, and obscure subtopics that you haven't used yet.` 
        : '';

    const system = `You are an expert exam question generator. Generate EXACTLY ${count} brand new, UNIQUE multiple choice questions for the ${examType || 'general'} exam${chapterNote}. 
Every question MUST be completely different from each other. 
Use varied difficulty levels and explore niche subtopics. Seed: ${batchSeed}.${setNote}${dynamicInstruction}${excludeNote}

Return ONLY a valid JSON object with format:
{"questions": [{"s": "Subject", "b": "Question text", "o": ["Option A", "Option B", "Option C", "Option D"], "a": 0, "e": "Short explanation"}]}`;

    const prompt = `Generate ${count} unique questions now. Set ${batchIndex + 1}. Return ONLY JSON.`;

    try {
        const result = await generateText({
            model: provider.model,
            system,
            prompt,
            temperature: 0.9,
            maxTokens: 16384,
        });

        const text = result.text.trim();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        // Some models return empty JSON \`{}\` which is invalid for our format
        if (!jsonMatch) throw new Error('No JSON in response');

        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            console.log(`${provider.name} generated ${parsed.questions.length} questions`);
            return parsed.questions;
        }
        throw new Error('Invalid format or missing questions array');
    } catch (err) {
        console.error(`🚨 [generateBatchWorker Error] Provider: ${provider.name}`);
        console.error(`   Message: ${err.message}`);
        console.error(`   Name: ${err.name}`);
        if (err.statusCode) console.error(`   Status Code: ${err.statusCode}`);
        if (err.cause) console.error(`   Cause:`, err.cause);
        
        throw err;
    }
}

// Generate all questions needed using parallel batching with multiple keys
async function generateAllQuestions({ examType, chapter, totalNeeded, excludeTexts }) {
    const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
    const { createGroq } = await import('@ai-sdk/groq');
    const { createOpenAI } = await import('@ai-sdk/openai');

    // Split total request into batches of max 15 questions each
    const BATCH_SIZE_LIMIT = 15;
    const batchesData = [];
    let remaining = totalNeeded;
    
    while (remaining > 0) {
        const batchSize = Math.min(remaining, BATCH_SIZE_LIMIT);
        batchesData.push({ count: batchSize });
        remaining -= batchSize;
    }

    console.log(`Splitting ${totalNeeded} questions into ${batchesData.length} chunks of max ${BATCH_SIZE_LIMIT} questions each.`);

    // Prepare all available models/providers
    const keys = [
        process.env.GEMINI_EXAM_KEY,
        process.env.GEMINI_EXAM_KEY_2, 
        process.env.GEMINI_EXAM_KEY_3,
        process.env.GEMINI_EXAM_KEY_4,
    ].filter(Boolean);

    // Hard fallback providers
    const fallbackProviders = [];
    if (process.env.GROQ_EXAM_KEY) {
        fallbackProviders.push({ 
            model: createOpenAI({ baseURL: 'https://api.groq.com/openai/v1', apiKey: process.env.GROQ_EXAM_KEY })('llama3-70b-8192'), 
            name: 'Groq',
            isFallback: true 
        });
    }
    if (process.env.OPENROUTER_EXAM_KEY) {
        fallbackProviders.push({ 
            model: createOpenAI({ baseURL: 'https://openrouter.ai/api/v1', apiKey: process.env.OPENROUTER_EXAM_KEY })('mistralai/mistral-7b-instruct'), 
            name: 'OpenRouter',
            isFallback: true 
        });
    }

    // Execute batches in parallel with staggered starts to avoid rate limits and Vercel timeouts
    const delay = ms => new Promise(res => setTimeout(res, ms));
    let batchResults = [];
    
    try {
        const batchPromises = batchesData.map(async (batchInfo, index) => {
            // Stagger the start time of each batch by 2.5 seconds
            if (index > 0) {
                console.log(`Delaying Batch ${index + 1} by ${index * 2500}ms to stagger requests...`);
                await delay(index * 2500);
            }

            // Strict rotation: Batch 1 -> Key 1, Batch 2 -> Key 2...
            const primaryKeyIndex = (geminiKeyIndex + index) % Math.max(1, keys.length);
            const primaryKey = keys.length > 0 ? keys[primaryKeyIndex] : null;
    
            const currentBatchProviders = [];
            if (primaryKey) {
                currentBatchProviders.push({
                    model: createGoogleGenerativeAI({ apiKey: primaryKey })('gemini-2.0-flash'),
                    name: `Gemini-${primaryKeyIndex + 1}`,
                    isFallback: false
                });
            }
            currentBatchProviders.push(...fallbackProviders);
    
            if (currentBatchProviders.length === 0) {
                console.error(`Batch ${index + 1} has no providers.`);
                return [];
            }
    
            // Attempt generation with retries using fallback providers if primary fails
            for (let attempt = 0; attempt < currentBatchProviders.length; attempt++) {
                const provider = currentBatchProviders[attempt];
                
                try {
                    console.log(`Starting Batch ${index + 1} (${batchInfo.count} qs) using ${provider.name}. Set: ${index + 1}`);
                    const batchSeed = `${Date.now()}-${index}-${attempt}`;
                    
                    const questions = await generateBatchWorker({
                        provider,
                        examType,
                        chapter,
                        count: batchInfo.count,
                        excludeTexts: excludeTexts,
                        batchSeed,
                        batchIndex: index
                    });
                    
                    return questions; // Success!
                } catch (err) {
                    console.warn(`⚠️ [Batch ${index + 1} Failed] Provider: ${provider.name}. Error: ${err.message}`);
                    if (attempt < currentBatchProviders.length - 1) {
                        const nextProvider = currentBatchProviders[attempt + 1];
                        console.log(`🔄 Proceeding to fallback: ${nextProvider.name}`);
                        // 3 second delay between failed provider retries
                        await delay(3000);
                    } else {
                        console.error(`❌ [Batch ${index + 1}] All providers failed for this batch.`);
                    }
                }
            }
            return []; // Return empty array if all providers fail for this specific batch
        });
        
        // Wait for all staggered batches to complete
        batchResults = await Promise.all(batchPromises);

    } catch (err) {
        console.error("Staggered parallel batch generation failed completely:", err.message);
        throw err; // Re-throw to fail the overall request and send 500 to frontend
    }

    // Advance the overarching index for the next request by how many batches we used
    if (keys.length > 0) {
        geminiKeyIndex = (geminiKeyIndex + batchesData.length) % keys.length;
    }

    const uniqueQMap = new Map();
    let currentExclude = [...(excludeTexts || [])];

    // Merge and dedupe results
    let addedTotal = 0;
    for (const batch of batchResults) {
        for (const q of batch) {
            if (!q.b || !q.o || q.o.length < 4 || typeof q.a !== 'number') continue;
            
            const key = q.b.trim().toLowerCase().substring(0, 100);
            const alreadySeen = currentExclude.some(ex => 
                ex.toLowerCase().substring(0, 80) === key.substring(0, 80)
            );
            
            if (!uniqueQMap.has(key) && !alreadySeen) {
                uniqueQMap.set(key, q);
                addedTotal++;
            }
        }
    }

    console.log(`Successfully merged ${addedTotal} total unique questions from parallel batches.`);
    
    return Array.from(uniqueQMap.values());
}


export async function POST(req) {
    const secError = await checkSecurity(req);
    if (secError) return secError;

    try {
        const { messages, action, examType, chapter, count, exclude } = await req.json();

        if (action === 'generate') {
            const needed = count || 10;
            const excludeTexts = exclude && Array.isArray(exclude) ? exclude : [];

            // We use the parallel batching approach, aiming to get 'needed' valid questions.
            // Under normal circumstances, 1 parallel pass will be enough.
            // If some fail, we fall back to short retries sequentially appended.
            
            let requestedTotal = needed + Math.min(10, Math.floor(needed * 0.2)); // Pad 20% to account for duplicates/bad generations
            
            let finalQuestions = [];
            let attempts = 0;
            const MAX_ITERATIONS = 3; // Maximum overarching iterations of full parallel calls
            let currentExclude = [...excludeTexts];

            while (finalQuestions.length < needed && attempts < MAX_ITERATIONS) {
                attempts++;
                const stillNeeded = needed - finalQuestions.length;
                console.log(`Parallel Generation Iteration ${attempts}: Need ${stillNeeded}`);

                const latestBatch = await generateAllQuestions({
                    examType,
                    chapter,
                    totalNeeded: stillNeeded + (attempts === 1 ? Math.min(10, Math.floor(stillNeeded * 0.2)) : 0), 
                    excludeTexts: currentExclude
                });

                // Deduplicate with existing final questions
                const newlyAdded = [];
                for (const q of latestBatch) {
                     const key = q.b.trim().toLowerCase().substring(0, 100);
                     const alreadyExists = finalQuestions.some(existing => existing.b.trim().toLowerCase().substring(0, 100) === key);
                     if (!alreadyExists && finalQuestions.length < needed) {
                         finalQuestions.push(q);
                         newlyAdded.push(q.b.substring(0,80));
                     }
                }
                
                currentExclude = [...currentExclude, ...newlyAdded];
                console.log(`Finished Iteration ${attempts}. Current Total: ${finalQuestions.length}/${needed}`);

                if (finalQuestions.length >= needed || latestBatch.length === 0) {
                    break;
                }
            }
            
            console.log(`Returning final ${finalQuestions.length} questions.`);
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
