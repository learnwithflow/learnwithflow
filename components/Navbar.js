'use client';
import { useState } from 'react';

export default function Navbar({ currentPage, showPage, user }) {
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
                <div className="nav-logo" onClick={() => navTo('home')}>
                    <svg width="32" height="18" viewBox="0 0 32 18" fill="none">
                        <defs>
                            <linearGradient id="ng" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#2563a8" />
                                <stop offset="100%" stopColor="#06d6a0" />
                            </linearGradient>
                        </defs>
                        <path d="M2 12 Q8 2 14 7 Q20 12 26 4 Q28 2 30 3" stroke="url(#ng)" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </svg>
                </div>
                <div className="nav-links">
                    {links.map(l => (
                        <button key={l.id} className={`nav-btn${currentPage === l.id ? ' active' : ''}`} onClick={() => navTo(l.id)}>
                            {l.label}
                        </button>
                    ))}
                    <button className={`nav-profile-btn${currentPage === 'profile' ? ' active' : ''}`} onClick={() => navTo('profile')} title={user ? user.name : 'Login'}>
                        {user ? user.avatar : '👤'}
                    </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button className="nav-profile-btn" onClick={() => navTo('profile')} title={user ? user.name : 'Login'} style={{ display: 'flex' }}>
                        {user ? user.avatar : '👤'}
                    </button>
                    <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                        <span /><span /><span />
                    </button>
                </div>
            </nav>

            <div className={`mobile-drawer${menuOpen ? ' open' : ''}`}>
                {links.map(l => (
                    <button key={l.id} className="mob-btn" onClick={() => navTo(l.id)}>{l.label}</button>
                ))}
                <button className="mob-btn" onClick={() => navTo('profile')}>{user ? `👤 ${user.name}` : '👤 Login / Sign Up'}</button>
            </div>
        </>
    );
}
