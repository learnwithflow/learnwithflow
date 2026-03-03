'use client';
import React, { useState, useEffect } from 'react';

export default function Portfolio({ showPage }) {
    const [profile, setProfile] = useState({
        name: 'Aspiring Learner',
        headline: 'Future Tech Professional',
        about: 'Passionate about building scalable applications and learning new technologies.',
    });

    const [skills, setSkills] = useState([
        { name: 'HTML/CSS', level: 'Advanced', verified: true },
        { name: 'JavaScript', level: 'Intermediate', verified: true },
        { name: 'React', level: 'Intermediate', verified: true },
        { name: 'Node.js', level: 'Beginner', verified: false },
    ]);

    const [projects, setProjects] = useState([
        { id: '1', title: 'Task Manager App', description: 'A full-stack task management application with real-time updates and team collaboration features.', tech: ['React', 'Node.js', 'Socket.io', 'MongoDB'], link: '#' },
        { id: '2', title: 'E-commerce Dashboard', description: 'Responsive admin dashboard for an e-commerce platform with sales analytics and inventory management.', tech: ['Next.js', 'Tailwind CSS', 'Chart.js'], link: '#' },
    ]);

    const handleShare = () => {
        navigator.clipboard.writeText('https://learnwithflow.online/portfolio/user');
        alert('Public portfolio link copied to clipboard!');
    };

    return (
        <div className="min-h-screen bg-[#f5f2eb] py-16 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto">

                {/* Profile Header */}
                <div className="relative rounded-3xl overflow-hidden bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]" style={{ animation: 'fadeUp 0.5s ease-out' }}>
                    {/* Cover */}
                    <div className="h-40 sm:h-48 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563a8 40%, #1a8a7a 100%)' }}>
                        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 70% 20%, rgba(255,255,255,0.15) 0%, transparent 60%)' }}></div>
                        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 20% 80%, rgba(6,182,160,0.3) 0%, transparent 50%)' }}></div>
                    </div>

                    {/* Profile Info */}
                    <div className="px-6 sm:px-10 pb-8">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 mb-6">
                            <div className="w-28 h-28 bg-white rounded-2xl p-1 shadow-lg flex items-center justify-center text-4xl font-bold text-[#2563a8] border-4 border-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                {profile.name.charAt(0)}
                            </div>
                            <button
                                onClick={handleShare}
                                className="self-start sm:self-auto bg-[#f5f2eb] hover:bg-[#ede9e0] text-[#3d3830] px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 text-sm border border-[#e2ddd4] hover:shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                                Share Profile
                            </button>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-[#1c1814] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{profile.name}</h1>
                        <p className="text-base font-semibold text-[#2563a8] mt-1.5">{profile.headline}</p>
                        <p className="text-[#6b6560] mt-3 leading-relaxed max-w-2xl text-[15px]">{profile.about}</p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

                    {/* Left - Skills */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)]" style={{ animation: 'fadeUp 0.5s ease-out 0.1s both' }}>
                            <h2 className="text-lg font-bold text-[#1c1814] mb-5 flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                <div className="w-8 h-8 rounded-lg bg-[#2563a8]/10 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-[#2563a8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                </div>
                                Verified Skills
                            </h2>
                            <div className="space-y-2.5">
                                {skills.map((skill, index) => (
                                    <div key={index} className="flex items-center justify-between p-3.5 rounded-xl bg-[#faf9f7] border border-[#f0ece5] transition-all duration-200 hover:border-[#e0dbd2] hover:shadow-sm" style={{ animation: `fadeUp 0.4s ease-out ${0.15 + index * 0.05}s both` }}>
                                        <span className="font-semibold text-[#2c2520] text-[13.5px]">{skill.name}</span>
                                        {skill.verified ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-100">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-[#a09890] uppercase tracking-wider bg-[#f0ece5] px-2.5 py-1 rounded-full">{skill.level}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-5 pt-4 border-t border-[#f0ece5] text-center">
                                <button onClick={() => showPage('roadmap')} className="text-sm font-semibold text-[#2563a8] hover:text-[#1a4f8a] transition-colors group">
                                    Verify more skills <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                                </button>
                            </div>
                        </div>

                        {/* Resume CTA */}
                        <div className="rounded-2xl p-6 text-white relative overflow-hidden shadow-[0_4px_24px_rgba(37,99,168,0.25)]" style={{ background: 'linear-gradient(135deg, #2563a8 0%, #1a8a7a 100%)', animation: 'fadeUp 0.5s ease-out 0.2s both' }}>
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2"></div>
                            <h3 className="font-bold text-lg mb-1.5 relative" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Need a PDF Resume?</h3>
                            <p className="text-white/70 text-sm mb-5 relative leading-relaxed">Auto-generate a professional resume from your portfolio data.</p>
                            <button onClick={() => showPage('resume')} className="w-full bg-white text-[#2563a8] font-bold py-2.5 rounded-xl hover:bg-white/90 transition-all duration-200 shadow-sm hover:shadow-md text-sm relative">
                                Build Resume
                            </button>
                        </div>
                    </div>

                    {/* Right - Projects */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold text-[#1c1814] mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Featured Projects</h2>
                        <div className="space-y-5">
                            {projects.map((project, i) => (
                                <div key={project.id} className="bg-white p-6 sm:p-7 rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-[#f0ece5] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-[#e0dbd2] hover:-translate-y-0.5" style={{ animation: `fadeUp 0.5s ease-out ${0.1 + i * 0.1}s both` }}>
                                    <h3 className="text-lg font-bold text-[#1c1814] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{project.title}</h3>
                                    <p className="text-[#8b8278] text-[14px] leading-relaxed mb-4">{project.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-5">
                                        {project.tech.map(t => (
                                            <span key={t} className="bg-[#f5f2eb] text-[#5c564e] px-3 py-1 rounded-lg text-xs font-semibold border border-[#ede9e0]">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-3">
                                        <a href={project.link} className="text-[13px] font-semibold text-[#3d3830] bg-[#f5f2eb] hover:bg-[#ede9e0] px-4 py-2 rounded-lg transition-all duration-200 border border-[#e2ddd4]">
                                            View Project
                                        </a>
                                        <a href="#" className="text-[13px] font-semibold text-[#2563a8] hover:text-[#1a4f8a] bg-[#2563a8]/8 hover:bg-[#2563a8]/12 px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                                            Source Code
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </div>
    );
}
