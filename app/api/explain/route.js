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

        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.2, maxOutputTokens: 200 }
                })
            }
        );

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error('Gemini API error:', errorData);
            return Response.json({
                explanation: `The correct answer is ${correctAnswer}. Review this topic to understand why.`
            });
        }

        const data = await res.json();
        const explanation = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
            `The correct answer is ${correctAnswer}.`;

        return Response.json({ explanation });
    } catch (e) {
        console.error('Explain API error:', e);
        return Response.json({ explanation: 'Explanation unavailable at the moment.' }, { status: 500 });
    }
}
