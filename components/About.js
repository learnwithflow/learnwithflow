'use client';

export default function About({ showPage }) {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#fafafa',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 24px 60px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
            <div style={{
                width: '100%',
                maxWidth: '720px',
                background: '#ffffff',
                borderRadius: '24px',
                padding: '56px 64px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04), 0 2px 4px -2px rgba(0,0,0,0.03)',
                border: '1px solid #f1f5f9',
            }}>
                {/* Header */}
                <div style={{ marginBottom: '40px' }}>
                    <div style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        color: '#64748b',
                        marginBottom: '14px',
                    }}>LEARNWITHFLOW</div>
                    <div style={{
                        fontSize: '40px',
                        fontWeight: 800,
                        color: '#0f172a',
                        lineHeight: 1.15,
                        letterSpacing: '-1px',
                        marginBottom: '16px',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>About Us</div>
                    <div style={{ width: '40px', height: '3px', background: '#0f172a', borderRadius: '99px' }} />
                </div>

                {/* Body */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: '#475569', fontSize: '16px', lineHeight: 1.75 }}>
                    <p style={{ margin: 0 }}>
                        Welcome to <strong style={{ color: '#0f172a' }}>learnwithflow</strong>, your ultimate platform for career growth and learning.
                        We believe in empowering individuals with the right tools, roadmaps, and resources to navigate their professional journeys effectively.
                    </p>

                    <div>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '10px', letterSpacing: '-0.3px' }}>Our Mission</div>
                        <p style={{ margin: 0 }}>
                            Our mission is to bridge the gap between education and industry requirements. We aim to provide clear, actionable
                            learning paths and intelligent interview preparation tools that help landing your dream job within reach.
                        </p>
                    </div>

                    <div>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '14px', letterSpacing: '-0.3px' }}>What We Offer</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                ['Comprehensive Roadmaps', 'Step-by-step guides for various tech and non-tech career paths.'],
                                ['AI Interview Practice', 'Mock interviews powered by AI to help you build confidence and improve your skills.'],
                                ['Career Quizzes', 'Discover the best career paths aligned with your interests and strengths.'],
                                ['Mock Exams', 'Prepare for certifications and assessments with our realistic mock exams.'],
                            ].map(([title, desc]) => (
                                <div key={title} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <span style={{ color: '#94a3b8', marginTop: '2px', flexShrink: 0, fontSize: '18px' }}>›</span>
                                    <span><strong style={{ color: '#1e293b' }}>{title}:</strong> {desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '10px', letterSpacing: '-0.3px' }}>Join Our Community</div>
                        <p style={{ margin: 0 }}>
                            Whether you are just starting out or looking to make a career switch, learnwithflow is here to support you at every step.
                            Let&apos;s learn, grow, and achieve our goals together.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #f1f5f9' }}>
                    <button
                        onClick={() => showPage('home')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 22px',
                            background: '#ffffff',
                            color: '#334155',
                            fontWeight: 700,
                            fontSize: '14px',
                            borderRadius: '99px',
                            border: '1px solid #e2e8f0',
                            cursor: 'pointer',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    >
                        <span style={{ color: '#94a3b8' }}>←</span> Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
