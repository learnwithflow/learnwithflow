'use client';
import { useState, useCallback, useRef } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CareerQuiz from '../components/CareerQuiz';
import MockExam from '../components/MockExam';
import Roadmap from '../components/Roadmap';
import AIInterview from '../components/AIInterview';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login';
import Toast from '../components/Toast';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home');
  const [toastMsg, setToastMsg] = useState('');
  const [user, setUser] = useState(null);
  const toastKey = useRef(0);

  const showPage = useCallback((page) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }, []);

  const showToast = useCallback((msg) => {
    toastKey.current++;
    setToastMsg(msg + ' ' + toastKey.current);
  }, []);

  const pageStyle = (id) => ({ display: currentPage === id ? 'block' : 'none' });

  return (
    <>
      <Navbar currentPage={currentPage} showPage={showPage} user={user} />
      <Toast message={toastMsg} />
      <div style={pageStyle('home')}><Hero showPage={showPage} /></div>
      <div style={{ ...pageStyle('quiz'), paddingTop: 56 }}><CareerQuiz showPage={showPage} /></div>
      <div style={{ ...pageStyle('exam'), paddingTop: 56 }}><MockExam showPage={showPage} showToast={showToast} /></div>
      <div style={{ ...pageStyle('roadmap'), paddingTop: 0 }}><Roadmap showPage={showPage} showToast={showToast} /></div>
      <div style={{ ...pageStyle('interview'), paddingTop: 56 }}><AIInterview showPage={showPage} showToast={showToast} /></div>
      <div style={{ ...pageStyle('dashboard'), paddingTop: 56 }}><Dashboard showPage={showPage} /></div>
      <div style={{ ...pageStyle('profile'), paddingTop: 56 }}><Login onLogin={(u) => { setUser(u); if (u) showPage('home'); }} /></div>
    </>
  );
}
