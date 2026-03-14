'use client';
import { useState, useEffect, useRef } from 'react';
import { CHAPTERS, QBANKS_RAW, shuffleArr } from '../lib/examData';
import { experimental_useObject } from '@ai-sdk/react';
import { z } from 'zod';
import { supabase, getAnonId } from '../lib/supabase';
import { incrementStreak } from '../lib/streak';
function fmtTime(s) { return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`; }

// Track used questions to prevent repeats across sessions
const USED_QS_KEY = 'lwf_used_qs_v2';
function getUsedQuestions(examType) {
    try {
        const data = JSON.parse(localStorage.getItem(USED_QS_KEY) || '{}');
        return data[examType] || [];
    } catch { return []; }
}
function saveUsedQuestions(examType, questionTexts) {
    try {
        const data = JSON.parse(localStorage.getItem(USED_QS_KEY) || '{}');
        const existing = data[examType] || [];
        const combined = [...new Set([...existing, ...questionTexts])];
        // Cap at 300 per exam type to avoid localStorage overflow
        data[examType] = combined.slice(-300);
        localStorage.setItem(USED_QS_KEY, JSON.stringify(data));
    } catch (e) { console.error('Save used qs error:', e); }
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
        // Randomize options for every single question to prevent A/B bias
        const randomizedQs = questions.map(q => {
            const correctText = q.o[q.a]; // The actual correct text before shuffle
            const shuffledOptions = shuffleArr([...q.o]);
            const newCorrectIndex = shuffledOptions.findIndex(opt => opt === correctText);
            return { ...q, o: shuffledOptions, a: newCorrectIndex };
        });

        setQs(randomizedQs); setQIdx(0); setAnswers(Array(questions.length).fill(null));
        setTimeLeft(timeSeconds); setExamTitle(title); setActiveMode(mode); setFeedback(''); setView('run'); setLoading(false);
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => { setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); return 0; } return t - 1; }); }, 1000);
    };

    const { submit: generateAIQuestions, object: generatedQuestions, isLoading: isGenerating } = experimental_useObject({
        api: '/api/exam',
        headers: { 'x-api-secret': process.env.NEXT_PUBLIC_API_SECRET },
        schema: z.object({
            questions: z.array(z.object({
                s: z.string(),
                b: z.string(),
                o: z.array(z.string()),
                a: z.number(),
                e: z.string().optional()
            }))
        })
    });

    // Generate questions: combine pool + AI-generated to reach the target count
    const generateMoreQuestions = async (pool, needed, type, chapter) => {
        // Get previously used questions from local storage
        const usedQTexts = getUsedQuestions(type);
        const poolQuestions = shuffleArr([...pool]);

        // Attempt to fetch robust online history from Supabase if user exists
        let supabaseUsedQTexts = [];
        try {
            const uid = getAnonId();
            if (uid) {
                // Fetch up to 1000 past questions for this user + exam type + chapter combo
                let query = supabase
                    .from('user_question_history')
                    .select('question_text')
                    .eq('user_id', uid)
                    .eq('exam_type', type)
                    .order('created_at', { ascending: false })
                    .limit(1000);
                
                if (chapter && chapter !== 'FULL_MOCK') {
                    query = query.eq('chapter', chapter);
                }

                const { data, error } = await query;
                if (error) {
                    console.warn(`[Graceful Degradation] Supabase history fetch skipped: ${error.message}`);
                } else if (data) {
                    supabaseUsedQTexts = data.map(row => row.question_text);
                }
            }
        } catch (e) {
            console.error('[Graceful Degradation] Failed fetching Supabase history:', e);
        }

        // Combine local used and Supabase history
        const excludeTexts = [
            ...usedQTexts.slice(0, 200), // Send up to 200 local used questions
            ...supabaseUsedQTexts // Throw in all Supabase history fetched
        ];

        // Deduplicate exclusions to save payload size
        const uniqueExcludeTexts = [...new Set(excludeTexts)];

        let aiQuestions = [];
        try {
            const res = await fetch('/api/exam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-secret': process.env.NEXT_PUBLIC_API_SECRET
                },
                body: JSON.stringify({
                    action: 'generate',
                    examType: type,
                    chapter,
                    count: needed,
                    exclude: uniqueExcludeTexts
                })
            });

                if (!res.ok) throw new Error('API failed to generate questions');
                const questions = await res.json();
                
                if (questions && questions.error) {
                    throw new Error(questions.error || 'Failed to generate questions');
                }

                if (questions && Array.isArray(questions) && questions.length > 0) {
                    // Filter out duplicates of used questions
                    const seen = new Set([
                        ...usedQTexts.map(t => t.toLowerCase().substring(0, 100)),
                        ...supabaseUsedQTexts.map(t => t.toLowerCase().substring(0, 100))
                    ]);
                    aiQuestions = questions.filter(q => {
                        if (!q.b || !q.o || q.o.length < 4 || typeof q.a !== 'number') return false;
                        const key = q.b.trim().toLowerCase().substring(0, 100);
                        if (seen.has(key)) return false;
                        seen.add(key);
                        return true;
                    });
                }
            } catch (e) {
                console.error('Gen error:', e);
                setLoading(false);
                showToast?.('⚠️ Failed to generate questions from AI API. Please try again later.');
                throw e; // Stop execution here so we don't proceed with empty questions
            }

            // If AI falls short, mix in local pool to guarantee exact number of questions
            const final = shuffleArr([...aiQuestions, ...poolQuestions]).slice(0, needed);

            if (final.length < needed) {
                setLoading(false);
                showToast?.(`⚠️ Could only generate ${final.length} questions. Need ${needed}.`);
                throw new Error('Not enough questions available');
            }

        // Save used question texts for next time
        const usedTexts = final.map(q => q.b.trim().substring(0, 80));
        saveUsedQuestions(type, usedTexts);

        console.log(`Exam: requested ${needed}, got ${aiQuestions.length} AI + ${poolQuestions.length} pool = ${final.length} total`);
        return final;
    };

    const startChapterExam = async (idx) => {
        setLoading(true);
        const chapter = CHAPTERS[examType]?.[idx] || 'Topic';
        try {
            const questions = await generateMoreQuestions(QBANKS_RAW[examType] || [], 30, examType, chapter);
            launchExam(questions, `📚 Chapter Quiz — ${chapter} (${questions.length} Qs)`, 30 * 60, 'chapter');
        } catch (e) {
            // Already handled by showToast in generateMoreQuestions
        }
    };

    const startWeakExam = async () => {
        setLoading(true);
        try {
            const questions = await generateMoreQuestions(QBANKS_RAW[examType] || [], 60, examType, null);
            launchExam(questions, `☀️ Weak Area Quiz (${questions.length} Qs)`, 60 * 60, 'weak');
        } catch (e) {
            // Already handled by showToast
        }
    };

    const startFullExam = async () => {
        setLoading(true);
        try {
            const questions = await generateMoreQuestions(QBANKS_RAW[examType] || [], 90, examType, 'FULL_MOCK');
            launchExam(questions, `🌙 Full Mock Exam (${questions.length} Qs)`, 90 * 60, 'full');
        } catch (e) {
            // Already handled by showToast
        }
    };

    const saveToFlashcards = (qObj, explanation) => {
        try {
            const cards = JSON.parse(localStorage.getItem('lwf_flashcards') || '[]');
            // Avoid duplicates
            if (!cards.find(c => c.q === qObj.b)) {
                cards.push({
                    q: qObj.b,
                    options: qObj.o,
                    a: qObj.a,
                    subj: qObj.s || examType,
                    explanation,
                    savedAt: Date.now(),
                    mastery: 0
                });
                localStorage.setItem('lwf_flashcards', JSON.stringify(cards));
                showToast?.('⭐ Saved to Flashcards!');
            } else {
                showToast?.('Already in Flashcards!');
            }
        } catch (e) { console.error(e); }
    };

    const selectAns = async (i) => {
        if (answers[qIdx] !== null || i === null) return;
        const newAns = [...answers]; newAns[qIdx] = i; setAnswers(newAns);
        const q = qs[qIdx];
        const isCorrect = i === q.a;
        const labels = ['A', 'B', 'C', 'D'];

        if (isCorrect) {
            setFeedback(
                <div style={{ marginTop: 20, padding: 16, borderRadius: 12, border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.06)', animation: 'slideUp 0.3s ease' }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#059669', marginBottom: q.e ? 8 : 0 }}>✨ Correct! Great job!</div>
                    {q.e && <div style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6, borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 8 }}><span style={{ fontWeight: 700, color: '#059669' }}>💡 Why: </span>{q.e}</div>}
                </div>
            );
            return;
        }

        const correctLetter = labels[q.a];
        const correctText = q.o[q.a];
        const staticExp = q.e && q.e.trim() !== '' ? q.e : null;

        // If we already have a static explanation, show it immediately (no API call needed!)
        if (staticExp) {
            setFeedback(
                <div style={{ marginTop: 20, padding: 16, borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.04)', animation: 'slideUp 0.3s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ fontWeight: 700, fontSize: 16, color: '#dc2626' }}>❌ Incorrect</div>
                        <button
                            onClick={() => saveToFlashcards(q, staticExp)}
                            style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#d97706', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.2s' }}
                            onMouseOver={(e) => { e.currentTarget.style.background = '#fde68a'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = '#fef3c7'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            ⭐ Save to Flashcards
                        </button>
                    </div>
                    <div style={{ fontWeight: 600, color: '#1f2937', fontSize: 15, marginBottom: 12 }}>✅ Correct Answer: {correctLetter}) {correctText}</div>
                    <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.65, background: 'rgba(37,99,168,0.05)', borderRadius: 8, padding: '10px 14px' }}>
                        <span style={{ fontWeight: 700, color: '#2563a8' }}>💡 Explanation: </span>{staticExp}
                    </div>
                </div>
            );
            return;
        }

        // No static explanation — show spinner and call AI explain API
        setFeedback(
            <div style={{ marginTop: 20, padding: 16, borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.04)', animation: 'slideUp 0.3s ease' }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#dc2626', marginBottom: 8 }}>❌ Incorrect</div>
                <div style={{ fontWeight: 600, color: '#1f2937', fontSize: 15, marginBottom: 10 }}>✅ Correct Answer: {correctLetter}) {correctText}</div>
                <div style={{ fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 10 }}>
                    <span style={{ width: 16, height: 16, border: '2px solid #2563a8', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
                    Generating AI explanation...
                </div>
            </div>
        );

        let explanation = `The correct answer is ${correctLetter}) ${correctText}.`;
        try {
            const res = await fetch('/api/explain', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-secret': process.env.NEXT_PUBLIC_API_SECRET
                },
                body: JSON.stringify({ question: q.b, options: q.o, correctIndex: q.a, wrongIndex: i, subject: q.s })
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
            explanation = raw || explanation;
        } catch {
            // Keep default explanation
        }

        setFeedback(
            <div style={{ marginTop: 20, padding: 16, borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.04)', animation: 'slideUp 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#dc2626' }}>❌ Incorrect</div>
                    <button
                        onClick={() => saveToFlashcards(q, explanation)}
                        style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#d97706', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.2s' }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#fde68a'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = '#fef3c7'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        ⭐ Save to Flashcards
                    </button>
                </div>
                <div style={{ fontWeight: 600, color: '#1f2937', fontSize: 15, marginBottom: 12 }}>✅ Correct Answer: {correctLetter}) {correctText}</div>
                <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.65, background: 'rgba(37,99,168,0.05)', borderRadius: 8, padding: '10px 14px' }}>
                    <span style={{ fontWeight: 700, color: '#2563a8' }}>💡 Explanation: </span>{explanation}
                </div>
            </div>
        );
    };

    const submitExam = async () => {
        clearInterval(timerRef.current);
        const correct = answers.reduce((acc, a, i) => acc + (a === qs[i]?.a ? 1 : 0), 0);
        const pct = Math.round(correct / qs.length * 100);
        const subjBreakdown = {};
        qs.forEach((q, i) => {
            const subj = q.s || examType;
            if (!subjBreakdown[subj]) subjBreakdown[subj] = { total: 0, correct: 0 };
            subjBreakdown[subj].total += 1;
            if (answers[i] === q.a) subjBreakdown[subj].correct += 1;
        });

        try {
            const hist = JSON.parse(localStorage.getItem('lwf_score_history') || '[]');
            hist.push({
                type: examType,
                mode: activeMode,
                score: correct,
                total: qs.length,
                pct,
                time: Date.now(),
                breakdown: subjBreakdown
            });
            if (hist.length > 30) hist.splice(0, hist.length - 30);
            localStorage.setItem('lwf_score_history', JSON.stringify(hist));
            localStorage.setItem('lwf_score', `${correct}/${qs.length} (${pct}%)`);
            const prev = parseInt(localStorage.getItem('lwf_qs') || '0');
            localStorage.setItem('lwf_qs', prev + qs.length);
            incrementStreak();
        } catch (e) { }
        // Save to Supabase
        try {
            const uid = getAnonId();
            if (uid) {
                const currentQ = qs[0];
                await supabase.from('exam_results').insert({
                    user_id: uid,
                    exam_type: examType,
                    exam_mode: activeMode,
                    subject: currentQ?.s || examType,
                    score: correct,
                    total: qs.length,
                    percentage: pct,
                });

                // Bulk insert newly generated questions into history to prevent repeating them
                // Filter out questions that are just pool fallbacks? Actually, safe to just log all that were exposed.
                const historyPayload = qs.map(q => ({
                    user_id: uid,
                    exam_type: examType,
                    chapter: selectedChapter !== '' && activeMode === 'chapter' ? CHAPTERS[examType][parseInt(selectedChapter)] : 'UNKNOWN',
                    question_text: q.b
                }));
                
                const { error: histError } = await supabase.from('user_question_history').insert(historyPayload);
                if (histError) {
                    console.warn(`[Graceful Degradation] Failed to save question history: ${histError.message}`);
                }
            }
        } catch (e) { console.error('[Graceful Degradation] Supabase save error:', e); }
        showToast?.(`Score: ${correct}/${qs.length} (${pct}%) — Saved! 🎯`);
        setView('daily');
    };

    const q = qs[qIdx];
    const answered = answers.filter(a => a !== null).length;
    const currentChapters = CHAPTERS[examType] || [];
    const EXAM_LABELS = { eamcet: 'Engg. Entrance', it: 'IT & Coding', diploma: 'Diploma', neet: 'Medical Entrance', appsc: 'Govt. Exams' };
    const examLabel = EXAM_LABELS[examType] || examType.toUpperCase();

    return (
        <div className="exam-wrap">
            <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#2563a8', fontWeight: 700, marginBottom: 8 }}>📝 DAILY PLAN</p>
                <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 34, marginBottom: 6 }}>Today&apos;s Study Plan</h2>
            </div>
            <div className="exam-type-tabs">
                {[['eamcet', 'Engg. Entrance'], ['it', 'IT & Coding'], ['diploma', 'Diploma'], ['neet', 'Medical Entrance'], ['appsc', 'Govt. Exams']].map(([id, label]) => (
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
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>📚 Chapter Practice — {examLabel}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>30 Questions · 30 minutes</div>
                        <select className="form-input" style={{ width: '100%', marginBottom: 10 }} value={selectedChapter} onChange={e => setSelectedChapter(e.target.value)}>
                            <option value="">Select chapter...</option>
                            {currentChapters.map((c, i) => <option key={i} value={i}>{c}</option>)}
                        </select>
                        <button className="btn-sm btn-sm-primary" disabled={loading} onClick={() => { if (selectedChapter === '') { showToast?.('⚠️ Select a chapter!'); return; } startChapterExam(parseInt(selectedChapter)); }}>Start Chapter Quiz (30 Qs) →</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
                            <div style={{ fontWeight: 700, marginBottom: 4 }}>☀️ Weak Area — {examLabel}</div>
                            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>60 Questions · 60 minutes</div>
                            <div style={{ fontSize: 11, color: 'var(--accent)', marginBottom: 12 }}>AI generates extra questions!</div>
                            <button className="btn-sm btn-sm-primary" disabled={loading} onClick={startWeakExam}>Start (60 Qs) →</button>
                        </div>
                        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
                            <div style={{ fontWeight: 700, marginBottom: 4 }}>🌙 Full Mock — {examLabel}</div>
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
                            {qIdx === qs.length - 1 && (
                                <button className="btn-sm btn-sm-primary" style={{ background: 'rgba(220,38,38,0.9)' }} onClick={submitExam}>Submit Exam</button>
                            )}
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
