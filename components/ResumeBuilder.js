'use client';
import React, { useState } from 'react';

export default function ResumeBuilder() {
    const [resumeData, setResumeData] = useState({
        name: 'Your Name',
        email: 'your.email@example.com',
        phone: '+1 234 567 8900',
        linkedin: 'linkedin.com/in/username',
        summary: 'Passionate and driven professional with a strong foundation in [Your Field]. Eager to apply my skills to real-world challenges and build innovative solutions.',
        experience: [
            { id: 1, role: 'Software Engineer Intern', company: 'Tech Solutions Inc.', duration: 'Jan 2023 - Present', desc: 'Developed responsive UI components using React and Tailwind CSS. Improved page load speed by 15%.' }
        ],
        education: [
            { id: 1, degree: 'B.Tech Computer Science', school: 'University of Engineering', year: '2020 - 2024' }
        ],
        skills: 'HTML, CSS, JavaScript, React, Next.js, Tailwind CSS, Node.js'
    });

    const handlePrint = () => {
        window.print();
    };

    const autoFillFromPortfolio = () => {
        setResumeData(prev => ({
            ...prev,
            skills: 'HTML/CSS, JavaScript, React, Node.js, Next.js',
            summary: 'Aspiring Full Stack Developer passionate about building scalable web applications. Completed the Frontend Developer Roadmap on LearnWithFlow.'
        }));
        alert('Details auto-filled from your Portfolio!');
    };

    return (
        <div className="min-h-screen bg-[#f5f2eb] py-16 px-4 sm:px-6 lg:px-8 font-sans print:bg-white print:py-0 print:px-0">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 print:block">

                {/* Left Column - Editor Panel */}
                <div className="lg:w-[340px] shrink-0 print:hidden" style={{ animation: 'fadeUp 0.5s ease-out' }}>
                    <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] sticky top-20 overflow-hidden">
                        {/* Editor Header */}
                        <div className="px-6 py-5 border-b border-[#f0ece5]">
                            <h2 className="text-lg font-bold text-[#1c1814] flex items-center gap-2.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                <div className="w-8 h-8 rounded-lg bg-[#2563a8]/10 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-[#2563a8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                </div>
                                Resume Editor
                            </h2>
                        </div>

                        <div className="p-6 space-y-5">
                            <button
                                onClick={autoFillFromPortfolio}
                                className="w-full bg-[#f5f2eb] text-[#2563a8] hover:bg-[#ede9e0] py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 text-sm border border-[#e2ddd4] hover:shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                Auto-fill from Portfolio
                            </button>

                            <div className="space-y-5 max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar">
                                {/* Personal Info */}
                                <div>
                                    <h3 className="text-xs font-bold text-[#a09890] uppercase tracking-wider mb-3">Personal Info</h3>
                                    <div className="space-y-2.5">
                                        <input type="text" value={resumeData.name} onChange={e => setResumeData({ ...resumeData, name: e.target.value })} className="w-full border border-[#eee9e1] bg-[#faf9f7] rounded-lg px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#2563a8]/20 focus:border-[#2563a8]/40 outline-none transition-all placeholder:text-[#c8c2b8]" placeholder="Full Name" />
                                        <input type="email" value={resumeData.email} onChange={e => setResumeData({ ...resumeData, email: e.target.value })} className="w-full border border-[#eee9e1] bg-[#faf9f7] rounded-lg px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#2563a8]/20 focus:border-[#2563a8]/40 outline-none transition-all placeholder:text-[#c8c2b8]" placeholder="Email" />
                                        <input type="text" value={resumeData.phone} onChange={e => setResumeData({ ...resumeData, phone: e.target.value })} className="w-full border border-[#eee9e1] bg-[#faf9f7] rounded-lg px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#2563a8]/20 focus:border-[#2563a8]/40 outline-none transition-all placeholder:text-[#c8c2b8]" placeholder="Phone" />
                                        <input type="text" value={resumeData.linkedin} onChange={e => setResumeData({ ...resumeData, linkedin: e.target.value })} className="w-full border border-[#eee9e1] bg-[#faf9f7] rounded-lg px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#2563a8]/20 focus:border-[#2563a8]/40 outline-none transition-all placeholder:text-[#c8c2b8]" placeholder="LinkedIn URL" />
                                    </div>
                                </div>

                                {/* Summary */}
                                <div>
                                    <h3 className="text-xs font-bold text-[#a09890] uppercase tracking-wider mb-3">Summary</h3>
                                    <textarea rows="3" value={resumeData.summary} onChange={e => setResumeData({ ...resumeData, summary: e.target.value })} className="w-full border border-[#eee9e1] bg-[#faf9f7] rounded-lg px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#2563a8]/20 focus:border-[#2563a8]/40 outline-none transition-all resize-none placeholder:text-[#c8c2b8]" placeholder="Professional Summary"></textarea>
                                </div>

                                {/* Skills */}
                                <div>
                                    <h3 className="text-xs font-bold text-[#a09890] uppercase tracking-wider mb-3">Skills</h3>
                                    <input type="text" value={resumeData.skills} onChange={e => setResumeData({ ...resumeData, skills: e.target.value })} className="w-full border border-[#eee9e1] bg-[#faf9f7] rounded-lg px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#2563a8]/20 focus:border-[#2563a8]/40 outline-none transition-all placeholder:text-[#c8c2b8]" placeholder="Comma separated skills" />
                                </div>
                            </div>

                            <button
                                onClick={handlePrint}
                                className="w-full bg-[#1c1814] hover:bg-[#2c2520] text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column - A4 Preview */}
                <div className="flex-1 print:w-full" style={{ animation: 'fadeUp 0.5s ease-out 0.15s both' }}>
                    <div className="bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)] mx-auto print:shadow-none print:w-[210mm] print:min-h-[297mm] w-full min-h-[842px] max-w-[794px] font-sans text-[#2c2520] rounded-2xl print:rounded-none overflow-hidden">
                        {/* Accent line */}
                        <div className="h-1 bg-gradient-to-r from-[#2563a8] via-[#1a8a7a] to-[#2563a8] print:hidden"></div>

                        <div className="p-10 sm:p-14 flex flex-col">
                            {/* Header */}
                            <header className="text-center pb-7 mb-7 border-b-2 border-[#eee9e1]">
                                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1814] mb-2.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{resumeData.name || 'Your Name'}</h1>
                                <div className="flex justify-center flex-wrap gap-x-5 gap-y-1 text-[13px] text-[#8b8278] font-medium">
                                    {resumeData.email && <span className="text-[#2563a8]">{resumeData.email}</span>}
                                    {resumeData.phone && <span>{resumeData.phone}</span>}
                                    {resumeData.linkedin && <span>{resumeData.linkedin}</span>}
                                </div>
                            </header>

                            {/* Summary */}
                            {resumeData.summary && (
                                <section className="mb-7">
                                    <h2 className="text-xs font-bold uppercase text-[#a09890] tracking-[0.15em] mb-3">Professional Summary</h2>
                                    <p className="text-[13.5px] leading-relaxed text-[#4a453e]">{resumeData.summary}</p>
                                </section>
                            )}

                            {/* Skills */}
                            {resumeData.skills && (
                                <section className="mb-7">
                                    <h2 className="text-xs font-bold uppercase text-[#a09890] tracking-[0.15em] mb-3">Technical Skills</h2>
                                    <p className="text-[13.5px] leading-relaxed text-[#4a453e] font-medium">{resumeData.skills}</p>
                                </section>
                            )}

                            {/* Experience */}
                            <section className="mb-7">
                                <h2 className="text-xs font-bold uppercase text-[#a09890] tracking-[0.15em] mb-4">Experience</h2>
                                <div className="space-y-5">
                                    {resumeData.experience.map(exp => (
                                        <div key={exp.id}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-[#1c1814] text-[15px]">{exp.role}</h3>
                                                <span className="text-[12px] font-semibold text-[#a09890] shrink-0 ml-4">{exp.duration}</span>
                                            </div>
                                            <div className="font-semibold text-[#2563a8] text-[13px] mb-2">{exp.company}</div>
                                            <ul className="list-disc list-inside text-[13.5px] space-y-1 ml-1 text-[#5c564e]">
                                                <li>{exp.desc}</li>
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Education */}
                            <section>
                                <h2 className="text-xs font-bold uppercase text-[#a09890] tracking-[0.15em] mb-4">Education</h2>
                                <div className="space-y-4">
                                    {resumeData.education.map(edu => (
                                        <div key={edu.id}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-[#1c1814] text-[15px]">{edu.degree}</h3>
                                                <span className="text-[12px] font-semibold text-[#a09890] shrink-0 ml-4">{edu.year}</span>
                                            </div>
                                            <div className="text-[13.5px] text-[#5c564e]">{edu.school}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
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
                @media print {
                    body { background: white !important; margin: 0 !important; padding: 0 !important; }
                    nav, footer, .toast-container { display: none !important; }
                    .print\\:hidden { display: none !important; }
                    .print\\:shadow-none { box-shadow: none !important; }
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e0dbd2; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #c8c2b8; }
            `}} />
        </div>
    );
}
