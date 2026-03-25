import React, { useState } from 'react';

function SessionReview({ questions, onUpdate }) {
  const [activeId, setActiveId] = useState(null);
  const [reply, setReply] = useState('');
  const [replyImage, setReplyImage] = useState('');

  const current = questions.find(q => q._id === activeId);

  const processFile = (file) => {
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Max size 2MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert("Please upload an image file");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setReplyImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const submitUpdate = (status) => {
    onUpdate(activeId, status, reply, replyImage);
    setActiveId(null); 
    setReply(''); 
    setReplyImage('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px', maxWidth: '1100px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* LEFT COLUMN: SESSION LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {questions.map(q => (
          <div 
            key={q._id} 
            onClick={() => { setActiveId(q._id); setReply(q.replyText || ''); }} 
            style={{ 
              padding: '25px', backgroundColor: 'white', borderRadius: '20px', cursor: 'pointer', 
              border: activeId === q._id ? '2px solid #4318ff' : 'none', 
              boxShadow: '0 10px 20px rgba(0,0,0,0.02)', transition: '0.3s' 
            }}
          >
            <h3 style={{ margin: '0 0 5px 0', color: '#1b2559' }}>{q.studentName}</h3>
            <p style={{ fontSize: '0.75rem', fontWeight: '800', color: q.status === 'Completed' ? '#05cd99' : '#ffb547', margin: 0 }}>
              STATUS: {q.status.toUpperCase()}
            </p>
          </div>
        ))}
      </div>

      {/* RIGHT COLUMN: REVIEW PANEL */}
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.04)' }}>
        {activeId ? (
          <>
            <h2 style={{ color: '#1b2559', marginBottom: '25px', fontSize: '1.4rem' }}>Reviewing: {current.studentName}</h2>
            
            <div style={{ backgroundColor: '#f4f7fe', padding: '20px', borderRadius: '15px', marginBottom: '25px' }}>
              <p style={{ color: '#4318ff', fontWeight: '700', margin: '0 0 5px 0', fontSize: '0.9rem' }}>Question:</p>
              <p style={{ color: '#1b2559', margin: 0 }}>"{current.questionText}"</p>
              {current.questionImage && (
                <img src={current.questionImage} alt="student attachment" style={{ width: '100%', borderRadius: '12px', marginTop: '15px' }} />
              )}
            </div>
            
            <label style={{ fontWeight: '700', display: 'block', marginBottom: '10px', color: '#1b2559', fontSize: '0.85rem' }}>Tutor Reply</label>
            <textarea 
              value={reply} 
              onChange={(e) => setReply(e.target.value)} 
              placeholder="Write your answer here..."
              style={{ width: '100%', height: '120px', padding: '15px', borderRadius: '15px', border: '1px solid #e0e5f2', marginBottom: '20px', outline: 'none', boxSizing: 'border-box' }} 
            />
            
            {/* STYLED DRAG & DROP + SELECT IMAGE BUTTON */}
            <div 
              onDragOver={(e) => e.preventDefault()} 
              onDrop={(e) => { e.preventDefault(); processFile(e.dataTransfer.files[0]); }} 
              style={dropZoneStyle}
            >
              <p style={{ fontSize: '0.8rem', color: '#a3aed0', marginBottom: '12px' }}>Drag & Drop Reply Image (Max 2MB)</p>
              
              <input 
                type="file" 
                id="tutor-upload" 
                accept="image/*" 
                onChange={(e) => processFile(e.target.files[0])} 
                style={{ display: 'none' }} 
              />
              <label htmlFor="tutor-upload" style={fileBtnStyle}>
                📎 Attach Image
              </label>

              {replyImage && (
                <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <img src={replyImage} alt="Reply preview" style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #4318ff' }} />
                  <span style={{ fontSize: '0.75rem', color: '#05cd99', fontWeight: '700' }}>Attached ✅</span>
                  <button type="button" onClick={() => setReplyImage("")} style={{ background: 'none', border: 'none', color: '#ff5b5b', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold' }}>Remove</button>
                </div>
              )}
            </div>

            <button onClick={() => submitUpdate('Replied')} style={{ ...btnStyle, backgroundColor: '#4318ff', marginBottom: '10px' }}>✉️ Send Reply (Keep Pending)</button>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => submitUpdate('Not Started')} style={{ ...btnStyle, backgroundColor: '#ffb547' }}>⏳ Reset to Pending</button>
              <button onClick={() => submitUpdate('Completed')} style={{ ...btnStyle, backgroundColor: '#05cd99' }}>✅ Complete Session</button>
            </div>
            
            <center>
              <button onClick={() => setActiveId(null)} style={{ background: 'none', border: 'none', color: '#a3aed0', marginTop: '15px', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}>
                Cancel
              </button>
            </center>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: '#a3aed0', fontSize: '1rem' }}>Select a session from the list to begin review.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- STYLES ---
const btnStyle = { 
  width: '100%', padding: '16px', color: 'white', border: 'none', 
  borderRadius: '15px', fontWeight: '700', cursor: 'pointer', 
  fontSize: '0.9rem', transition: '0.3s' 
};

const fileBtnStyle = {
  display: 'inline-block',
  padding: '8px 18px',
  backgroundColor: '#f4f7fe',
  color: '#4318ff',
  borderRadius: '10px',
  fontSize: '0.8rem',
  fontWeight: '700',
  cursor: 'pointer',
  border: '1px solid #e0e5f2'
};

const dropZoneStyle = { 
  border: '2px dashed #e0e5f2', 
  padding: '20px', 
  borderRadius: '20px', 
  textAlign: 'center', 
  backgroundColor: '#faffff', 
  marginBottom: '25px' 
};

export default SessionReview;