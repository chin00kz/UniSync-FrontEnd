import React, { useState } from 'react';
import { validateNoteTitle, validateUploadFile } from '../../utils/validation.js';
import '../../pages/student/Notes.css';

/**
 * UploadNoteForm — controlled upload form with validation.
 * Props:
 *   subjects    {object}  { "Year 1": [{code, name}], ... }
 *   currentUser {string}
 *   onSubmit    {fn}      (noteData) => void
 *   onCancel    {fn}
 */
export default function UploadNoteForm({ subjects, currentUser, onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [file, setFile] = useState(null);        // FIX: controlled file state
  const [titleError, setTitleError] = useState('');
  const [fileError, setFileError] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');

  const availableSubjects = academicYear ? (subjects[academicYear] || []) : [];

  // FIX: validate title on every keystroke, show error inline
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    const { error } = validateNoteTitle(val);
    setTitleError(val.length > 0 ? error : '');
  };

  // FIX: file state is properly set when a file is selected
  const handleFileChange = (e) => {
    const selected = e.target.files[0] || null;
    setFile(selected);
    if (selected) {
      const { error } = validateUploadFile(selected);
      setFileError(error);
    } else {
      setFileError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    // Re-validate all fields on submit
    const titleValidation = validateNoteTitle(title);
    if (!titleValidation.valid) {
      setTitleError(titleValidation.error);
      return;
    }

    const fileValidation = validateUploadFile(file);
    if (!fileValidation.valid) {
      setFileError(fileValidation.error);
      return;
    }

    if (!subjectCode) {
      setFormError('Please select a subject code.');
      return;
    }

    const newNote = {
      id: Date.now(),
      title: title.trim(),
      subjectCode,
      year: academicYear,
      rating: 0,
      fileName: file.name,
      isReported: false,
      reportReason: null,
      reportedBy: null,
      reportedAt: null,
      uploadedBy: currentUser,
      uploadedAt: new Date().toISOString(),
    };

    onSubmit(newNote);
    setSuccess(`"${file.name}" uploaded successfully!`);

    // Reset form after short delay
    setTimeout(() => {
      setTitle('');
      setAcademicYear('');
      setSubjectCode('');
      setFile(null);
      setSuccess('');
      onCancel();
    }, 1500);
  };

  return (
    <div className="upload-page-wrapper">
      <div className="upload-header">
        <button className="back-button" onClick={onCancel} type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div>
          <h1>Upload Notes</h1>
          <p>Share with the SLIIT community</p>
        </div>
      </div>

      <div className="upload-card">
        <form onSubmit={handleSubmit} noValidate>
          {/* TITLE */}
          <div className="form-group">
            <label htmlFor="note-title">Title</label>
            <input
              id="note-title"
              type="text"
              value={title}
              placeholder="e.g. Algorithms Revision"
              onChange={handleTitleChange}
              className={titleError ? 'input-error' : ''}
              required
            />
            {titleError && <p className="field-error">{titleError}</p>}
          </div>

          {/* YEAR + SUBJECT */}
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="upload-year">Academic Year</label>
              <select
                id="upload-year"
                required
                value={academicYear}
                onChange={(e) => { setAcademicYear(e.target.value); setSubjectCode(''); }}
              >
                <option value="" disabled>Select year</option>
                {Object.keys(subjects).map((yr) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>
            <div className="form-group half">
              <label htmlFor="upload-subject">Subject</label>
              <select
                id="upload-subject"
                required
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
              >
                <option value="" disabled>
                  {academicYear ? 'Select subject' : 'Select year first'}
                </option>
                {availableSubjects.map((sub) => (
                  <option key={sub.code} value={sub.code}>
                    {sub.code} — {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* FILE UPLOAD — FIX: shows file name when selected */}
          <div className="form-group">
            <label>File Upload</label>
            <div className={`file-upload-zone ${file ? 'has-file' : ''}`}>
              <input
                type="file"
                className="file-input-hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.ppt,.pptx,.txt"
                onChange={handleFileChange}
              />
              <div className="upload-zone-content">
                {file ? (
                  <p className="file-selected">✓ {file.name}</p>
                ) : (
                  <p>Click to select a file (PDF, DOCX, JPG, PNG…)</p>
                )}
              </div>
            </div>
            {fileError && <p className="field-error">{fileError}</p>}
          </div>

          {formError && <div className="alert error">{formError}</div>}
          {success && <div className="alert success">{success}</div>}

          <div className="form-footer">
            <button type="button" className="btn-upload-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-upload-submit"
              disabled={!!titleError || !!fileError}
            >
              Complete Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
