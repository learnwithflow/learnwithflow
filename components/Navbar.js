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
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'jobtracker', label: 'Job Tracker' },
        { id: 'portfolio', label: 'Portfolio' },
        { id: 'resume', label: 'Resume Builder' },
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
                        <div className="hidden md:block absolute top-[52px] right-4 w-52 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 z-50">
                            <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Career Copilot</div>
                            {featureLinks.map(l => (
                                <button
                                    key={l.id}
                                    onClick={() => handleNav(l.id)}
                                    className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors flex items-center gap-2 ${currentPage === l.id ? 'text-blue-700 bg-blue-50/70 border-l-2 border-blue-600' : 'text-gray-700 hover:bg-gray-50 border-l-2 border-transparent hover:text-blue-600'}`}
                                >
                                    {l.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile Drawer */}
            <div className={`mobile-drawer${mobileMenuOpen ? ' open' : ''}`}>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-2 pt-2">Main Features</div>
                {mainLinks.map(l => (
                    <button key={l.id} className={`mob-btn ${currentPage === l.id ? 'text-blue-700 bg-blue-50' : 'text-gray-800'}`} onClick={() => handleNav(l.id, true)}>{l.label}</button>
                ))}

                <div className="border-t border-gray-200 my-2"></div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-2 pt-2">Career Tools</div>
                {featureLinks.map(l => (
                    <button key={l.id} className={`mob-btn ${currentPage === l.id ? 'text-blue-700 bg-blue-50' : 'text-gray-800'}`} onClick={() => handleNav(l.id, true)}>{l.label}</button>
                ))}
            </div>
        </>
    );
}
