async function callAI(messages) {
    const providers = [
        { url: 'https://api.groq.com/openai/v1/chat/completions', key: process.env.GROQ_EXAM_KEY, model: 'llama-3.3-70b-versatile', name: 'Groq' },
        { url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', key: process.env.GEMINI_EXAM_KEY, model: 'gemini-2.0-flash', name: 'Gemini' },
        { url: 'https://openrouter.ai/api/v1/chat/completions', key: process.env.OPENROUTER_EXAM_KEY, model: 'meta-llama/llama-3.3-70b-instruct:free', name: 'OpenRouter' },
    ];
    for (const p of providers) {
        if (!p.key) continue;
        try {
            const res = await fetch(p.url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${p.key}` }, body: JSON.stringify({ model: p.model, messages, max_tokens: 2000, temperature: 0.7 }) });
            if (!res.ok) continue;
            const data = await res.json();
            return data.choices?.[0]?.message?.content || '';
        } catch (e) { continue; }
    }
    return null;
}

export const maxDuration = 60;

import { checkSecurity } from '../../../lib/apiSecurity';

export async function POST(req) {
    const secError = checkSecurity(req);
    if (secError) return secError;

    try {
        const { messages, action, examType, chapter, count } = await req.json();

        // Generate exam questions dynamically
        if (action === 'generate') {
            const { generateObject } = await import('ai');
            const { google } = await import('@ai-sdk/google');
            const { z } = await import('zod');

            const result = await generateObject({
                model: google('gemini-2.0-flash', { apiKey: process.env.GEMINI_EXAM_KEY }),
                system: `You are an exam question generator. Generate exactly ${count || 10} multiple choice questions for ${examType || 'general'} exam${chapter ? ` on topic: ${chapter}` : ''}. Make questions challenging but fair.`,
                prompt: `Generate ${count || 10} questions now.`,
                schema: z.object({
                    questions: z.array(z.object({
                        s: z.string().describe("Subject"),
                        b: z.string().describe("Question text"),
                        o: z.array(z.string()).describe("4 options for the multiple choice question"),
                        a: z.number().describe("Index (0-3) of the correct option"),
                        e: z.string().optional().describe("Short 1-sentence explanation of why it is correct")
                    }))
                }),
                temperature: 0.7,
            });

            return Response.json(result.object.questions);
        }

        // Regular AI call
        const content = await callAI(messages);
        return Response.json({ content: content || 'Explanation unavailable.' });
    } catch (e) {
        return Response.json({ content: 'Error processing request.' }, { status: 500 });
    }
}
