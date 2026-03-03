'use client';
import React, { useState } from 'react';

export default function Portfolio({ showPage }) {
    const [profile] = useState({
        name: 'Aspiring Learner',
        headline: 'Future Tech Professional',
        about: 'Passionate about building scalable applications and learning new technologies.',
    });

    const [skills] = useState([
        { name: 'HTML/CSS', level: 'Advanced', verified: true },
        { name: 'JavaScript', level: 'Intermediate', verified: true },
        { name: 'React', level: 'Intermediate', verified: true },
        { name: 'Node.js', level: 'Beginner', verified: false },
    ]);

    const [projects] = useState([
        { id: '1', title: 'Task Manager App', description: 'A full-stack task management application with real-time updates and team collaboration features.', tech: ['React', 'Node.js', 'Socket.io', 'MongoDB'], link: '#' },
        { id: '2', title: 'E-commerce Dashboard', description: 'Responsive admin dashboard for an e-commerce platform with sales analytics and inventory management.', tech: ['Next.js', 'Tailwind CSS', 'Chart.js'], link: '#' },
    ]);

    const handleShare = () => {
        navigator.clipboard.writeText('https://learnwithflow.online/portfolio/user');
        alert('Public portfolio link copied to clipboard!');
    };

    return (
        <div className="min-h-screen bg-[#f5f2eb] font-sans">
            {/* Full-width cover banner */}
            <div className="w-full h-48 sm:h-56 relative" style={{ background: 'linear-gradient(135deg, #0f2439 0%, #1e3a5f 25%, #2563a8 50%, #1a7a6a 80%, #0f2439 100%)' }}>
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(37,99,168,0.4) 0%, transparent 60%)' }}></div>
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 60%, rgba(6,182,160,0.25) 0%, transparent 50%)' }}></div>
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
            </div>

            {/* Centered content container */}
            <div className="max-w-4xl mx-auto px-6 sm:px-8" style={{ animation: 'pfFadeUp 0.6s ease-out' }}>
                {/* Profile card overlapping cover */}
                <div className="-mt-20 mb-10">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                        <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center text-5xl font-bold text-[#2563a8] shadow-xl border-4 border-white shrink-0" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {profile.name.charAt(0)}
                        </div>
                        <div className="flex-1 pt-2">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1c1814] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{profile.name}</h1>
                                    <p className="text-[#2563a8] font-bold text-base mt-1">{profile.headline}</p>
                                </div>
                                <button onClick={handleShare} className="hidden sm:flex items-center gap-2 bg-white text-[#3d3830] px-5 py-2.5 rounded-xl font-semibold text-sm border border-[#e2ddd4] shadow-sm hover:shadow-md transition-all duration-200 shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                                    Share
                                </button>
                            </div>
                            <p className="text-[#6b6560] mt-3 leading-relaxed text-[15px] max-w-xl">{profile.about}</p>
                        </div>
                    </div>
                </div>

                {/* Skills + Projects in proper balanced grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-16">

                    {/* Skills Column */}
                    <div className="md:col-span-4 space-y-6" style={{ animation: 'pfFadeUp 0.5s ease-out 0.1s both' }}>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eee9e1]">
                            <h2 className="text-base font-bold text-[#1c1814] mb-4 flex items-center gap-2.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                <svg className="w-5 h-5 text-[#2563a8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                Verified Skills
                            </h2>
                            <div className="space-y-2">
                                {skills.map((skill, i) => (
                                    <div key={i} className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#faf9f7] hover:bg-[#f5f2eb] transition-colors duration-200" style={{ animation: `pfFadeUp 0.4s ease-out ${0.15 + i * 0.06}s both` }}>
                                        <span className="text-[13.5px] font-semibold text-[#2c2520]">{skill.name}</span>
                                        {skill.verified ? (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-[#a09890] bg-[#eee9e1] px-2 py-0.5 rounded-full uppercase tracking-wider">{skill.level}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => showPage('roadmap')} className="w-full text-center text-sm font-semibold text-[#2563a8] hover:text-[#1a4f8a] mt-5 pt-4 border-t border-[#eee9e1] transition-colors group">
                                Verify more skills <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>

                        {/* Resume CTA */}
                        <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563a8 100%)', animation: 'pfFadeUp 0.5s ease-out 0.25s both' }}>
                            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10"></div>
                            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5"></div>
                            <h3 className="font-bold text-base mb-1 relative" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Need a PDF Resume?</h3>
                            <p className="text-white/60 text-sm mb-4 relative leading-relaxed">Auto-generate from your portfolio data.</p>
                            <button onClick={() => showPage('resume')} className="w-full bg-white text-[#1e3a5f] font-bold py-2.5 rounded-xl hover:bg-white/90 transition-all duration-200 text-sm relative">
                                Build Resume →
                            </button>
                        </div>
                    </div>

                    {/* Projects Column */}
                    <div className="md:col-span-8" style={{ animation: 'pfFadeUp 0.5s ease-out 0.15s both' }}>
                        <h2 className="text-lg font-bold text-[#1c1814] mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Featured Projects</h2>
                        <div className="space-y-5">
                            {projects.map((project, i) => (
                                <div key={project.id} className="bg-white p-6 rounded-2xl shadow-sm border border-[#eee9e1] transition-all duration-300 hover:shadow-md hover:border-[#ddd7cd] hover:-translate-y-px" style={{ animation: `pfFadeUp 0.5s ease-out ${0.2 + i * 0.1}s both` }}>
                                    <h3 className="text-[17px] font-bold text-[#1c1814] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{project.title}</h3>
                                    <p className="text-[#8b8278] text-[14px] leading-relaxed mb-4">{project.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-5">
                                        {project.tech.map(t => (
                                            <span key={t} className="bg-[#f5f2eb] text-[#5c564e] px-3 py-1 rounded-lg text-xs font-semibold">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-3">
                                        <a href={project.link} className="text-[13px] font-semibold text-[#3d3830] bg-[#f5f2eb] hover:bg-[#ede9e0] px-4 py-2 rounded-lg transition-colors">
                                            View Project
                                        </a>
                                        <a href="#" className="text-[13px] font-semibold text-[#2563a8] hover:text-[#1a4f8a] px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5">
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
                @keyframes pfFadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </div>
    );
}
