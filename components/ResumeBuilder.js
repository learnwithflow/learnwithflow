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

    const inputCls = "w-full bg-[#faf9f7] border border-[#eee9e1] rounded-2xl px-5 py-3.5 text-[14px] font-medium text-[#2c2520] focus:ring-2 focus:ring-[#2563a8]/15 focus:border-[#2563a8]/30 outline-none transition-all duration-200 placeholder:text-[#c8c2b8] hover:border-[#ddd7cd]";

    return (
        <div className="min-h-screen bg-[#f5f2eb] font-sans print:bg-white print:py-0 print:px-0">

            {/* ─── Sticky Top Bar ─── */}
            <div className="print:hidden bg-white/90 backdrop-blur-xl border-b border-[#eee9e1] sticky top-14 z-40" style={{ animation: 'rbSlide 0.5s ease-out' }}>
                <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-[#1c1814] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Resume Builder</h1>
                        <p className="text-sm text-[#a09890] font-medium mt-0.5">Edit on the left · Preview updates live</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={autoFillFromPortfolio} className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-[#2563a8] bg-[#2563a8]/8 hover:bg-[#2563a8]/15 px-5 py-3 rounded-2xl transition-all duration-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            Auto-fill
                        </button>
                        <button onClick={handlePrint} className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[#1c1814] hover:bg-[#2c2520] px-6 py-3 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            Download PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── Main Content ─── */}
            <div className="max-w-6xl mx-auto px-8 py-12 print:p-0 print:max-w-none">
                <div className="flex flex-col lg:flex-row gap-10 print:block">

                    {/* ─── Editor Panel ─── */}
                    <div className="lg:w-[420px] shrink-0 print:hidden" style={{ animation: 'rbSlide 0.5s ease-out 0.1s both' }}>
                        <div className="bg-white rounded-3xl shadow-sm border border-[#eee9e1] overflow-hidden lg:sticky lg:top-36">
                            <div className="p-8 space-y-8">

                                {/* Personal Info */}
                                <div>
                                    <h3 className="text-xs font-black text-[#a09890] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-md bg-[#2563a8]/10 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-[#2563a8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                        </div>
                                        Personal Info
                                    </h3>
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
                                    <h3 className="text-xs font-black text-[#a09890] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-md bg-[#06b6a0]/10 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-[#06b6a0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                                        </div>
                                        Summary
                                    </h3>
                                    <textarea rows="4" value={resumeData.summary} onChange={e => setResumeData({ ...resumeData, summary: e.target.value })} className={inputCls + ' resize-none'} placeholder="Professional Summary"></textarea>
                                </div>

                                {/* Skills */}
                                <div>
                                    <h3 className="text-xs font-black text-[#a09890] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-md bg-[#8b5cf6]/10 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                                        </div>
                                        Skills
                                    </h3>
                                    <input type="text" value={resumeData.skills} onChange={e => setResumeData({ ...resumeData, skills: e.target.value })} className={inputCls} placeholder="Comma separated skills" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─── A4 Live Preview ─── */}
                    <div className="flex-1 print:w-full" style={{ animation: 'rbSlide 0.5s ease-out 0.2s both' }}>
                        <div className="bg-white shadow-[0_8px_40px_rgba(0,0,0,0.06)] mx-auto print:shadow-none print:w-[210mm] print:min-h-[297mm] w-full min-h-[842px] max-w-[794px] font-sans text-[#2c2520] rounded-3xl print:rounded-none overflow-hidden border border-[#eee9e1] print:border-none">

                            <div className="p-12 sm:p-14 flex flex-col">
                                {/* Header */}
                                <header className="text-center pb-8 mb-8 border-b-2 border-[#eee9e1]">
                                    <h1 className="text-4xl font-black tracking-tight text-[#1c1814] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.1 }}>{resumeData.name || 'Your Name'}</h1>
                                    <div className="flex justify-center flex-wrap gap-x-5 gap-y-1.5 text-[13px]">
                                        {resumeData.email && <span className="text-[#2563a8] font-semibold">{resumeData.email}</span>}
                                        {resumeData.phone && <span className="text-[#8b8278] font-medium">• {resumeData.phone}</span>}
                                        {resumeData.linkedin && <span className="text-[#8b8278] font-medium">• {resumeData.linkedin}</span>}
                                    </div>
                                </header>

                                {resumeData.summary && (
                                    <section className="mb-8">
                                        <h2 className="text-[11px] font-black uppercase text-[#a09890] tracking-[0.2em] mb-3">Professional Summary</h2>
                                        <p className="text-[14px] leading-[1.8] text-[#4a453e]">{resumeData.summary}</p>
                                    </section>
                                )}

                                {resumeData.skills && (
                                    <section className="mb-8">
                                        <h2 className="text-[11px] font-black uppercase text-[#a09890] tracking-[0.2em] mb-3">Technical Skills</h2>
                                        <p className="text-[14px] leading-[1.8] text-[#4a453e] font-medium">{resumeData.skills}</p>
                                    </section>
                                )}

                                <section className="mb-8">
                                    <h2 className="text-[11px] font-black uppercase text-[#a09890] tracking-[0.2em] mb-5">Experience</h2>
                                    {resumeData.experience.map(exp => (
                                        <div key={exp.id} className="mb-5">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-[#1c1814] text-[15px]">{exp.role}</h3>
                                                <span className="text-[12px] font-bold text-[#a09890] shrink-0 ml-4">{exp.duration}</span>
                                            </div>
                                            <div className="font-semibold text-[#2563a8] text-[13px] mb-2">{exp.company}</div>
                                            <ul className="list-disc list-inside text-[13.5px] text-[#5c564e] leading-relaxed">
                                                <li>{exp.desc}</li>
                                            </ul>
                                        </div>
                                    ))}
                                </section>

                                <section>
                                    <h2 className="text-[11px] font-black uppercase text-[#a09890] tracking-[0.2em] mb-5">Education</h2>
                                    {resumeData.education.map(edu => (
                                        <div key={edu.id}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-[#1c1814] text-[15px]">{edu.degree}</h3>
                                                <span className="text-[12px] font-bold text-[#a09890] shrink-0 ml-4">{edu.year}</span>
                                            </div>
                                            <div className="text-[13.5px] text-[#5c564e]">{edu.school}</div>
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
                @keyframes rbSlide {
                    from { opacity: 0; transform: translateY(24px); }
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
