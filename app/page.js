'use client';
import { useState, useCallback, useRef } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CareerQuiz from '../components/CareerQuiz';
import MockExam from '../components/MockExam';
import Roadmap from '../components/Roadmap';
import AIInterview from '../components/AIInterview';
import Dashboard from '../components/Dashboard';
import Toast from '../components/Toast';
import About from '../components/About';
import Terms from '../components/Terms';
import PrivacyPolicy from '../components/PrivacyPolicy';
import Leaderboard from '../components/Leaderboard';
import Footer from '../components/Footer';
import Profile from '../components/Profile';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home');
  const [toastMsg, setToastMsg] = useState('');
  const [userName, setUserName] = useState('');
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
      <Profile onProfileReady={setUserName} />
      <Navbar currentPage={currentPage} showPage={showPage} />
      <Toast message={toastMsg} />
      <div style={pageStyle('home')}><Hero showPage={showPage} /></div>
      <div style={{ ...pageStyle('quiz'), paddingTop: 56 }}><CareerQuiz showPage={showPage} /></div>
      <div style={{ ...pageStyle('exam'), paddingTop: 56 }}><MockExam showPage={showPage} showToast={showToast} /></div>
      <div style={{ ...pageStyle('roadmap'), paddingTop: 0 }}><Roadmap showPage={showPage} showToast={showToast} /></div>
      <div style={{ ...pageStyle('interview'), paddingTop: 56 }}><AIInterview showPage={showPage} showToast={showToast} /></div>
      <div style={{ ...pageStyle('dashboard'), paddingTop: 56 }}><Dashboard showPage={showPage} userName={userName} /></div>
      <div style={{ ...pageStyle('leaderboard'), paddingTop: 56 }}><Leaderboard /></div>
      <div style={{ ...pageStyle('about'), paddingTop: 0 }}><About showPage={showPage} /></div>
      <div style={{ ...pageStyle('terms'), paddingTop: 0 }}><Terms showPage={showPage} /></div>
      <div style={{ ...pageStyle('privacy'), paddingTop: 0 }}><PrivacyPolicy showPage={showPage} /></div>
      {!['exam', 'quiz', 'roadmap'].includes(currentPage) && <Footer showPage={showPage} />}
    </>
  );
}
