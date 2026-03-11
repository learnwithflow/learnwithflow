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
    const secError = checkSecurity(req);
    if (secError) return secError;

    try {
        const { messages } = await req.json();

        const { streamText } = await import('ai');
        const { google } = await import('@ai-sdk/google');

        const systemMessage = messages.find(m => m.role === 'system')?.content || 'You are an AI assistant.';
        const chatMessages = messages.filter(m => m.role !== 'system');

        const result = streamText({
            model: google('gemini-2.0-flash', { apiKey: process.env.GEMINI_ROADMAP_KEY }),
            system: systemMessage,
            messages: chatMessages,
            maxTokens: 500,
            temperature: 0.7
        });

        return new Response(result.textStream);
    } catch (e) {
        console.error('Roadmap API error:', e);
        return Response.json({ content: 'Error processing request.' }, { status: 500 });
    }
}
