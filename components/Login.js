'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Login({ onLogin }) {
    const [mode, setMode] = useState('login'); // login | signup | forgot | profile
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check current session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                const u = buildUser(session.user);
                setUser(u);
                onLogin?.(u);
            }
        });

        // Listen to auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                const u = buildUser(session.user);
                setUser(u);
                onLogin?.(u);
            } else {
                setUser(null);
                onLogin?.(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const buildUser = (supaUser) => ({
        id: supaUser.id,
        email: supaUser.email,
        name: supaUser.user_metadata?.full_name || supaUser.email?.split('@')[0] || 'User',
        avatar: (supaUser.user_metadata?.full_name || supaUser.email)?.[0]?.toUpperCase() || 'U',
        createdAt: supaUser.created_at,
    });

    const handleLogin = async (e) => {
        e.preventDefault(); setError(''); setLoading(true);
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (err) setError(err.message);
    };

    const handleSignup = async (e) => {
        e.preventDefault(); setError('');
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        if (password !== confirmPass) { setError('Passwords do not match.'); return; }
        setLoading(true);
        const { error: err } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name } }
        });
        setLoading(false);
        if (err) { setError(err.message); }
        else { setSuccess('Account created! Check your email to confirm, then login.'); setMode('login'); }
    };

    const handleForgot = async (e) => {
        e.preventDefault(); setError(''); setLoading(true);
        const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/?reset=true`
        });
        setLoading(false);
        if (err) setError(err.message);
        else { setSuccess('Password reset email sent! Check your inbox.'); }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null); onLogin?.(null);
        setMode('login'); setEmail(''); setPassword(''); setName('');
    };

    // Profile view (logged in)
    if (user) {
        const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently';
        const qs = typeof window !== 'undefined' ? parseInt(localStorage.getItem('lwf_qs') || '0') : 0;
        const streak = typeof window !== 'undefined' ? parseInt(localStorage.getItem('lwf_streak') || '1') : 1;
        const score = typeof window !== 'undefined' ? (localStorage.getItem('lwf_score') || '--') : '--';

        return (
            <div className="auth-container">
                <div className="auth-card profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar-large">{user.avatar}</div>
                        <h2 className="profile-name">{user.name}</h2>
                        <p className="profile-email">{user.email}</p>
                        <p className="profile-since">Member since {memberSince}</p>
                    </div>
                    <div className="profile-stats">
                        <div className="profile-stat"><div className="profile-stat-val">🔥 {streak}</div><div className="profile-stat-label">Day Streak</div></div>
                        <div className="profile-stat"><div className="profile-stat-val">✅ {qs}</div><div className="profile-stat-label">Qs Solved</div></div>
                        <div className="profile-stat"><div className="profile-stat-val">📊 {score}</div><div className="profile-stat-label">Last Score</div></div>
                    </div>
                    <button className="auth-btn logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo">
                    <svg width="38" height="22" viewBox="0 0 32 18" fill="none">
                        <defs><linearGradient id="ag" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#2563a8" /><stop offset="100%" stopColor="#06d6a0" /></linearGradient></defs>
                        <path d="M2 12 Q8 2 14 7 Q20 12 26 4 Q28 2 30 3" stroke="url(#ag)" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </svg>
                </div>

                {mode === 'login' && (
                    <>
                        <h2 className="auth-title">Welcome Back</h2>
                        <p className="auth-sub">Login to continue your learning journey</p>
                        <form onSubmit={handleLogin}>
                            <div className="auth-field">
                                <label>Email</label>
                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                            </div>
                            <div className="auth-field">
                                <label>Password</label>
                                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
                            </div>
                            {error && <div className="auth-error">{error}</div>}
                            {success && <div className="auth-success">{success}</div>}
                            <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Logging in...' : 'Login →'}</button>
                        </form>
                        <div className="auth-footer">
                            <button className="auth-link" onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}>Forgot Password?</button>
                            <button className="auth-link" onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}>Create Account</button>
                        </div>
                    </>
                )}

                {mode === 'signup' && (
                    <>
                        <h2 className="auth-title">Create Account</h2>
                        <p className="auth-sub">Start your career journey today</p>
                        <form onSubmit={handleSignup}>
                            <div className="auth-field">
                                <label>Full Name</label>
                                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
                            </div>
                            <div className="auth-field">
                                <label>Email</label>
                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                            </div>
                            <div className="auth-field">
                                <label>Password</label>
                                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" />
                            </div>
                            <div className="auth-field">
                                <label>Confirm Password</label>
                                <input type="password" required value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Re-enter password" />
                            </div>
                            {error && <div className="auth-error">{error}</div>}
                            {success && <div className="auth-success">{success}</div>}
                            <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Creating account...' : 'Sign Up →'}</button>
                        </form>
                        <div className="auth-footer">
                            <button className="auth-link" onClick={() => { setMode('login'); setError(''); setSuccess(''); }}>Already have an account? Login</button>
                        </div>
                    </>
                )}

                {mode === 'forgot' && (
                    <>
                        <h2 className="auth-title">Reset Password</h2>
                        <p className="auth-sub">We'll send a reset link to your email</p>
                        <form onSubmit={handleForgot}>
                            <div className="auth-field">
                                <label>Email</label>
                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                            </div>
                            {error && <div className="auth-error">{error}</div>}
                            {success && <div className="auth-success">{success}</div>}
                            <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Email →'}</button>
                        </form>
                        <div className="auth-footer">
                            <button className="auth-link" onClick={() => { setMode('login'); setError(''); setSuccess(''); }}>← Back to Login</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
