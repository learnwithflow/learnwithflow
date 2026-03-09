'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase, getAnonId } from '../lib/supabase';

export default function Dashboard({ showPage, userName }) {
    const [stats, setStats] = useState({ todayExams: 0, todayAvg: 0, totalExams: 0, totalQs: 0, bestScore: 0 });
    const [weekData, setWeekData] = useState([]);
    const [subjectStats, setSubjectStats] = useState([]);
    const [recentExams, setRecentExams] = useState([]);
    const [scoreHistory, setScoreHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const chartRef = useRef(null);
    const chartInst = useRef(null);

    const loadData = useCallback(async () => {
        const uid = getAnonId();
        if (!uid) { setLoading(false); return; }

        try {
            // All results for this user
            const { data: all } = await supabase
                .from('exam_results')
                .select('*')
                .eq('user_id', uid)
                .order('created_at', { ascending: false });

            if (!all || all.length === 0) { setLoading(false); return; }

            // Today's stats
            const today = new Date().toISOString().split('T')[0];
            const todayResults = all.filter(r => r.created_at?.startsWith(today));
            const todayAvg = todayResults.length > 0
                ? Math.round(todayResults.reduce((a, r) => a + r.percentage, 0) / todayResults.length)
                : 0;

            // Best score
            const best = Math.max(...all.map(r => r.percentage));

            setStats({
                todayExams: todayResults.length,
                todayAvg,
                totalExams: all.length,
                totalQs: all.reduce((a, r) => a + r.total, 0),
                bestScore: best,
            });

            // Recent exams (last 10)
            setRecentExams(all.slice(0, 10));

            // Score history (last 15 chronological)
            setScoreHistory([...all].reverse().slice(-15));

            // Weekly subject breakdown
            const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
            const weekResults = all.filter(r => r.created_at >= weekAgo);
            setWeekData(weekResults);

            // Subject stats
            const subjMap = {};
            weekResults.forEach(r => {
                const subj = r.subject || r.exam_type || 'General';
                if (!subjMap[subj]) subjMap[subj] = { name: subj, total: 0, correct: 0, count: 0 };
                subjMap[subj].total += r.total;
                subjMap[subj].correct += r.score;
                subjMap[subj].count++;
            });
            const sorted = Object.values(subjMap).sort((a, b) => b.count - a.count);
            setSubjectStats(sorted);

        } catch (e) { console.error(e); }
        setLoading(false);
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    // Chart
    useEffect(() => {
        if (!chartRef.current || scoreHistory.length === 0 || typeof window === 'undefined') return;
        const loadChart = async () => {
            if (typeof Chart === 'undefined') {
                const s = document.createElement('script');
                s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js';
                s.onload = () => buildChart();
                document.head.appendChild(s);
            } else buildChart();
        };
        loadChart();
    }, [scoreHistory]);

    function buildChart() {
        if (!chartRef.current || typeof Chart === 'undefined') return;
        if (chartInst.current) chartInst.current.destroy();
        chartInst.current = new Chart(chartRef.current, {
            type: 'line',
            data: {
                labels: scoreHistory.map((_, i) => `#${i + 1}`),
                datasets: [{
                    data: scoreHistory.map(h => h.percentage),
                    borderColor: '#2563a8',
                    backgroundColor: 'rgba(37,99,168,0.06)',
                    tension: 0.4, fill: true, pointRadius: 4, borderWidth: 2,
                    pointBackgroundColor: scoreHistory.map(h => h.percentage >= 70 ? '#06b6a0' : h.percentage >= 40 ? '#f59e0b' : '#ef4444'),
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `${ctx.parsed.y}%` } } },
                scales: {
                    y: { min: 0, max: 100, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 }, color: '#9e978e' } },
                    x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#9e978e' } }
                }
            }
        });
    }

    const hour = new Date().getHours();
    const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const displayName = userName || 'Student';

    // Get day-wise breakdown for the week
    function getWeekDays() {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(Date.now() - i * 86400000);
            const key = d.toISOString().split('T')[0];
            const dayExams = weekData.filter(r => r.created_at?.startsWith(key));
            days.push({
                label: d.toLocaleDateString('en', { weekday: 'short' }),
                date: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
                count: dayExams.length,
                avg: dayExams.length > 0 ? Math.round(dayExams.reduce((a, r) => a + r.percentage, 0) / dayExams.length) : 0,
            });
        }
        return days;
    }

    const subjectColors = ['#2563a8', '#06b6a0', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#6366f1'];

    return (
        <div style={S.wrap}>
            {/* Header */}
            <div style={S.header}>
                <div>
                    <h2 style={S.greet}>{greet}, {displayName} 👋</h2>
                    <p style={S.subtext}>Here&apos;s your learning progress</p>
                </div>
            </div>

            {/* Tab Switcher */}
            <div style={S.tabs}>
                {['overview', 'subjects', 'history'].map(tab => (
                    <button
                        key={tab}
                        style={{ ...S.tab, ...(activeTab === tab ? S.tabActive : {}) }}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === 'overview' ? '📊 Overview' : tab === 'subjects' ? '📚 Subjects' : '📈 History'}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={S.emptyState}>
                    <div style={S.spinner} />
                    <p style={S.emptyText}>Loading your stats...</p>
                </div>
            ) : stats.totalExams === 0 ? (
                <div style={S.emptyState}>
                    <div style={{ fontSize: 56, marginBottom: 16 }}>🎯</div>
                    <h3 style={S.emptyTitle}>No exams yet</h3>
                    <p style={S.emptyText}>Take your first mock exam to see your dashboard come alive!</p>
                    <button style={S.ctaBtn} onClick={() => showPage('exam')}>Start Mock Exam →</button>
                </div>
            ) : (
                <>
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <>
                            {/* Stat Cards */}
                            <div style={S.statsGrid}>
                                <div style={S.statCard}>
                                    <div style={S.statIcon}>📝</div>
                                    <div style={S.statVal}>{stats.todayExams}</div>
                                    <div style={S.statLabel}>Today&apos;s Exams</div>
                                </div>
                                <div style={S.statCard}>
                                    <div style={S.statIcon}>🎯</div>
                                    <div style={S.statVal}>{stats.todayAvg}%</div>
                                    <div style={S.statLabel}>Today&apos;s Avg</div>
                                </div>
                                <div style={S.statCard}>
                                    <div style={S.statIcon}>📊</div>
                                    <div style={S.statVal}>{stats.totalExams}</div>
                                    <div style={S.statLabel}>Total Exams</div>
                                </div>
                                <div style={S.statCard}>
                                    <div style={S.statIcon}>🏆</div>
                                    <div style={S.statVal}>{stats.bestScore}%</div>
                                    <div style={S.statLabel}>Best Score</div>
                                </div>
                            </div>

                            {/* Score Trend Chart */}
                            <div style={S.card}>
                                <h3 style={S.cardTitle}>Score Trend</h3>
                                <div style={{ height: 200 }}>
                                    <canvas ref={chartRef} />
                                </div>
                            </div>

                            {/* Week Activity */}
                            <div style={S.card}>
                                <h3 style={S.cardTitle}>This Week</h3>
                                <div style={S.weekGrid}>
                                    {getWeekDays().map((d, i) => (
                                        <div key={i} style={S.weekDay}>
                                            <div style={S.weekLabel}>{d.label}</div>
                                            <div style={{ ...S.weekBar, height: Math.max(4, d.count * 20), background: d.count > 0 ? 'linear-gradient(180deg, #2563a8, #06b6a0)' : '#e8e4dc' }} />
                                            <div style={S.weekCount}>{d.count}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* SUBJECTS TAB */}
                    {activeTab === 'subjects' && (
                        <div style={S.card}>
                            <h3 style={S.cardTitle}>Subject Performance (This Week)</h3>
                            {subjectStats.length === 0 ? (
                                <p style={S.emptyText}>No exam data this week. Take some exams!</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {subjectStats.map((s, i) => {
                                        const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                                        const color = subjectColors[i % subjectColors.length];
                                        return (
                                            <div key={s.name} style={S.subjRow}>
                                                <div style={S.subjInfo}>
                                                    <div style={{ ...S.subjDot, background: color }} />
                                                    <div>
                                                        <div style={S.subjName}>{s.name}</div>
                                                        <div style={S.subjMeta}>{s.count} exam{s.count > 1 ? 's' : ''} · {s.correct}/{s.total} correct</div>
                                                    </div>
                                                </div>
                                                <div style={S.subjRight}>
                                                    <div style={S.barBg}>
                                                        <div style={{ ...S.barFill, width: `${pct}%`, background: color }} />
                                                    </div>
                                                    <div style={{ ...S.subjPct, color }}>{pct}%</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* HISTORY TAB */}
                    {activeTab === 'history' && (
                        <div style={S.card}>
                            <h3 style={S.cardTitle}>Recent Exams</h3>
                            {recentExams.length === 0 ? (
                                <p style={S.emptyText}>No exams taken yet.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {recentExams.map((r, i) => {
                                        const pColor = r.percentage >= 70 ? '#06b6a0' : r.percentage >= 40 ? '#f59e0b' : '#ef4444';
                                        const dt = new Date(r.created_at);
                                        return (
                                            <div key={i} style={S.histRow}>
                                                <div style={{ ...S.histBadge, background: `${pColor}14`, color: pColor }}>{r.percentage}%</div>
                                                <div style={S.histInfo}>
                                                    <div style={S.histTitle}>{r.subject || r.exam_type}</div>
                                                    <div style={S.histMeta}>
                                                        {r.score}/{r.total} · {r.exam_mode || r.exam_type} · {dt.toLocaleDateString('en', { month: 'short', day: 'numeric' })} {dt.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div style={S.actions}>
                        <button style={S.actionBtn} onClick={() => showPage('exam')}>
                            <span>📝</span> Take Exam
                        </button>
                        <button style={{ ...S.actionBtn, background: 'linear-gradient(135deg, #8b5cf610, #8b5cf605)' }} onClick={() => showPage('roadmap')}>
                            <span>🗺️</span> Roadmaps
                        </button>
                        <button style={{ ...S.actionBtn, background: 'linear-gradient(135deg, #06b6a010, #06b6a005)' }} onClick={() => showPage('interview')}>
                            <span>🎤</span> Interview
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

const S = {
    wrap: {
        maxWidth: 760, margin: '0 auto', padding: '24px 20px 60px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
    header: {
        marginBottom: 24,
    },
    greet: {
        fontSize: 26, fontWeight: 700, color: '#1c1814', margin: '0 0 4px',
        letterSpacing: '-0.3px',
    },
    subtext: {
        fontSize: 14, color: '#8b8278', margin: 0,
    },

    // Tabs
    tabs: {
        display: 'flex', gap: 6, marginBottom: 24,
        background: '#f0ede6', borderRadius: 14, padding: 4,
    },
    tab: {
        flex: 1, padding: '10px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        border: 'none', borderRadius: 11, background: 'transparent',
        color: '#8b8278', transition: 'all 0.2s',
    },
    tabActive: {
        background: '#fff', color: '#1c1814',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },

    // Stats Grid
    statsGrid: {
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20,
    },
    statCard: {
        background: '#fff', borderRadius: 18, padding: '20px 16px',
        border: '1px solid rgba(0,0,0,0.04)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
    },
    statIcon: { fontSize: 22, marginBottom: 8 },
    statVal: {
        fontSize: 28, fontWeight: 700, color: '#1c1814',
        letterSpacing: '-0.5px', lineHeight: 1,
    },
    statLabel: {
        fontSize: 12, color: '#9e978e', marginTop: 4, fontWeight: 500,
    },

    // Card
    card: {
        background: '#fff', borderRadius: 18, padding: '22px 20px',
        border: '1px solid rgba(0,0,0,0.04)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 15, fontWeight: 700, color: '#1c1814', margin: '0 0 16px',
        letterSpacing: '-0.2px',
    },

    // Week activity
    weekGrid: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 8,
        height: 100, paddingTop: 10,
    },
    weekDay: {
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    },
    weekLabel: { fontSize: 11, color: '#9e978e', fontWeight: 500 },
    weekBar: {
        width: '100%', maxWidth: 32, borderRadius: 8, transition: 'height 0.5s ease',
        minHeight: 4,
    },
    weekCount: { fontSize: 12, fontWeight: 700, color: '#3d3830' },

    // Subject row
    subjRow: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
    },
    subjInfo: {
        display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto',
        minWidth: 0,
    },
    subjDot: {
        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
    },
    subjName: {
        fontSize: 14, fontWeight: 600, color: '#1c1814',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180,
    },
    subjMeta: { fontSize: 11, color: '#9e978e' },
    subjRight: {
        display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 160px',
    },
    barBg: {
        flex: 1, height: 6, borderRadius: 3, background: '#f0ede6', overflow: 'hidden',
    },
    barFill: {
        height: '100%', borderRadius: 3, transition: 'width 0.6s ease',
    },
    subjPct: {
        fontSize: 14, fontWeight: 700, minWidth: 40, textAlign: 'right',
    },

    // History
    histRow: {
        display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px',
        borderRadius: 14, background: '#faf9f7', border: '1px solid rgba(0,0,0,0.03)',
    },
    histBadge: {
        fontSize: 15, fontWeight: 700, padding: '6px 12px', borderRadius: 10,
        minWidth: 48, textAlign: 'center',
    },
    histInfo: { flex: 1, minWidth: 0 },
    histTitle: {
        fontSize: 14, fontWeight: 600, color: '#1c1814',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    },
    histMeta: { fontSize: 11, color: '#9e978e', marginTop: 2 },

    // Actions
    actions: {
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 8,
    },
    actionBtn: {
        padding: '16px 10px', borderRadius: 16, border: '1px solid rgba(0,0,0,0.04)',
        background: 'linear-gradient(135deg, #2563a810, #2563a805)',
        cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#3d3830',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        transition: 'all 0.2s',
    },

    // Empty / Loading
    emptyState: {
        textAlign: 'center', padding: '60px 20px',
    },
    emptyTitle: {
        fontSize: 20, fontWeight: 700, color: '#1c1814', margin: '0 0 8px',
    },
    emptyText: {
        fontSize: 14, color: '#9e978e', margin: '0 0 24px',
    },
    ctaBtn: {
        padding: '14px 32px', fontSize: 15, fontWeight: 600, color: '#fff',
        background: 'linear-gradient(135deg, #2563a8, #06b6a0)',
        border: 'none', borderRadius: 14, cursor: 'pointer',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
    spinner: {
        width: 32, height: 32, border: '3px solid #e8e4dc', borderTopColor: '#2563a8',
        borderRadius: '50%', animation: 'spin 0.8s linear infinite',
        margin: '0 auto 16px',
    },
};
