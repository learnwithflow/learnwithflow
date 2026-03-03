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
        <div className="min-h-screen bg-[#f5f2eb] py-12 px-4 sm:px-6 lg:px-8 font-sans print:bg-white print:py-0 print:px-0">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 print:block">

                {/* Left Column - Form (Hidden on Print) */}
                <div className="lg:w-1/3 space-y-6 print:hidden">
                    <div className="bg-[#faf8f4] p-6 rounded-2xl shadow-sm border border-[#e2ddd4] sticky top-6">
                        <h2 className="text-2xl font-bold text-[#1c1814] mb-6 flex items-center gap-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
                            <svg className="w-6 h-6 text-[#2563a8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            Resume Editor
                        </h2>

                        <button
                            onClick={autoFillFromPortfolio}
                            className="w-full mb-6 bg-[#2563a8]/10 text-[#2563a8] hover:bg-[#2563a8]/20 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors border border-transparent"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            Auto-fill from Portfolio
                        </button>

                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            {/* Personal Info */}
                            <div className="space-y-3">
                                <h3 className="font-bold text-[#1c1814] border-b border-[#e2ddd4] pb-1">Personal Info</h3>
                                <input type="text" value={resumeData.name} onChange={e => setResumeData({ ...resumeData, name: e.target.value })} className="w-full border border-[#e2ddd4] bg-white rounded px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#2563a8] focus:border-[#2563a8] outline-none" placeholder="Full Name" />
                                <input type="email" value={resumeData.email} onChange={e => setResumeData({ ...resumeData, email: e.target.value })} className="w-full border border-[#e2ddd4] bg-white rounded px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#2563a8] focus:border-[#2563a8] outline-none" placeholder="Email" />
                                <input type="text" value={resumeData.phone} onChange={e => setResumeData({ ...resumeData, phone: e.target.value })} className="w-full border border-[#e2ddd4] bg-white rounded px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#2563a8] focus:border-[#2563a8] outline-none" placeholder="Phone" />
                                <input type="text" value={resumeData.linkedin} onChange={e => setResumeData({ ...resumeData, linkedin: e.target.value })} className="w-full border border-[#e2ddd4] bg-white rounded px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#2563a8] focus:border-[#2563a8] outline-none" placeholder="LinkedIn URL" />
                            </div>

                            {/* Summary */}
                            <div className="space-y-3">
                                <h3 className="font-bold text-[#1c1814] border-b border-[#e2ddd4] pb-1">Summary</h3>
                                <textarea rows="3" value={resumeData.summary} onChange={e => setResumeData({ ...resumeData, summary: e.target.value })} className="w-full border border-[#e2ddd4] bg-white rounded px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#2563a8] focus:border-[#2563a8] outline-none" placeholder="Professional Summary"></textarea>
                            </div>

                            {/* Skills */}
                            <div className="space-y-3">
                                <h3 className="font-bold text-[#1c1814] border-b border-[#e2ddd4] pb-1">Skills</h3>
                                <input type="text" value={resumeData.skills} onChange={e => setResumeData({ ...resumeData, skills: e.target.value })} className="w-full border border-[#e2ddd4] bg-white rounded px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#2563a8] focus:border-[#2563a8] outline-none" placeholder="Comma separated skills" />
                            </div>
                        </div>

                        <button
                            onClick={handlePrint}
                            className="w-full mt-6 bg-[#2563a8] hover:bg-[#1f5088] text-white py-3 rounded-lg font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                            Download PDF / Print
                        </button>
                    </div>
                </div>

                {/* Right Column - Live Preview (ATS Friendly Layout) */}
                <div className="lg:w-2/3 print:w-full">
                    {/* A4 Size Container */}
                    <div className="bg-white shadow-lg mx-auto print:shadow-none print:w-[210mm] print:min-h-[297mm] w-full min-h-[842px] max-w-[794px] p-10 sm:p-12 font-sans text-gray-800 border box-border flex flex-col">

                        {/* Header */}
                        <header className="text-center border-b-2 border-gray-300 pb-6 mb-6">
                            <h1 className="text-4xl font-bold uppercase tracking-wider text-gray-900 mb-2">{resumeData.name || 'Your Name'}</h1>
                            <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-600 font-medium">
                                {resumeData.email && <span>{resumeData.email}</span>}
                                {resumeData.phone && <span>• {resumeData.phone}</span>}
                                {resumeData.linkedin && <span>• {resumeData.linkedin}</span>}
                            </div>
                        </header>

                        {/* Summary */}
                        {resumeData.summary && (
                            <section className="mb-6">
                                <h2 className="text-lg font-bold uppercase text-gray-900 border-b border-gray-300 tracking-wider mb-3 pb-1">Professional Summary</h2>
                                <p className="text-sm leading-relaxed">{resumeData.summary}</p>
                            </section>
                        )}

                        {/* Skills */}
                        {resumeData.skills && (
                            <section className="mb-6">
                                <h2 className="text-lg font-bold uppercase text-gray-900 border-b border-gray-300 tracking-wider mb-3 pb-1">Technical Skills</h2>
                                <p className="text-sm leading-relaxed font-medium">{resumeData.skills}</p>
                            </section>
                        )}

                        {/* Experience */}
                        <section className="mb-6">
                            <h2 className="text-lg font-bold uppercase text-gray-900 border-b border-gray-300 tracking-wider mb-3 pb-1">Experience</h2>
                            <div className="space-y-4">
                                {resumeData.experience.map(exp => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-gray-900">{exp.role}</h3>
                                            <span className="text-sm font-semibold text-gray-600">{exp.duration}</span>
                                        </div>
                                        <div className="font-medium text-blue-700 italic text-sm mb-2">{exp.company}</div>
                                        <ul className="list-disc list-inside text-sm space-y-1 ml-1 text-gray-700">
                                            <li>{exp.desc}</li>
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Education */}
                        <section>
                            <h2 className="text-lg font-bold uppercase text-gray-900 border-b border-gray-300 tracking-wider mb-3 pb-1">Education</h2>
                            <div className="space-y-4">
                                {resumeData.education.map(edu => (
                                    <div key={edu.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                                            <span className="text-sm font-semibold text-gray-600">{edu.year}</span>
                                        </div>
                                        <div className="text-sm text-gray-700">{edu.school}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>
                </div>

            </div>

            {/* Adding custom styles for print and scrollbar */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @media print {
          body { 
            background: white !important; 
            margin: 0 !important;
            padding: 0 !important;
          }
          nav, footer, .toast-container { display: none !important; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}} />
        </div>
    );
}
