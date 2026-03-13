async function callAI(messages) {
    const providers = [
        { url: 'https://api.groq.com/openai/v1/chat/completions', key: process.env.GROQ_ROADMAP_KEY, model: 'llama-3.3-70b-versatile', name: 'Groq' },
        { url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', key: process.env.GEMINI_ROADMAP_KEY, model: 'gemini-2.0-flash', name: 'Gemini' },
        { url: 'https://openrouter.ai/api/v1/chat/completions', key: process.env.OPENROUTER_ROADMAP_KEY, model: 'meta-llama/llama-3.3-70b-instruct:free', name: 'OpenRouter' },
    ];
    for (const p of providers) {
        if (!p.key) continue;
        try {
            const res = await fetch(p.url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${p.key}` }, body: JSON.stringify({ model: p.model, messages, max_tokens: 500, temperature: 0.7 }) });
            if (!res.ok) continue;
            const data = await res.json();
            return data.choices?.[0]?.message?.content || '';
        } catch (e) { continue; }
    }
    return 'Explanation unavailable. Please try again later.';
}

import { checkSecurity } from '../../../lib/apiSecurity';

export async function POST(req) {
    const secError = await checkSecurity(req);
    if (secError) return secError;

    try {
        const { messages } = await req.json();

        const { streamText } = await import('ai');
        const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
        const { createGroq } = await import('@ai-sdk/groq');
        const { createOpenAI } = await import('@ai-sdk/openai');

        const systemMessage = messages.find(m => m.role === 'system')?.content || 'You are an AI assistant.';
        const chatMessages = messages.filter(m => m.role !== 'system');

        const providers = [
            { model: createGroq({ apiKey: process.env.GROQ_ROADMAP_KEY })('llama-3.3-70b-versatile'), name: 'Groq' },
            { model: createGoogleGenerativeAI({ apiKey: process.env.GEMINI_ROADMAP_KEY })('gemini-2.0-flash'), name: 'Gemini-Main' },
            { model: createGoogleGenerativeAI({ apiKey: process.env.GEMINI_EXAM_KEY_2 })('gemini-2.0-flash'), name: 'Gemini-2' },
            { model: createGoogleGenerativeAI({ apiKey: process.env.GEMINI_EXAM_KEY_3 })('gemini-2.0-flash'), name: 'Gemini-3' },
            { model: createOpenAI({ baseURL: 'https://openrouter.ai/api/v1', apiKey: process.env.OPENROUTER_ROADMAP_KEY })('meta-llama/llama-3.3-70b-instruct:free'), name: 'OpenRouter' }
        ];

        let lastError = null;
        for (const p of providers) {
            try {
                const result = streamText({
                    model: p.model,
                    system: systemMessage,
                    messages: chatMessages,
                    maxTokens: 500,
                    temperature: 0.7
                });
                return new Response(result.textStream);
            } catch (err) {
                console.error(`${p.name} roadmap failed:`, err);
                lastError = err;
            }
        }
        throw lastError || new Error('All roadmap providers failed');
    } catch (e) {
        console.error('Roadmap API error:', e);
        return Response.json({ content: 'Error processing request.' }, { status: 500 });
    }
}
