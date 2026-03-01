'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CareerQuiz from '../components/CareerQuiz';
import MockExam from '../components/MockExam';
import Roadmap from '../components/Roadmap';
import AIInterview from '../components/AIInterview';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login';
import Toast from '../components/Toast';
import { supabase } from '../lib/supabase';

// Pages that require login
const PROTECTED = ['quiz', 'exam', 'roadmap', 'interview', 'dashboard'];

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home');
  const [toastMsg, setToastMsg] = useState('');
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const toastKey = useRef(0);

  // Check Supabase session on first load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(buildUser(session.user));
      }
      setAuthChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(buildUser(session.user));
      } else {
        setUser(null);
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

  const showPage = useCallback((page) => {
    // Protected route check
    if (PROTECTED.includes(page) && !user) {
      setCurrentPage('profile');
      showToast('Please login to access this page.');
      return;
    }
    setCurrentPage(page);
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }, [user]);

  const showToast = useCallback((msg) => {
    toastKey.current++;
    setToastMsg(msg + ' ' + toastKey.current);
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    if (u) setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const pageStyle = (id) => ({ display: currentPage === id ? 'block' : 'none' });

  // Show loading spinner while checking auth
  if (!authChecked) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>
        <div style={{ textAlign: 'center', color: '#888' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar currentPage={currentPage} showPage={showPage} user={user} onLogout={handleLogout} />
      <Toast message={toastMsg} />
      <div style={pageStyle('home')}><Hero showPage={showPage} /></div>
      <div style={{ ...pageStyle('quiz'), paddingTop: 56 }}><CareerQuiz showPage={showPage} /></div>
      <div style={{ ...pageStyle('exam'), paddingTop: 56 }}><MockExam showPage={showPage} showToast={showToast} /></div>
      <div style={{ ...pageStyle('roadmap'), paddingTop: 0 }}><Roadmap showPage={showPage} showToast={showToast} /></div>
      <div style={{ ...pageStyle('interview'), paddingTop: 56 }}><AIInterview showPage={showPage} showToast={showToast} /></div>
      <div style={{ ...pageStyle('dashboard'), paddingTop: 56 }}><Dashboard showPage={showPage} /></div>
      <div style={{ ...pageStyle('profile'), paddingTop: 56 }}><Login onLogin={handleLogin} /></div>
    </>
  );
}
