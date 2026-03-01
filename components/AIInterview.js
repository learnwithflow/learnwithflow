'use client';
import { useState, useEffect, useRef } from 'react';
import { IV_QUESTION_POOL, FILLERS, DIFF_T, DIFF_Q } from '../lib/interviewData';

function shuffleArr(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }

export default function AIInterview({ showPage, showToast }) {
    const [screen, setScreen] = useState('landing');
    const [profile, setProfile] = useState({ name: '', degree: '', branch: '', role: '', exp: '', company: 'general', skills: [], diff: 'easy' });
    const [skillInput, setSkillInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [qs, setQs] = useState([]);
    const [qIdx, setQIdx] = useState(0);
    const [scores, setScores] = useState([]);
    const [textAns, setTextAns] = useState('');
    const [voiceAns, setVoiceAns] = useState('');
    const [recording, setRecording] = useState(false);
    const [tab, setTab] = useState('voice');
    const [timer, setTimer] = useState(60);
    const [totalTime, setTotalTime] = useState(0);
    const [fillerCount, setFillerCount] = useState(0);
    const [liveScore, setLiveScore] = useState('--');
    const [aiSpeaking, setAiSpeaking] = useState(false);
    const [voiceOn, setVoiceOn] = useState(true);
    const [result, setResult] = useState(null);
    const [aiThinking, setAiThinking] = useState(false);
    const chatRef = useRef(null);
    const webcamRef = useRef(null);
    const recRef = useRef(null);
    const timerRef = useRef(null);
    const totalTimerRef = useRef(null);
    const scoresRef = useRef([]);

    useEffect(() => { if (screen === 'interview') { navigator.mediaDevices?.getUserMedia({ video: true }).then(s => { if (webcamRef.current) webcamRef.current.srcObject = s; }).catch(() => { }); } }, [screen]);
    useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages]);

    const addMsg = (role, text, type = '') => setMessages(prev => [...prev, { role, text, type }]);

    const speak = (text) => {
        if (!voiceOn || typeof window === 'undefined') return;
        window.speechSynthesis?.cancel();
        const u = new SpeechSynthesisUtterance(text); u.rate = 0.9;
        setAiSpeaking(true); u.onend = () => setAiSpeaking(false);
        window.speechSynthesis?.speak(u);
    };

    const startIV = (e) => {
        e.preventDefault();
        const picked = shuffleArr(IV_QUESTION_POOL).slice(0, DIFF_Q[profile.diff] || 5);
        setQs(picked); setQIdx(0); setScores([]); scoresRef.current = []; setMessages([]); setFillerCount(0); setTotalTime(0);
        setTimer(DIFF_T[profile.diff] || 90); setScreen('interview'); setLiveScore('--'); setResult(null);
        clearInterval(totalTimerRef.current);
        totalTimerRef.current = setInterval(() => setTotalTime(t => t + 1), 1000);
        setTimeout(() => {
            const companyName = { google: 'Google', tcs: 'TCS', startup: 'InnovateTech Startup', general: 'TechCorp' }[profile.company] || 'TechCorp';
            addMsg('ai', `Good day, ${profile.name}. I'm the HR Manager at ${companyName}. Thank you for applying for the ${profile.role} position. I'll be conducting your interview today. Please answer each question clearly and concisely. Let's begin.`);
            setTimeout(() => askQ(0, picked), 2000);
        }, 600);
    };

    const askQ = (idx, pool) => {
        const q = (pool || qs)[idx]; if (!q) return;
        if (idx === 10 && profile.diff !== 'easy') addMsg('sys', '*** HR round completed. Handing over to Technical Lead... ***');
        addMsg('ai', q, 'q');
        if (voiceOn) speak(q);
        clearInterval(timerRef.current); let t = DIFF_T[profile.diff] || 90; setTimer(t);
        timerRef.current = setInterval(() => { t--; setTimer(t); if (t <= 0) { clearInterval(timerRef.current); addMsg('ai', `I notice you're taking a while. In a real interview, hesitation like this would concern us. Let's move on.`, 'warn'); nextQ(idx, pool); } }, 1000);
    };

    const send = async (answerText) => {
        if (!answerText?.trim() || aiThinking) return;
        clearInterval(timerRef.current);
        const fillers = (answerText.toLowerCase().match(new RegExp(FILLERS.join('|'), 'g')) || []).length;
        setFillerCount(f => f + fillers);
        addMsg('user', answerText);
        setVoiceAns(''); setTextAns('');
        setAiThinking(true);

        let score = 25; // Default lowest score if AI fails

        try {
            const companyName = { google: 'Google', tcs: 'TCS', startup: 'InnovateTech Startup', general: 'TechCorp' }[profile.company] || 'TechCorp';
            const isBoss = qIdx >= 10 && profile.diff !== 'easy';
            const roleName = isBoss ? 'Technical Lead / Hiring Manager' : 'strict but fair HR Manager';
            const extraCtx = isBoss ? 'You are conducting the technical and behavioral round.' : 'You are conducting the initial HR round.';

            const msgs = [{
                role: 'system',
                content: `You are a ${roleName} at ${companyName} conducting a real job interview for ${profile.role} position. ${extraCtx} The candidate is ${profile.name} with ${profile.exp || 'fresher'} experience, ${profile.degree} in ${profile.branch}.

Your job is to:
1. Score their answer 25-100 (never below 25, be realistic — average answers get 50-65, good answers 70-85, excellent 85-100, poor answers 25-45).
2. React like a REAL interviewer would. DO NOT USE ANY EMOJIS.
   - If answer is GOOD: Show you're impressed. "That's a strong answer. I appreciate that level of detail."
   - If answer is AVERAGE: Be neutral. "Okay, that's a reasonable response, but let me tell you what would make it stand out..."
   - If answer is POOR/VAGUE: Show concern. "Honestly, this answer would raise some red flags. Here's why..."
   - If answer is OFF-TOPIC: "I appreciate the effort, but that doesn't address what I asked. In a real interview, this would cost you points."
3. Give specific improvement tips. DO NOT USE EMOJIS.

Reply EXACTLY in this format:
SCORE: <number between 25-100>
REACTION: <1-2 sentences of reaction — NO EMOJIS>
TIP: <1 specific actionable improvement tip — NO EMOJIS>`
            }, {
                role: 'user',
                content: `Interview Question: "${qs[qIdx]}"\n\nCandidate's Answer: "${answerText}"`
            }];

            const res = await fetch('/api/interview', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: msgs }) });
            const json = await res.json();
            const raw = json.content || '';

            const sm = raw.match(/SCORE:\s*(\d+)/i);
            if (sm) score = Math.max(25, Math.min(100, parseInt(sm[1])));

            const rm = raw.match(/REACTION:\s*(.+)/i);
            const tm = raw.match(/TIP:\s*(.+)/i);

            const reaction = rm ? rm[1].trim() : (score >= 70 ? 'Good response.' : score >= 50 ? 'Acceptable answer.' : 'That needs work.');
            const tip = tm ? tm[1].trim() : '';

            let feedback = `${reaction}`;
            if (tip) feedback += `\n\nTip: ${tip}`;
            if (fillers > 2) feedback += `\n\n[Warning] I noticed ${fillers} filler words ("um", "like", etc.) — in a professional setting, this reduces your credibility.`;

            addMsg('ai', feedback);
            if (voiceOn) speak(reaction);
        } catch (e) {
            addMsg('ai', `${score >= 70 ? 'Good answer. I am satisfied with this.' : score >= 50 ? 'Decent attempt. Try to be more specific with examples.' : 'This needs improvement. Be more structured in your response.'}`);
        }

        setAiThinking(false);
        scoresRef.current = [...scoresRef.current, score];
        setScores(prev => [...prev, score]);
        const allScores = [...scoresRef.current];
        const avg = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
        setLiveScore(avg + '/100');
        setTimeout(() => nextQ(qIdx, qs), 1500);
    };

    const nextQ = (idx, pool) => { const next = idx + 1; if (next < (pool || qs).length) { setQIdx(next); askQ(next, pool); } else endIV(); };

    const endIV = async () => {
        clearInterval(timerRef.current); clearInterval(totalTimerRef.current);
        const allScores = scoresRef.current.length ? scoresRef.current : [50];
        const avg = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
        let feedback = ['💡 Practice answering aloud daily — record yourself and listen.', '🎯 Use STAR method: Situation, Task, Action, Result.', '🔊 Reduce filler words by pausing 2 seconds before answering.'];

        try {
            const companyName = { google: 'Google', tcs: 'TCS', startup: 'a Startup', general: 'TechCorp' }[profile.company] || 'a company';
            const msgs = [{
                role: 'system',
                content: `You are a senior HR Director giving final interview feedback. Be honest, specific, and encouraging. Think about how a real HR would write a post-interview assessment.`
            }, {
                role: 'user',
                content: `Candidate: ${profile.name}
Role Applied: ${profile.role} at ${companyName}
Education: ${profile.degree} in ${profile.branch}
Experience: ${profile.exp || 'Fresher'}
Interview Performance: ${avg}/100 average score across ${allScores.length} questions
Filler words used: ${fillerCount}
Individual scores: ${allScores.join(', ')}

As an HR Director, provide exactly 3 pieces of specific, actionable feedback. Include:
1. What the candidate did well (or what HR noticed positively)
2. What concerned you as HR / what a boss would want improved  
3. One concrete action item for their next interview

Start each line with an emoji. Be specific to THIS candidate's performance.`
            }];
            const res = await fetch('/api/interview', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: msgs }) });
            const json = await res.json();
            const lines = (json.content || '').split('\n').filter(l => l.trim()).slice(0, 3);
            if (lines.length >= 2) feedback = lines;
        } catch (e) { }

        try { const hist = JSON.parse(localStorage.getItem('lwf_score_history') || '[]'); hist.push({ type: 'interview', score: avg, total: 100, pct: avg, time: Date.now() }); localStorage.setItem('lwf_score_history', JSON.stringify(hist)); } catch (e) { }

        // HR verdict
        let verdict, verdictDetail;
        if (avg >= 80) { verdict = '🎉 Strong Candidate — Likely to Get Hired!'; verdictDetail = 'As an HR, I would move this candidate to the next round without hesitation.'; }
        else if (avg >= 65) { verdict = '👍 Promising — Needs Minor Improvements'; verdictDetail = 'An HR would consider you, but might have a few concerns to discuss with the team.'; }
        else if (avg >= 50) { verdict = '💪 Average — Significant Improvement Needed'; verdictDetail = 'Honestly, a hiring manager would likely pass unless the talent pool is thin. Focus on structured answers.'; }
        else { verdict = '📚 Not Ready Yet — Keep Practicing'; verdictDetail = 'An HR would not move forward at this stage. But don\'t give up — practice daily and you\'ll improve fast.'; }

        setResult({ avg, conf: Math.min(100, Math.max(30, avg + Math.floor(Math.random() * 15) - 5)), comm: Math.min(100, Math.max(25, avg - 5 + Math.floor(Math.random() * 10))), feedback, qs: allScores.length, verdict, verdictDetail });
        setScreen('results');
    };

    const toggleMic = async () => {
        if (recording) { recRef.current?.stop?.(); setRecording(false); return; }
        try {
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
                const sr = new SR(); sr.continuous = true; sr.interimResults = true;
                sr.onresult = (evt) => { setVoiceAns(Array.from(evt.results).map(r => r[0].transcript).join('')); };
                sr.onerror = () => setRecording(false); recRef.current = sr; sr.start(); setRecording(true);
            }
        } catch (e) { showToast?.('⚠️ Mic access denied'); }
    };

    const addSkill = (e) => { if (e.key === 'Enter' && skillInput.trim()) { e.preventDefault(); setProfile(p => ({ ...p, skills: [...p.skills, skillInput.trim()] })); setSkillInput(''); } };
    const handleKeyDown = (e, ansText) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(ansText); } };
    const fmtTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
    const ringOffset = result ? Math.max(0, 440 - (result.avg / 100) * 440) : 440;
    const vBadge = result ? (result.avg >= 80 ? { cls: 'good', text: '🎉 Likely Hired!' } : result.avg >= 65 ? { cls: 'good', text: '👍 Promising' } : result.avg >= 50 ? { cls: 'avg', text: '💪 Needs Work' } : { cls: 'bad', text: '📚 Keep Practicing' }) : null;

    return (
        <div id="page-interview">
            <div className="loop-wrap">
                <div className="gorb gorb1" /><div className="gorb gorb2" />

                {screen === 'landing' && (
                    <div className="loop-screen active" id="lscreen-landing">
                        <div className="l-logo-mark">AI</div>
                        <p className="l-eyebrow">● Live Interview Simulator</p>
                        <h1 className="l-title">AI Interview<br />Coach</h1>
                        <p className="l-sub">Face a realistic HR interviewer. Get scored like a real interview. Know how a boss would react to your answers.</p>
                        <div className="l-feat-row">
                            {['🤖 HR/Boss AI', '🎤 Voice Mode', '📊 Real Scoring', '😊 Boss Reactions'].map(c => <div key={c} className="l-chip"><span>{c.split(' ')[0]}</span>{c.split(' ').slice(1).join(' ')}</div>)}
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
                                <div className="lform-group"><label className="llabel">Full Name</label><input className="linput" required placeholder="Name" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} /></div>
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
                        <div className="l-iv-layout">
                            <div className="l-iv-main">
                                <div className="l-iv-hdr">
                                    <div className="l-iv-info"><div className="l-iv-ava">{qIdx >= 10 && profile.diff !== 'easy' ? 'TL' : 'HR'}</div><div><div className="l-iv-name">{qIdx >= 10 && profile.diff !== 'easy' ? 'Technical Lead' : 'HR Manager'}</div><div className="l-iv-role">{{ google: 'Google', tcs: 'TCS', startup: 'InnovateTech', general: 'TechCorp' }[profile.company] || 'TechCorp'}</div></div></div>
                                    <div className="l-hdr-right">
                                        <button onClick={() => setVoiceOn(v => !v)} style={{ background: 'rgba(6,214,160,0.2)', border: '1px solid rgba(6,214,160,0.5)', color: 'var(--loop-accent2)', fontFamily: "'DM Mono',monospace", fontSize: 11, padding: '5px 10px', borderRadius: 7, cursor: 'pointer' }}>{voiceOn ? 'ON' : 'OFF'}</button>
                                        <div className={`l-qtimer${timer <= 15 ? ' danger' : timer <= 30 ? ' warn' : ''}`}>{timer}</div>
                                        <div className="l-status"><span style={{ width: 5, height: 5, background: 'var(--loop-accent2)', borderRadius: '50%', display: 'inline-block', animation: 'blink2 1s infinite' }} />LIVE</div>
                                    </div>
                                </div>
                                <div className="l-chat" ref={chatRef}>
                                    {messages.map((m, i) => (
                                        <div key={i} className={`l-msg${m.role === 'sys' ? ' sys-msg' : ''}`} style={m.role === 'sys' ? { textAlign: 'center', color: 'var(--loop-accent2)', fontStyle: 'italic', margin: '20px 0' } : {}}>
                                            {m.role !== 'sys' && <div className={`l-mava ${m.role}`}>{m.role === 'ai' ? (qIdx >= 10 && profile.diff !== 'easy' ? 'TL' : 'HR') : profile.name?.[0]?.toUpperCase() || 'U'}</div>}
                                            {m.role !== 'sys' && <div className="l-mcont"><div className="l-mmeta">{m.role === 'ai' ? (qIdx >= 10 && profile.diff !== 'easy' ? 'Technical Lead' : 'HR Manager') : profile.name || 'You'}</div><div className={`l-mbub${m.role === 'ai' ? ' ai-b' : ''}${m.type === 'warn' ? ' warn-b' : ''}`} dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>').replace(/\n/g, '<br/>') }} /></div>}
                                            {m.role === 'sys' && <div>{m.text}</div>}
                                        </div>
                                    ))}
                                    {aiThinking && <div className="l-msg"><div className="l-mava ai">{qIdx >= 10 && profile.diff !== 'easy' ? 'TL' : 'HR'}</div><div className="l-mcont"><div className="l-mmeta">{qIdx >= 10 && profile.diff !== 'easy' ? 'Technical Lead' : 'HR Manager'}</div><div className="l-mbub ai-b" style={{ fontStyle: 'italic', color: 'var(--loop-muted)' }}>Evaluating response...</div></div></div>}
                                </div>
                                <div className="l-input-area">
                                    <div className="l-tabs">{[['voice', '🎤 Voice'], ['text', '⌨️ Text']].map(([id, lbl]) => <button key={id} className={`l-tab${tab === id ? ' active' : ''}`} onClick={() => setTab(id)}>{lbl}</button>)}</div>
                                    {tab === 'voice' && <div className="l-tc active"><div className="l-irow"><button className={`l-bmic${recording ? ' recording' : ' idle'}`} onClick={toggleMic}>🎤</button><textarea id="la-text" value={voiceAns} onChange={e => setVoiceAns(e.target.value)} onKeyDown={e => handleKeyDown(e, voiceAns)} placeholder="Voice appears here or type... (Enter to send)" /><button className="l-bsend" disabled={aiThinking} onClick={() => send(voiceAns)}>Send →</button></div><div className="l-mstatus">{recording ? '🔴 Recording — tap mic to stop' : 'Click mic or type + Enter to send'}</div></div>}
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
                            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 22, color: 'var(--loop-text)' }}>HR Assessment Report</h2>
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
                            <div style={{ marginBottom: 18 }}><p className="lft">HR Director Feedback</p>{result.feedback.map((f, i) => <div key={i} className="lfi"><span>→</span><span>{f}</span></div>)}</div>
                            <button className="btn-loop" onClick={() => setScreen('landing')} style={{ width: '100%', marginBottom: 10 }}>Practice Again →</button>
                            <button onClick={() => showPage('roadmap')} style={{ width: '100%', background: 'var(--loop-surface2)', border: '1px solid var(--loop-border)', color: 'var(--loop-text)', padding: 12, borderRadius: 10, fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>View Career Roadmap →</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
