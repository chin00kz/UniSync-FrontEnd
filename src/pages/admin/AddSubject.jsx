import React, { useState } from 'react';

export default function AddSubject({ onAddSubject }) {
  const [year, setYear] = useState('Year 1');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code || !name) return;

    onAddSubject(year, code.toUpperCase(), name);
    setSuccess(`✓ Subject ${code.toUpperCase()} successfully added to ${year}.`);
    setCode('');
    setName('');

    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="main-content">
      <div className="page-topbar">
        <span>UniSync</span>
        <span className="breadcrumb-sep">›</span>
        <span>Admin</span>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-active">Add Subject</span>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h1>Curriculum Management</h1>
          <p>Add new subjects to the standard curriculum catalog.</p>
        </div>

        <div className="upload-card" style={{ maxWidth: '580px', margin: 0 }}>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group half">
                <label>Academic Year</label>
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                  <option>Year 1</option>
                  <option>Year 2</option>
                  <option>Year 3</option>
                  <option>Year 4</option>
                </select>
              </div>
              <div className="form-group half">
                <label>Subject Code</label>
                <input
                  type="text"
                  placeholder="e.g. IT5050"
                  required
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setSuccess(''); }}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Subject Name</label>
              <input
                type="text"
                placeholder="e.g. Current Trends in SE"
                required
                value={name}
                onChange={(e) => { setName(e.target.value); setSuccess(''); }}
              />
            </div>

            {success && <div className="alert success" style={{ marginBottom: 16 }}>{success}</div>}

            <button type="submit" className="btn-primary-action" style={{ width: '100%', justifyContent: 'center' }}>
              Add Subject
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
