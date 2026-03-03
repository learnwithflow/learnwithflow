'use client';
import { useState, useRef, useEffect } from 'react';

export default function Navbar({ currentPage, showPage }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
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
            id: 'dashboard', label: 'Dashboard', desc: 'Progress & analytics', color: '#8b5cf6',
            svg: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13h4v8H3zm7-5h4v13h-4zm7-5h4v18h-4z" /></svg>
        },
        {
            id: 'portfolio', label: 'Portfolio', desc: 'Skills & projects', color: '#2563a8',
            svg: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        },
        {
            id: 'resume', label: 'Resume Builder', desc: 'ATS-ready PDF', color: '#06b6a0',
            svg: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        },
    ];

    const handleNav = (id, isMobile = false) => {
        if (isMobile) setMobileMenuOpen(false);
        else setDesktopMenuOpen(false);
        showPage(id);
    };

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
            <nav id="main-nav" className="flex items-center justify-between px-6 h-14 bg-[#f5f2eb]/90 backdrop-blur-md border-b border-[#e2ddd4] fixed top-0 left-0 right-0 z-50">
                <div className="nav-logo flex items-center gap-2 cursor-pointer" onClick={() => handleNav('home')}>
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
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: 18, letterSpacing: '-0.3px', color: 'var(--ink)' }}>learnwith</span>
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px', background: 'linear-gradient(90deg, #2563a8, #06b6a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginLeft: -4 }}>flow</span>
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
                        <div className="hidden md:block absolute top-[56px] right-4 w-56 rounded-xl overflow-hidden z-50" style={{ animation: 'ddSlide 0.18s cubic-bezier(.16,1,.3,1)', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
                            <div className="px-3.5 pt-3 pb-1.5">
                                <span className="text-[9px] font-bold text-[#a09890] uppercase tracking-[0.18em]">Career Copilot</span>
                            </div>
                            <div className="px-1.5 pb-2">
                                {featureLinks.map((l, i) => (
                                    <button
                                        key={l.id}
                                        onClick={() => handleNav(l.id)}
                                        className={`w-full text-left px-2.5 py-2 rounded-lg transition-all duration-150 flex items-center gap-2.5 group ${currentPage === l.id ? 'bg-[#f0edff]' : 'hover:bg-black/[0.03]'}`}
                                    >
                                        <div
                                            className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105"
                                            style={{ backgroundColor: l.color + '14', color: l.color }}
                                        >
                                            {l.svg}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className={`text-[13px] font-semibold leading-tight ${currentPage === l.id ? 'text-[#6d28d9]' : 'text-[#1c1814]'}`}>
                                                {l.label}
                                            </div>
                                            <div className="text-[10.5px] text-[#9e978e] leading-tight mt-px">
                                                {l.desc}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <style dangerouslySetInnerHTML={{
                        __html: `
                        @keyframes ddSlide {
                            from { opacity: 0; transform: translateY(-6px); }
                            to { opacity: 1; transform: translateY(0); }
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
