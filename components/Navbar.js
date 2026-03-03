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
                        <div className="hidden md:block absolute top-[62px] right-3 w-[260px] z-50" style={{ animation: 'ddFade 0.25s cubic-bezier(.22,1,.36,1)' }}>
                            <div className="rounded-2xl p-1.5" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(24px) saturate(1.4)', WebkitBackdropFilter: 'blur(24px) saturate(1.4)', boxShadow: '0 12px 40px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)', border: '1px solid rgba(255,255,255,0.6)' }}>
                                {featureLinks.map((l, i) => (
                                    <button
                                        key={l.id}
                                        onClick={() => handleNav(l.id)}
                                        className={`w-full text-left rounded-xl transition-all duration-200 flex items-center gap-3.5 group relative overflow-hidden ${currentPage === l.id ? 'bg-white shadow-sm' : 'hover:bg-white/80'}`}
                                        style={{ padding: '14px 16px', animation: `ddItem 0.3s cubic-bezier(.22,1,.36,1) ${i * 0.06}s both` }}
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
                            from { opacity: 0; transform: translateY(-10px) scale(0.97); }
                            to { opacity: 1; transform: translateY(0) scale(1); }
                        }
                        @keyframes ddItem {
                            from { opacity: 0; transform: translateX(-6px); }
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
