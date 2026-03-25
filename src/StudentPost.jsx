import React, { useState } from 'react';
import axios from 'axios';

function StudentPost({ onPostSuccess }) {
  const [name, setName] = useState('');
  const [question, setQuestion] = useState('');
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB!");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/sessions', {
        studentName: name,
        questionText: question,
        questionImage: image
      });
      onPostSuccess();
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Check file size (Max 2MB)"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div style={cardStyle}>
        <h2 style={{ color: '#1b2559', fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>New Question</h2>
        <p style={{ color: '#a3aed0', marginBottom: '30px', fontSize: '0.9rem' }}>Fill out the details below.</p>
        
        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Student Full Name</label>
          <input type="text" placeholder="e.g. Suneth" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />

          <label style={labelStyle}>Your Question</label>
          <textarea placeholder="Explain your problem clearly..." value={question} onChange={(e) => setQuestion(e.target.value)} required style={{ ...inputStyle, height: '120px' }} />

          {/* CUSTOM STYLED DRAG & DROP ZONE */}
          <div 
            onDragOver={(e) => e.preventDefault()} 
            onDrop={(e) => { e.preventDefault(); processFile(e.dataTransfer.files[0]); }} 
            style={dropZoneStyle}
          >
            <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#a3aed0' }}>Drag & Drop image here Image (Max 2MB)</p>
            
            <input 
              type="file" 
              id="file-upload" 
              accept="image/*" 
              onChange={(e) => processFile(e.target.files[0])} 
              style={{ display: 'none' }} 
            />
            <label htmlFor="file-upload" style={fileBtnStyle}>
              📸 Select Image
            </label>

            {image && (
              <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <img src={image} alt="Preview" style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #4318ff' }} />
                <span style={{ fontSize: '0.75rem', color: '#05cd99', fontWeight: '700' }}>Ready! ✅</span>
                <button type="button" onClick={() => setImage("")} style={{ background: 'none', border: 'none', color: '#ff5b5b', cursor: 'pointer', fontSize: '0.7rem' }}>Remove</button>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? "Posting..." : "Post to Dashboard"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- UPDATED STYLES ---
const cardStyle = { width: '500px', backgroundColor: 'white', padding: '40px', borderRadius: '35px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)' };
const labelStyle = { display: 'block', marginBottom: '8px', color: '#1b2559', fontWeight: '700', fontSize: '0.8rem' };
const inputStyle = { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #e0e5f2', marginBottom: '20px', boxSizing: 'border-box', fontSize: '0.9rem' };
const dropZoneStyle = { border: '2px dashed #e0e5f2', padding: '25px', borderRadius: '20px', textAlign: 'center', backgroundColor: '#faffff', marginBottom: '30px' };

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

const btnStyle = { 
  width: '70%', // MADE SMALLER AS REQUESTED
  padding: '15px', 
  backgroundColor: '#4318ff', 
  color: 'white', 
  border: 'none', 
  borderRadius: '15px', 
  fontWeight: '800', 
  fontSize: '1rem', 
  cursor: 'pointer',
  boxShadow: '0 8px 20px rgba(67, 24, 255, 0.2)'
};

export default StudentPost;