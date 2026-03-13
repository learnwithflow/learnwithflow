async function callAI(messages) {
    const providers = [
        { url: 'https://api.groq.com/openai/v1/chat/completions', key: process.env.GROQ_EXAM_KEY, model: 'llama-3.3-70b-versatile', name: 'Groq' },
        { url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', key: process.env.GEMINI_EXAM_KEY, model: 'gemini-2.0-flash', name: 'Gemini' },
        { url: 'https://openrouter.ai/api/v1/chat/completions', key: process.env.OPENROUTER_EXAM_KEY, model: 'meta-llama/llama-3.3-70b-instruct:free', name: 'OpenRouter' },
    ];
    for (const p of providers) {
        if (!p.key) continue;
        try {
            const res = await fetch(p.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${p.key}` },
                body: JSON.stringify({ model: p.model, messages, max_tokens: 2000, temperature: 0.7 })
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                console.error(`${p.name} helper failed:`, res.status, errData);
                continue;
            }
            const data = await res.json();
            const content = data.choices?.[0]?.message?.content;
            if (content) return content;
        } catch (e) {
            console.error(`${p.name} helper error:`, e);
            continue;
        }
    }
    return null;
}

export const maxDuration = 60;

import { checkSecurity } from '../../../lib/apiSecurity';

export async function POST(req) {
    const secError = await checkSecurity(req);
    if (secError) return secError;

    try {
        const { messages, action, examType, chapter, count, exclude } = await req.json();

        // Generate exam questions dynamically
        if (action === 'generate') {
            const { generateObject, generateText } = await import('ai');
            const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
            const { createGroq } = await import('@ai-sdk/groq');
            const { createOpenAI } = await import('@ai-sdk/openai');
            const { z } = await import('zod');

            const schema = z.object({
                questions: z.array(z.object({
                    s: z.string().describe("Subject"),
                    b: z.string().describe("Question text"),
                    o: z.array(z.string()).describe("4 options for the multiple choice question"),
                    a: z.number().describe("Index (0-3) of the correct option"),
                    e: z.string().optional().describe("Short 1-sentence explanation of why it is correct")
                }))
            });

            const excludeText = exclude && Array.isArray(exclude) && exclude.length > 0 
                ? `\nCRITICAL: DO NOT generate any of the following questions (avoid these topics/questions): ${exclude.slice(0, 50).join(', ')}`
                : '';

            const system = `You are an exam question generator. Generate exactly ${count || 10} multiple choice questions for ${examType || 'general'} exam${chapter === 'FULL_MOCK' ? '. Ensure the questions cover an equal, balanced mix of ALL subjects for this exam type (e.g. Physics, Chemistry, Maths for EAMCET)' : chapter ? ` on topic: ${chapter}` : ''}. Make questions challenging but fair.${excludeText}`;
            const prompt = `Generate ${count || 10} questions now.`;

            const providers = [
                { model: createGroq({ apiKey: process.env.GROQ_EXAM_KEY })('llama-3.3-70b-versatile'), name: 'Groq' },
                { model: createGoogleGenerativeAI({ apiKey: process.env.GEMINI_EXAM_KEY })('gemini-2.0-flash'), name: 'Gemini' },
                { model: createGoogleGenerativeAI({ apiKey: process.env.GEMINI_EXAM_KEY_2 })('gemini-2.0-flash'), name: 'Gemini-2' },
                { model: createGoogleGenerativeAI({ apiKey: process.env.GEMINI_EXAM_KEY_3 })('gemini-2.0-flash'), name: 'Gemini-3' },
                { model: createGoogleGenerativeAI({ apiKey: process.env.GEMINI_EXAM_KEY_4 })('gemini-2.0-flash'), name: 'Gemini-4' },
                { model: createOpenAI({ baseURL: 'https://openrouter.ai/api/v1', apiKey: process.env.OPENROUTER_EXAM_KEY })('meta-llama/llama-3.3-70b-instruct:free'), name: 'OpenRouter' }
            ];

            const jsonInstructions = `Respond with a JSON object containing an array designated by the key "questions". Each object in the array MUST have these keys:
- "s": Subject
- "b": Question text
- "o": Array of 4 options
- "a": Index (0-3) of correct option
- "e": Short explanation
Return ONLY the JSON.`;

            let lastError = null;
            for (const p of providers) {
                try {
                    const result = await generateText({
                        model: p.model,
                        system: system + "\n" + jsonInstructions,
                        prompt,
                        temperature: 0.7,
                    });
                    
                    const text = result.text.trim();
                    const jsonMatch = text.match(/\{[\s\S]*\}/);
                    if (!jsonMatch) throw new Error("No JSON found in response");
                    
                    const parsed = JSON.parse(jsonMatch[0]);
                    if (parsed.questions && Array.isArray(parsed.questions)) {
                        return Response.json(parsed.questions);
                    }
                    throw new Error("Invalid response format");
                } catch (err) {
                    console.error(`${p.name} generation failed:`, err.message || err);
                    lastError = err;
                }
            }
            throw lastError || new Error('All generation providers failed');
        }

        // Regular AI call
        const content = await callAI(messages);
        return Response.json({ content: content || 'Explanation unavailable.' });
    } catch (e) {
        console.error('Exam API error:', e.message || e);
        return Response.json({ content: 'Error processing request.' }, { status: 500 });
    }
}
