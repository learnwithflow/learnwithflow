'use client';

const S = {
    page: {
        minHeight: '100vh',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 24px 80px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
    wrap: {
        width: '100%',
        maxWidth: '640px',
    },
    eyebrow: {
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color: '#a1a1aa',
        marginBottom: '20px',
        display: 'block',
    },
    title: {
        fontSize: '42px',
        fontWeight: 800,
        color: '#09090b',
        lineHeight: 1.1,
        letterSpacing: '-1.5px',
        margin: '0 0 8px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
    rule: {
        width: '32px',
        height: '2px',
        background: '#09090b',
        margin: '20px 0 40px',
        borderRadius: '99px',
        border: 'none',
    },
    lead: {
        fontSize: '17px',
        color: '#52525b',
        lineHeight: 1.8,
        margin: '0 0 48px',
        fontWeight: 400,
    },
    sectionTitle: {
        fontSize: '13px',
        fontWeight: 700,
        color: '#09090b',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        marginBottom: '10px',
        display: 'block',
    },
    sectionBody: {
        fontSize: '16px',
        color: '#52525b',
        lineHeight: 1.8,
        margin: 0,
        fontWeight: 400,
    },
    divider: {
        border: 'none',
        borderTop: '1px solid #f4f4f5',
        margin: '32px 0',
    },
    listItem: {
        display: 'flex',
        gap: '14px',
        alignItems: 'flex-start',
        marginBottom: '14px',
        fontSize: '16px',
        color: '#52525b',
        lineHeight: 1.8,
    },
    dot: {
        width: '6px',
        height: '6px',
        background: '#d4d4d8',
        borderRadius: '50%',
        flexShrink: 0,
        marginTop: '10px',
    },
    btn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 24px',
        border: '1px solid #e4e4e7',
        borderRadius: '99px',
        background: '#fafafa',
        color: '#3f3f46',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        transition: 'all 0.15s ease',
        letterSpacing: '0.1px',
    },
};

export default function About({ showPage }) {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <span style={S.eyebrow}>Who we are</span>
                <h1 style={S.title}>About Us</h1>
                <hr style={S.rule} />

                <p style={S.lead}>
                    Welcome to <strong style={{ color: '#09090b', fontWeight: 700 }}>learnwithflow</strong> — your ultimate platform for
                    career growth and learning. We believe in empowering individuals with the right tools,
                    roadmaps, and resources to navigate their professional journeys effectively.
                </p>

                <span style={S.sectionTitle}>Our Mission</span>
                <p style={S.sectionBody}>
                    Our mission is to bridge the gap between education and industry requirements. We aim to provide
                    clear, actionable learning paths and intelligent interview preparation tools that help landing
                    your dream job within reach.
                </p>

                <hr style={S.divider} />

                <span style={S.sectionTitle}>What We Offer</span>
                <div style={{ marginTop: '10px' }}>
                    {[
                        ['Comprehensive Roadmaps', 'Step-by-step guides for various tech and non-tech career paths.'],
                        ['AI Interview Practice', 'Mock interviews powered by AI to help you build confidence and improve your skills.'],
                        ['Career Quizzes', 'Discover the best career paths aligned with your interests and strengths.'],
                        ['Mock Exams', 'Prepare for certifications and assessments with our realistic mock exams.'],
                    ].map(([title, desc]) => (
                        <div key={title} style={S.listItem}>
                            <div style={S.dot} />
                            <span><strong style={{ color: '#27272a' }}>{title}</strong> — {desc}</span>
                        </div>
                    ))}
                </div>

                <hr style={S.divider} />

                <span style={S.sectionTitle}>Join Our Community</span>
                <p style={{ ...S.sectionBody, marginBottom: '48px' }}>
                    Whether you are just starting out or looking to make a career switch, learnwithflow is here
                    to support you at every step. Let&apos;s learn, grow, and achieve our goals together.
                </p>

                <button
                    style={S.btn}
                    onClick={() => showPage('home')}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f4f4f5'; e.currentTarget.style.borderColor = '#d4d4d8'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.borderColor = '#e4e4e7'; }}
                >
                    <span style={{ fontSize: '16px', color: '#a1a1aa' }}>←</span>
                    Back to Home
                </button>
            </div>
        </div>
    );
}
