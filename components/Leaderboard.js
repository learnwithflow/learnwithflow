'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Leaderboard() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaders();
    }, []);

    async function fetchLeaders() {
        setLoading(true);
        try {
            // Aggregate scores per user where we join with profiles to get the name
            // Note: Since Supabase anon users might not be fully linked in complex queries without a backend RPC,
            // we'll fetch top exam results and their associated profiles.
            const { data, error } = await supabase
                .from('exam_results')
                .select(`
                    user_id,
                    score,
                    profiles ( name )
                `)
                .order('score', { ascending: false })
                .limit(50);

            if (error) { throw error; }

            // Group by user to get their highest score, or total score. 
            // Let's do Highest Single Exam Score for now as it's cleaner.
            const map = new Map();
            data?.forEach(row => {
                const uid = row.user_id;
                const name = row.profiles?.name || 'Anonymous Learner';
                if (!map.has(uid)) {
                    map.set(uid, { name, score: row.score });
                }
            });

            // Sort map values
            const sorted = Array.from(map.values()).sort((a, b) => b.score - a.score).slice(0, 10);
            setLeaders(sorted);
        } catch (e) {
            console.error('Leaderboard fetch error', e);
        }
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div style={{ width: 40, height: 40, border: '3px solid rgba(37,99,168,0.2)', borderTopColor: '#2563a8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <div style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(245,158,11,0.1)', color: '#d97706', borderRadius: 40, fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Top 10 Scores</div>
                <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, color: '#1c1814', margin: '0 0 16px', letterSpacing: '-0.03em' }}>
                    Leader<span style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>board</span>
                </h1>
                <p style={{ color: '#8b8278', fontSize: 16 }}>The highest mock exam scores across the entire platform.</p>
            </div>

            <div style={{ background: '#fff', borderRadius: 24, padding: 8, boxShadow: '0 12px 40px -8px rgba(0,0,0,0.06)', border: '1px solid #e6e0d4' }}>
                {leaders.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#8b8278' }}>No scores recorded yet. Be the first!</div>
                ) : (
                    leaders.map((l, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', padding: '16px 20px',
                            background: i === 0 ? 'linear-gradient(135deg, rgba(245,158,11,0.05), transparent)' : 'transparent',
                            borderRadius: 16, marginBottom: 4, position: 'relative', overflow: 'hidden'
                        }}>
                            {i === 0 && <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 4, background: '#f59e0b', borderRadius: '0 4px 4px 0' }} />}

                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: i === 0 ? '#fef3c7' : i === 1 ? '#f3f4f6' : i === 2 ? '#ffedd5' : '#faf9f7', color: i === 0 ? '#d97706' : i === 1 ? '#6b7280' : i === 2 ? '#c2410c' : '#8b8278', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, marginRight: 16 }}>
                                #{i + 1}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 16, color: i === 0 ? '#b45309' : '#1c1814' }}>{l.name}</div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: i === 0 ? '#d97706' : '#2563a8' }}>{l.score}</div>
                                <div style={{ fontSize: 11, color: '#8b8278', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Points</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
