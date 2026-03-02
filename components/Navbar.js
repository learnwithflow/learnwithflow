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
    ];

    return (
        <>
            <nav id="main-nav">
                <div className="nav-logo" onClick={() => navTo('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0 }}>
                    <span style={{
                        fontFamily: "'Syne', 'Plus Jakarta Sans', sans-serif",
                        fontWeight: 800,
                        fontSize: 22,
                        letterSpacing: '-0.5px',
                        background: 'linear-gradient(90deg, #2563a8, #06d6a0)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>Learn</span>
                    <span style={{
                        fontFamily: "'Syne', 'Plus Jakarta Sans', sans-serif",
                        fontWeight: 800,
                        fontSize: 22,
                        color: '#06d6a0',
                    }}>~</span>
                    <span style={{
                        fontFamily: "'Syne', 'Plus Jakarta Sans', sans-serif",
                        fontWeight: 800,
                        fontSize: 22,
                        letterSpacing: '-0.5px',
                        background: 'linear-gradient(90deg, #06d6a0, #2563a8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>Flow</span>
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
