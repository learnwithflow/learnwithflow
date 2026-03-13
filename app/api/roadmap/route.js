import { checkSecurity } from '../../../lib/apiSecurity';

export const maxDuration = 60;

export async function POST(req) {
    const secError = await checkSecurity(req);
    if (secError) return secError;

    try {
        const { messages } = await req.json();

        const { streamText } = await import('ai');
        const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
        const { createGroq } = await import('@ai-sdk/groq');
        const { createOpenAI } = await import('@ai-sdk/openai');

        const systemMessage = messages.find(m => m.role === 'system')?.content || 'You are an expert learning AI assistant. Help the user understand topics on their roadmap. Be concise and practical.';
        const chatMessages = messages.filter(m => m.role !== 'system');

        const providers = [
            { model: createOpenAI({ baseURL: 'https://api.groq.com/openai/v1', apiKey: process.env.GROQ_ROADMAP_KEY })('llama-3.3-70b-versatile'), name: 'Groq' },
            { model: createGoogleGenerativeAI({ apiKey: process.env.GEMINI_ROADMAP_KEY })('gemini-2.0-flash'), name: 'Gemini-Main' },
            { model: createGoogleGenerativeAI({ apiKey: process.env.GEMINI_EXAM_KEY_2 })('gemini-2.0-flash'), name: 'Gemini-2' },
            { model: createGoogleGenerativeAI({ apiKey: process.env.GEMINI_EXAM_KEY_3 })('gemini-2.0-flash'), name: 'Gemini-3' },
            { model: createGoogleGenerativeAI({ apiKey: process.env.GEMINI_EXAM_KEY_4 })('gemini-2.0-flash'), name: 'Gemini-4' },
            { model: createOpenAI({ baseURL: 'https://openrouter.ai/api/v1', apiKey: process.env.OPENROUTER_ROADMAP_KEY })('meta-llama/llama-3.3-70b-instruct:free'), name: 'OpenRouter' }
        ];

        let lastError = null;
        for (const p of providers) {
            try {
                const result = await streamText({
                    model: p.model,
                    system: systemMessage,
                    messages: chatMessages,
                    maxTokens: 600,
                    temperature: 0.7
                });
                // Return the stream as a Response
                return result.toTextStreamResponse();
            } catch (err) {
                console.error(`${p.name} roadmap failed:`, err.message || err);
                lastError = err;
            }
        }
        throw lastError || new Error('All roadmap providers failed');
    } catch (e) {
        console.error('Roadmap API error:', e.message || e);
        return new Response('Sorry, I could not process your request. Please try again.', {
            status: 200, // Return 200 so client doesn't show "network error"
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}
