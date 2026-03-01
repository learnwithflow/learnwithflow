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

export async function POST(req) {
    try {
        const { messages, action } = await req.json();

        // Generate exam questions dynamically
        if (action === 'generate') {
            const { examType, chapter, count } = await req.json().catch(() => ({}));
            const genMsgs = messages || [{
                role: 'system',
                content: `You are an exam question generator. Generate exactly ${count || 10} multiple choice questions for ${examType || 'general'} exam${chapter ? ` on topic: ${chapter}` : ''}.

Return ONLY a JSON array, no other text. Each question must have this format:
[{"s":"Subject","b":"Question text?","o":["Option A","Option B","Option C","Option D"],"a":0}]

Where "a" is the index (0-3) of the correct answer. Make questions challenging but fair.`
            }, { role: 'user', content: `Generate ${count || 10} questions now.` }];

            const content = await callAI(genMsgs);
            if (content) {
                try {
                    const match = content.match(/\[[\s\S]*\]/);
                    if (match) {
                        const questions = JSON.parse(match[0]);
                        return Response.json({ questions });
                    }
                } catch (e) { }
            }
            return Response.json({ questions: null });
        }

        // Regular AI call
        const content = await callAI(messages);
        return Response.json({ content: content || 'Explanation unavailable.' });
    } catch (e) {
        return Response.json({ content: 'Error processing request.' }, { status: 500 });
    }
}
