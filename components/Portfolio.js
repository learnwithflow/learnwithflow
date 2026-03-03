'use client';
import React, { useState } from 'react';

export default function Portfolio({ showPage }) {
    const [profile] = useState({
        name: 'Aspiring Learner',
        headline: 'Future Tech Professional',
        about: 'Passionate about building scalable applications and learning new technologies. Always curious, always shipping.',
    });

    const [skills] = useState([
        { name: 'HTML/CSS', verified: true },
        { name: 'JavaScript', verified: true },
        { name: 'React', verified: true },
        { name: 'Node.js', verified: false },
        { name: 'Next.js', verified: false },
        { name: 'Tailwind CSS', verified: true },
    ]);

    const [projects] = useState([
        { id: '1', title: 'Task Manager App', description: 'A full-stack task management application with real-time updates and team collaboration features.', tech: ['React', 'Node.js', 'Socket.io', 'MongoDB'], link: '#', color: '#2563a8' },
        { id: '2', title: 'E-commerce Dashboard', description: 'Responsive admin dashboard for an e-commerce platform with sales analytics and inventory management.', tech: ['Next.js', 'Tailwind CSS', 'Chart.js'], link: '#', color: '#06b6a0' },
    ]);

    const handleShare = () => {
        navigator.clipboard.writeText('https://learnwithflow.online/portfolio/user');
        alert('Portfolio link copied!');
    };

    return (
        <div className="min-h-screen bg-[#f5f2eb] font-sans">
            {/* ─── Full-width Hero Cover ─── */}
            <div className="w-full relative overflow-hidden" style={{ height: 280, background: 'linear-gradient(140deg, #0d1b2a 0%, #1b2d45 20%, #1e4976 45%, #2563a8 65%, #1a8a7a 85%, #0d3b30 100%)' }}>
                {/* Animated floating orbs */}
                <div className="absolute w-[500px] h-[500px] rounded-full -top-48 -left-24 opacity-20" style={{ background: 'radial-gradient(circle, rgba(37,99,168,0.6) 0%, transparent 70%)', animation: 'pfFloat 8s ease-in-out infinite' }}></div>
                <div className="absolute w-[400px] h-[400px] rounded-full -bottom-32 right-10 opacity-15" style={{ background: 'radial-gradient(circle, rgba(6,182,160,0.5) 0%, transparent 70%)', animation: 'pfFloat 6s ease-in-out infinite reverse' }}></div>
                <div className="absolute w-[200px] h-[200px] rounded-full top-10 right-1/3 opacity-10" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)', animation: 'pfFloat 10s ease-in-out infinite' }}></div>
                {/* Subtle noise texture */}
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")' }}></div>
            </div>

            {/* ─── Profile Section (overlaps cover) ─── */}
            <div className="max-w-3xl mx-auto px-6 sm:px-10">
                <div className="-mt-24 mb-16" style={{ animation: 'pfSlideUp 0.7s cubic-bezier(.22,1,.36,1)' }}>
                    {/* Avatar + Name */}
                    <div className="flex flex-col items-center text-center">
                        <div className="w-36 h-36 bg-white rounded-[28px] flex items-center justify-center text-6xl font-black shadow-2xl border-[5px] border-white mb-6" style={{ color: '#2563a8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {profile.name.charAt(0)}
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-[#1c1814] tracking-tight mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{profile.name}</h1>
                        <p className="text-lg font-semibold text-[#2563a8] mb-3">{profile.headline}</p>
                        <p className="text-[#8b8278] text-base leading-relaxed max-w-lg mb-6">{profile.about}</p>
                        <button onClick={handleShare} className="inline-flex items-center gap-2.5 bg-white text-[#3d3830] pl-5 pr-6 py-3 rounded-2xl font-semibold text-sm border border-[#e2ddd4] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                            Share Profile
                        </button>
                    </div>
                </div>

                {/* ─── Skills Section ─── */}
                <div className="mb-16" style={{ animation: 'pfSlideUp 0.6s ease-out 0.15s both' }}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-[#1c1814]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Skills</h2>
                        <button onClick={() => showPage('roadmap')} className="text-sm font-semibold text-[#2563a8] hover:text-[#1a4f8a] transition-colors group flex items-center gap-1">
                            Add more <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {skills.map((skill, i) => (
                            <div
                                key={i}
                                className={`inline-flex items-center gap-2 py-3 px-5 rounded-2xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-default ${skill.verified
                                        ? 'bg-white border border-emerald-200 text-[#1c1814] shadow-sm'
                                        : 'bg-[#faf9f7] border border-[#eee9e1] text-[#6b6560]'
                                    }`}
                                style={{ animation: `pfSlideUp 0.4s ease-out ${0.2 + i * 0.05}s both` }}
                            >
                                {skill.name}
                                {skill.verified && (
                                    <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── Projects Section ─── */}
                <div className="mb-16" style={{ animation: 'pfSlideUp 0.6s ease-out 0.25s both' }}>
                    <h2 className="text-2xl font-bold text-[#1c1814] mb-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Featured Projects</h2>
                    <div className="space-y-6">
                        {projects.map((project, i) => (
                            <div
                                key={project.id}
                                className="bg-white rounded-3xl p-8 sm:p-10 border border-[#eee9e1] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-400 group relative overflow-hidden"
                                style={{ animation: `pfSlideUp 0.5s ease-out ${0.3 + i * 0.12}s both` }}
                            >
                                {/* Colored top accent */}
                                <div className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 opacity-0 group-hover:opacity-100" style={{ background: `linear-gradient(90deg, ${project.color}, ${project.color}88)` }}></div>

                                <h3 className="text-xl font-bold text-[#1c1814] mb-3 group-hover:text-[#2563a8] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    {project.title}
                                </h3>
                                <p className="text-[#8b8278] text-[15px] leading-relaxed mb-6">{project.description}</p>

                                <div className="flex flex-wrap gap-2.5 mb-7">
                                    {project.tech.map(t => (
                                        <span key={t} className="bg-[#f5f2eb] text-[#5c564e] px-4 py-1.5 rounded-xl text-xs font-bold tracking-wide">
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-4">
                                    <a href={project.link} className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[#1c1814] hover:bg-[#2c2520] px-6 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
                                        View Project
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                    </a>
                                    <a href="#" className="inline-flex items-center gap-2 text-sm font-bold text-[#2563a8] bg-[#2563a8]/8 hover:bg-[#2563a8]/15 px-6 py-2.5 rounded-xl transition-all duration-200">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                                        Source Code
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── Resume CTA Banner ─── */}
                <div className="mb-16 rounded-3xl p-10 sm:p-12 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1b2d45 0%, #2563a8 50%, #1a8a7a 100%)', animation: 'pfSlideUp 0.5s ease-out 0.4s both' }}>
                    <div className="absolute w-[300px] h-[300px] rounded-full -top-20 -right-20 opacity-15" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }}></div>
                    <div className="absolute w-[200px] h-[200px] rounded-full -bottom-16 -left-10 opacity-10" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)' }}></div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 relative" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Ready to land that job?</h3>
                    <p className="text-white/60 text-base mb-8 relative max-w-md mx-auto leading-relaxed">Auto-generate a professional, ATS-friendly resume from your portfolio data in one click.</p>
                    <button onClick={() => showPage('resume')} className="inline-flex items-center gap-2 bg-white text-[#1b2d45] font-bold px-8 py-3.5 rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm relative">
                        Build Your Resume
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pfSlideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pfFloat {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(20px, -20px); }
                }
            `}} />
        </div>
    );
}
