'use client';
import { useState } from 'react';

export default function Navbar({ currentPage, showPage }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const navTo = (page) => { setMenuOpen(false); showPage(page); };

    const links = [
        { id: 'home', label: 'Home' },
        { id: 'quiz', label: 'Career Quiz' },
        { id: 'exam', label: 'Mock Exam' },
        { id: 'roadmap', label: 'Roadmaps' },
        { id: 'interview', label: 'AI Interview' },
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'jobtracker', label: 'Job Tracker' },
        { id: 'portfolio', label: 'Portfolio' },
        { id: 'resume', label: 'Resume Builder' },
    ];

    return (
        <>
            <nav id="main-nav">
                <div className="nav-logo" onClick={() => navTo('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {/* Flowing wave SVG */}
                    <svg width="28" height="18" viewBox="0 0 36 20" fill="none" style={{ flexShrink: 0 }}>
                        <defs>
                            <linearGradient id="logoWave" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#4a4a8a" />
                                <stop offset="50%" stopColor="#2563a8" />
                                <stop offset="100%" stopColor="#06b6a0" />
                            </linearGradient>
                        </defs>
                        <path d="M2 14 C6 4, 12 4, 16 10 C20 16, 24 6, 28 4 C30 3, 33 5, 34 8 L34 6 C33 3, 30 1, 28 2 C24 4, 20 14, 16 8 C12 2, 6 2, 2 12 Z" fill="url(#logoWave)" opacity="0.85" />
                        <path d="M28 4 C30 3, 33 5, 34 8 C34 10, 35 10, 34 12 C33 9, 31 6, 28 7 Z" fill="#06b6a0" opacity="0.7" />
                    </svg>
                    {/* Text logo */}
                    <span style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 400,
                        fontSize: 18,
                        letterSpacing: '-0.3px',
                        color: 'var(--ink)',
                    }}>learnwith</span>
                    <span style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: 18,
                        letterSpacing: '-0.3px',
                        background: 'linear-gradient(90deg, #2563a8, #06b6a0)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginLeft: -4,
                    }}>flow</span>
                </div>
                <div className="nav-links">
                    {links.map(l => (
                        <button key={l.id} className={`nav-btn${currentPage === l.id ? ' active' : ''}`} onClick={() => navTo(l.id)}>
                            {l.label}
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                        <span /><span /><span />
                    </button>
                </div>
            </nav>

            <div className={`mobile-drawer${menuOpen ? ' open' : ''}`}>
                {links.map(l => (
                    <button key={l.id} className="mob-btn" onClick={() => navTo(l.id)}>{l.label}</button>
                ))}
            </div>
        </>
    );
}
