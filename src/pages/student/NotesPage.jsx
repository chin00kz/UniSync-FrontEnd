import React, { useEffect, useState } from 'react';
import YearView from '../../components/notes/YearView';
import UploadNoteForm from '../../components/notes/UploadNoteForm';
import './Notes.css';

/**
 * NotesPage — switches between YearView and UploadNoteForm.
 * ALL state (notes) is lifted to App.jsx so Admin pages can read it.
 */
export default function NotesPage({ 
  user,
  notes = [],
  subjects = {},
  onAddNote,
  onDeleteNote,
  onRateNote,
  onReportNote,
  onRemoveNote,
  onDismissReport,
  onNavigateToAddSubject
}) {
  const [view, setView] = useState('notes'); // 'notes' | 'upload'

  const role = user?.role || null;
  const currentUser = user?.name || '';

  const [loading, setLoading] = useState(false);

  return (
    <div className="main-content">
      {view === 'upload' ? (
        <UploadNoteForm
          subjects={subjects}
          currentUser={currentUser}
          onSubmit={(newNote) => {
            onAddNote(newNote);
            setView('notes');
          }}
          onCancel={() => setView('notes')}
        />
      ) : (
        <YearView
          notes={notes}
          onDeleteNote={onDeleteNote}
          onReportNote={onReportNote}
          onRateNote={onRateNote}
          onUploadClick={() => setView('upload')}
          role={role}
          currentUser={currentUser}
          subjects={subjects}
          onRemoveNote={onRemoveNote}
          onDismissReport={onDismissReport}
          onNavigateToAddSubject={onNavigateToAddSubject}
        />
      )}
    </div>
  );
}
