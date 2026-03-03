'use client';
import React, { useState, useEffect } from 'react';

const BOARDS = ['Wishlist', 'Applied', 'Interview', 'Offer'];

export default function JobTracker({ showPage }) {
    const [jobs, setJobs] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedJobs = localStorage.getItem('lwf_jobTracker');
            if (savedJobs) return JSON.parse(savedJobs);
        }
        return [
            { id: '1', company: 'Google', role: 'Frontend Developer', link: 'careers.google.com', status: 'Wishlist' },
            { id: '2', company: 'Microsoft', role: 'Software Engineer', link: '', status: 'Applied' },
            { id: '3', company: 'Amazon', role: 'SDE I', link: '', status: 'Interview' }
        ];
    });
    const [isAdding, setIsAdding] = useState(false);
    const [newJob, setNewJob] = useState({ company: '', role: '', link: '', status: 'Wishlist' });
    const [draggedJobId, setDraggedJobId] = useState(null);

    const saveJobs = (updatedJobs) => {
        setJobs(updatedJobs);
        localStorage.setItem('lwf_jobTracker', JSON.stringify(updatedJobs));
    };

    const handleAddJob = (e) => {
        e.preventDefault();
        if (!newJob.company || !newJob.role) return;

        const job = {
            ...newJob,
            id: Date.now().toString()
        };

        saveJobs([...jobs, job]);
        setNewJob({ company: '', role: '', link: '', status: 'Wishlist' });
        setIsAdding(false);
    };

    const handleDragStart = (e, id) => {
        setDraggedJobId(id);
        e.dataTransfer.effectAllowed = 'move';
        // Optional: add a class to the dragged item for styling
        setTimeout(() => {
            if (e.target) e.target.classList.add('opacity-50');
        }, 0);
    };

    const handleDragEnd = (e) => {
        if (e.target) e.target.classList.remove('opacity-50');
        setDraggedJobId(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, status) => {
        e.preventDefault();
        if (!draggedJobId) return;

        const updatedJobs = jobs.map(job =>
            job.id === draggedJobId ? { ...job, status } : job
        );
        saveJobs(updatedJobs);
        setDraggedJobId(null);
    };

    const handleDelete = (id) => {
        saveJobs(jobs.filter(job => job.id !== id));
    };

    return (
        <div className="min-h-screen bg-[#f5f2eb] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header section */}
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-[#1c1814] mb-4 tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
                        Job <span className="text-[#2563a8]">Tracker</span>
                    </h1>
                    <p className="text-lg text-[#8b8278] max-w-3xl mx-auto font-medium">
                        Manage your applications from wishlist to offer. Drag and drop jobs across stages.
                    </p>
                </div>

                {/* Action Bar */}
                <div className="flex justify-between items-center bg-[#faf8f4] p-4 rounded-xl shadow-sm border border-[#e2ddd4]">
                    <div className="text-sm text-[#8b8278]">
                        <span className="font-bold text-[#1c1814]">{jobs.length}</span> Total Applications
                    </div>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="bg-[#1c1814] hover:bg-[#3d3830] text-white px-5 py-2.5 rounded-lg font-bold transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Add Job
                    </button>
                </div>

                {/* Add Job Modal/Form */}
                {isAdding && (
                    <div className="bg-[#faf8f4] p-6 rounded-xl shadow-md border border-[#e2ddd4] animate-in fade-in slide-in-from-top-4">
                        <h3 className="text-xl font-bold text-[#1c1814] mb-4 border-b border-[#e2ddd4] pb-2">Add New Application</h3>
                        <form onSubmit={handleAddJob} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                            <div className="lg:col-span-1">
                                <label className="block text-sm font-bold text-[#3d3830] mb-1">Company *</label>
                                <input required type="text" value={newJob.company} onChange={e => setNewJob({ ...newJob, company: e.target.value })} className="w-full border border-[#e2ddd4] bg-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#2563a8] focus:border-[#2563a8] outline-none transition-all font-medium" placeholder="e.g. Google" />
                            </div>
                            <div className="lg:col-span-1">
                                <label className="block text-sm font-bold text-[#3d3830] mb-1">Role *</label>
                                <input required type="text" value={newJob.role} onChange={e => setNewJob({ ...newJob, role: e.target.value })} className="w-full border border-[#e2ddd4] bg-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#2563a8] focus:border-[#2563a8] outline-none transition-all font-medium" placeholder="e.g. Frontend Dev" />
                            </div>
                            <div className="lg:col-span-1">
                                <label className="block text-sm font-bold text-[#3d3830] mb-1">Job Link</label>
                                <input type="url" value={newJob.link} onChange={e => setNewJob({ ...newJob, link: e.target.value })} className="w-full border border-[#e2ddd4] bg-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#2563a8] focus:border-[#2563a8] outline-none transition-all font-medium" placeholder="https://..." />
                            </div>
                            <div className="lg:col-span-1">
                                <label className="block text-sm font-bold text-[#3d3830] mb-1">Stage</label>
                                <select value={newJob.status} onChange={e => setNewJob({ ...newJob, status: e.target.value })} className="w-full border border-[#e2ddd4] bg-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#2563a8] focus:border-[#2563a8] outline-none transition-all font-medium">
                                    {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                            <div className="lg:col-span-1 flex gap-2">
                                <button type="submit" className="w-full bg-[#2563a8] hover:bg-[#1f5088] text-white px-4 py-2.5 rounded-lg font-bold transition-colors shadow-sm">Save</button>
                                <button type="button" onClick={() => setIsAdding(false)} className="w-full bg-[#ede9e0] hover:bg-[#e2ddd4] text-[#1c1814] px-4 py-2.5 rounded-lg font-bold transition-colors">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Kanban Board */}
                <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
                    {BOARDS.map(board => {
                        const boardJobs = jobs.filter(j => j.status === board);
                        return (
                            <div
                                key={board}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, board)}
                                className="flex-none w-80 bg-[#ede9e0] rounded-xl flex flex-col snap-center border border-[#e2ddd4]"
                            >
                                {/* Board Column Header */}
                                <div className="p-4 flex justify-between items-center bg-[#faf8f4] rounded-t-xl sticky top-0 border-b border-[#e2ddd4]">
                                    <h3 className="font-bold text-[#1c1814]">{board}</h3>
                                    <span className="bg-[#ede9e0] text-[#3d3830] text-xs font-bold px-2.5 py-1 rounded-full">{boardJobs.length}</span>
                                </div>

                                {/* Board Column Content */}
                                <div className="p-4 flex-1 overflow-y-auto space-y-4 min-h-[300px]">
                                    {boardJobs.map(job => (
                                        <div
                                            key={job.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, job.id)}
                                            onDragEnd={handleDragEnd}
                                            className="bg-[#faf8f4] p-4 rounded-xl shadow-sm border border-[#e2ddd4] hover:shadow-md hover:border-[#2563a8]/50 transition-all cursor-grab active:cursor-grabbing group relative"
                                        >
                                            <button onClick={() => handleDelete(job.id)} className="absolute top-3 right-3 text-[#8b8278] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                            <div className="font-bold text-[#1c1814] text-lg mb-1 pr-6">{job.role}</div>
                                            <div className="text-[#8b8278] font-bold mb-3 flex items-center gap-2 text-sm">
                                                <div className="w-6 h-6 rounded-md bg-[#ede9e0] flex items-center justify-center text-xs font-bold text-[#3d3830] border border-[#e2ddd4]">
                                                    {job.company.charAt(0).toUpperCase()}
                                                </div>
                                                {job.company}
                                            </div>

                                            {job.link && (
                                                <a href={job.link} target="_blank" rel="noopener noreferrer" className="text-xs text-[#2563a8] hover:text-[#1c1814] font-bold flex items-center gap-1 mb-3 transition-colors">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                                    View Job Post
                                                </a>
                                            )}

                                            {/* Contextual Action for Interview Stage */}
                                            {board === 'Interview' && (
                                                <button
                                                    onClick={() => showPage('interview')}
                                                    className="w-full mt-2 bg-[#2563a8]/10 hover:bg-[#2563a8]/20 text-[#2563a8] border border-transparent py-2 px-3 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                                                    Prep with AI
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {boardJobs.length === 0 && (
                                        <div className="text-center p-6 border-2 border-dashed border-[#e2ddd4] rounded-xl text-[#8b8278] text-sm font-bold">
                                            Drop jobs here
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
