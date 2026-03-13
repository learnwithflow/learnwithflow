async function callAI(messages, maxTokens = 800) {
    const providers = [
        { url: 'https://api.groq.com/openai/v1/chat/completions', key: process.env.GROQ_INTERVIEW_KEY, model: 'llama3-70b-8192', name: 'Groq' },
        { url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', key: process.env.GEMINI_INTERVIEW_KEY, model: 'gemini-2.0-flash', name: 'Gemini' },
        { url: 'https://openrouter.ai/api/v1/chat/completions', key: process.env.OPENROUTER_INTERVIEW_KEY, model: 'mistralai/mistral-7b-instruct', name: 'OpenRouter' },
    ];
    for (const p of providers) {
        if (!p.key) continue;
        try {
            const res = await fetch(p.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${p.key}` },
                body: JSON.stringify({ model: p.model, messages, max_tokens: maxTokens, temperature: 0.8 })
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                console.error(`${p.name} interview helper failed:`, res.status, errData);
                continue;
            }
            const data = await res.json();
            const content = data.choices?.[0]?.message?.content;
            if (content) return content;
        } catch (e) {
            console.error(`${p.name} interview helper error:`, e);
            continue;
        }
    }
    return '';
}

import { checkSecurity } from '../../../lib/apiSecurity';

export async function POST(req) {
    const secError = await checkSecurity(req);
    if (secError) return secError;

    try {
        const { messages, action } = await req.json();

        const { streamText } = await import('ai');
        const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
        const { createGroq } = await import('@ai-sdk/groq');
        const { createOpenAI } = await import('@ai-sdk/openai');

        const providers = [
            { model: createOpenAI({ baseURL: 'https://api.groq.com/openai/v1', apiKey: process.env.GROQ_INTERVIEW_KEY })('llama3-70b-8192'), name: 'Groq' },
            { model: createGoogleGenerativeAI({ apiKey: process.env.GEMINI_INTERVIEW_KEY })('gemini-2.0-flash'), name: 'Gemini-Main' },
            { model: createGoogleGenerativeAI({ apiKey: process.env.GEMINI_EXAM_KEY_2 })('gemini-2.0-flash'), name: 'Gemini-2' },
            { model: createGoogleGenerativeAI({ apiKey: process.env.GEMINI_EXAM_KEY_3 })('gemini-2.0-flash'), name: 'Gemini-3' },
            { model: createOpenAI({ baseURL: 'https://openrouter.ai/api/v1', apiKey: process.env.OPENROUTER_INTERVIEW_KEY })('mistralai/mistral-7b-instruct'), name: 'OpenRouter' }
        ];

        const isGenQs = action === 'generateQuestions';
        const maxTokens = isGenQs ? 2000 : 800;

        let lastError = null;
        for (const p of providers) {
            try {
                const result = streamText({
                    model: p.model,
                    messages,
                    maxTokens,
                    temperature: 0.8
                });
                return new Response(result.textStream);
            } catch (err) {
                console.error(`${p.name} interview failed:`, err);
                lastError = err;
            }
        }
        throw lastError || new Error('All interview providers failed');
    } catch (e) {
        console.error('Interview API error:', e);
        return Response.json({ content: 'Error processing request.' }, { status: 500 });
    }
}
