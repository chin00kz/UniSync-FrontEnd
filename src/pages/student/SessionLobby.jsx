import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SessionLobby.css';

function SessionLobby() {
  const navigate = useNavigate();
  const [currentUserObj, setCurrentUserObj] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      navigate('/login');
    } else {
      setCurrentUserObj(JSON.parse(userStr));
    }
  }, [navigate]);

  // Existing Logic States
  const [lobbies, setLobbies] = useState([
    { id: 1, ownerId: 'A1', name: 'Software Engineering Revision', type: 'Public', maxParticipants: 10, privateCode: null },
    { id: 2, ownerId: 'A1', name: 'Math Quiz Group', type: 'Public', maxParticipants: 5, privateCode: null },
    { id: 3, ownerId: 'S2', name: 'UI/UX Mockup Brainstorm', type: 'Private', maxParticipants: 4, privateCode: 'UXS321' }
  ]);
  const [formData, setFormData] = useState({
    lobbyName: '',
    lobbyType: 'Public',
    maxParticipants: 2,
  });

  const [privateCode, setPrivateCode] = useState('');
  const [error, setError] = useState('');

  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [selectedLobby, setSelectedLobby] = useState(null);
  const [enteredCode, setEnteredCode] = useState('');
  const [joinError, setJoinError] = useState('');

  const [muteAudio, setMuteAudio] = useState(false);
  const [muteMic, setMuteMic] = useState(false);
  const [muteVideo, setMuteVideo] = useState(false);

  // Edit Lobby States
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editFormData, setEditFormData] = useState({ id: null, lobbyName: '', lobbyType: 'Public', maxParticipants: 2 });

  // Handlers
  const generatePrivateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'maxParticipants' ? parseInt(value) : value,
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { lobbyName, lobbyType, maxParticipants } = formData;

    if (maxParticipants < 2 || maxParticipants > 10) {
      setError('Max participants must be between 2 and 10.');
      return;
    }

    const newLobby = {
      id: lobbies.length + 1,
      ownerId: currentUserObj?.id,
      name: lobbyName,
      type: lobbyType,
      maxParticipants,
      privateCode: lobbyType === 'Private' ? generatePrivateCode() : null,
    };

    setLobbies((prev) => [...prev, newLobby]);
    setPrivateCode(newLobby.privateCode || '');
    setFormData({ lobbyName: '', lobbyType: 'Public', maxParticipants: 2 });
    setError('');
  };

  const populateDummyData = () => {
    const types = ['Public', 'Private'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const names = ['Pre-Exam Study Group', 'DSA Algorithm Practice', 'React UI Planning', 'Late Night Cram Session'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomLimit = Math.floor(Math.random() * 9) + 2;

    setFormData({ lobbyName: randomName, lobbyType: randomType, maxParticipants: randomLimit });
    setError('');
  };

  const handleJoinClick = (lobby) => {
    setSelectedLobby(lobby);
    setEnteredCode('');
    setJoinError('');
    setMuteAudio(false);
    setMuteMic(false);
    setMuteVideo(false);
    setJoinModalVisible(true);
  };

  const handleJoinSubmit = () => {
    if (!selectedLobby) return;
    const joinMessageSuffix = `\n(Audio: ${muteAudio ? 'Off' : 'On'}, Mic: ${muteMic ? 'Off' : 'On'}, Video: ${muteVideo ? 'Off' : 'On'})`;

    if (selectedLobby.type === 'Private') {
      if (enteredCode.toUpperCase() === selectedLobby.privateCode) {
        alert(`Access Granted! Joined Private Lobby: ${selectedLobby.name}${joinMessageSuffix}`);
        setJoinModalVisible(false);
      } else {
        setJoinError('Invalid Invite Code. Please try again.');
      }
    } else {
      alert(`Successfully joined Public Lobby: ${selectedLobby.name}${joinMessageSuffix}`);
      setJoinModalVisible(false);
    }
  };

  const handleShareLink = (lobbyId) => {
    const mockLink = `http://localhost:5173/lobby/${lobbyId}`;
    navigator.clipboard.writeText(mockLink);
    alert(`Lobby Link copied to clipboard!\n${mockLink}`);
  };

  const handleDeleteLobby = (lobbyId) => {
    if (window.confirm("Are you sure you want to delete this lobby?")) {
      setLobbies((prev) => prev.filter(l => l.id !== lobbyId));
    }
  };

  const handleEditLobbyClick = (lobby) => {
    setEditFormData({
      id: lobby.id,
      lobbyName: lobby.name,
      lobbyType: lobby.type,
      maxParticipants: lobby.maxParticipants
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editFormData.maxParticipants < 2 || editFormData.maxParticipants > 10) {
      alert('Max participants must be between 2 and 10.');
      return;
    }

    setLobbies(prev => prev.map(l => {
      if (l.id === editFormData.id) {
        return {
          ...l,
          name: editFormData.lobbyName,
          type: editFormData.lobbyType,
          maxParticipants: editFormData.maxParticipants,
          privateCode: (editFormData.lobbyType === 'Private' && l.type !== 'Private') ? generatePrivateCode() : l.privateCode
        };
      }
      return l;
    }));
    setEditModalVisible(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  if (!currentUserObj) return null; // Avoid render errors before redirect happens

  const currentUser = currentUserObj.name;
  const isAdmin = currentUserObj.role === 'admin';

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <aside className="sidebar-container">
        <div className="sidebar-header">
          <div className="sidebar-logo-icon">U</div>
          <div className="sidebar-logo-text">
            <span className="brand">UniSync</span>
            <span className="portal">LOBBY PORTAL</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Platform</div>
            <a className="sidebar-link active">
              <span className="nav-icon">⏱</span> Dashboard
            </a>
            <a className="sidebar-link">
              <span className="nav-icon">⚇</span> {isAdmin ? 'User Management' : 'My Friends'}
            </a>
            {isAdmin && (
              <>
                <a className="sidebar-link">
                  <span className="nav-icon">►</span> Moderation
                </a>
                <a className="sidebar-link">
                  <span className="nav-icon">⊡</span> System Logs
                </a>
              </>
            )}
          </div>
          <div className="nav-section">
            <div className="nav-section-title">Projects</div>
            <a className="sidebar-link">
              <span className="nav-icon">...</span> More
            </a>
          </div>
        </nav>

        <div className="sidebar-footer" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '12px' }}>
            <div className="user-avatar">{currentUserObj.initials}</div>
            <div className="user-info">
              <span className="user-name">{currentUserObj.name}</span>
              <span className="user-email">{currentUserObj.role === 'admin' ? 'Admin Access' : currentUserObj.email}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-secondary" style={{ width: '100%', padding: '6px', fontSize: '0.8rem', border: 'none', background: '#ffe4e6', color: '#e11d48' }}>Log Out</button>
        </div>
      </aside>

      {/* MAIN CONTENT DIV */}
      <main className="main-wrapper">
        <div className="top-breadcrumb">
          <span className="breadcrumb-icon">◫</span>
          UniSync &gt; <span className="current">{isAdmin ? 'Admin Dashboard' : 'Student Portal'}</span>
        </div>

        <div className="page-content">
          <div className="gradient-banner"></div>

          <div className="page-header">
            <p>Create and join study groups to collaborate with your peers.</p>
          </div>

          {/* SUMMARY CARDS (Optional, simulating screenshot) */}
          <div className="summary-cards">
            <div className="sum-card">
              <div className="sum-title">{isAdmin ? 'Total Active Lobbies' : 'My Created Lobbies'}</div>
              <div className="sum-value">{isAdmin ? lobbies.length : lobbies.filter(l => l.ownerId === currentUserObj.id).length}</div>
              <div className="sum-desc">{isAdmin ? 'Currently open for joining' : 'Lobbies controlled by you'}</div>
              <div className="sum-icon-bg">👥</div>
            </div>
            <div className="sum-card">
              <div className="sum-title">Total Participants Limit</div>
              <div className="sum-value">{lobbies.reduce((acc, curr) => acc + curr.maxParticipants, 0)}</div>
              <div className="sum-desc">Maximum capacity</div>
              <div className="sum-icon-bg">🛡️</div>
            </div>
            <div className="sum-card">
              <div className="sum-title">Public Lobbies</div>
              <div className="sum-value">{lobbies.filter(l => l.type === 'Public').length}</div>
              <div className="sum-desc">Open to everyone</div>
              <div className="sum-icon-bg">📄</div>
            </div>
            <div className="sum-card">
              <div className="sum-title">Private Lobbies</div>
              <div className="sum-value">{lobbies.filter(l => l.type === 'Private').length}</div>
              <div className="sum-desc">Invite code required</div>
              <div className="sum-icon-bg">📈</div>
            </div>
          </div>

          <div className="dashboard-grid">
            {/* LOBBY BROWSER (Main Table Area) */}
            <div className="card">
              <h2 className="card-title">Lobby Browser</h2>
              {lobbies.length === 0 ? (
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>No active lobbies found. Create one to get started!</p>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Lobby Name</th>
                        <th>Type</th>
                        <th>Max Limit</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lobbies.map((lobby) => {
                        const canManage = currentUserObj.role === 'admin' || (currentUserObj.role === 'student' && lobby.ownerId === currentUserObj.id);
                        return (
                          <tr key={lobby.id}>
                            <td style={{ fontWeight: '600', color: "var(--text-primary)" }}>{lobby.name}</td>
                            <td>
                              <span className={`badge ${lobby.type === 'Private' ? 'private' : 'public'}`}>
                                {lobby.type}
                              </span>
                            </td>
                            <td>{lobby.maxParticipants}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleJoinClick(lobby)} className="btn btn-secondary btn-action" style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}>
                                  Join
                                </button>
                                <button onClick={() => handleShareLink(lobby.id)} className="btn btn-secondary btn-action">
                                  Share
                                </button>
                                {canManage && (
                                  <>
                                    <button onClick={() => handleEditLobbyClick(lobby)} className="btn btn-secondary btn-action">
                                      Edit
                                    </button>
                                    <button onClick={() => handleDeleteLobby(lobby.id)} className="btn btn-action" style={{ borderColor: '#ef4444', color: '#ef4444', background: 'transparent' }}>
                                      Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* CREATE A LOBBY PANEL (Right Side Quick Actions Equivalent) */}
            <div className="card quick-actions-card">
              <h2 className="card-title">{isAdmin ? 'System Broadcast' : 'Quick Actions'}</h2>
              <p className="qa-description">{isAdmin ? 'Create an official public room for the network.' : 'Create a new lobby room.'}</p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Lobby Name</label>
                  <input
                    type="text"
                    name="lobbyName"
                    value={formData.lobbyName}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="E.g. React UI Planning"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    name="lobbyType"
                    value={formData.lobbyType}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">Max Participants</label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    min="2"
                    max="10"
                    required
                    className="form-input"
                  />
                </div>

                {error && <div className="alert-error">{error}</div>}
                {privateCode && (
                  <div className="alert-success">
                    Private Lobby Created! Code: <strong>{privateCode}</strong>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary-gradient">
                    Create Lobby
                  </button>
                  <button type="button" onClick={populateDummyData} className="btn btn-secondary" style={{ width: '100%' }}>
                    Populate Dummy Data
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </main>

      {/* JOIN MODAL */}
      {joinModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Meeting Pre-Check</h2>
            </div>

            <div className="modal-body">
              <div style={{ marginBottom: '20px', fontSize: '1rem' }}>
                Joining <strong style={{ color: 'var(--text-primary)' }}>{selectedLobby?.name}</strong>
                <span className="badge" style={{ marginLeft: '10px', backgroundColor: '#e2e8f0' }}>{selectedLobby?.type}</span>
              </div>

              <div style={{ marginBottom: '24px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Joining as: </span>
                <strong style={{ fontSize: '0.9rem' }}>{currentUser}</strong>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem' }}>Entry Preferences</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={muteAudio} onChange={(e) => setMuteAudio(e.target.checked)} />
                    Mute system audio upon entry
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={muteMic} onChange={(e) => setMuteMic(e.target.checked)} />
                    Mute my microphone upon entry
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={muteVideo} onChange={(e) => setMuteVideo(e.target.checked)} />
                    Turn off video upon entry
                  </label>
                </div>
              </div>

              {selectedLobby?.type === 'Private' && (
                <div style={{ padding: '16px', backgroundColor: '#fffbeb', border: '1px solid #fef08a', borderRadius: '8px' }}>
                  <label className="form-label" style={{ color: '#854d0e' }}>
                    Private Meeting Code Required
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 6-character code"
                    value={enteredCode}
                    onChange={(e) => { setEnteredCode(e.target.value); setJoinError(''); }}
                    className="form-input"
                    style={{ textTransform: 'uppercase', borderColor: '#fde047' }}
                  />
                  {joinError && <div style={{ color: '#991b1b', fontSize: '0.8rem', marginTop: '6px' }}>{joinError}</div>}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setJoinModalVisible(false)}>
                Cancel
              </button>
              <button className="btn btn-primary-gradient" onClick={handleJoinSubmit}>
                Join Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Lobby</h2>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Lobby Name</label>
                  <input
                    type="text"
                    value={editFormData.lobbyName}
                    onChange={(e) => setEditFormData({ ...editFormData, lobbyName: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    value={editFormData.lobbyType}
                    onChange={(e) => setEditFormData({ ...editFormData, lobbyType: e.target.value })}
                    className="form-select"
                  >
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">Max Participants</label>
                  <input
                    type="number"
                    value={editFormData.maxParticipants}
                    onChange={(e) => setEditFormData({ ...editFormData, maxParticipants: parseInt(e.target.value) })}
                    min="2"
                    max="10"
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditModalVisible(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary-gradient">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionLobby;