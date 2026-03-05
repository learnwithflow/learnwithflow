'use client';
import { useState, useEffect, useRef } from 'react';
import { CHAPTERS, QBANKS_RAW, shuffleArr } from '../lib/examData';

function fmtTime(s) { return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`; }

function repeatAndShuffle(pool, needed) {
    const result = [];
    while (result.length < needed) {
        const shuffled = shuffleArr([...pool]);
        for (const q of shuffled) {
            if (result.length >= needed) break;
            result.push({ ...q, _id: result.length });
        }
    }
    return result;
}

export default function MockExam({ showPage, showToast }) {
    const [examType, setExamType] = useState('eamcet');
    const [view, setView] = useState('daily');
    const [qs, setQs] = useState([]);
    const [qIdx, setQIdx] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(900);
    const [examTitle, setExamTitle] = useState('');
    const [activeMode, setActiveMode] = useState('');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState('');
    const timerRef = useRef(null);

    useEffect(() => { return () => clearInterval(timerRef.current); }, []);


    const switchExamType = (type) => {
        setExamType(type);
        setView('daily');
        setQs([]);
        setQIdx(0);
        setAnswers([]);
        setFeedback('');
        setSelectedChapter('');
        clearInterval(timerRef.current);
    };

    const launchExam = (questions, title, timeSeconds, mode) => {
        setQs(questions); setQIdx(0); setAnswers(Array(questions.length).fill(null));
        setTimeLeft(timeSeconds); setExamTitle(title); setActiveMode(mode); setFeedback(''); setView('run'); setLoading(false);
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => { setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); return 0; } return t - 1; }); }, 1000);
    };

    const generateMoreQuestions = async (existing, needed, type, chapter) => {
        const shortfall = needed - existing.length;
        if (shortfall <= 0) return existing.slice(0, needed);
        try {
            const msgs = [{
                role: 'system',
                content: `Generate exactly ${shortfall} MCQ questions for ${type} exam${chapter ? ` on topic: ${chapter}` : ''}. Return ONLY a JSON array. Each: {"s":"Subject","b":"Question?","o":["A","B","C","D"],"a":0,"e":"Short 1-sentence explanation of why it is correct"} where "a" is correct index.`
            }, { role: 'user', content: `Generate ${shortfall} unique questions now.` }];
            const res = await fetch('/api/exam', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: msgs, action: 'generate' }) });
            const json = await res.json();
            if (json.questions && Array.isArray(json.questions)) {
                return [...existing, ...json.questions].slice(0, needed);
            }
        } catch (e) { }
        return repeatAndShuffle(existing, needed);
    };

    const startChapterExam = async (idx) => {
        setLoading(true);
        const pool = shuffleArr([...(QBANKS_RAW[examType] || QBANKS_RAW.eamcet)]);
        const chapter = CHAPTERS[examType]?.[idx] || 'Topic';
        const questions = await generateMoreQuestions(pool, 30, examType, chapter);
        launchExam(questions, `📚 Chapter Quiz — ${chapter} (30 Qs)`, 30 * 60, 'chapter');
    };

    const startWeakExam = async () => {
        setLoading(true);
        const pool = shuffleArr([...(QBANKS_RAW[examType] || QBANKS_RAW.eamcet)]);
        const questions = await generateMoreQuestions(pool, 60, examType, null);
        launchExam(questions, '☀️ Weak Area Quiz (60 Qs)', 60 * 60, 'weak');
    };

    const startFullExam = async () => {
        setLoading(true);
        const pool = shuffleArr([...(QBANKS_RAW[examType] || QBANKS_RAW.eamcet)]);
        const questions = await generateMoreQuestions(pool, 90, examType, null);
        launchExam(questions, '🌙 Full Mock Exam (90 Qs)', 90 * 60, 'full');
    };

    const selectAns = (i) => {
        if (answers[qIdx] !== null) return;
        const newAns = [...answers]; newAns[qIdx] = i; setAnswers(newAns);
        const q = qs[qIdx];
        const isCorrect = i === q.a;

        let feedbackHTML = (
            <div style={{
                marginTop: 20, padding: 16, borderRadius: 12, border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                background: isCorrect ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)', animation: 'slideUp 0.3s ease'
            }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: isCorrect ? '#059669' : '#dc2626', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {isCorrect ? '✨ Correct!' : `❌ Incorrect`}
                </div>
                {!isCorrect && <div style={{ fontWeight: 600, color: '#374151', marginBottom: 6 }}>Correct Answer: {['A', 'B', 'C', 'D'][q.a]}) {q.o[q.a]}</div>}

                {(q.e && q.e.trim() !== '') && (
                    <div style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.5, borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 8, marginTop: 4 }}>
                        <span style={{ fontWeight: 600 }}>💡 Explanation:</span> {q.e}
                    </div>
                )}
            </div>
        );
        setFeedback(feedbackHTML);
    };

    const submitExam = () => {
        clearInterval(timerRef.current);
        const correct = answers.reduce((acc, a, i) => acc + (a === qs[i]?.a ? 1 : 0), 0);
        const pct = Math.round(correct / qs.length * 100);
        try {
            const hist = JSON.parse(localStorage.getItem('lwf_score_history') || '[]');
            hist.push({ type: examType, mode: activeMode, score: correct, total: qs.length, pct, time: Date.now() });
            if (hist.length > 30) hist.splice(0, hist.length - 30);
            localStorage.setItem('lwf_score_history', JSON.stringify(hist));
            localStorage.setItem('lwf_score', `${correct}/${qs.length} (${pct}%)`);
            const prev = parseInt(localStorage.getItem('lwf_qs') || '0');
            localStorage.setItem('lwf_qs', prev + qs.length);
        } catch (e) { }
        showToast?.(`Score: ${correct}/${qs.length} (${pct}%) — Saved! 🎯`);
        setView('daily');
    };

    const q = qs[qIdx];
    const answered = answers.filter(a => a !== null).length;
    const currentChapters = CHAPTERS[examType] || [];

    return (
        <div className="exam-wrap">
            <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#2563a8', fontWeight: 700, marginBottom: 8 }}>📝 DAILY PLAN</p>
                <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 34, marginBottom: 6 }}>Today&apos;s Study Plan</h2>
            </div>
            <div className="exam-type-tabs">
                {[['eamcet', 'EAMCET'], ['it', 'IT/Coding'], ['diploma', 'Diploma'], ['neet', 'NEET'], ['appsc', 'APPSC']].map(([id, label]) => (
                    <button key={id} className={`exam-tab${examType === id ? ' active' : ''}`} onClick={() => switchExamType(id)}>{label}</button>
                ))}
            </div>

            {view === 'daily' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {loading && (
                        <div style={{ background: 'rgba(37,99,168,0.08)', border: '1px solid rgba(37,99,168,0.3)', borderRadius: 12, padding: '20px', textAlign: 'center', fontSize: 15, fontWeight: 600, color: '#2563a8' }}>
                            🤖 AI is generating questions... Please wait...
                        </div>
                    )}
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>📚 Chapter Practice — {examType.toUpperCase()}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>30 Questions · 30 minutes</div>
                        <select className="form-input" style={{ width: '100%', marginBottom: 10 }} value={selectedChapter} onChange={e => setSelectedChapter(e.target.value)}>
                            <option value="">Select chapter...</option>
                            {currentChapters.map((c, i) => <option key={i} value={i}>{c}</option>)}
                        </select>
                        <button className="btn-sm btn-sm-primary" disabled={loading} onClick={() => { if (selectedChapter === '') { showToast?.('⚠️ Select a chapter!'); return; } startChapterExam(parseInt(selectedChapter)); }}>Start Chapter Quiz (30 Qs) →</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
                            <div style={{ fontWeight: 700, marginBottom: 4 }}>☀️ Weak Area — {examType.toUpperCase()}</div>
                            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>60 Questions · 60 minutes</div>
                            <div style={{ fontSize: 11, color: 'var(--accent)', marginBottom: 12 }}>AI generates extra questions!</div>
                            <button className="btn-sm btn-sm-primary" disabled={loading} onClick={startWeakExam}>Start (60 Qs) →</button>
                        </div>
                        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
                            <div style={{ fontWeight: 700, marginBottom: 4 }}>🌙 Full Mock — {examType.toUpperCase()}</div>
                            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>90 Questions · 90 minutes</div>
                            <div style={{ fontSize: 11, color: 'var(--accent)', marginBottom: 12 }}>Real exam simulation!</div>
                            <button className="btn-sm btn-sm-primary" disabled={loading} onClick={startFullExam}>Start (90 Qs) →</button>
                        </div>
                    </div>
                </div>
            )}

            {view === 'run' && q && (<>
                <div className="exam-header">
                    <div>
                        <div className="exam-title">{examTitle}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>Solved: {answered}/{qs.length}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div className="exam-timer-num">{fmtTime(timeLeft)}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>Q {qIdx + 1} / {qs.length}</div>
                    </div>
                </div>
                <div className="exam-layout">
                    <div className="exam-main">
                        <div className="q-subject">{q.s}</div>
                        <div className="q-body">{q.b}</div>
                        <div className="options-grid">
                            {q.o.map((o, i) => {
                                let cls = 'opt';
                                if (answers[qIdx] !== null) { cls += ' disabled'; if (i === q.a) cls += ' correct'; else if (i === answers[qIdx]) cls += ' wrong'; }
                                return <button key={i} className={cls} onClick={() => selectAns(i)}>{['A', 'B', 'C', 'D'][i]}) {o}</button>;
                            })}
                        </div>
                        {feedback && feedback}
                        <div className="exam-nav">
                            <button className="btn-sm btn-sm-outline" onClick={() => { if (qIdx > 0) { setQIdx(qIdx - 1); setFeedback(''); } }}>← Prev</button>
                            <button className="btn-sm btn-sm-primary" style={{ background: 'rgba(220,38,38,0.9)' }} onClick={submitExam}>Submit Exam</button>
                            <button className="btn-sm btn-sm-outline" onClick={() => { if (qIdx < qs.length - 1) { setQIdx(qIdx + 1); setFeedback(''); } else submitExam(); }}>
                                {qIdx < qs.length - 1 ? 'Next →' : 'Finish →'}
                            </button>
                        </div>
                    </div>
                    <div className="q-palette-wrap">
                        <div className="palette-title">Question Palette</div>
                        <div className="palette-grid">
                            {qs.map((_, i) => <button key={i} className={`p-btn${answers[i] !== null ? ' answered' : ''}${i === qIdx ? ' active-p' : ''}`} onClick={() => { setQIdx(i); setFeedback(''); }}>{i + 1}</button>)}
                        </div>
                        <div style={{ marginTop: 14, fontSize: 12, color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                            <div>✅ Answered: {answered}</div>
                            <div>⬜ Remaining: {qs.length - answered}</div>
                        </div>
                    </div>
                </div>
            </>)}
        </div>
    );
}
