'use client';

const S = {
    footer: {
        background: '#fafafa',
        borderTop: '1px solid #f0f0f0',
        padding: '40px 24px 32px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
    inner: {
        maxWidth: '900px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
    },
    brandName: {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '15px',
        letterSpacing: '-0.2px',
        color: '#27272a',
    },
    tagline: {
        fontSize: '13px',
        color: '#a1a1aa',
        textAlign: 'center',
        lineHeight: 1.6,
        maxWidth: '360px',
    },
    links: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    link: {
        fontSize: '13px',
        fontWeight: 500,
        color: '#52525b',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '6px 12px',
        borderRadius: '6px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        transition: 'color 0.15s ease, background 0.15s ease',
        textDecoration: 'none',
        display: 'inline-block',
    },
    sep: {
        width: '3px',
        height: '3px',
        borderRadius: '50%',
        background: '#d4d4d8',
        flexShrink: 0,
    },
    divider: {
        width: '100%',
        maxWidth: '280px',
        border: 'none',
        borderTop: '1px solid #f0f0f0',
    },
    legal: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
    },
    copyright: {
        fontSize: '12px',
        color: '#a1a1aa',
        textAlign: 'center',
    },
    mailLink: {
        fontSize: '12px',
        color: '#a1a1aa',
        textDecoration: 'none',
        transition: 'color 0.15s ease',
    },
    instaLink: {
        fontSize: '12px',
        color: '#a1a1aa',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        transition: 'color 0.15s ease',
    },
};

const navLinks = [
    { id: 'about', label: 'About Us' },
    { id: 'terms', label: 'Terms & Conditions' },
    { id: 'privacy', label: 'Privacy Policy' },
];

export default function Footer({ showPage }) {
    const year = new Date().getFullYear();

    return (
        <footer style={S.footer}>
            <div style={S.inner}>
                {/* Brand */}
                <div style={S.brand} onClick={() => showPage('home')}>
                    <svg width="22" height="14" viewBox="0 0 36 20" fill="none" style={{ flexShrink: 0 }}>
                        <defs>
                            <linearGradient id="footerWave" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#4a4a8a" />
                                <stop offset="50%" stopColor="#2563a8" />
                                <stop offset="100%" stopColor="#06b6a0" />
                            </linearGradient>
                        </defs>
                        <path d="M2 14 C6 4, 12 4, 16 10 C20 16, 24 6, 28 4 C30 3, 33 5, 34 8 L34 6 C33 3, 30 1, 28 2 C24 4, 20 14, 16 8 C12 2, 6 2, 2 12 Z" fill="url(#footerWave)" opacity="0.85" />
                        <path d="M28 4 C30 3, 33 5, 34 8 C34 10, 35 10, 34 12 C33 9, 31 6, 28 7 Z" fill="#06b6a0" opacity="0.7" />
                    </svg>
                    <span style={S.brandName}>
                        <span style={{ fontWeight: 400 }}>learnwith</span>
                        <span style={{
                            fontWeight: 700,
                            background: 'linear-gradient(90deg, #2563a8, #06b6a0)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>flow</span>
                    </span>
                </div>

                {/* Tagline */}
                <p style={S.tagline}>
                    Empowering your career journey with AI-powered tools, roadmaps, and practice resources.
                </p>

                {/* Nav links */}
                <nav style={S.links} aria-label="Footer navigation">
                    {navLinks.map((l, i) => (
                        <span key={l.id} style={{ display: 'contents' }}>
                            <button
                                style={S.link}
                                onClick={() => showPage(l.id)}
                                onMouseEnter={e => { e.currentTarget.style.color = '#09090b'; e.currentTarget.style.background = '#f4f4f5'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#52525b'; e.currentTarget.style.background = 'none'; }}
                            >
                                {l.label}
                            </button>
                            {i < navLinks.length - 1 && <div style={S.sep} />}
                        </span>
                    ))}
                </nav>

                <hr style={S.divider} />

                {/* Copyright + contact */}
                <div style={S.legal}>
                    <p style={S.copyright}>© {year} learnwithflow. All rights reserved.</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <a
                            href="mailto:learnwithfloww@gmail.com"
                            style={S.mailLink}
                            onMouseEnter={e => { e.currentTarget.style.color = '#2563a8'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#a1a1aa'; }}
                        >
                            learnwithfloww@gmail.com
                        </a>
                        <div style={S.sep} />
                        <a
                            href="https://instagram.com/learnwithflow.online"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={S.instaLink}
                            onMouseEnter={e => { e.currentTarget.style.color = '#e1306c'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#a1a1aa'; }}
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <circle cx="12" cy="12" r="4" />
                                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                            </svg>
                            @learnwithflow.online
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
