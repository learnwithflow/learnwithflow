'use client';

const SECTIONS = [
    {
        title: '1. Use of the Platform',
        body: "You must be at least 13 years old to use this platform. You agree to use the platform only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the platform.",
    },
    {
        title: '2. Intellectual Property',
        body: 'All content, features, and functionality on this platform—including text, graphics, logos, icons, and images—are the exclusive property of learnwithflow and are protected by international copyright and intellectual property laws.',
    },
    {
        title: '3. User Accounts',
        body: 'When creating an account, you must provide accurate and complete information. You are solely responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.',
    },
    {
        title: '4. Limitation of Liability',
        body: 'learnwithflow provides educational content and resources for informational purposes only. We do not guarantee that the use of our platform will result in employment or a specific career outcome. In no event shall we be liable for any indirect, incidental, or consequential damages arising out of your use of the platform.',
    },
    {
        title: '5. AI-Generated Content',
        body: null,
        custom: true,
    },
    {
        title: '6. Changes to Terms',
        body: 'We reserve the right to modify these Terms at any time. We will indicate at the top of this page the date the terms were last revised. Your continued use of the platform after any such changes constitutes your acceptance of the new Terms.',
    },
];

export default function Terms({ showPage }) {
    const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return (
        <div style={{
            minHeight: '100vh',
            background: '#fafafa',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
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
                        fontSize: '13px', fontWeight: 700, letterSpacing: '2px',
                        textTransform: 'uppercase', color: '#64748b', marginBottom: '14px',
                    }}>LEARNWITHFLOW</div>
                    <div style={{
                        fontSize: '36px', fontWeight: 800, color: '#0f172a',
                        lineHeight: 1.15, letterSpacing: '-0.8px', marginBottom: '10px',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>Terms & Conditions</div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500, marginBottom: '16px' }}>
                        Last Updated: {lastUpdated}
                    </div>
                    <div style={{ width: '40px', height: '3px', background: '#0f172a', borderRadius: '99px' }} />
                </div>

                {/* Intro */}
                <p style={{ margin: '0 0 32px', color: '#475569', fontSize: '16px', lineHeight: 1.75 }}>
                    Welcome to learnwithflow. By accessing or using our website and services, you agree to be bound by these Terms and Conditions. Please read them carefully.
                </p>

                {/* Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    {SECTIONS.map((s) => (
                        <div key={s.title} style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
                            <div style={{
                                fontSize: '16px', fontWeight: 700, color: '#0f172a',
                                marginBottom: '10px', letterSpacing: '-0.2px',
                            }}>{s.title}</div>
                            {s.custom ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#475569', fontSize: '15px', lineHeight: 1.75 }}>
                                    <p style={{ margin: 0 }}>
                                        Certain content on our platform — including practice questions, quiz options, explanations,
                                        interview questions, roadmap suggestions, and exam feedback — is <strong style={{ color: '#1e293b' }}>generated using artificial intelligence (AI) models</strong>.
                                        This content is provided for educational and practice purposes only.
                                    </p>
                                    <p style={{ margin: 0 }}>
                                        AI-generated content may contain inaccuracies or errors. learnwithflow does not guarantee its accuracy,
                                        completeness, or reliability. Users are advised to independently verify important information.
                                    </p>
                                    <p style={{ margin: 0 }}>
                                        Our platform does <strong style={{ color: '#0f172a' }}>not</strong> claim to provide official question papers from
                                        any examination board or government authority. All practice questions are original, AI-assisted content designed for learning.
                                    </p>
                                </div>
                            ) : (
                                <p style={{ margin: 0, color: '#475569', fontSize: '15px', lineHeight: 1.75 }}>{s.body}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #f1f5f9' }}>
                    <button
                        onClick={() => showPage('home')}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '10px 22px', background: '#ffffff', color: '#334155',
                            fontWeight: 700, fontSize: '14px', borderRadius: '99px',
                            border: '1px solid #e2e8f0', cursor: 'pointer',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 0.2s',
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
