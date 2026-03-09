'use client';
import { useState, useEffect } from 'react';
import { supabase, getAnonId } from '../lib/supabase';

export default function Profile({ onProfileReady }) {
    const [name, setName] = useState('');
    const [inputName, setInputName] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        const id = getAnonId();
        if (!id) { setLoading(false); return; }
        try {
            const { data } = await supabase.from('profiles').select('name').eq('id', id).single();
            if (data?.name) {
                setName(data.name);
                setInputName(data.name);
                onProfileReady?.(data.name);
            }
        } catch (e) { }
        setLoading(false);
    }

    async function saveProfile() {
        if (!inputName.trim()) return;
        setSaving(true);
        const id = getAnonId();
        try {
            await supabase.from('profiles').upsert({ id, name: inputName.trim() });
            setName(inputName.trim());
            setEditing(false);
            onProfileReady?.(inputName.trim());
        } catch (e) { }
        setSaving(false);
    }

    if (loading) return null;

    // First-time: show welcome modal
    if (!name) {
        return (
            <div style={S.overlay}>
                <div style={S.modal}>
                    <div style={S.modalIcon}>👋</div>
                    <h2 style={S.modalTitle}>Welcome to LearnWithFlow</h2>
                    <p style={S.modalSub}>What should we call you?</p>
                    <input
                        style={S.input}
                        type="text"
                        placeholder="Enter your name..."
                        value={inputName}
                        onChange={e => setInputName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && saveProfile()}
                        autoFocus
                        maxLength={30}
                    />
                    <button
                        style={{ ...S.btn, opacity: inputName.trim() ? 1 : 0.5 }}
                        onClick={saveProfile}
                        disabled={!inputName.trim() || saving}
                    >
                        {saving ? 'Saving...' : 'Get Started →'}
                    </button>
                </div>
            </div>
        );
    }

    // Edit mode inline
    if (editing) {
        return (
            <div style={S.editWrap}>
                <input
                    style={S.editInput}
                    type="text"
                    value={inputName}
                    onChange={e => setInputName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') saveProfile(); if (e.key === 'Escape') { setEditing(false); setInputName(name); } }}
                    autoFocus
                    maxLength={30}
                />
                <button style={S.editBtn} onClick={saveProfile} disabled={saving}>✓</button>
                <button style={S.editCancel} onClick={() => { setEditing(false); setInputName(name); }}>✕</button>
            </div>
        );
    }

    return (
        <div style={S.profileChip} onClick={() => setEditing(true)} title="Click to edit name">
            <div style={S.avatar}>{name.charAt(0).toUpperCase()}</div>
            <span style={S.chipName}>{name}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.4 }}>
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
        </div>
    );
}

const S = {
    overlay: {
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.3s ease'
    },
    modal: {
        background: '#fff', borderRadius: 24, padding: '48px 40px',
        maxWidth: 400, width: '90%', textAlign: 'center',
        boxShadow: '0 24px 80px -12px rgba(0,0,0,0.2)',
    },
    modalIcon: { fontSize: 48, marginBottom: 12 },
    modalTitle: {
        fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
        fontSize: 22, color: '#1c1814', margin: '0 0 6px'
    },
    modalSub: {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 14, color: '#8b8278', margin: '0 0 24px'
    },
    input: {
        width: '100%', padding: '14px 18px', fontSize: 16,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        border: '2px solid #e2ddd4', borderRadius: 14,
        outline: 'none', boxSizing: 'border-box',
        transition: 'border-color 0.2s',
        background: '#faf9f7',
    },
    btn: {
        width: '100%', padding: '14px 0', marginTop: 16,
        fontSize: 15, fontWeight: 600, color: '#fff', cursor: 'pointer',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: 'linear-gradient(135deg, #2563a8, #06b6a0)',
        border: 'none', borderRadius: 14,
        transition: 'transform 0.15s, box-shadow 0.15s',
    },
    profileChip: {
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '6px 14px 6px 6px', borderRadius: 40,
        background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer',
        transition: 'all 0.2s', fontSize: 13, color: '#3d3830',
        fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500,
    },
    avatar: {
        width: 28, height: 28, borderRadius: '50%',
        background: 'linear-gradient(135deg, #2563a8, #06b6a0)',
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
    chipName: { maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    editWrap: { display: 'inline-flex', alignItems: 'center', gap: 6 },
    editInput: {
        padding: '6px 12px', fontSize: 13, borderRadius: 10,
        border: '2px solid #2563a8', outline: 'none', width: 140,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
    editBtn: {
        width: 28, height: 28, borderRadius: 8, border: 'none', cursor: 'pointer',
        background: '#2563a8', color: '#fff', fontSize: 14, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
    },
    editCancel: {
        width: 28, height: 28, borderRadius: 8, border: '1px solid #e2ddd4',
        cursor: 'pointer', background: '#fff', color: '#8b8278', fontSize: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
};
