'use client';
import { useState, useEffect, useRef } from 'react';

const DAILY_TASKS = [
    { text: '📚 Chapter Practice — 10 Qs', pts: '+10 pts' },
    { text: '☀️ Weak Area Quiz — 10 Qs', pts: '+10 pts' },
    { text: '🌙 Full Mock Exam — 30 Qs', pts: '+30 pts' },
    { text: '🗺️ Complete 1 Roadmap topic', pts: '+5 pts' },
];

export default function Dashboard({ showPage }) {
    const [streak, setStreak] = useState(1);
    const [bestStreak, setBestStreak] = useState(1);
    const [qs, setQs] = useState(0);
    const [score, setScore] = useState('--');
    const [rmPct, setRmPct] = useState(0);
    const [tasks, setTasks] = useState(DAILY_TASKS.map(t => ({ ...t, done: false })));
    const [history, setHistory] = useState([]);
    const chartRef = useRef(null);
    const chartInstRef = useRef(null);

    useEffect(() => { loadAll(); }, []);
    useEffect(() => { if (history.length > 0) buildChart(); }, [history]);

    const loadAll = () => {
        try {
            const today = new Date().toDateString();
            const last = localStorage.getItem('lwf_last_visit');
            let s = parseInt(localStorage.getItem('lwf_streak') || '1');
            let bs = parseInt(localStorage.getItem('lwf_best_streak') || '1');
            if (last !== today) {
                const yesterday = new Date(Date.now() - 86400000).toDateString();
                s = last === yesterday ? s + 1 : 1;
                localStorage.setItem('lwf_last_visit', today);
                localStorage.setItem('lwf_streak', s);
                if (s > bs) { bs = s; localStorage.setItem('lwf_best_streak', bs); }
            }
            setStreak(s || 1); setBestStreak(bs || 1);
            setQs(parseInt(localStorage.getItem('lwf_qs') || '0'));
            setScore(localStorage.getItem('lwf_score') || '--');
            try { const rm = JSON.parse(localStorage.getItem('lwf_rm_v3') || '{}'); const total = Object.values(rm).reduce((a, v) => a + (v?.length || 0), 0); setRmPct(total > 0 ? Math.min(100, Math.round(total / 5)) : 0); } catch (e) { }
            try { setHistory(JSON.parse(localStorage.getItem('lwf_score_history') || '[]')); } catch (e) { }
        } catch (e) { }
    };

    const buildChart = () => {
        if (!chartRef.current || typeof window === 'undefined' || typeof Chart === 'undefined') return;
        if (chartInstRef.current) chartInstRef.current.destroy();
        chartInstRef.current = new Chart(chartRef.current, {
            type: 'line',
            data: { labels: history.slice(-10).map((_, i) => `Exam ${i + 1}`), datasets: [{ label: 'Score %', data: history.slice(-10).map(h => h.pct), borderColor: '#2563a8', backgroundColor: 'rgba(37,99,168,0.1)', tension: 0.4, fill: true, pointRadius: 5, pointBackgroundColor: history.slice(-10).map(h => h.pct >= 70 ? '#16a34a' : '#dc2626') }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100 }, x: { grid: { display: false } } } }
        });
    };

    const toggleTask = (i) => setTasks(prev => prev.map((t, idx) => idx === i ? { ...t, done: !t.done } : t));
    const hour = new Date().getHours();
    const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="dash-wrap">
            <div style={{ marginBottom: 26 }}>
                <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, marginBottom: 4 }}>{greet}! 👋</h2>
                <p style={{ color: 'var(--muted)', fontSize: 15 }}>Keep going — you&apos;re making great progress!</p>
            </div>
            <div className="dash-grid">
                <div className="dash-card"><div className="dc-icon">🔥</div><div className="dc-val">{streak}</div><div className="dc-label">Day Streak</div><div className="dc-change">Best: {bestStreak}</div></div>
                <div className="dash-card"><div className="dc-icon">✅</div><div className="dc-val">{qs}</div><div className="dc-label">Qs Solved</div><div className="dc-change">Keep solving!</div></div>
                <div className="dash-card"><div className="dc-icon">📊</div><div className="dc-val">{score}</div><div className="dc-label">Last Score</div></div>
                <div className="dash-card"><div className="dc-icon">🗺️</div><div className="dc-val">{rmPct}%</div><div className="dc-label">Roadmap</div></div>
            </div>
            <div className="dash-main">
                <div>
                    <div className="big-card">
                        <h3>📈 Score History</h3>
                        {history.length === 0 ? <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '30px 0', fontSize: 14 }}>Take your first exam to see your chart!</div> : <div style={{ height: 160 }}><canvas ref={chartRef} /></div>}
                    </div>
                </div>
                <div>
                    <div className="big-card">
                        <h3>📋 Today&apos;s Tasks</h3>
                        <div className="week-tasks">
                            {tasks.map((t, i) => (
                                <div key={i} className={`task${t.done ? ' done' : ''}`} onClick={() => toggleTask(i)}>
                                    <div className="task-check">{t.done ? '✓' : ''}</div>
                                    <div className="task-text">{t.text}</div>
                                    <div className="task-pts">{t.pts}</div>
                                </div>
                            ))}
                        </div>
                        <button className="btn-sm btn-sm-primary" style={{ marginTop: 12 }} onClick={() => showPage('roadmap')}>Open Roadmaps →</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
