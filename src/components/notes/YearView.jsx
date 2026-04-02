import React, { useState } from 'react';
import NoteCard from './NoteCard';
import SearchBar from './SearchBar';
import SubjectFilter from './SubjectFilter';
import '../../pages/student/Notes.css';

const YEAR_CONFIG = [
  { id: 'Year 1', color: 'blue' },
  { id: 'Year 2', color: 'green' },
  { id: 'Year 3', color: 'amber' },
  { id: 'Year 4', color: 'purple' },
];

function ReportModal({ note, onClose, onReportNote }) {
  const [selectedReason, setSelectedReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedReason) return;
    onReportNote(note.id, selectedReason);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); onClose(); }, 1800);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Report: {note.title}</h3>
        {submitted ? (
          <div className="success-message">✓ Report submitted! Admin will review it.</div>
        ) : (
          <>
            <div className="radio-group">
              {['Wrong Subject', 'Incorrect Content', 'Spam', 'Copyright Issue'].map((reason) => (
                <label key={reason} className="radio-label">
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                  />
                  {reason}
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn-upload-cancel" onClick={onClose}>Cancel</button>
              <button
                className="btn-report-submit"
                onClick={handleSubmit}
                disabled={!selectedReason}
              >
                Submit Report
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * YearView — shows the year grid + filtered notes grid.
 * Props: notes, onDeleteNote, onReportNote, onRateNote, onUploadClick, role, currentUser, subjects
 */
export default function YearView({
  notes = [],
  onDeleteNote,
  onReportNote,
  onRateNote,
  role,
  currentUser,
  subjects,
  onRemoveNote,
  onDismissReport,
  onNavigateToAddSubject
}) {
  const [selectedYear, setSelectedYear] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [sortBy, setSortBy] = useState('newest');
  const [reportingNote, setReportingNote] = useState(null);

  // FIX: search now also checks note.year
  let filtered = notes.filter((note) => {
    const q = search.toLowerCase();
    const matchesSearch =
      note.title.toLowerCase().includes(q) ||
      note.subjectCode.toLowerCase().includes(q) ||
      note.year.toLowerCase().includes(q);
    const matchesYear = selectedYear ? note.year === selectedYear : true;
    const matchesSubject =
      selectedSubject === 'All Subjects' || note.subjectCode === selectedSubject;
    return matchesSearch && matchesYear && matchesSubject;
  });

  if (sortBy === 'rating') {
    filtered = [...filtered].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
  } else {
    filtered = [...filtered].sort((a, b) => b.id - a.id);
  }

  const showDetailView =
    selectedYear || search || selectedSubject !== 'All Subjects' || sortBy !== 'newest';

  const handleReset = () => {
    setSelectedYear(null);
    setSearch('');
    setSelectedSubject('All Subjects');
    setSortBy('newest');
  };

  return (
    <div className="year-dashboard">
      <div className="dashboard-header">
        <h1>Notes Repository</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          {role !== 'student' && (
            <button className="btn-secondary" onClick={onNavigateToAddSubject} style={{ border: '1px solid var(--border-nav)', borderRadius: '8px', padding: '0 16px', fontWeight: 600, fontSize: '13px' }}>
              Manage Curriculum
            </button>
          )}
          <button className="btn-primary-action" onClick={onUploadClick}>
            + Upload Note
          </button>
        </div>
      </div>

      {/* FILTER ROW */}
      <div className="filter-row">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by title, subject, or year…"
        />
        <SubjectFilter
          value={selectedSubject}
          onChange={setSelectedSubject}
          subjects={subjects}
          selectedYear={selectedYear}
        />
        <div className="sort-pills animate-fade-in">
          <button onClick={() => setSortBy('newest')} style={{ padding: '8px 16px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, background: sortBy === 'newest' ? 'var(--bg-main)' : 'transparent', color: sortBy === 'newest' ? 'var(--text-main)' : 'var(--text-muted)', border: 'none', transition: 'all 0.2s' }}>Newest</button>
          <button onClick={() => setSortBy('rating')} style={{ padding: '8px 16px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, background: sortBy === 'rating' ? 'var(--bg-main)' : 'transparent', color: sortBy === 'rating' ? 'var(--text-main)' : 'var(--text-muted)', border: 'none', transition: 'all 0.2s' }}>Top Rated</button>
        </div>
      </div>

      {/* ADMIN MODERATION PANEL */}
      {role !== 'student' && notes.some(n => n.isReported) && (
        <div className="moderation-panel glass-panel animate-fade-in" style={{ marginBottom: '32px', border: '1px solid #fee2e2', background: 'rgba(254, 242, 242, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: '#ef4444', color: 'white', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 800 }}>MODERATION REQUIRED</div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Reported Content</h2>
          </div>
          <div className="table-container" style={{ background: 'white', borderRadius: '12px', border: '1px solid #fee2e2' }}>
            <table className="data-table">
              <thead style={{ background: '#fff1f2' }}>
                <tr>
                  <th style={{ color: '#991b1b' }}>Note Title</th>
                  <th style={{ color: '#991b1b' }}>Reason</th>
                  <th style={{ color: '#991b1b' }}>Reporter</th>
                  <th style={{ color: '#991b1b' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {notes.filter(n => n.isReported).map(note => (
                  <tr key={note.id}>
                    <td><div style={{ fontWeight: 600 }}>{note.title}</div><div style={{ fontSize: '11px', color: '#666' }}>{note.subjectCode}</div></td>
                    <td><span className="badge private" style={{ background: '#fee2e2', color: '#b91c1c' }}>{note.reportReason}</span></td>
                    <td style={{ fontSize: '13px' }}>{note.reportedBy || 'Anonymous'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-action" onClick={() => onDismissReport(note.id)} style={{ color: '#166534', borderColor: '#166534' }}>Ignore</button>
                        <button className="btn btn-action" onClick={() => onRemoveNote(note.id)} style={{ color: '#b91c1c', borderColor: '#b91c1c' }}>Remove Note</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showDetailView ? (
        <div className="detail-view">
          <button className="back-btn-modern" onClick={handleReset}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Years
          </button>

          {filtered.length === 0 ? (
            <div className="glass-panel animate-fade-in" style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: 'none' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9ca3af', marginBottom: '16px', opacity: 0.6 }}>
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
              <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main)', fontSize: '18px' }}>No notes found</h3>
              <p style={{ margin: 0 }}>Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          ) : (
            <div className="notes-grid">
              {filtered.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={onDeleteNote}
                  onReport={setReportingNote}
                  onRate={onRateNote}
                  role={role}
                  currentUser={currentUser}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="year-grid-container">
          <div className="year-grid animate-fade-in" style={{ animation: 'fade-in-up 0.4s ease-out 0.4s both' }}>
            {YEAR_CONFIG.map((yr) => {
              const count = notes.filter((n) => n.year === yr.id).length;
              return (
                <div
                  key={yr.id}
                  className={`year-card-refined ${yr.color}`}
                  onClick={() => setSelectedYear(yr.id)}
                >
                  <h2>{yr.id}</h2>
                  <p>{count} {count === 1 ? 'file' : 'files'} uploaded</p>
                </div>
              );
            })}
          </div>

          <div className="recent-notes-section animate-fade-in" style={{ marginTop: '48px', animation: 'fade-in-up 0.4s ease-out 0.5s both' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)' }}>Recent Uploads</h2>
            <div className="notes-grid">
              {notes.slice(0, 4).map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={onDeleteNote}
                  onReport={setReportingNote}
                  onRate={onRateNote}
                  role={role}
                  currentUser={currentUser}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {reportingNote && (
        <ReportModal
          note={reportingNote}
          onClose={() => setReportingNote(null)}
          onReportNote={onReportNote}
        />
      )}
    </div>
  );
}
