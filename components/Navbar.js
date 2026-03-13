'use client';
import { useState, useRef, useEffect } from 'react';

export default function Navbar({ currentPage, showPage }) {
    const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [streak, setStreak] = useState(0);
    const dropdownRef = useRef(null);

    const mainLinks = [
        { id: 'home', label: 'Home' },
        { id: 'quiz', label: 'Career Quiz' },
        { id: 'exam', label: 'Mock Exam' },
        { id: 'roadmap', label: 'Roadmaps' },
        { id: 'interview', label: 'AI Interview' },
    ];

    const featureLinks = [
        {
            id: 'leaderboard', label: 'Leaderboard', desc: 'See how you rank against others', color: '#f59e0b',
            svg: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
        },
        {
            id: 'dashboard', label: 'Dashboard', desc: 'Progress & analytics', color: '#8b5cf6',
            svg: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13h4v8H3zm7-5h4v13h-4zm7-5h4v18h-4z" /></svg>
        },
        {
            id: 'about', label: 'About Us', desc: 'Learn more about us', color: '#10b981',
            svg: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        },
        {
            id: 'terms', label: 'Terms & Conditions', desc: 'Platform policies', color: '#f59e0b',
            svg: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        },
        {
            id: 'privacy', label: 'Privacy Policy', desc: 'How we handle your data', color: '#06b6a0',
            svg: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        },
    ];

    const handleNav = (id, isMobile = false) => {
        if (isMobile) setMobileMenuOpen(false);
        else setDesktopMenuOpen(false);
        showPage(id);
    };

    // Calculate Daily Streak
    useEffect(() => {
        try {
            const lastActiveStr = localStorage.getItem('lwf_last_active');
            let currentStreak = parseInt(localStorage.getItem('lwf_streak') || '0', 10);

            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];

            if (lastActiveStr) {
                const lastDate = new Date(lastActiveStr);

                // Set to start of day for comparison
                const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const lastMidnight = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());

                const diffTime = todayMidnight.getTime() - lastMidnight.getTime();
                const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

                if (diffDays === 0) {
                    // Already active today, streak remains same
                } else if (diffDays === 1) {
                    // Active yesterday, but not yet today (this implies they haven't DONE anything today yet to claim, so streak stays for display until they do it, or we just keep it until tomorrow resets it)
                    // Wait, if it's 1, they haven't lost it yet. It only resets if diffDays >= 2.
                } else {
                    // Missed a day(s)
                    currentStreak = 0;
                    localStorage.setItem('lwf_streak', '0');
                }
            } else {
                currentStreak = 0;
            }
            setStreak(currentStreak);
        } catch (e) {
            console.error('Streak error', e);
        }
    }, []);

    // Close desktop dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDesktopMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <nav id="main-nav" className="flex items-center justify-between px-6 h-14 bg-[#fdfcf7]/75 backdrop-blur-[24px] border-b border-[#e6e0d4]/60 fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
                <div className="nav-logo flex flex-col justify-start cursor-pointer group pt-1 md:pt-2" onClick={() => handleNav('home')}>
                    <div className="flex items-center w-full justify-end pr-1 md:pr-2" style={{ overflow: 'visible' }}>
                        <svg
                            style={{ overflow: 'visible' }}
                            className="h-[10px] w-[30px] md:h-[12px] md:w-[34px] -mb-[2px] md:-mb-[3px] transition-transform duration-300 group-hover:-translate-y-0.5"
                            viewBox="0 0 120 36"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#312e81" />
                                    <stop offset="30%" stopColor="#2563eb" />
                                    <stop offset="70%" stopColor="#0d9488" />
                                    <stop offset="100%" stopColor="#0f766e" />
                                </linearGradient>
                            </defs>
                            <path d="M2,32 Q18,4 42,14 T84,22 T118,8 L118,22 Q102,36 78,28 T36,18 T2,32 Z" fill="url(#ribbonGrad)" />
                        </svg>
                    </div>
                    <div className="flex items-center -ml-1">
                        <span className="text-[14px] md:text-[18px] font-semibold tracking-tight text-[#1c1814] leading-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>learnwith</span>
                        <span className="text-[14px] md:text-[18px] font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#2563eb] to-[#0d9488] leading-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>flow</span>
                    </div>
                </div>



                <div className="hidden md:flex items-center justify-center flex-1 gap-1">
                    {mainLinks.map(l => (
                        <button key={l.id} className={`nav-btn${currentPage === l.id ? ' active' : ''}`} onClick={() => handleNav(l.id)}>
                            {l.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center" ref={dropdownRef}>
                    {/* Mobile Hamburger Button */}
                    <button className={`hamburger !flex md:!hidden ${mobileMenuOpen ? 'open' : ''} !p-2 rounded-lg hover:bg-black/5 transition-colors origin-center`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
                        <span /><span /><span />
                    </button>

                    {/* Desktop Hamburger Button */}
                    <button className={`hamburger !hidden md:!flex ${desktopMenuOpen ? 'open' : ''} !p-2 rounded-lg hover:bg-black/5 transition-colors origin-center ml-2`} onClick={() => setDesktopMenuOpen(!desktopMenuOpen)} aria-label="More Features">
                        <span /><span /><span />
                    </button>

                    {/* Desktop Dropdown */}
                    {desktopMenuOpen && (
                        <div className="hidden md:block absolute top-[62px] right-3 w-[260px] z-50" style={{ animation: 'ddFade 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                            <div className="rounded-2xl p-1.5" style={{ background: 'rgba(253,252,247,0.85)', backdropFilter: 'blur(24px) saturate(1.4)', WebkitBackdropFilter: 'blur(24px) saturate(1.4)', boxShadow: '0 12px 40px -8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)', border: '1px solid rgba(230,224,212,0.6)' }}>
                                {featureLinks.map((l, i) => (
                                    <button
                                        key={l.id}
                                        onClick={() => handleNav(l.id)}
                                        className={`w-full text-left rounded-xl transition-all duration-300 flex items-center gap-3.5 group relative overflow-hidden ${currentPage === l.id ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]' : 'hover:bg-white/90 active:scale-[0.98]'}`}
                                        style={{ padding: '14px 16px', animation: `ddItem 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s both` }}
                                    >
                                        {/* Left accent bar */}
                                        <div className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-full transition-all duration-200" style={{ backgroundColor: currentPage === l.id ? l.color : 'transparent' }}></div>

                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:shadow-sm"
                                            style={{ background: `linear-gradient(135deg, ${l.color}18, ${l.color}08)`, color: l.color, border: `1px solid ${l.color}15` }}
                                        >
                                            {l.svg}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className={`text-[13.5px] font-semibold tracking-[-0.01em] ${currentPage === l.id ? 'text-[#1c1814]' : 'text-[#2c2520] group-hover:text-[#1c1814]'}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                                {l.label}
                                            </div>
                                            <div className="text-[11px] text-[#9e978e] mt-0.5 tracking-[0.01em]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                                {l.desc}
                                            </div>
                                        </div>
                                        <svg className={`w-3.5 h-3.5 shrink-0 transition-all duration-200 ${currentPage === l.id ? 'text-[#1c1814] opacity-50' : 'text-[#d0cbc2] group-hover:text-[#a09890] group-hover:translate-x-0.5'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <style dangerouslySetInnerHTML={{
                        __html: `
                        @keyframes ddFade {
                            from { opacity: 0; transform: translateY(-12px) scale(0.96); }
                            to { opacity: 1; transform: translateY(0) scale(1); }
                        }
                        @keyframes ddItem {
                            from { opacity: 0; transform: translateX(-8px); }
                            to { opacity: 1; transform: translateX(0); }
                        }
                    `}} />
                </div>
            </nav>

            {/* Mobile Drawer */}
            <div className={`mobile-drawer${mobileMenuOpen ? ' open' : ''}`}>
                <div className="text-[10px] font-extrabold text-[#8b8278] uppercase tracking-[0.2em] pl-3 pt-4 mb-2">Main Features</div>
                {mainLinks.map(l => (
                    <button key={l.id} className={`mob-btn font-bold transition-all ${currentPage === l.id ? 'text-[#2563a8] bg-[#2563a8]/10' : 'text-[#3d3830] hover:bg-[#ede9e0]'}`} onClick={() => handleNav(l.id, true)}>{l.label}</button>
                ))}

                <div className="border-t border-[#e2ddd4] my-3"></div>
                <div className="text-[10px] font-extrabold text-[#8b8278] uppercase tracking-[0.2em] pl-3 pt-2 mb-2">Career Tools</div>
                {featureLinks.map(l => (
                    <button key={l.id} className={`mob-btn font-bold transition-all ${currentPage === l.id ? 'text-[#2563a8] bg-[#2563a8]/10' : 'text-[#3d3830] hover:bg-[#ede9e0]'}`} onClick={() => handleNav(l.id, true)}>{l.label}</button>
                ))}
            </div>
        </>
    );
}
