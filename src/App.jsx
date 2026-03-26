import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TutorDashboard from './pages/TutorDashboard';
import SessionReview from './pages/SessionReview';
import StudentPost from './pages/StudentPost';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [questions, setQuestions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const fetchSessions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/sessions');
      setQuestions(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchSessions();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleSelectQuestion = (id) => {
    setSelectedId(id);
    setCurrentPage('review');
  };

  const handleUpdate = async (id, status, reply, replyImage) => {
    try {
      await axios.patch(`http://localhost:5000/api/sessions/${id}`, {
        status,
        replyText: reply,
        replyImage: replyImage
      });
      fetchSessions();
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#f4f7fe', fontFamily: 'Inter, sans-serif' }}>
      <aside style={{ width: '280px', backgroundColor: '#0b1437', color: 'white', padding: '40px 20px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ marginBottom: '50px' }}>UniSync</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div onClick={() => { setCurrentPage('dashboard'); setSelectedId(null); }} style={{ padding: '15px', borderRadius: '12px', cursor: 'pointer', backgroundColor: currentPage === 'dashboard' ? '#4318ff' : 'transparent' }}>📊 Dashboard</div>
          <div onClick={() => { setCurrentPage('review'); setSelectedId(null); }} style={{ padding: '15px', borderRadius: '12px', cursor: 'pointer', backgroundColor: currentPage === 'review' ? '#4318ff' : 'transparent' }}>💬 Session Reviews</div>
          <div onClick={() => setCurrentPage('post')} style={{ padding: '15px', borderRadius: '12px', cursor: 'pointer', backgroundColor: currentPage === 'post' ? '#4318ff' : 'transparent' }}>🙋‍♂️ Ask Question</div>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {currentPage === 'dashboard' && <TutorDashboard questions={questions} onAction={handleSelectQuestion} />}
        {currentPage === 'review' && <SessionReview questions={questions} onUpdate={handleUpdate} initialSelectedId={selectedId} />}
        {currentPage === 'post' && <StudentPost onPostSuccess={() => { fetchSessions(); setCurrentPage('dashboard'); }} />}
      </main>
    </div>
  );
}

export default App;