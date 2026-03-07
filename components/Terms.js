'use client';

const sections = [
    {
        title: 'Use of the Platform',
        body: "You must be at least 13 years old to use this platform. You agree to use the platform only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the platform.",
    },
    {
        title: 'Intellectual Property',
        body: 'All content, features, and functionality on this platform — including text, graphics, logos, icons, and images — are the exclusive property of learnwithflow and are protected by international copyright and intellectual property laws.',
    },
    {
        title: 'User Accounts',
        body: 'When creating an account, you must provide accurate and complete information. You are solely responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.',
    },
    {
        title: 'Limitation of Liability',
        body: 'learnwithflow provides educational content and resources for informational purposes only. We do not guarantee that the use of our platform will result in employment or a specific career outcome. In no event shall we be liable for any indirect, incidental, or consequential damages arising out of your use of the platform.',
    },
    {
        title: 'AI-Generated Content',
        isAI: true,
    },
    {
        title: 'Changes to Terms',
        body: 'We reserve the right to modify these Terms at any time. We will indicate at the top of this page the date the terms were last revised. Your continued use of the platform after any such changes constitutes your acceptance of the new Terms.',
    },
];

const S = {
    page: {
        minHeight: '100vh',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'flex-start',
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
    date: {
        fontSize: '13px',
        color: '#a1a1aa',
        fontWeight: 500,
        display: 'block',
        marginBottom: '0',
    },
    rule: {
        width: '32px',
        height: '2px',
        background: '#09090b',
        margin: '20px 0 36px',
        borderRadius: '99px',
        border: 'none',
    },
    lead: {
        fontSize: '16px',
        color: '#71717a',
        lineHeight: 1.8,
        margin: '0 0 48px',
    },
    divider: {
        border: 'none',
        borderTop: '1px solid #f4f4f5',
        margin: '32px 0',
    },
    sectionNum: {
        fontSize: '11px',
        color: '#a1a1aa',
        fontWeight: 700,
        letterSpacing: '1.5px',
        display: 'block',
        marginBottom: '6px',
    },
    sectionTitle: {
        fontSize: '17px',
        fontWeight: 700,
        color: '#09090b',
        marginBottom: '12px',
        letterSpacing: '-0.2px',
        display: 'block',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
    sectionBody: {
        fontSize: '15px',
        color: '#52525b',
        lineHeight: 1.8,
        margin: 0,
        fontWeight: 400,
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
    },
};

export default function Terms({ showPage }) {
    const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <span style={S.eyebrow}>Legal</span>
                <h1 style={S.title}>Terms & Conditions</h1>
                <span style={S.date}>Last Updated: {lastUpdated}</span>
                <hr style={S.rule} />

                <p style={S.lead}>
                    By accessing or using our website and services, you agree to be bound by these Terms and Conditions.
                    Please read them carefully before using the platform.
                </p>

                {sections.map((s, i) => (
                    <div key={s.title}>
                        <span style={S.sectionNum}>0{i + 1}</span>
                        <span style={S.sectionTitle}>{s.title}</span>
                        {s.isAI ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <p style={S.sectionBody}>
                                    Certain content on our platform — including practice questions, explanations, interview questions,
                                    and roadmap suggestions — is <strong style={{ color: '#27272a', fontWeight: 600 }}>generated using artificial intelligence (AI) models</strong>.
                                    This content is provided for educational and practice purposes only.
                                </p>
                                <p style={S.sectionBody}>
                                    AI-generated content may contain inaccuracies or errors. Users are advised to independently verify
                                    important information before relying on it for academic or professional decisions.
                                </p>
                                <p style={S.sectionBody}>
                                    Our platform does <strong style={{ color: '#09090b', fontWeight: 600 }}>not</strong> claim to
                                    provide official question papers from any examination board or government authority.
                                    All practice content is original and AI-assisted.
                                </p>
                            </div>
                        ) : (
                            <p style={S.sectionBody}>{s.body}</p>
                        )}
                        {i < sections.length - 1 && <hr style={S.divider} />}
                    </div>
                ))}

                <div style={{ marginTop: '48px', paddingTop: '40px', borderTop: '1px solid #f4f4f5' }}>
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
        </div>
    );
}
