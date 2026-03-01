'use client';
import { useState, useEffect } from 'react';

const USERS_KEY = 'lwf_users';
const SESSION_KEY = 'lwf_session';

function getUsers() { try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); } catch { return {}; } }
function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

export default function Login({ onLogin }) {
    const [mode, setMode] = useState('login'); // login | signup | forgot | profile
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
            if (session?.email) { setUser(session); onLogin?.(session); }
        } catch { }
    }, []);

    const handleLogin = (e) => {
        e.preventDefault(); setError(''); setSuccess('');
        const users = getUsers();
        if (!users[email]) { setError('No account found. Please sign up first.'); return; }
        if (users[email].password !== password) { setError('Wrong password. Try again or reset.'); return; }
        const session = { email, name: users[email].name, avatar: users[email].name?.[0]?.toUpperCase() || 'U' };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setUser(session); onLogin?.(session);
    };

    const handleSignup = (e) => {
        e.preventDefault(); setError(''); setSuccess('');
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        if (password !== confirmPass) { setError('Passwords do not match.'); return; }
        const users = getUsers();
        if (users[email]) { setError('Account already exists. Please login.'); return; }
        users[email] = { name, password, createdAt: Date.now() };
        saveUsers(users);
        const session = { email, name, avatar: name?.[0]?.toUpperCase() || 'U' };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setUser(session); onLogin?.(session);
    };

    const handleForgot = (e) => {
        e.preventDefault(); setError(''); setSuccess('');
        const users = getUsers();
        if (!users[email]) { setError('No account with this email found.'); return; }
        if (password.length < 6) { setError('New password must be at least 6 characters.'); return; }
        if (password !== confirmPass) { setError('Passwords do not match.'); return; }
        users[email].password = password;
        saveUsers(users);
        setSuccess('Password reset! You can login now.');
        setTimeout(() => { setMode('login'); setSuccess(''); setPassword(''); setConfirmPass(''); }, 1500);
    };

    const handleLogout = () => {
        localStorage.removeItem(SESSION_KEY);
        setUser(null); onLogin?.(null);
        setMode('login'); setEmail(''); setPassword(''); setName('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') e.target.form?.requestSubmit();
    };

    // Profile view (logged in)
    if (user) {
        const users = getUsers();
        const userData = users[user.email] || {};
        const memberSince = userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently';
        const qs = parseInt(localStorage.getItem('lwf_qs') || '0');
        const streak = parseInt(localStorage.getItem('lwf_streak') || '1');
        const score = localStorage.getItem('lwf_score') || '--';

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
                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKeyDown} placeholder="you@example.com" />
                            </div>
                            <div className="auth-field">
                                <label>Password</label>
                                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown} placeholder="Enter password" />
                            </div>
                            {error && <div className="auth-error">{error}</div>}
                            <button type="submit" className="auth-btn">Login →</button>
                        </form>
                        <div className="auth-footer">
                            <button className="auth-link" onClick={() => { setMode('forgot'); setError(''); }}>Forgot Password?</button>
                            <button className="auth-link" onClick={() => { setMode('signup'); setError(''); }}>Create Account</button>
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
                                <input type="text" required value={name} onChange={e => setName(e.target.value)} onKeyDown={handleKeyDown} placeholder="Your name" />
                            </div>
                            <div className="auth-field">
                                <label>Email</label>
                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKeyDown} placeholder="you@example.com" />
                            </div>
                            <div className="auth-field">
                                <label>Password</label>
                                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown} placeholder="Min 6 characters" />
                            </div>
                            <div className="auth-field">
                                <label>Confirm Password</label>
                                <input type="password" required value={confirmPass} onChange={e => setConfirmPass(e.target.value)} onKeyDown={handleKeyDown} placeholder="Re-enter password" />
                            </div>
                            {error && <div className="auth-error">{error}</div>}
                            <button type="submit" className="auth-btn">Sign Up →</button>
                        </form>
                        <div className="auth-footer">
                            <button className="auth-link" onClick={() => { setMode('login'); setError(''); }}>Already have an account? Login</button>
                        </div>
                    </>
                )}

                {mode === 'forgot' && (
                    <>
                        <h2 className="auth-title">Reset Password</h2>
                        <p className="auth-sub">Enter your email and set a new password</p>
                        <form onSubmit={handleForgot}>
                            <div className="auth-field">
                                <label>Email</label>
                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKeyDown} placeholder="you@example.com" />
                            </div>
                            <div className="auth-field">
                                <label>New Password</label>
                                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown} placeholder="Min 6 characters" />
                            </div>
                            <div className="auth-field">
                                <label>Confirm New Password</label>
                                <input type="password" required value={confirmPass} onChange={e => setConfirmPass(e.target.value)} onKeyDown={handleKeyDown} placeholder="Re-enter password" />
                            </div>
                            {error && <div className="auth-error">{error}</div>}
                            {success && <div className="auth-success">{success}</div>}
                            <button type="submit" className="auth-btn">Reset Password →</button>
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
