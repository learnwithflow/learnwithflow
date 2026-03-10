async function callAI(messages, maxTokens = 800) {
    const providers = [
        { url: 'https://api.groq.com/openai/v1/chat/completions', key: process.env.GROQ_INTERVIEW_KEY, model: 'llama-3.3-70b-versatile', name: 'Groq' },
        { url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', key: process.env.GEMINI_INTERVIEW_KEY, model: 'gemini-2.0-flash', name: 'Gemini' },
        { url: 'https://openrouter.ai/api/v1/chat/completions', key: process.env.OPENROUTER_INTERVIEW_KEY, model: 'meta-llama/llama-3.3-70b-instruct:free', name: 'OpenRouter' },
    ];
    for (const p of providers) {
        if (!p.key) continue;
        try {
            const res = await fetch(p.url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${p.key}` }, body: JSON.stringify({ model: p.model, messages, max_tokens: maxTokens, temperature: 0.8 }) });
            if (!res.ok) continue;
            const data = await res.json();
            return data.choices?.[0]?.message?.content || '';
        } catch (e) { continue; }
    }
    return '';
}

import { checkSecurity } from '../../../lib/apiSecurity';

export async function POST(req) {
    const secError = checkSecurity(req);
    if (secError) return secError;

    try {
        const { messages, action } = await req.json();

        const { streamText } = await import('ai');
        const { google } = await import('@ai-sdk/google');

        if (action === 'generateQuestions') {
            const result = streamText({
                model: google('gemini-2.0-flash', { apiKey: process.env.GEMINI_INTERVIEW_KEY }),
                messages,
                maxTokens: 2000,
                temperature: 0.8
            });
            return result.toTextStreamResponse();
        }

        const result = streamText({
            model: google('gemini-2.0-flash', { apiKey: process.env.GEMINI_INTERVIEW_KEY }),
            messages,
            maxTokens: 800,
            temperature: 0.8
        });
        return result.toTextStreamResponse();
    } catch (e) {
        return Response.json({ content: 'Error processing request.' }, { status: 500 });
    }
}
