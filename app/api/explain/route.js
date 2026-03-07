export async function POST(req) {
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
        const { google } = await import('@ai-sdk/google');

        const result = streamText({
            model: google('gemini-2.0-flash', { apiKey }),
            prompt,
            temperature: 0.2,
            maxTokens: 200
        });

        return result.toTextStreamResponse();
    } catch (e) {
        console.error('Explain API error:', e);
        return Response.json({ explanation: 'Explanation unavailable at the moment.' }, { status: 500 });
    }
}
