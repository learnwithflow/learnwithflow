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

    const handlePrint = () => { window.print(); };

    const autoFillFromPortfolio = () => {
        setResumeData(prev => ({
            ...prev,
            skills: 'HTML/CSS, JavaScript, React, Node.js, Next.js',
            summary: 'Aspiring Full Stack Developer passionate about building scalable web applications. Completed the Frontend Developer Roadmap on LearnWithFlow.'
        }));
        alert('Details auto-filled from your Portfolio!');
    };

    const inputCls = "w-full border border-[#eee9e1] bg-[#faf9f7] rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#2563a8]/15 focus:border-[#2563a8]/30 outline-none transition-all placeholder:text-[#c8c2b8]";

    return (
        <div className="min-h-screen bg-[#f5f2eb] font-sans print:bg-white print:py-0 print:px-0">
            {/* Top toolbar — NOT a cramped sidebar */}
            <div className="print:hidden border-b border-[#e2ddd4] bg-white/80 backdrop-blur-md sticky top-14 z-40" style={{ animation: 'rbFade 0.4s ease-out' }}>
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#2563a8]/10 flex items-center justify-center shrink-0">
                            <svg className="w-4.5 h-4.5 text-[#2563a8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-[#1c1814]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Resume Builder</h1>
                            <p className="text-[11px] text-[#a09890] font-medium">Edit below · Live preview updates instantly</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={autoFillFromPortfolio} className="hidden sm:flex items-center gap-2 bg-[#f5f2eb] text-[#2563a8] hover:bg-[#ede9e0] px-4 py-2.5 rounded-xl font-semibold text-sm border border-[#e2ddd4] transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            Auto-fill
                        </button>
                        <button onClick={handlePrint} className="flex items-center gap-2 bg-[#1c1814] text-white hover:bg-[#2c2520] px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            Download PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Main centered content */}
            <div className="max-w-5xl mx-auto px-6 py-10 print:p-0 print:max-w-none">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">

                    {/* Editor Panel */}
                    <div className="lg:col-span-5 print:hidden" style={{ animation: 'rbFade 0.5s ease-out 0.1s both' }}>
                        <div className="bg-white rounded-2xl shadow-sm border border-[#eee9e1] p-6 space-y-6 lg:sticky lg:top-36">
                            {/* Personal Info */}
                            <div>
                                <h3 className="text-[11px] font-bold text-[#a09890] uppercase tracking-[0.15em] mb-3">Personal Info</h3>
                                <div className="space-y-3">
                                    <input type="text" value={resumeData.name} onChange={e => setResumeData({ ...resumeData, name: e.target.value })} className={inputCls} placeholder="Full Name" />
                                    <input type="email" value={resumeData.email} onChange={e => setResumeData({ ...resumeData, email: e.target.value })} className={inputCls} placeholder="Email" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input type="text" value={resumeData.phone} onChange={e => setResumeData({ ...resumeData, phone: e.target.value })} className={inputCls} placeholder="Phone" />
                                        <input type="text" value={resumeData.linkedin} onChange={e => setResumeData({ ...resumeData, linkedin: e.target.value })} className={inputCls} placeholder="LinkedIn" />
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div>
                                <h3 className="text-[11px] font-bold text-[#a09890] uppercase tracking-[0.15em] mb-3">Summary</h3>
                                <textarea rows="3" value={resumeData.summary} onChange={e => setResumeData({ ...resumeData, summary: e.target.value })} className={inputCls + ' resize-none'} placeholder="Professional Summary"></textarea>
                            </div>

                            {/* Skills */}
                            <div>
                                <h3 className="text-[11px] font-bold text-[#a09890] uppercase tracking-[0.15em] mb-3">Skills</h3>
                                <input type="text" value={resumeData.skills} onChange={e => setResumeData({ ...resumeData, skills: e.target.value })} className={inputCls} placeholder="Comma separated skills" />
                            </div>
                        </div>
                    </div>

                    {/* A4 Live Preview */}
                    <div className="lg:col-span-7 print:w-full" style={{ animation: 'rbFade 0.5s ease-out 0.2s both' }}>
                        <div className="bg-white shadow-[0_4px_30px_rgba(0,0,0,0.06)] mx-auto print:shadow-none print:w-[210mm] print:min-h-[297mm] w-full min-h-[842px] max-w-[794px] font-sans text-[#2c2520] rounded-2xl print:rounded-none overflow-hidden border border-[#eee9e1] print:border-none">

                            <div className="p-10 sm:p-12 flex flex-col">
                                {/* Header */}
                                <header className="text-center pb-6 mb-6 border-b-2 border-[#eee9e1]">
                                    <h1 className="text-3xl sm:text-[34px] font-extrabold tracking-tight text-[#1c1814] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.1 }}>{resumeData.name || 'Your Name'}</h1>
                                    <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-[#8b8278]">
                                        {resumeData.email && <span className="text-[#2563a8] font-semibold">{resumeData.email}</span>}
                                        {resumeData.phone && <span className="font-medium">• {resumeData.phone}</span>}
                                        {resumeData.linkedin && <span className="font-medium">• {resumeData.linkedin}</span>}
                                    </div>
                                </header>

                                {/* Summary */}
                                {resumeData.summary && (
                                    <section className="mb-6">
                                        <h2 className="text-[11px] font-bold uppercase text-[#a09890] tracking-[0.15em] mb-2.5">Professional Summary</h2>
                                        <p className="text-[13px] leading-[1.7] text-[#4a453e]">{resumeData.summary}</p>
                                    </section>
                                )}

                                {/* Skills */}
                                {resumeData.skills && (
                                    <section className="mb-6">
                                        <h2 className="text-[11px] font-bold uppercase text-[#a09890] tracking-[0.15em] mb-2.5">Technical Skills</h2>
                                        <p className="text-[13px] leading-[1.7] text-[#4a453e] font-medium">{resumeData.skills}</p>
                                    </section>
                                )}

                                {/* Experience */}
                                <section className="mb-6">
                                    <h2 className="text-[11px] font-bold uppercase text-[#a09890] tracking-[0.15em] mb-3">Experience</h2>
                                    {resumeData.experience.map(exp => (
                                        <div key={exp.id} className="mb-4">
                                            <div className="flex justify-between items-baseline mb-0.5">
                                                <h3 className="font-bold text-[#1c1814] text-[14px]">{exp.role}</h3>
                                                <span className="text-[11px] font-semibold text-[#a09890] shrink-0 ml-4">{exp.duration}</span>
                                            </div>
                                            <div className="font-semibold text-[#2563a8] text-[12.5px] mb-1.5">{exp.company}</div>
                                            <ul className="list-disc list-inside text-[12.5px] text-[#5c564e] space-y-0.5">
                                                <li>{exp.desc}</li>
                                            </ul>
                                        </div>
                                    ))}
                                </section>

                                {/* Education */}
                                <section>
                                    <h2 className="text-[11px] font-bold uppercase text-[#a09890] tracking-[0.15em] mb-3">Education</h2>
                                    {resumeData.education.map(edu => (
                                        <div key={edu.id}>
                                            <div className="flex justify-between items-baseline mb-0.5">
                                                <h3 className="font-bold text-[#1c1814] text-[14px]">{edu.degree}</h3>
                                                <span className="text-[11px] font-semibold text-[#a09890] shrink-0 ml-4">{edu.year}</span>
                                            </div>
                                            <div className="text-[12.5px] text-[#5c564e]">{edu.school}</div>
                                        </div>
                                    ))}
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes rbFade {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @media print {
                    body { background: white !important; margin: 0 !important; padding: 0 !important; }
                    nav, footer, .toast-container { display: none !important; }
                    .print\\:hidden { display: none !important; }
                }
            `}} />
        </div>
    );
}
