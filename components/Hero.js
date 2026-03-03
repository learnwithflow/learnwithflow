'use client';

export default function Hero({ showPage }) {
    return (
        <>
            <div className="hero">
                <div className="float-tag ft1">✅ EAMCET Ready</div>
                <div className="float-tag ft2">🎯 IT Jobs</div>
                <div className="float-tag ft3">🏆 Top 10%</div>
                <h1>Your path from <em>Inter</em> to <em>Career</em> starts here.</h1>
                <p className="hero-sub">
                    Confused after 10th or Intermediate? LearnWithFlow gives you AI career guidance,
                    mock exams, voice interview practice — all in one place.
                </p>
                <div className="hero-actions">
                    <button className="btn-big btn-primary" onClick={() => showPage('quiz')}>Take Career Quiz — Free →</button>
                    <button className="btn-big btn-outline" onClick={() => showPage('exam')}>Try Mock Exam</button>
                </div>
                <div className="hero-stats">
                    <div className="hstat">
                        <div className="hstat-num">5K+</div>
                        <div className="hstat-label">Students</div>
                    </div>
                    <div className="hstat">
                        <div className="hstat-num">94%</div>
                        <div className="hstat-label">Pass Rate</div>
                    </div>
                </div>
            </div>

            <div className="feat-strip">
                <div className="feat-inner">
                    <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--muted)' }}>
                        Everything you need to succeed
                    </div>
                    <div className="feat-row">
                        {[
                            { icon: '🧭', title: 'AI Career Compass', desc: '5-min quiz → personalized path.', page: 'quiz' },
                            { icon: '🗺️', title: 'Career Roadmaps', desc: 'Interactive, click to track progress.', page: 'roadmap' },
                            { icon: '🎤', title: 'AI Interview Coach', desc: 'Voice + code + confidence analysis.', page: 'interview' },
                            { icon: '📊', title: 'Progress Dashboard', desc: 'Streaks, graphs, weak areas.', page: 'dashboard' },
                        ].map(f => (
                            <div key={f.page} className="feat-cell" onClick={() => showPage(f.page)}>
                                <div className="fc-icon">{f.icon}</div>
                                <div className="fc-title">{f.title}</div>
                                <div className="fc-desc">{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
