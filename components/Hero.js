'use client';

const FEATURES = [
    {
        icon: '🧭',
        title: 'AI Career Compass',
        desc: '5-minute quiz reveals your ideal path — Engineering, IT, Medicine, Government, or Design.',
        page: 'quiz',
        tag: 'Free'
    },
    {
        icon: '📋',
        title: 'Mock Exams',
        desc: 'EAMCET, NEET, APPSC, IT, Diploma — timed exams with instant AI explanations on wrong answers.',
        page: 'exam',
        tag: 'AI-Powered'
    },
    {
        icon: '🗺️',
        title: 'Career Roadmaps',
        desc: 'Step-by-step interactive paths for every career. Track your progress as you go.',
        page: 'roadmap',
        tag: 'Visual'
    },
    {
        icon: '🎤',
        title: 'AI Interview Coach',
        desc: 'Practice voice interviews with real-time feedback on confidence, clarity and content.',
        page: 'interview',
        tag: 'Voice AI'
    },
];

const STATS = [
    { num: '12+', label: 'Career Paths' },
    { num: '1,200+', label: 'Practice Questions' },
];

const EXAMS = [
    { name: 'EAMCET', icon: '⚗️', desc: 'Engineering & Medicine' },
    { name: 'NEET', icon: '🩺', desc: 'Medical Entrance' },
    { name: 'APPSC', icon: '🏛️', desc: 'Govt Group Exams' },
    { name: 'IT/Coding', icon: '💻', desc: 'Software Jobs' },
    { name: 'Diploma', icon: '📐', desc: 'Polytechnic Exams' },
];

const STEPS = [
    { step: '01', title: 'Take the Free Quiz', desc: 'Answer 10 simple questions about your interests and strengths. No registration needed.' },
    { step: '02', title: 'Get Your Career Path', desc: 'AI instantly maps out the best career options for you with salary ranges and timelines.' },
    { step: '03', title: 'Practice & Prepare', desc: 'Follow roadmaps, take mock exams, and practice interviews — all in one place.' },
    { step: '04', title: 'Land Your First Job', desc: 'Use your AI-Interview Coach to crack interviews and get your first offer.' },
];

const TESTIMONIALS = [
    { name: 'Ravi T.', loc: 'Vijayawada', text: 'After 12th I had no idea what to do. LearnWithFlow showed me IT was perfect for me. Got placed in 8 months!', emoji: '🎓' },
    { name: 'Priya M.', loc: 'Hyderabad', text: 'The EAMCET mock exams are so good — with explanations I actually understood WHY I got it wrong. Cleared with 89%!', emoji: '⚗️' },
    { name: 'Charan K.', loc: 'Guntur', text: 'The interview coach helped me stop fumbling. Real voice practice changed everything for my first campus interview.', emoji: '🎤' },
];

export default function Hero({ showPage }) {
    return (
        <>
            {/* ── HERO ── */}
            <section className="hw-hero">
                <div className="hw-hero-inner">

                    <h1 className="hw-h1">
                        Your path from <em>Inter</em> to <em>Career</em> — guided by AI
                    </h1>
                    <p className="hw-hero-p">
                        Confused after 10th or Intermediate? LearnWithFlow gives you a personalised career roadmap,
                        mock exam practice with instant explanations, and AI voice interview coaching — completely free.
                    </p>
                    <div className="hw-hero-actions">
                        <button className="hw-btn-primary" onClick={() => showPage('quiz')}>
                            Find My Career Path — Free →
                        </button>
                        <button className="hw-btn-outline" onClick={() => showPage('exam')}>
                            Practice Mock Exam
                        </button>
                    </div>
                    <div className="hw-stats-row">
                        {STATS.map(s => (
                            <div key={s.label} className="hw-stat">
                                <div className="hw-stat-num">{s.num}</div>
                                <div className="hw-stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="hw-section hw-features-section">
                <div className="hw-container">
                    <div className="hw-section-tag">What We Offer</div>
                    <h2 className="hw-section-title">Everything you need, in one place</h2>
                    <p className="hw-section-sub">From career discovery to exam prep to job interviews — LearnWithFlow covers every step.</p>
                    <div className="hw-features-grid">
                        {FEATURES.map(f => (
                            <div key={f.page} className="hw-feature-card" onClick={() => showPage(f.page)}>
                                <div className="hw-feat-top">
                                    <div className="hw-feat-icon">{f.icon}</div>
                                    <span className="hw-feat-tag">{f.tag}</span>
                                </div>
                                <div className="hw-feat-title">{f.title}</div>
                                <div className="hw-feat-desc">{f.desc}</div>
                                <div className="hw-feat-cta">Try it →</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── EXAMS ── */}
            <section className="hw-section hw-exams-section">
                <div className="hw-container">
                    <div className="hw-section-tag">Mock Exams</div>
                    <h2 className="hw-section-title">Practice the exam you&apos;re preparing for</h2>
                    <p className="hw-section-sub">AI-generated questions with instant explanations. Know exactly where you went wrong and why.</p>
                    <div className="hw-exams-row">
                        {EXAMS.map(e => (
                            <button key={e.name} className="hw-exam-chip" onClick={() => showPage('exam')}>
                                <span className="hw-exam-icon">{e.icon}</span>
                                <div>
                                    <div className="hw-exam-name">{e.name}</div>
                                    <div className="hw-exam-desc">{e.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="hw-section">
                <div className="hw-container">
                    <div className="hw-section-tag">How It Works</div>
                    <h2 className="hw-section-title">From quiz to career in 4 steps</h2>
                    <div className="hw-steps-grid">
                        {STEPS.map(s => (
                            <div key={s.step} className="hw-step-card">
                                <div className="hw-step-num">{s.step}</div>
                                <div className="hw-step-title">{s.title}</div>
                                <div className="hw-step-desc">{s.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="hw-section hw-testimonials-section">
                <div className="hw-container">
                    <div className="hw-section-tag">Student Stories</div>
                    <h2 className="hw-section-title">Real results from real students</h2>
                    <div className="hw-testi-grid">
                        {TESTIMONIALS.map(t => (
                            <div key={t.name} className="hw-testi-card">
                                <div className="hw-testi-emoji">{t.emoji}</div>
                                <p className="hw-testi-text">&ldquo;{t.text}&rdquo;</p>
                                <div className="hw-testi-name">{t.name} <span className="hw-testi-loc">— {t.loc}</span></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ── */}
            <section className="hw-cta-banner">
                <div className="hw-container hw-cta-inner">
                    <h2 className="hw-cta-title">Start your career journey today — it&apos;s 100% free</h2>
                    <p className="hw-cta-sub">No sign-up required. Just take the quiz and get your personalised career roadmap in under 5 minutes.</p>
                    <button className="hw-btn-primary" onClick={() => showPage('quiz')}>
                        Take the Free Career Quiz →
                    </button>
                </div>
            </section>
        </>
    );
}
