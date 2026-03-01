'use client';
import { useState } from 'react';
import { QUIZ_Q, RESULTS } from '../lib/quizData';

export default function CareerQuiz({ showPage }) {
    const [qIdx, setQIdx] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [result, setResult] = useState(null);
    const [selected, setSelected] = useState(null);

    const selectAns = (i) => {
        setSelected(i);
        setTimeout(() => {
            const newAns = [...answers]; newAns[qIdx] = i; setAnswers(newAns); setSelected(null);
            if (qIdx < 4) setQIdx(qIdx + 1);
            else {
                let key = 'eamcet';
                if (newAns[1] === 2 || newAns[3] === 0) key = 'diploma';
                else if (newAns[1] === 3) key = 'it';
                else if (newAns[2] === 1) key = 'neet';
                else if (newAns[3] === 2) key = 'appsc';
                setResult(RESULTS[key]);
            }
        }, 360);
    };

    const restart = () => { setQIdx(0); setAnswers([]); setResult(null); setSelected(null); };
    const q = QUIZ_Q[qIdx];
    const progress = ((qIdx + 1) / 5) * 100;

    return (
        <div className="quiz-wrap">
            <div style={{ marginBottom: 30 }}>
                <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#2563a8', fontWeight: 700, marginBottom: 10 }}>🧭 AI Career Compass</div>
                <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 38, lineHeight: 1.1, marginBottom: 8 }}>
                    Let&apos;s find your <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#2563a8,#06d6a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>perfect path.</em>
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: 15 }}>Answer 5 questions. Our AI suggests the best career path.</p>
            </div>
            {!result ? (<>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 18 }}>Question {qIdx + 1} of 5</div>
                <div className="quiz-card">
                    <div className="q-num">Question 0{qIdx + 1}</div>
                    <div className="q-text">{q.t}</div>
                    <div className="q-options">
                        {q.o.map((opt, i) => <button key={i} className={`q-option${selected === i ? ' selected' : ''}`} onClick={() => selectAns(i)}>{opt}</button>)}
                    </div>
                </div>
            </>) : (<>
                <div className="progress-bar"><div className="progress-fill" style={{ width: '100%' }} /></div>
                <div className="result-card show">
                    <div className="result-path">{result.p}</div>
                    <h3>{result.t}</h3><p>{result.d}</p>
                    <ul className="result-bullets">{result.b.map((b, i) => <li key={i}>{b}</li>)}</ul>
                    <div className="salary-chip">💰 {result.s}</div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 22, flexWrap: 'wrap' }}>
                        <button className="btn-big btn-primary" onClick={() => showPage('roadmap')}>View Roadmap →</button>
                        <button className="btn-big btn-outline" onClick={restart}>Retake Quiz</button>
                    </div>
                </div>
            </>)}
        </div>
    );
}
