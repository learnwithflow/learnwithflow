'use client';
import React, { useState, useEffect } from 'react';

export default function Portfolio({ showPage }) {
    const [profile, setProfile] = useState({
        name: 'Ganesh P',
        headline: 'Aspiring Full Stack Developer',
        about: 'Passionate about building scalable web applications and learning new technologies. Currently completing the Frontend Developer Roadmap on LearnWithFlow.',
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
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="w-24 h-24 bg-white rounded-full p-1 border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-blue-600">
                                {profile.name.charAt(0)}
                            </div>
                            <button
                                onClick={handleShare}
                                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                                Share Profile
                            </button>
                        </div>

                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">{profile.name}</h1>
                            <p className="text-lg font-medium text-blue-600 mt-1">{profile.headline}</p>
                            <p className="text-gray-600 mt-4 leading-relaxed max-w-2xl">
                                {profile.about}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Left Column - Skills */}
                    <div className="md:col-span-1 space-y-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                Verified Skills
                            </h2>
                            <div className="space-y-3">
                                {skills.map((skill, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                                        <span className="font-medium text-gray-800">{skill.name}</span>
                                        {skill.verified ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="text-xs font-medium text-gray-500">{skill.level}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                                <button
                                    onClick={() => showPage('roadmap')}
                                    className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    Verify more skills to roadmap &rarr;
                                </button>
                            </div>
                        </div>

                        {/* CTA to Resume Builder */}
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-sm text-white text-center">
                            <h3 className="font-bold text-lg mb-2">Need a PDF Resume?</h3>
                            <p className="text-indigo-100 text-sm mb-4">Auto-generate a professional resume from your portfolio data.</p>
                            <button
                                onClick={() => showPage('resume')}
                                className="w-full bg-white text-indigo-600 font-bold py-2 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm"
                            >
                                Build Resume
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Projects */}
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Projects</h2>

                        {projects.map(project => (
                            <div key={project.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                                <p className="text-gray-600 mb-4">{project.description}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tech.map(t => (
                                        <span key={t} className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-md text-xs font-semibold">
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <a href={project.link} className="text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors border border-gray-200">
                                        View Project
                                    </a>
                                    <a href="#" className="text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-1">
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
