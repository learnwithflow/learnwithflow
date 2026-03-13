import { checkSecurity } from '../../../lib/apiSecurity';

export async function POST(req) {
    const secError = await checkSecurity(req);
    if (secError) return secError;

    try {
        const { question, options, correctIndex, wrongIndex, subject } = await req.json();

        const correctAnswer = options[correctIndex];
        const wrongAnswer = options[wrongIndex];
        const optionLetters = ['A', 'B', 'C', 'D'];

        const prompt = `You are a precise and accurate educational tutor. A student answered a multiple choice question incorrectly.

Question: ${question}
Subject: ${subject || 'General'}

The student selected: ${optionLetters[wrongIndex]}) ${wrongAnswer}
The correct answer is: ${optionLetters[correctIndex]}) ${correctAnswer}

All other options:
${options.map((o, i) => `${optionLetters[i]}) ${o}`).join('\n')}

Write a clear, short (2-3 sentences max) explanation of EXACTLY WHY "${correctAnswer}" is correct for this question. Be factually accurate. Use subject-specific reasoning. Do NOT include the question text again. Just explain why the correct answer is right.`;

        const apiKey = process.env.GEMINI_EXAM_KEY;
        if (!apiKey) {
            return Response.json({ explanation: `The correct answer is ${correctAnswer}. This is the standard result for this type of question.` });
        }

        const { streamText } = await import('ai');
        const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
        const { createGroq } = await import('@ai-sdk/groq');
        const { createOpenAI } = await import('@ai-sdk/openai');

        const providers = [
            { model: createOpenAI({ baseURL: 'https://api.groq.com/openai/v1', apiKey: process.env.GROQ_EXAM_KEY })('llama-3.3-70b-versatile'), name: 'Groq' },
            { model: createGoogleGenerativeAI({ apiKey: process.env.GEMINI_EXAM_KEY })('gemini-2.0-flash'), name: 'Gemini' },
            { model: createOpenAI({ baseURL: 'https://openrouter.ai/api/v1', apiKey: process.env.OPENROUTER_EXAM_KEY })('meta-llama/llama-3.3-70b-instruct:free'), name: 'OpenRouter' }
        ];

        let lastError = null;
        for (const p of providers) {
            try {
                const result = streamText({
                    model: p.model,
                    prompt,
                    temperature: 0.2,
                    maxTokens: 200
                });
                return new Response(result.textStream);
            } catch (err) {
                console.error(`${p.name} explanation failed:`, err);
                lastError = err;
            }
        }
        throw lastError || new Error('All explanation providers failed');
    } catch (e) {
        console.error('Explain API error:', e);
        return Response.json({ explanation: 'Explanation unavailable at the moment.' }, { status: 500 });
    }
}
