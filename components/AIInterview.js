'use client';
import { useState, useEffect, useRef } from 'react';
import { FILLERS, DIFF_T, DIFF_Q, Q_CATEGORIES, Q_MIX } from '../lib/interviewData';
import { incrementStreak } from '../lib/streak';

export default function AIInterview({ showPage, showToast }) {
    const [screen, setScreen] = useState('landing');
    const [profile, setProfile] = useState({ name: '', degree: '', branch: '', role: '', exp: '', company: 'general', skills: [], diff: 'easy', resume: '' });
    const [skillInput, setSkillInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [qs, setQs] = useState([]);
    const [qIdx, setQIdx] = useState(0);
    const [scores, setScores] = useState([]);
    const [textAns, setTextAns] = useState('');
    const [voiceAns, setVoiceAns] = useState('');
    const [recording, setRecording] = useState(false);
    const [tab, setTab] = useState('voice');
    const [timer, setTimer] = useState(120);
    const [totalTime, setTotalTime] = useState(0);
    const [fillerCount, setFillerCount] = useState(0);
    const [liveScore, setLiveScore] = useState('--');
    const [result, setResult] = useState(null);
    const [aiThinking, setAiThinking] = useState(false);
    const [loadingQs, setLoadingQs] = useState(false);
    const chatRef = useRef(null);
    const webcamRef = useRef(null);
    const recRef = useRef(null);
    const timerRef = useRef(null);
    const totalTimerRef = useRef(null);
    const scoresRef = useRef([]);
    const conversationRef = useRef([]);

    useEffect(() => {
        if (screen === 'interview') {
            navigator.mediaDevices?.getUserMedia({ video: true }).then(s => {
                if (webcamRef.current) webcamRef.current.srcObject = s;
            }).catch(() => { });
        }
    }, [screen]);

    useEffect(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [messages]);

    const addMsg = (role, text, type = '') => setMessages(prev => [...prev, { role, text, type }]);

    // Generate questions dynamically via AI based on candidate profile
    const generateQuestions = async () => {
        const mix = Q_MIX[profile.diff] || Q_MIX.easy;
        const totalQ = DIFF_Q[profile.diff] || 10;
        const companyName = { google: 'Google', tcs: 'TCS', startup: 'a fast-growing startup', general: 'a mid-size tech company' }[profile.company] || 'a tech company';

        const prompt = `You are a senior interview coach. Generate exactly ${totalQ} interview questions for this candidate:

Name: ${profile.name}
Role: ${profile.role}
Education: ${profile.degree} in ${profile.branch}
Experience: ${profile.exp || 'Fresher'}
Company Type: ${companyName}
Skills: ${profile.skills.length ? profile.skills.join(', ') : 'Not specified'}
${profile.resume ? `\nCANDIDATE'S RESUME/BACKGROUND DATA:\n"""\n${profile.resume}\n"""\n\nHIGH PRIORITY: Since the candidate provided their resume data above, absolutely make sure at least 3-4 questions are highly specific to the projects, companies, or experiences listed in their resume.` : ''}

Question Mix:
- ${mix.hr} HR/introduction questions (warm-up, motivation, culture fit)
- ${mix.behavioral} behavioral questions (leadership, failure stories, pressure handling)
- ${mix.technical} technical questions specific to ${profile.role} role
- ${mix.coding} coding/problem-solving questions (give a specific problem and ask them to explain their approach or write code)

CRITICAL RULES:
1. Questions must sound like a REAL HUMAN interviewer talking naturally, not a robot reading from a list
2. Use conversational language — like how a real senior interviewer would speak
3. For coding questions, give a SPECIFIC problem (e.g., "Can you write a function that takes an array of numbers and returns the second largest? Walk me through your thinking.")
4. Mix difficulty — start easy, get harder
5. Reference the candidate's background naturally (e.g., "Since you studied ${profile.branch}..." or "For the ${profile.role} role, we often need...")
6. Include follow-up style questions (e.g., "That's interesting — so tell me, how would you handle...")
7. Make each question feel like a different part of a real conversation, not a checklist
8. DO NOT number the questions
9. DO NOT add any explanations or labels — just the questions, one per line
10. Each question should be on its own line, separated by a newline

Output ONLY the questions, one per line. Nothing else.`;

        try {
            const res = await fetch('/api/interview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-secret': process.env.NEXT_PUBLIC_API_SECRET
                },
                body: JSON.stringify({
                    action: 'generateQuestions',
                    messages: [
                        { role: 'system', content: 'You are a senior interview question designer. Output only interview questions, one per line. No numbering, no labels, no explanations.' },
                        { role: 'user', content: prompt }
                    ]
                })
            });
            if (!res.ok) throw new Error('API failed');

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let raw = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                raw += decoder.decode(value, { stream: true });
            }

            const questions = raw.split('\n')
                .map(l => l.trim())
                .filter(l => l.length > 10 && l.endsWith('?'))
                .map(l => l.replace(/^\d+[\.\)]\s*/, '').replace(/^[-•]\s*/, '').trim())
                .slice(0, totalQ);

            if (questions.length >= 3) return questions;
        } catch (e) {
            console.error('Failed to generate questions:', e);
        }

        // Fallback — only if AI fails completely
        return getFallbackQuestions(profile);
    };

    const getFallbackQuestions = (p) => {
        const role = p.role || 'this position';
        return [
            `So ${p.name}, let's start simple — tell me a bit about yourself and what brought you here today.`,
            `What got you interested in becoming a ${role}? Was there a specific moment?`,
            `Walk me through a project you've worked on that you're genuinely proud of.`,
            `Every job has rough patches — tell me about a time things didn't go as planned and how you dealt with it.`,
            `If I gave you a completely unfamiliar technology to learn by next week, how would you approach it?`,
            `Here's a quick problem — can you write a function that checks if a string is a palindrome? Talk me through your approach.`,
            `Where do you honestly see yourself in the next 2-3 years?`,
            `What would your ideal work day look like?`,
            `Do you have any questions for me about the role or the team?`,
            `One last thing — is there anything about yourself that doesn't show up on your resume but you think I should know?`
        ].slice(0, DIFF_Q[p.diff] || 10);
    };

    const startIV = async (e) => {
        e.preventDefault();
        setLoadingQs(true);
        setScreen('interview');
        setQIdx(0); setScores([]); scoresRef.current = []; setMessages([]); setFillerCount(0); setTotalTime(0);
        setTimer(DIFF_T[profile.diff] || 120); setLiveScore('--'); setResult(null);
        conversationRef.current = [];

        // Generate questions via AI
        const picked = await generateQuestions();
        setQs(picked);
        setLoadingQs(false);

        clearInterval(totalTimerRef.current);
        totalTimerRef.current = setInterval(() => setTotalTime(t => t + 1), 1000);

        const companyName = { google: 'Google', tcs: 'TCS', startup: 'InnovateTech Startup', general: 'TechCorp' }[profile.company] || 'TechCorp';
        const greeting = `Hey ${profile.name}, thanks for coming in today. I'm going to be interviewing you for the ${profile.role} position here at ${companyName}. This will be a conversational interview — just be yourself, answer honestly, and take your time. Ready? Let's get into it.`;
        addMsg('ai', greeting);

        setTimeout(() => askQ(0, picked), 2500);
    };

    const askQ = (idx, pool) => {
        const q = (pool || qs)[idx];
        if (!q) return;

        // Natural transition messages between sections
        if (idx === Math.ceil((pool || qs).length * 0.4)) {
            addMsg('sys', 'Moving to more specific questions...');
        }
        if (idx === Math.ceil((pool || qs).length * 0.7)) {
            addMsg('sys', 'Wrapping up with a few more questions...');
        }

        addMsg('ai', q, 'q');
        conversationRef.current.push({ role: 'interviewer', text: q });

        clearInterval(timerRef.current);
        let t = DIFF_T[profile.diff] || 120;
        setTimer(t);
        timerRef.current = setInterval(() => {
            t--;
            setTimer(t);
            if (t <= 0) {
                clearInterval(timerRef.current);
                addMsg('ai', `We need to keep track of time, so let's move on to the next question.`, 'warn');
                nextQ(idx, pool);
            }
        }, 1000);
    };

    const send = async (answerText) => {
        if (!answerText?.trim() || aiThinking) return;
        clearInterval(timerRef.current);

        const fillers = (answerText.toLowerCase().match(new RegExp(FILLERS.join('|'), 'g')) || []).length;
        setFillerCount(f => f + fillers);
        addMsg('user', answerText);
        setVoiceAns(''); setTextAns('');
        setAiThinking(true);

        conversationRef.current.push({ role: 'candidate', text: answerText });

        let score = 25;

        try {
            const companyName = { google: 'Google', tcs: 'TCS', startup: 'InnovateTech Startup', general: 'TechCorp' }[profile.company] || 'TechCorp';
            const isCoding = qs[qIdx]?.toLowerCase().includes('write') || qs[qIdx]?.toLowerCase().includes('code') || qs[qIdx]?.toLowerCase().includes('function') || qs[qIdx]?.toLowerCase().includes('algorithm');
            const recentContext = conversationRef.current.slice(-6).map(c => `${c.role}: ${c.text}`).join('\n');

            const msgs = [{
                role: 'system',
                content: `You are a real human interviewer at ${companyName} interviewing ${profile.name} for a ${profile.role} position.
Experience: ${profile.exp || 'Fresher'} | Education: ${profile.degree} in ${profile.branch}

CONVERSATION SO FAR:
${recentContext}

YOUR JOB:
1. Score their answer 25-100. Be BRUTALLY HONEST:
   - WRONG/INCORRECT answer: 25-35. Say clearly it's wrong. Don't sugarcoat.
   - VAGUE/GENERIC answer (could apply to anyone): 35-50. Point out it lacks substance.
   - DECENT but missing depth: 50-65. Acknowledge what's good, say what's missing.
   - GOOD solid answer: 65-80. Show genuine appreciation.
   - EXCELLENT with specifics/examples: 80-100. Be visibly impressed.

2. React like a REAL PERSON would:
   - If they're WRONG: "Hmm, that's actually not quite right. [explain why]. The correct approach would be..."
   - If they're VAGUE: "I hear what you're saying, but can you give me something more concrete? That answer could come from anyone."
   - If they give a TEXTBOOK answer without understanding: "Sounds like you memorized that. Can you explain what that actually means in practice?"
   - If they're GOOD: "Now that's what I like to hear. That shows real understanding."
   - If it's OFF-TOPIC: "Hold on — that's not really what I was asking. Let me rephrase..."
${isCoding ? '\n3. For CODING questions: Check if the logic is correct. If the code has bugs, point them out specifically. If the approach is wrong, explain the correct approach. Don\'t say "good attempt" if the code is broken.' : ''}

3. NO EMOJIS. Talk like a real person — casual but professional.
4. Keep responses concise — 2-3 sentences max for reaction, 1 sentence for tip.

Reply EXACTLY in this format:
SCORE: <number 25-100>
REACTION: <your honest, human reaction — be real, not robotic>
TIP: <one specific thing they should do differently next time>`
            }, {
                role: 'user',
                content: `Question asked: "${qs[qIdx]}"\n\nTheir answer: "${answerText}"`
            }];

            const res = await fetch('/api/interview', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-secret': process.env.NEXT_PUBLIC_API_SECRET }, body: JSON.stringify({ messages: msgs }) });
            if (!res.ok) throw new Error('API failed');

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let raw = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                raw += decoder.decode(value, { stream: true });
            }

            const sm = raw.match(/SCORE:\s*(\d+)/i);
            if (sm) score = Math.max(25, Math.min(100, parseInt(sm[1])));

            const rm = raw.match(/REACTION:\s*(.+)/i);
            const tm = raw.match(/TIP:\s*(.+)/i);

            const reaction = rm ? rm[1].trim() : (score >= 70 ? 'Solid answer.' : score >= 50 ? 'Okay, but you can do better.' : 'That needs a lot of work.');
            const tip = tm ? tm[1].trim() : '';

            let feedback = reaction;
            if (tip) feedback += `\n\nTip: ${tip}`;
            if (fillers > 2) feedback += `\n\n[Note] You used a few filler words like "um" or "like" (${fillers} times) in that answer — taking brief pauses instead can make your answer sound more confident!`;

            addMsg('ai', feedback);
            conversationRef.current.push({ role: 'interviewer', text: reaction });
        } catch (e) {
            const fallbackMsg = score >= 50 ? 'Alright, noted. Let\'s keep going.' : 'Hmm, that could use some work. Moving on.';
            addMsg('ai', fallbackMsg);
        }

        setAiThinking(false);
        scoresRef.current = [...scoresRef.current, score];
        setScores(prev => [...prev, score]);
        const allScores = [...scoresRef.current];
        const avg = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
        setLiveScore(avg + '/100');
        setTimeout(() => nextQ(qIdx, qs), 1800);
    };

    const nextQ = (idx, pool) => {
        const next = idx + 1;
        if (next < (pool || qs).length) {
            setQIdx(next);
            askQ(next, pool);
        } else {
            endIV();
        }
    };

    const endIV = async () => {
        clearInterval(timerRef.current);
        clearInterval(totalTimerRef.current);
        const allScores = scoresRef.current.length ? scoresRef.current : [50];
        const avg = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
        let feedback = ['Practice answering questions out loud — record yourself and play it back.', 'Use the STAR method: Situation, Task, Action, Result for behavioral questions.', 'Reduce filler words by pausing for 2 seconds before you start answering.'];

        try {
            const companyName = { google: 'Google', tcs: 'TCS', startup: 'a Startup', general: 'TechCorp' }[profile.company] || 'a company';
            const msgs = [{
                role: 'system',
                content: `You are a senior hiring manager giving honest post-interview feedback. Be direct, specific, and helpful. Write like you're talking to someone, not writing a report. NO EMOJIS.`
            }, {
                role: 'user',
                content: `Candidate: ${profile.name}
Role: ${profile.role} at ${companyName}
Education: ${profile.degree} in ${profile.branch}
Experience: ${profile.exp || 'Fresher'}
Performance: ${avg}/100 average across ${allScores.length} questions
Individual scores: ${allScores.join(', ')}
Filler words: ${fillerCount}

Give exactly 3 pieces of specific, honest feedback:
1. What went well (or at least what was salvageable)
2. The biggest concern a hiring manager would have
3. One concrete thing to practice before their next interview

Be real. If they did poorly, say so. Start each point with a dash (-). NO EMOJIS.`
            }];
            const res = await fetch('/api/interview', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-secret': process.env.NEXT_PUBLIC_API_SECRET }, body: JSON.stringify({ messages: msgs }) });
            if (!res.ok) throw new Error('API failed');

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let raw = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                raw += decoder.decode(value, { stream: true });
            }
            const lines = raw.split('\n').filter(l => l.trim()).slice(0, 3);
            if (lines.length >= 2) feedback = lines;
        } catch (e) { }

        try {
            const hist = JSON.parse(localStorage.getItem('lwf_score_history') || '[]');
            hist.push({ type: 'interview', score: avg, total: 100, pct: avg, time: Date.now() });
            localStorage.setItem('lwf_score_history', JSON.stringify(hist));
            incrementStreak();
        } catch (e) { }

        let verdict, verdictDetail;
        if (avg >= 80) {
            verdict = 'Strong Candidate — Likely Moving Forward';
            verdictDetail = 'Based on this interview, I\'d recommend this candidate for the next round without hesitation.';
        } else if (avg >= 65) {
            verdict = 'Promising — A Few Concerns';
            verdictDetail = 'There\'s potential here, but I\'d want to discuss a couple things with the team before moving forward.';
        } else if (avg >= 50) {
            verdict = 'Below Average — Needs Significant Work';
            verdictDetail = 'Honestly, most hiring managers would pass at this point. The answers lacked depth and specifics.';
        } else {
            verdict = 'Not Ready — Keep Practicing';
            verdictDetail = 'This candidate isn\'t ready for this role yet. Needs more preparation — both technical knowledge and interview skills.';
        }

        setResult({
            avg,
            conf: Math.min(100, Math.max(30, avg + Math.floor(Math.random() * 15) - 5)),
            comm: Math.min(100, Math.max(25, avg - 5 + Math.floor(Math.random() * 10))),
            feedback,
            qs: allScores.length,
            verdict,
            verdictDetail
        });
        setScreen('results');
    };

    const toggleMic = async () => {
        if (recording) { recRef.current?.stop?.(); setRecording(false); return; }
        try {
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
                const sr = new SR();
                sr.continuous = true;
                sr.interimResults = true;
                sr.onresult = (evt) => {
                    setVoiceAns(Array.from(evt.results).map(r => r[0].transcript).join(''));
                };
                sr.onerror = () => setRecording(false);
                recRef.current = sr;
                sr.start();
                setRecording(true);
            }
        } catch (e) { showToast?.('Mic access denied — check your browser settings'); }
    };

    const addSkill = (e) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            setProfile(p => ({ ...p, skills: [...p.skills, skillInput.trim()] }));
            setSkillInput('');
        }
    };
    const removeSkill = (idx) => setProfile(p => ({ ...p, skills: p.skills.filter((_, i) => i !== idx) }));
    const handleKeyDown = (e, ansText) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(ansText); } };
    const fmtTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
    const ringOffset = result ? Math.max(0, 440 - (result.avg / 100) * 440) : 440;
    const vBadge = result ? (result.avg >= 80 ? { cls: 'good', text: 'Strong Candidate' } : result.avg >= 65 ? { cls: 'good', text: 'Promising' } : result.avg >= 50 ? { cls: 'avg', text: 'Needs Work' } : { cls: 'bad', text: 'Keep Practicing' }) : null;

    return (
        <div id="page-interview">
            <div className="loop-wrap">
                <div className="gorb gorb1" /><div className="gorb gorb2" />

                {screen === 'landing' && (
                    <div className="loop-screen active" id="lscreen-landing">
                        <div className="l-logo-mark">AI</div>
                        <p className="l-eyebrow">● Live Interview Simulator</p>
                        <h1 className="l-title">AI Interview<br />Coach</h1>
                        <p className="l-sub">Face a realistic interviewer powered by AI. Get honest feedback — no sugarcoating. Know exactly where you stand before your real interview.</p>
                        <div className="l-feat-row">
                            {['🤖 Real AI Interviewer', '🎤 Voice Input', '📊 Honest Scoring', '💻 Coding Questions'].map(c => <div key={c} className="l-chip"><span>{c.split(' ')[0]}</span>{c.split(' ').slice(1).join(' ')}</div>)}
                        </div>
                        <button className="btn-loop" onClick={() => setScreen('profile')}>Start Interview →</button>
                    </div>
                )}

                {screen === 'profile' && (
                    <div className="loop-screen active" id="lscreen-profile">
                        <div className="lcard">
                            <p className="lcard-step">Step 01 — Setup</p>
                            <h2 className="lcard-title">Tell us about yourself</h2>
                            <form onSubmit={startIV}>
                                <div className="lform-group"><label className="llabel">Full Name</label><input className="linput" required placeholder="Your name" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} /></div>
                                <div className="lform-row">
                                    <div className="lform-group"><label className="llabel">Degree</label><select className="linput" required value={profile.degree} onChange={e => setProfile(p => ({ ...p, degree: e.target.value }))}><option value="">Select</option>{['B.Tech', 'Diploma', 'Intermediate', 'BCA', 'MCA', 'B.Sc'].map(d => <option key={d}>{d}</option>)}</select></div>
                                    <div className="lform-group"><label className="llabel">Branch</label><select className="linput" required value={profile.branch} onChange={e => setProfile(p => ({ ...p, branch: e.target.value }))}><option value="">Select</option>{['CSE', 'ECE', 'Mechanical', 'Civil', 'MPC', 'BiPC', 'Commerce'].map(b => <option key={b}>{b}</option>)}</select></div>
                                </div>
                                <div className="lform-row">
                                    <div className="lform-group"><label className="llabel">Target Role</label><input className="linput" required placeholder="e.g. Software Engineer" value={profile.role} onChange={e => setProfile(p => ({ ...p, role: e.target.value }))} /></div>
                                    <div className="lform-group"><label className="llabel">Experience</label><select className="linput" required value={profile.exp} onChange={e => setProfile(p => ({ ...p, exp: e.target.value }))}><option value="">Select</option>{['Fresher', '0-1 years', '1-2 years', '2-5 years'].map(e2 => <option key={e2}>{e2}</option>)}</select></div>
                                </div>
                                <div className="lform-group"><label className="llabel">Company Style</label>
                                    <select className="linput" value={profile.company} onChange={e => setProfile(p => ({ ...p, company: e.target.value }))}>
                                        <option value="general">General / Any</option>
                                        <option value="google">Google / FAANG</option>
                                        <option value="tcs">TCS / Infosys / Wipro</option>
                                        <option value="startup">Startup</option>
                                    </select>
                                </div>
                                <div className="lform-group"><label className="llabel">Skills (press Enter to add)</label>
                                    <input className="linput" placeholder="e.g. React, Python, SQL..." value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={addSkill} />
                                    {profile.skills.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                                            {profile.skills.map((s, i) => (
                                                <span key={i} style={{ background: 'rgba(6,214,160,0.15)', border: '1px solid rgba(6,214,160,0.3)', color: 'var(--loop-accent2)', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontFamily: "'DM Mono',monospace", cursor: 'pointer' }} onClick={() => removeSkill(i)}>{s} ×</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="lform-group">
                                    <label className="llabel">Paste Resume / LinkedIn Bio (Optional)</label>
                                    <textarea className="linput" style={{ minHeight: 80, resize: 'vertical' }} placeholder="Paste the text from your resume here. The AI will read it and ask specific questions about your projects and experience!" value={profile.resume} onChange={e => setProfile(p => ({ ...p, resume: e.target.value }))} />
                                </div>
                                <div className="lform-group"><label className="llabel">Difficulty</label>
                                    <div className="ldiff-row">{['easy', 'medium', 'hard'].map(d => <div key={d} className={`ldiff-btn ${d}${profile.diff === d ? ' sel' : ''}`} onClick={() => setProfile(p => ({ ...p, diff: d }))}>{d[0].toUpperCase() + d.slice(1)}</div>)}</div>
                                </div>
                                <button type="submit" className="btn-loop" style={{ width: '100%', marginTop: 8 }}>Launch Interview →</button>
                            </form>
                        </div>
                    </div>
                )}

                {screen === 'interview' && (
                    <div className="loop-screen active" id="lscreen-interview">
                        {loadingQs && (
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,10,20,0.9)', zIndex: 100, borderRadius: 16 }}>
                                <div style={{ width: 40, height: 40, border: '3px solid rgba(6,214,160,0.3)', borderTopColor: 'var(--loop-accent2)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                <p style={{ color: 'var(--loop-accent2)', fontFamily: "'DM Mono',monospace", fontSize: 13, marginTop: 16 }}>Preparing your interview questions...</p>
                            </div>
                        )}
                        <div className="l-iv-layout">
                            <div className="l-iv-main">
                                <div className="l-iv-hdr">
                                    <div className="l-iv-info">
                                        <div className="l-iv-ava">IV</div>
                                        <div>
                                            <div className="l-iv-name">Interviewer</div>
                                            <div className="l-iv-role">{{ google: 'Google', tcs: 'TCS', startup: 'InnovateTech', general: 'TechCorp' }[profile.company] || 'TechCorp'}</div>
                                        </div>
                                    </div>
                                    <div className="l-hdr-right">
                                        <div className={`l-qtimer${timer <= 15 ? ' danger' : timer <= 30 ? ' warn' : ''}`}>{fmtTime(timer)}</div>
                                        <div className="l-status"><span style={{ width: 5, height: 5, background: 'var(--loop-accent2)', borderRadius: '50%', display: 'inline-block', animation: 'blink2 1s infinite' }} />LIVE</div>
                                    </div>
                                </div>
                                <div className="l-chat" ref={chatRef}>
                                    {messages.map((m, i) => (
                                        <div key={i} className={`l-msg${m.role === 'sys' ? ' sys-msg' : ''}`} style={m.role === 'sys' ? { textAlign: 'center', color: 'var(--loop-muted)', fontStyle: 'italic', margin: '16px 0', fontSize: 12 } : {}}>
                                            {m.role !== 'sys' && <div className={`l-mava ${m.role}`}>{m.role === 'ai' ? 'IV' : profile.name?.[0]?.toUpperCase() || 'U'}</div>}
                                            {m.role !== 'sys' && <div className="l-mcont"><div className="l-mmeta">{m.role === 'ai' ? 'Interviewer' : profile.name || 'You'}</div><div className={`l-mbub${m.role === 'ai' ? ' ai-b' : ''}${m.type === 'warn' ? ' warn-b' : ''}`} dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>').replace(/\n/g, '<br/>') }} /></div>}
                                            {m.role === 'sys' && <div>{m.text}</div>}
                                        </div>
                                    ))}
                                    {aiThinking && <div className="l-msg"><div className="l-mava ai">IV</div><div className="l-mcont"><div className="l-mmeta">Interviewer</div><div className="l-mbub ai-b" style={{ fontStyle: 'italic', color: 'var(--loop-muted)' }}>Thinking about your answer...</div></div></div>}
                                </div>
                                <div className="l-input-area">
                                    <div className="l-tabs">{[['voice', '🎤 Voice'], ['text', '⌨️ Text']].map(([id, lbl]) => <button key={id} className={`l-tab${tab === id ? ' active' : ''}`} onClick={() => setTab(id)}>{lbl}</button>)}</div>
                                    {tab === 'voice' && <div className="l-tc active"><div className="l-irow"><button className={`l-bmic${recording ? ' recording' : ' idle'}`} onClick={toggleMic}>🎤</button><textarea id="la-text" value={voiceAns} onChange={e => setVoiceAns(e.target.value)} onKeyDown={e => handleKeyDown(e, voiceAns)} placeholder="Tap mic to speak, or type here... (Enter to send)" /><button className="l-bsend" disabled={aiThinking} onClick={() => send(voiceAns)}>Send →</button></div><div className="l-mstatus">{recording ? '🔴 Recording — tap mic to stop' : 'Click mic to speak or type + Enter to send'}</div></div>}
                                    {tab === 'text' && <div className="l-tc active"><div className="l-irow"><textarea id="la-text2" value={textAns} onChange={e => setTextAns(e.target.value)} onKeyDown={e => handleKeyDown(e, textAns)} placeholder="Type your answer... (Enter to send)" /><button className="l-bsend" disabled={aiThinking} onClick={() => send(textAns)}>Send →</button></div></div>}
                                </div>
                            </div>
                            <div className="l-iv-sidebar">
                                <div className="l-sec"><p className="l-slbl">📷 Camera</p><div className="l-vcont"><video ref={webcamRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} /><div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}><div className="l-rec"><div className="l-rd" />REC</div></div></div></div>
                                <div className="l-sec"><p className="l-slbl">Progress</p><div className="l-pt"><div className="l-pf" style={{ width: `${qs.length ? (qIdx / qs.length * 100) : 0}%` }} /></div><div className="l-pi"><span>Q {qIdx}/{qs.length}</span><span>{fmtTime(totalTime)}</span></div></div>
                                <div className="l-sec"><p className="l-slbl">Live Score</p><div className="l-lscore">{liveScore}</div></div>
                                <div className="l-sec"><p className="l-slbl">Stats</p><div className="l-sgrid"><div className="l-sc"><div className="l-sv">{fillerCount}</div><div className="l-sl">Fillers</div></div><div className="l-sc"><div className="l-sv">{scores.length}</div><div className="l-sl">Answered</div></div></div></div>
                                <button className="l-bend" onClick={endIV}>End & Get Report</button>
                            </div>
                        </div>
                    </div>
                )}

                {screen === 'results' && result && (
                    <div className="loop-screen active" id="lscreen-results">
                        <div className="lres-card">
                            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 22, color: 'var(--loop-text)' }}>Interview Assessment</h2>
                            <div className="lscore-ring">
                                <svg width="145" height="145" viewBox="0 0 160 160"><defs><linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#06d6a0" /><stop offset="100%" stopColor="#2563a8" /></linearGradient></defs><circle className="lring-bg" cx="80" cy="80" r="70" /><circle className="lring-fill" cx="80" cy="80" r="70" style={{ strokeDashoffset: ringOffset }} /></svg>
                                <div className="lscore-ctr"><div className="lscore-num">{result.avg}</div><div className="lscore-lbl">/ 100</div></div>
                            </div>
                            <div className="lverdict">
                                <div className={`lvbadge ${vBadge.cls}`}>{vBadge.text}</div>
                                <div className="lverdict-txt">{result.verdictDetail}</div>
                            </div>
                            <div className="lmg">
                                <div className="lmc"><div className="lmt">Answer Quality</div><div className="lmv purple">{result.avg}/100</div></div>
                                <div className="lmc"><div className="lmt">Confidence</div><div className="lmv green">{result.conf}/100</div></div>
                                <div className="lmc"><div className="lmt">Communication</div><div className="lmv yellow">{result.comm}/100</div></div>
                                <div className="lmc"><div className="lmt">Fillers</div><div className="lmv red">{fillerCount}</div></div>
                            </div>
                            <div style={{ marginBottom: 18 }}><p className="lft">Interviewer Feedback</p>{result.feedback.map((f, i) => <div key={i} className="lfi"><span>→</span><span>{f}</span></div>)}</div>
                            <button className="btn-loop" onClick={() => setScreen('landing')} style={{ width: '100%', marginBottom: 10 }}>Practice Again →</button>
                            <button onClick={() => showPage('roadmap')} style={{ width: '100%', background: 'var(--loop-surface2)', border: '1px solid var(--loop-border)', color: 'var(--loop-text)', padding: 12, borderRadius: 10, fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>View Career Roadmap →</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
