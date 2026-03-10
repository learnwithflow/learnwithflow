'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ROADMAP_DATA, RELATED_ROADMAPS, ROLE_INTROS } from '../lib/roadmapData';
import Image from 'next/image';

const RM_KEY = 'lwf_rm_v3';

function loadProgress() {
    try { const s = JSON.parse(localStorage.getItem(RM_KEY) || '{}'); const out = {}; Object.keys(s).forEach(k => { out[k] = new Set(s[k]); }); return out; } catch (e) { return {}; }
}
function saveProgress(prog) {
    try { const t = {}; Object.keys(prog).forEach(k => { t[k] = [...prog[k]]; }); localStorage.setItem(RM_KEY, JSON.stringify(t)); } catch (e) { }
}

export default function Roadmap({ showPage, showToast }) {
    const [view, setView] = useState('listing');
    const [currentRmId, setCurrentRmId] = useState(null);
    const [progress, setProgress] = useState(() => {
        if (typeof window !== 'undefined') return loadProgress();
        return {};
    });
    const [chatMsgs, setChatMsgs] = useState([{ role: 'ai', text: "Hi! I'm your AI assistant 🚀 Ask me anything about this roadmap!" }]);
    const [chatInput, setChatInput] = useState('');
    const [aiThinking, setAiThinking] = useState(false);
    const chatRef = useRef(null);
    const treeRef = useRef(null);

    // New states
    const [introOpen, setIntroOpen] = useState(false);
    const [detailPanel, setDetailPanel] = useState(null); // { nodeId, label, status }
    const [detailContent, setDetailContent] = useState(null); // AI-generated content
    const [detailLoading, setDetailLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('roadmap'); // roadmap | projects
    const [projects, setProjects] = useState(null);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [chatMsgs]);

    const openDetail = (rmId) => {
        if (!progress[rmId]) { setProgress(prev => { const next = { ...prev, [rmId]: new Set() }; saveProgress(next); return next; }); }
        setCurrentRmId(rmId); setView('detail'); setActiveTab('roadmap'); setDetailPanel(null); setProjects(null); setIntroOpen(false);
        if (typeof window !== 'undefined') window.scrollTo(0, 0);
    };
    const closeDetail = () => { setView('listing'); setCurrentRmId(null); setDetailPanel(null); };

    const toggleNode = (e, nodeId) => {
        e.stopPropagation();
        setProgress(prev => {
            const next = { ...prev }; if (!next[currentRmId]) next[currentRmId] = new Set();
            const set = new Set(next[currentRmId]); if (set.has(nodeId)) set.delete(nodeId); else set.add(nodeId);
            next[currentRmId] = set; saveProgress(next); return next;
        });
    };

    const setNodeStatus = (nodeId, status) => {
        setProgress(prev => {
            const next = { ...prev }; if (!next[currentRmId]) next[currentRmId] = new Set();
            const set = new Set(next[currentRmId]);
            if (status === 'done') set.add(nodeId);
            else set.delete(nodeId);
            next[currentRmId] = set; saveProgress(next); return next;
        });
    };

    const askAI = async (text, hiddenSysText = '') => {
        if (!text.trim() && !hiddenSysText) return;
        const newMsgs = [...chatMsgs, { role: 'user', text }];
        if (text) setChatMsgs(newMsgs);
        setChatInput(''); setAiThinking(true);

        try {
            const apiMsgs = [
                { role: 'system', content: 'You are an AI learning assistant for a technical roadmap. Explain concepts clearly and concisely, like a friendly mentor. Do not use markdown headers, just paragraphs and lists.' },
                ...newMsgs.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }))
            ];
            if (hiddenSysText) apiMsgs.push({ role: 'user', content: hiddenSysText });

            const res = await fetch('/api/roadmap', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-secret': process.env.NEXT_PUBLIC_API_SECRET }, body: JSON.stringify({ messages: apiMsgs }) });
            if (!res.ok) throw new Error('API failed');
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let raw = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                raw += decoder.decode(value, { stream: true });
            }
            setChatMsgs(prev => [...prev, { role: 'ai', text: raw || 'Sorry, I encountered an error explaining that.' }]);
        } catch (e) {
            setChatMsgs(prev => [...prev, { role: 'ai', text: 'Network error. Please try again.' }]);
        }
        setAiThinking(false);
    };

    // Open topic detail panel with AI-generated resources
    const openTopicDetail = async (nodeId, label) => {
        setDetailPanel({ nodeId, label });
        setDetailLoading(true);
        setDetailContent(null);

        try {
            const rmTitle = data?.title || '';
            const apiMsgs = [
                { role: 'system', content: 'You are an expert technical educator. Give clear, practical learning guidance. NO markdown headers. Keep it concise.' },
                {
                    role: 'user', content: `Topic: "${label}" (part of the ${rmTitle} roadmap)

Give me:
1. DESCRIPTION: A 2-3 sentence clear description of what this topic is and why it matters.
2. FREE RESOURCES: List exactly 3 free learning resources with title and URL. Use real, popular resources (MDN, freeCodeCamp, YouTube channels like Traversy Media, etc). Format: "- [Title](URL) — Type"
3. TIPS: One practical tip for learning this topic.

Format your response exactly like:
DESCRIPTION: <text>
RESOURCES:
- [Title](URL) — Article/Video/Course
- [Title](URL) — Article/Video/Course
- [Title](URL) — Article/Video/Course
TIP: <text>` }
            ];

            const res = await fetch('/api/roadmap', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-secret': process.env.NEXT_PUBLIC_API_SECRET }, body: JSON.stringify({ messages: apiMsgs }) });
            if (!res.ok) throw new Error('API failed');
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let raw = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                raw += decoder.decode(value, { stream: true });
            }

            const descMatch = raw.match(/DESCRIPTION:\s*(.+?)(?=RESOURCES:|$)/s);
            const tipMatch = raw.match(/TIP:\s*(.+?)$/s);
            const resourcesMatch = raw.match(/RESOURCES:\s*([\s\S]+?)(?=TIP:|$)/);

            const resources = [];
            if (resourcesMatch) {
                const lines = resourcesMatch[1].split('\n').filter(l => l.trim().startsWith('-'));
                lines.forEach(l => {
                    const linkMatch = l.match(/\[(.+?)\]\((.+?)\)/);
                    const typeMatch = l.match(/—\s*(.+?)$/);
                    if (linkMatch) {
                        resources.push({ title: linkMatch[1], url: linkMatch[2], type: typeMatch ? typeMatch[1].trim() : 'Resource' });
                    }
                });
            }

            setDetailContent({
                description: descMatch ? descMatch[1].trim() : `Learn about ${label} — an important topic in your learning journey.`,
                resources: resources.length ? resources : [
                    { title: `Search: ${label}`, url: `https://www.google.com/search?q=${encodeURIComponent(label + ' tutorial')}`, type: 'Search' }
                ],
                tip: tipMatch ? tipMatch[1].trim() : 'Practice by building a small project using this concept.'
            });
        } catch (e) {
            setDetailContent({
                description: `Learn about ${label}.`,
                resources: [{ title: `Search: ${label}`, url: `https://www.google.com/search?q=${encodeURIComponent(label + ' tutorial')}`, type: 'Search' }],
                tip: 'Practice regularly to master this topic.'
            });
        }
        setDetailLoading(false);
    };

    // Generate project ideas via AI
    const loadProjects = async () => {
        if (projects) return; // Already loaded
        setProjectsLoading(true);

        try {
            const rmTitle = data?.title || '';
            const apiMsgs = [
                { role: 'system', content: 'You are a senior developer mentor. Suggest practical projects. NO markdown headers. Be concise.' },
                {
                    role: 'user', content: `Suggest exactly 5 beginner-to-intermediate projects for someone learning "${rmTitle}". For each project:
- Give a catchy project name
- One sentence description
- Difficulty: Beginner / Intermediate / Advanced
- Key skills practiced

Format each as:
PROJECT: <name>
DESC: <description>
LEVEL: <difficulty>
SKILLS: <comma-separated skills>
---` }
            ];

            const res = await fetch('/api/roadmap', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-secret': process.env.NEXT_PUBLIC_API_SECRET }, body: JSON.stringify({ messages: apiMsgs }) });
            if (!res.ok) throw new Error('API failed');
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let raw = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                raw += decoder.decode(value, { stream: true });
            }

            const projectBlocks = raw.split('---').filter(b => b.trim());
            const parsed = projectBlocks.map(block => {
                const name = block.match(/PROJECT:\s*(.+)/)?.[1]?.trim() || 'Project';
                const desc = block.match(/DESC:\s*(.+)/)?.[1]?.trim() || '';
                const level = block.match(/LEVEL:\s*(.+)/)?.[1]?.trim() || 'Beginner';
                const skills = block.match(/SKILLS:\s*(.+)/)?.[1]?.trim() || '';
                return { name, desc, level, skills };
            }).filter(p => p.name && p.desc);

            setProjects(parsed.length ? parsed : [{ name: 'Personal Portfolio', desc: 'Build a personal portfolio website showcasing your skills and projects.', level: 'Beginner', skills: 'HTML, CSS, JavaScript' }]);
        } catch (e) {
            setProjects([{ name: 'Personal Portfolio', desc: 'Build a portfolio to showcase your skills.', level: 'Beginner', skills: 'Core skills' }]);
        }
        setProjectsLoading(false);
    };

    // Download roadmap as image
    const downloadRoadmap = async () => {
        if (!treeRef.current || downloading) return;
        setDownloading(true);
        try {
            // Use canvas-based approach
            const el = treeRef.current;
            const canvas = document.createElement('canvas');
            const scale = 2;
            canvas.width = el.scrollWidth * scale;
            canvas.height = el.scrollHeight * scale;
            const ctx = canvas.getContext('2d');
            ctx.scale(scale, scale);
            ctx.fillStyle = '#fdfdfd';
            ctx.fillRect(0, 0, el.scrollWidth, el.scrollHeight);

            // Draw title
            ctx.fillStyle = '#111';
            ctx.font = 'bold 28px Syne, sans-serif';
            ctx.fillText(data?.title || 'Roadmap', 40, 50);
            ctx.font = '14px DM Sans, sans-serif';
            ctx.fillStyle = '#777';
            ctx.fillText(data?.sub || '', 40, 75);
            ctx.fillText(`Progress: ${pct}% — ${done}/${total} topics completed`, 40, 100);

            // Draw nodes
            let y = 140;
            data?.nodes?.forEach(n => {
                if (n.section) {
                    ctx.fillStyle = '#111';
                    ctx.font = 'bold 16px DM Sans, sans-serif';
                    ctx.fillText(n.section, 40, y);
                    y += 30;
                }
                if (n.row) {
                    let x = 40;
                    n.row.forEach(nd => {
                        const isDone = rmProg?.has(nd.id);
                        ctx.fillStyle = isDone ? '#d4f5e9' : nd.type === 'req' ? '#fff3cd' : '#e8f4f8';
                        ctx.strokeStyle = isDone ? '#06d6a0' : nd.type === 'req' ? '#f0c040' : '#90cdf4';
                        ctx.lineWidth = 1.5;
                        const w = 180, h = 36;
                        ctx.beginPath();
                        ctx.roundRect(x, y - 24, w, h, 8);
                        ctx.fill();
                        ctx.stroke();
                        ctx.fillStyle = '#333';
                        ctx.font = '12px DM Sans, sans-serif';
                        ctx.fillText((isDone ? '✓ ' : '') + nd.label, x + 10, y - 4);
                        x += w + 15;
                    });
                    y += 50;
                }
            });

            // Watermark
            ctx.fillStyle = '#ccc';
            ctx.font = '12px DM Sans, sans-serif';
            ctx.fillText('learnwithflow.online', 40, y + 20);

            canvas.toBlob(blob => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${data?.title?.replace(/\s+/g, '_') || 'roadmap'}.png`;
                    a.click();
                    URL.revokeObjectURL(url);
                }
            });
            showToast?.('📥 Roadmap downloaded!');
        } catch (e) {
            showToast?.('Download failed — try a screenshot instead');
        }
        setDownloading(false);
    };

    const data = currentRmId ? ROADMAP_DATA[currentRmId] : null;
    const rmProg = currentRmId ? progress[currentRmId] : null;
    const total = data ? data.nodes.reduce((c, n) => c + (n.row ? n.row.length : 0), 0) : 0;
    const done = rmProg ? rmProg.size : 0;
    const pct = total > 0 ? Math.round(done / total * 100) : 0;

    const ALL_RMS = Object.entries(ROADMAP_DATA).map(([id, d]) => ({ id, title: d.title }));
    const INDIA = ['eamcet', 'it', 'diploma', 'neet', 'appsc'];
    const indiaRms = ALL_RMS.filter(r => INDIA.includes(r.id));
    const otherRms = ALL_RMS.filter(r => !INDIA.includes(r.id));

    const relatedIds = currentRmId ? (RELATED_ROADMAPS[currentRmId] || []).filter(id => ROADMAP_DATA[id]) : [];
    const roleIntro = currentRmId ? ROLE_INTROS[currentRmId] : '';

    return (
        <div style={{ minHeight: '100vh', background: '#fdfdfd' }}>
            {view === 'listing' && (
                <div className="rm-listing-page" style={{ paddingTop: 80, paddingBottom: 60, maxWidth: 1000, margin: '0 auto', px: 20 }}>
                    <div className="rm-listing-inner">
                        <div className="rm-listing-hero" style={{ textAlign: 'center', marginBottom: 50 }}>
                            <h1 style={{ fontSize: 48, fontFamily: "'Instrument Serif', serif", letterSpacing: -1, marginBottom: 10 }}>Developer Roadmaps</h1>
                            <p style={{ color: 'var(--muted)' }}>Community created step-by-step guides and paths to learn new skills.</p>
                        </div>
                        <div className="rm-section-divider"><span>Role & Skill Roadmaps</span></div>
                        <div className="rm-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 50 }}>
                            {otherRms.map(r => {
                                const p = progress[r.id];
                                const t = ROADMAP_DATA[r.id]?.nodes?.reduce((c, n) => c + (n.row ? n.row.length : 0), 0) || 0;
                                const d = p ? p.size : 0;
                                const pc = t > 0 ? Math.round(d / t * 100) : 0;
                                return (
                                    <div key={r.id} className="rm-card-sh" onClick={() => openDetail(r.id)} style={{ position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>{r.title}</span>
                                            {pc > 0 && <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: '#06d6a0', fontWeight: 700 }}>{pc}%</span>}
                                        </div>
                                        {pc > 0 && <div style={{ position: 'absolute', bottom: 0, left: 0, width: `${pc}%`, height: 3, background: 'linear-gradient(90deg, #06d6a0, #2563a8)', borderRadius: 2, transition: 'width 0.5s ease' }} />}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="rm-section-divider"><span>Indian Career Paths</span></div>
                        <div className="rm-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                            {indiaRms.map(r => {
                                const p = progress[r.id];
                                const t = ROADMAP_DATA[r.id]?.nodes?.reduce((c, n) => c + (n.row ? n.row.length : 0), 0) || 0;
                                const d = p ? p.size : 0;
                                const pc = t > 0 ? Math.round(d / t * 100) : 0;
                                return (
                                    <div key={r.id} className="rm-card-sh" onClick={() => openDetail(r.id)} style={{ position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>{r.title}</span>
                                            {pc > 0 && <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: '#06d6a0', fontWeight: 700 }}>{pc}%</span>}
                                        </div>
                                        {pc > 0 && <div style={{ position: 'absolute', bottom: 0, left: 0, width: `${pc}%`, height: 3, background: 'linear-gradient(90deg, #06d6a0, #2563a8)', borderRadius: 2, transition: 'width 0.5s ease' }} />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {view === 'detail' && data && (
                <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px 80px' }}>
                    {/* Main Roadmap Area (Left) */}
                    <div>
                        <div className="rm-hdr">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                                <button className="rm-back-badge" onClick={closeDetail}>← All Roadmaps</button>
                                <button onClick={downloadRoadmap} disabled={downloading} style={{ background: '#111', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontFamily: "'DM Mono', monospace", cursor: 'pointer', fontWeight: 600, opacity: downloading ? 0.6 : 1 }}>
                                    {downloading ? '⏳ Saving...' : '↓ Download'}
                                </button>
                            </div>
                            <h1 className="rm-title-sh">{data.title}</h1>
                            <p className="rm-sub-sh">{data.sub}</p>

                            {/* Progress Bar */}
                            <div style={{ margin: '12px 0 16px', background: '#f0f0f0', borderRadius: 10, height: 8, overflow: 'hidden', position: 'relative' }}>
                                <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #06d6a0, #2563a8)', borderRadius: 10, transition: 'width 0.5s ease' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", fontWeight: 700, color: pct > 0 ? '#06d6a0' : '#999', background: pct > 0 ? 'rgba(6,214,160,0.1)' : '#f5f5f5', padding: '3px 10px', borderRadius: 6 }}>{pct}% DONE</span>
                                <span style={{ fontSize: 12, color: '#999', fontFamily: "'DM Mono', monospace" }}>{done}/{total} topics</span>
                            </div>

                            {/* Tabs: Roadmap | Projects */}
                            <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #eee', marginBottom: 16 }}>
                                {[['roadmap', '📋 Roadmap'], ['projects', '🛠️ Projects']].map(([id, lbl]) => (
                                    <button key={id} onClick={() => { setActiveTab(id); if (id === 'projects') loadProjects(); }} style={{
                                        padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer',
                                        fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: activeTab === id ? 700 : 400,
                                        color: activeTab === id ? '#111' : '#999',
                                        borderBottom: activeTab === id ? '2px solid #111' : '2px solid transparent',
                                        marginBottom: -2
                                    }}>{lbl}</button>
                                ))}
                            </div>

                            {/* "What is [Role]?" Intro */}
                            {roleIntro && (
                                <div style={{ marginBottom: 16 }}>
                                    <button onClick={() => setIntroOpen(!introOpen)} style={{
                                        width: '100%', textAlign: 'left', padding: '12px 16px', background: '#fafafa', border: '1px solid #eee',
                                        borderRadius: 10, cursor: 'pointer', fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#333',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                        <span>ℹ️ What is a {data.title}?</span>
                                        <span style={{ transform: introOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                                    </button>
                                    {introOpen && (
                                        <div style={{ padding: '14px 16px', background: '#fafafa', borderRadius: '0 0 10px 10px', border: '1px solid #eee', borderTop: 'none', fontSize: 14, lineHeight: 1.7, color: '#555' }}>
                                            {roleIntro}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Legend */}
                            <div className="rm-legend">
                                <div className="rm-legend-item"><div className="rm-legend-box req" /> Required</div>
                                <div className="rm-legend-item"><div className="rm-legend-box opt" /> Optional</div>
                                <div className="rm-legend-item"><div className="rm-legend-box done" /> Done</div>
                            </div>
                        </div>

                        {/* Roadmap Tab */}
                        {activeTab === 'roadmap' && (
                            <div className="rm-tree-container" ref={treeRef}>
                                <div className="rm-center-line"></div>
                                {data.nodes.map((n, i) => {
                                    if (n.section) return <div key={i} className="rm-section-sh">{n.section}</div>;
                                    if (n.arrow) return <div key={i} className="rmf-arrow-sh" />;
                                    if (n.row) return (
                                        <div key={i} className="rmf-row-sh">
                                            {n.row.map(nd => {
                                                const isDone = rmProg?.has(nd.id);
                                                return (
                                                    <div key={nd.id} className={`rmf-node-sh ${nd.type} ${isDone ? 'done' : ''}`} onClick={() => openTopicDetail(nd.id, nd.label)}>
                                                        <div className="rmf-node-text">{nd.label}</div>
                                                        <div className={`rmf-node-check ${isDone ? 'checked' : ''}`} onClick={(e) => toggleNode(e, nd.id)}>
                                                            {isDone && '✓'}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    );
                                    return null;
                                })}
                            </div>
                        )}

                        {/* Projects Tab */}
                        {activeTab === 'projects' && (
                            <div style={{ padding: '20px 0' }}>
                                {projectsLoading && (
                                    <div style={{ textAlign: 'center', padding: 40 }}>
                                        <div style={{ width: 32, height: 32, border: '3px solid #eee', borderTopColor: '#06d6a0', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                                        <p style={{ color: '#999', fontSize: 13, marginTop: 12, fontFamily: "'DM Mono', monospace" }}>Generating project ideas...</p>
                                    </div>
                                )}
                                {projects && projects.map((p, i) => (
                                    <div key={i} style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: 12, padding: '18px 20px', marginBottom: 14 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                                            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", color: '#111' }}>🛠️ {p.name}</h3>
                                            <span style={{
                                                fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 600, padding: '3px 10px', borderRadius: 20, flexShrink: 0,
                                                background: p.level?.includes('Beginner') ? '#d4f5e9' : p.level?.includes('Intermediate') ? '#fff3cd' : '#fde2e2',
                                                color: p.level?.includes('Beginner') ? '#06976b' : p.level?.includes('Intermediate') ? '#b08800' : '#c53030'
                                            }}>{p.level}</span>
                                        </div>
                                        <p style={{ margin: '6px 0 8px', fontSize: 14, color: '#555', lineHeight: 1.5 }}>{p.desc}</p>
                                        {p.skills && <p style={{ margin: 0, fontSize: 12, color: '#06d6a0', fontFamily: "'DM Mono', monospace" }}>Skills: {p.skills}</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Topic Detail Popup (Replacing Sidebar) */}
                    {detailPanel && (
                        <div className="rm-popup-overlay" onClick={() => { setDetailPanel(null); setChatInput(''); }}>
                            <div className="rm-popup-content" onClick={e => e.stopPropagation()}>
                                <div className="rm-popup-header">
                                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", color: '#111' }}>{detailPanel.label}</h3>
                                    <button onClick={() => { setDetailPanel(null); setChatInput(''); }} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#999', padding: 0, lineHeight: 1 }}>×</button>
                                </div>
                                <div className="rm-popup-body">
                                    {/* Status selector */}
                                    <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                                        {['pending', 'done', 'skip'].map(s => {
                                            const isDone = rmProg?.has(detailPanel.nodeId);
                                            const isActive = (s === 'done' && isDone) || (s === 'pending' && !isDone);
                                            return (
                                                <button key={s} onClick={() => setNodeStatus(detailPanel.nodeId, s)} style={{
                                                    padding: '6px 14px', borderRadius: 8, border: '1px solid #eee', fontSize: 12, cursor: 'pointer',
                                                    fontFamily: "'DM Mono', monospace", fontWeight: 600, textTransform: 'capitalize',
                                                    background: isActive ? (s === 'done' ? '#d4f5e9' : s === 'skip' ? '#fde2e2' : '#f5f5f5') : '#fff',
                                                    color: isActive ? (s === 'done' ? '#06976b' : s === 'skip' ? '#c53030' : '#333') : '#999'
                                                }}>{s === 'done' ? '✓ Done' : s === 'skip' ? '⏭ Skip' : '● Pending'}</button>
                                            );
                                        })}
                                    </div>

                                    {detailLoading && (
                                        <div style={{ textAlign: 'center', padding: 30 }}>
                                            <div style={{ width: 28, height: 28, border: '3px solid #eee', borderTopColor: '#06d6a0', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                                            <p style={{ color: '#999', fontSize: 13, marginTop: 12 }}>Loading resources...</p>
                                        </div>
                                    )}

                                    {detailContent && (
                                        <>
                                            <p style={{ fontSize: 14, color: '#333', lineHeight: 1.6, margin: '0 0 16px' }}>{detailContent.description}</p>

                                            <div style={{ marginBottom: 16 }}>
                                                <p style={{ fontSize: 12, color: '#06d6a0', fontWeight: 700, fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>💚 Free Resources</p>
                                                {detailContent.resources.map((r, i) => (
                                                    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{
                                                        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#fafafa', borderRadius: 10,
                                                        marginBottom: 6, textDecoration: 'none', fontSize: 14, color: '#111', border: '1px solid #eee',
                                                        transition: 'background 0.15s'
                                                    }}>
                                                        <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: '#888', background: '#f0f0f0', padding: '3px 8px', borderRadius: 6 }}>{r.type}</span>
                                                        <span style={{ fontWeight: 500 }}>{r.title}</span>
                                                    </a>
                                                ))}
                                            </div>

                                            {detailContent.tip && (
                                                <div style={{ background: 'rgba(6,214,160,0.06)', border: '1px solid rgba(6,214,160,0.15)', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#333', lineHeight: 1.5 }}>
                                                    💡 <strong>Tip:</strong> {detailContent.tip}
                                                </div>
                                            )}

                                            {/* AI Chat Toggle Button */}
                                            <button
                                                className="rm-popup-ai-toggle"
                                                onClick={() => setIntroOpen(!introOpen)} // Reusing introOpen state for chat toggle
                                            >
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <span style={{ display: 'flex', width: 20, height: 20, position: 'relative' }}>
                                                        <Image src="/logo-icon.jpg" alt="AI Learn" fill style={{ borderRadius: '50%', objectFit: 'cover' }} />
                                                    </span>
                                                    Ask AI About "{detailPanel.label}"
                                                </span>
                                                <span style={{ transform: introOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: '#888' }}>▼</span>
                                            </button>

                                            {/* Mini AI Chat */}
                                            {introOpen && (
                                                <div className="rm-mini-chat-container">
                                                    <div className="rm-ai-chat" ref={chatRef} style={{ flex: 1, padding: '12px', border: 'none', background: 'transparent' }}>
                                                        {chatMsgs.map((m, i) => (
                                                            <div key={i} className={`rm-ai-msg ${m.role}`}>
                                                                <div className="rm-ai-ava" style={{ ...(m.role === 'ai' ? { padding: 0, border: 'none', background: 'transparent' } : {}), width: 24, height: 24, position: 'relative' }}>
                                                                    {m.role === 'ai' ? <Image src="/logo-icon.jpg" alt="AI" fill style={{ borderRadius: '50%', objectFit: 'cover' }} /> : 'U'}
                                                                </div>
                                                                <div className="rm-ai-bub">{m.text}</div>
                                                            </div>
                                                        ))}
                                                        {aiThinking && (
                                                            <div className="rm-ai-msg ai">
                                                                <div className="rm-ai-ava" style={{ padding: 0, border: 'none', background: 'transparent', width: 24, height: 24, position: 'relative' }}>
                                                                    <Image src="/logo-icon.jpg" alt="AI" fill style={{ borderRadius: '50%', objectFit: 'cover' }} />
                                                                </div>
                                                                <div className="rm-ai-bub" style={{ fontStyle: 'italic', opacity: 0.7 }}>Thinking...</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="rm-ai-input" style={{ borderTop: '1px solid #eee', padding: '10px', background: '#fafafa' }}>
                                                        <input
                                                            type="text"
                                                            placeholder="Ask a question..."
                                                            value={chatInput}
                                                            onChange={e => setChatInput(e.target.value)}
                                                            onKeyDown={e => e.key === 'Enter' && askAI(chatInput)}
                                                            style={{ border: '1px solid #ddd', background: '#fff' }}
                                                        />
                                                        <button onClick={() => askAI(chatInput)}>↗</button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Spin animation for loaders */}
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
