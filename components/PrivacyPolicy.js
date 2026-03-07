'use client';

const sections = [
    {
        title: 'Information We Collect',
        body: 'This website does not require users to create accounts and does not intentionally collect personal information such as names, email addresses, phone numbers, or login credentials.',
    },
    {
        title: 'Technical Data',
        body: 'Like most websites, our servers may automatically record basic technical information such as IP address, device type, browser type, and access time for security, analytics, and system maintenance purposes.',
    },
    {
        title: 'Cookies',
        body: 'This website does not use tracking cookies to identify individual users. Any cookies that may be set are strictly necessary for the platform to function correctly.',
    },
    {
        title: 'Third-Party Services',
        body: 'The platform may rely on third-party hosting or infrastructure providers to operate the website. These providers may process limited technical data required for hosting and security. We do not sell or share your data with third-party advertisers.',
    },
    {
        title: 'User Responsibility',
        body: 'Users should avoid submitting personal or sensitive information while using the platform. Any information voluntarily provided through contact forms or similar features is used solely to respond to your inquiry.',
    },
    {
        title: 'Contact',
        isContact: true,
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
    mailLink: {
        color: '#2563a8',
        fontWeight: 600,
        textDecoration: 'none',
        fontSize: '15px',
    },
};

export default function PrivacyPolicy({ showPage }) {
    const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <span style={S.eyebrow}>Legal</span>
                <h1 style={S.title}>Privacy Policy</h1>
                <span style={S.date}>Last Updated: {lastUpdated}</span>
                <hr style={S.rule} />

                <p style={S.lead}>
                    Your privacy matters to us. This policy explains what data we collect, how we use it,
                    and the choices you have. By using learnwithflow, you agree to the practices described below.
                </p>

                {sections.map((s, i) => (
                    <div key={s.title}>
                        <span style={S.sectionNum}>0{i + 1}</span>
                        <span style={S.sectionTitle}>{s.title}</span>
                        {s.isContact ? (
                            <p style={S.sectionBody}>
                                For privacy concerns or questions, you can contact the website owner at{' '}
                                <a href="mailto:learnwithfloww@gmail.com" style={S.mailLink}>
                                    learnwithfloww@gmail.com
                                </a>
                                . We aim to respond within 48 hours.
                            </p>
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
