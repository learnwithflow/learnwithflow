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
        // Mock copy to clipboard
        navigator.clipboard.writeText('https://learnwithflow.online/portfolio/ganeshp');
        alert('Public portfolio link copied to clipboard!');
    };

    return (
        <div className="min-h-screen bg-[#f5f2eb] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Profile Header Card */}
                <div className="bg-[#faf8f4] rounded-2xl shadow-sm border border-[#e2ddd4] overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-[#2563a8] to-[#06d6a0]"></div>
                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="w-24 h-24 bg-[#faf8f4] rounded-full p-1 border-4 border-[#faf8f4] shadow-md flex items-center justify-center text-3xl font-bold text-[#2563a8]">
                                {profile.name.charAt(0)}
                            </div>
                            <button
                                onClick={handleShare}
                                className="bg-[#faf8f4] border border-[#e2ddd4] hover:bg-[#ede9e0] text-[#1c1814] px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 shadow-sm text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                                Share Profile
                            </button>
                        </div>

                        <div>
                            <h1 className="text-3xl font-extrabold text-[#1c1814]" style={{ fontFamily: "'Instrument Serif', serif" }}>{profile.name}</h1>
                            <p className="text-lg font-bold text-[#2563a8] mt-1">{profile.headline}</p>
                            <p className="text-[#3d3830] mt-4 leading-relaxed max-w-2xl font-medium">
                                {profile.about}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Left Column - Skills */}
                    <div className="md:col-span-1 space-y-8">
                        <div className="bg-[#faf8f4] p-6 rounded-2xl shadow-sm border border-[#e2ddd4]">
                            <h2 className="text-xl font-bold text-[#1c1814] mb-4 flex items-center gap-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
                                <svg className="w-5 h-5 text-[#2563a8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                Verified Skills
                            </h2>
                            <div className="space-y-3">
                                {skills.map((skill, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-[#f5f2eb] border border-[#e2ddd4]">
                                        <span className="font-bold text-[#1c1814] text-sm">{skill.name}</span>
                                        {skill.verified ? (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16a34a] bg-[#16a34a]/10 px-2 py-1 rounded-full uppercase tracking-wider">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="text-[11px] font-bold text-[#8b8278] uppercase tracking-wider">{skill.level}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-[#e2ddd4] text-center">
                                <button
                                    onClick={() => showPage('roadmap')}
                                    className="text-sm font-bold text-[#2563a8] hover:text-[#1c1814] transition-colors"
                                >
                                    Verify more skills to roadmap &rarr;
                                </button>
                            </div>
                        </div>

                        {/* CTA to Resume Builder */}
                        <div className="bg-gradient-to-br from-[#2563a8] to-[#7c3aed] p-6 rounded-2xl shadow-sm text-white text-center">
                            <h3 className="font-bold text-lg mb-2">Need a PDF Resume?</h3>
                            <p className="text-white/80 text-sm mb-4">Auto-generate a professional resume from your portfolio data.</p>
                            <button
                                onClick={() => showPage('resume')}
                                className="w-full bg-white text-[#2563a8] font-bold py-2 rounded-lg hover:bg-white/90 transition-colors shadow-sm"
                            >
                                Build Resume
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Projects */}
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold text-[#1c1814] mb-6" style={{ fontFamily: "'Instrument Serif', serif" }}>Featured Projects</h2>

                        {projects.map(project => (
                            <div key={project.id} className="bg-[#faf8f4] p-6 rounded-2xl shadow-sm border border-[#e2ddd4] hover:shadow-md hover:border-[#2563a8]/50 transition-all">
                                <h3 className="text-xl font-bold text-[#1c1814] mb-2">{project.title}</h3>
                                <p className="text-[#8b8278] font-medium mb-4">{project.description}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tech.map(t => (
                                        <span key={t} className="bg-[#ede9e0] text-[#3d3830] border border-[#e2ddd4] px-2.5 py-1 rounded-md text-xs font-bold">
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <a href={project.link} className="text-sm font-bold text-[#3d3830] bg-[#ede9e0] hover:bg-[#e2ddd4] px-4 py-2 rounded-lg transition-colors border border-[#e2ddd4]">
                                        View Project
                                    </a>
                                    <a href="#" className="text-sm font-bold text-[#2563a8] bg-[#2563a8]/10 hover:bg-[#2563a8]/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-1 border border-transparent">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                                        Source Code
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
