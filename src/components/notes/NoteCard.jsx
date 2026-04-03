import React from 'react';
import RatingStars from './RatingStars';
import '../../pages/student/Notes.css';

/**
 * NoteCard — displays a single note.
 * Props:
 *   note        {object}
 *   onDelete    {fn}    called with note.id
 *   onReport    {fn}    called with note (opens report modal)
 *   onRate      {fn}    called with (note.id, newRating)
 *   role        {string} 'student' | 'admin'
 *   currentUser {string}
 */
export default function NoteCard({ note, onDelete, onReport, onRate, role, currentUser }) {
  const canDelete = role === 'admin' || note.uploadedBy === currentUser;
  const uploadDate = note.date ? new Date(note.date).toLocaleDateString() : 'Recent';

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${note.title}"? This cannot be undone.`)) {
      onDelete(note.id);
    }
  };

  // Download file from backend
  const handleDownload = async () => {
    try {
      const res = await fetch(`/api/notes/${note.id}/download`);
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = note.fileName || note.title || 'note-file';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download file.');
    }
  };

  return (
    <div className="note-card" style={{ padding: '0', overflow: 'hidden', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-nav)', boxShadow: 'var(--shadow-card)' }}>
      {/* Subtle Color Header */}
      <div style={{ height: '8px', background: 'var(--primary-gradient)' }}></div>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 className="note-title" style={{ padding: 0, textAlign: 'left', marginBottom: '12px', fontSize: '15px', fontWeight: 600 }}>{note.title}</h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span className="subject-badge">{note.subjectCode}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-inactive)', fontWeight: 500 }}>{uploadDate}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <p className="note-uploader" style={{ margin: 0, textAlign: 'left', fontSize: '13px' }}>By {note.uploadedBy || 'Unknown'}</p>
          <div style={{ transform: 'scale(0.8)', transformOrigin: 'right center', margin: 0 }}>
            <RatingStars
              rating={note.rating}
              onChange={(newRating) => onRate(note.id, newRating)}
            />
          </div>
        </div>

        <div className="note-actions" style={{ marginTop: 'auto' }}>
          <button
            className="btn-download"
            onClick={handleDownload}
          >
            Download
          </button>

          {role === 'student' && note.uploadedBy !== currentUser && (
            <button className="btn-report" onClick={() => onReport(note)}>
              Report
            </button>
          )}

          {canDelete && (
            <button
              className="btn-delete"
              onClick={handleDelete}
              title="Delete Note"
              style={{ flex: 'none', width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
