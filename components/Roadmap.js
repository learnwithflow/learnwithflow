import { useState, useEffect, useRef } from 'react';
import { ROADMAP_DATA } from '../lib/roadmapData';

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
    const [progress, setProgress] = useState({});
    const [chatMsgs, setChatMsgs] = useState([{ role: 'ai', text: "Hi! I'm your AI learning assistant 🚀\nI'm here to guide you through your learning journey on this roadmap. I can help you understand concepts, track your progress, and provide personalized learning advice." }]);
    const [chatInput, setChatInput] = useState('');
    const [aiThinking, setAiThinking] = useState(false);
    const chatRef = useRef(null);

    useEffect(() => { setProgress(loadProgress()); }, []);
    useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [chatMsgs]);

    const openDetail = (rmId) => {
        if (!progress[rmId]) { setProgress(prev => { const next = { ...prev, [rmId]: new Set() }; saveProgress(next); return next; }); }
        setCurrentRmId(rmId); setView('detail');
        if (typeof window !== 'undefined') window.scrollTo(0, 0);
    };
    const closeDetail = () => { setView('listing'); setCurrentRmId(null); };

    const toggleNode = (e, nodeId) => {
        e.stopPropagation(); // prevent asking AI
        setProgress(prev => {
            const next = { ...prev }; if (!next[currentRmId]) next[currentRmId] = new Set();
            const set = new Set(next[currentRmId]); if (set.has(nodeId)) set.delete(nodeId); else set.add(nodeId);
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

            const res = await fetch('/api/roadmap', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: apiMsgs }) });
            const json = await res.json();
            setChatMsgs(prev => [...prev, { role: 'ai', text: json.content || 'Sorry, I encountered an error explaining that.' }]);
        } catch (e) {
            setChatMsgs(prev => [...prev, { role: 'ai', text: 'Network error. Please try again.' }]);
        }
        setAiThinking(false);
    };

    const handleNodeClick = (label) => {
        const text = `Can you explain ${label}?`;
        const sysContext = `Please act as an AI Tutor. The user clicked on the roadmap topic "${label}". Explain what it is, why it's important, and how to learn it in less than 150 words.`;
        askAI(text, sysContext);
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
                            {otherRms.map(r => <div key={r.id} className="rm-card-sh" onClick={() => openDetail(r.id)}>{r.title}</div>)}
                        </div>
                        <div className="rm-section-divider"><span>Indian Career Paths</span></div>
                        <div className="rm-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                            {indiaRms.map(r => <div key={r.id} className="rm-card-sh" onClick={() => openDetail(r.id)}>{r.title}</div>)}
                        </div>
                    </div>
                </div>
            )}

            {view === 'detail' && data && (
                <div className="rm-split-layout">
                    {/* Main Roadmap Area (Left) */}
                    <div className="rm-main-area">
                        <div className="rm-hdr">
                            <button className="rm-back-badge" onClick={closeDetail}>← All Roadmaps</button>
                            <h1 className="rm-title-sh">{data.title}</h1>
                            <p className="rm-sub-sh">{data.sub}</p>

                            {/* Legend & Meta */}
                            <div className="rm-legend">
                                <div className="rm-legend-item"><div className="rm-legend-box req" /> Required</div>
                                <div className="rm-legend-item"><div className="rm-legend-box opt" /> Optional</div>
                                <div className="rm-legend-item"><div className="rm-legend-box done" /> Done</div>
                            </div>
                        </div>

                        <div className="rm-tree-container">
                            <div className="rm-center-line"></div>
                            {data.nodes.map((n, i) => {
                                if (n.section) return <div key={i} className="rm-section-sh">{n.section}</div>;
                                if (n.arrow) return <div key={i} className="rmf-arrow-sh" />;
                                if (n.row) return (
                                    <div key={i} className="rmf-row-sh">
                                        {n.row.map(nd => {
                                            const isDone = rmProg?.has(nd.id);
                                            return (
                                                <div key={nd.id} className={`rmf-node-sh ${nd.type} ${isDone ? 'done' : ''}`} onClick={() => handleNodeClick(nd.label)}>
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
                    </div>

                    {/* AI Chat Sidebar (Right) */}
                    <div className="rm-ai-sidebar">
                        <div className="rm-ai-hdr">
                            <span style={{ marginRight: 8, display: 'flex', alignItems: 'center' }}>
                                <img src="/logo-icon.jpg" alt="AI Learn" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }} />
                            </span>
                            <span style={{ fontWeight: 700, fontSize: 14 }}>AI Learn</span>
                        </div>
                        <div className="rm-ai-chat" ref={chatRef}>
                            {chatMsgs.map((m, i) => (
                                <div key={i} className={`rm-ai-msg ${m.role}`}>
                                    <div className="rm-ai-ava" style={m.role === 'ai' ? { padding: 0, border: 'none', background: 'transparent' } : {}}>
                                        {m.role === 'ai' ? <img src="/logo-icon.jpg" alt="AI" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} /> : 'U'}
                                    </div>
                                    <div className="rm-ai-bub">{m.text}</div>
                                </div>
                            ))}
                            {aiThinking && (
                                <div className="rm-ai-msg ai">
                                    <div className="rm-ai-ava" style={{ padding: 0, border: 'none', background: 'transparent' }}>
                                        <img src="/logo-icon.jpg" alt="AI" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                                    </div>
                                    <div className="rm-ai-bub" style={{ fontStyle: 'italic', opacity: 0.7 }}>Thinking...</div>
                                </div>
                            )}
                        </div>
                        <div className="rm-ai-input">
                            <input
                                type="text"
                                placeholder="Ask AI anything about the roadmap..."
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && askAI(chatInput)}
                            />
                            <button onClick={() => askAI(chatInput)}>↗</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
