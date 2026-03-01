'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Navbar({ currentPage, showPage, user, onLogout }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const navTo = (page) => { setMenuOpen(false); showPage(page); };

    const handleLogout = async () => {
        setMenuOpen(false);
        await supabase.auth.signOut();
        onLogout?.();
    };

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
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button className={`nav-profile-btn${currentPage === 'profile' ? ' active' : ''}`} onClick={() => navTo('profile')} title={user.name}>
                                {user.avatar}
                            </button>
                            <button className="nav-btn" onClick={handleLogout} title="Logout" style={{ fontSize: 13, color: '#dc2626', fontWeight: 700, padding: '6px 12px' }}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button className={`nav-profile-btn${currentPage === 'profile' ? ' active' : ''}`} onClick={() => navTo('profile')} title="Login">
                            👤
                        </button>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {user ? (
                        <button className="nav-profile-btn" onClick={() => navTo('profile')} title={user.name} style={{ display: 'flex' }}>
                            {user.avatar}
                        </button>
                    ) : (
                        <button className="nav-profile-btn" onClick={() => navTo('profile')} title="Login" style={{ display: 'flex' }}>
                            👤
                        </button>
                    )}
                    <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                        <span /><span /><span />
                    </button>
                </div>
            </nav>

            <div className={`mobile-drawer${menuOpen ? ' open' : ''}`}>
                {links.map(l => (
                    <button key={l.id} className="mob-btn" onClick={() => navTo(l.id)}>{l.label}</button>
                ))}
                {user ? (
                    <>
                        <button className="mob-btn" onClick={() => navTo('profile')}>👤 {user.name}</button>
                        <button className="mob-btn" onClick={handleLogout} style={{ color: '#dc2626' }}>🚪 Logout</button>
                    </>
                ) : (
                    <button className="mob-btn" onClick={() => navTo('profile')}>👤 Login / Sign Up</button>
                )}
            </div>
        </>
    );
}
