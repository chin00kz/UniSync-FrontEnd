import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './LiveLobby.css';

export default function LiveLobby() {
  const navigate = useNavigate();

  // --- MEDIA REFS ---
  // Using a callback ref instead of useRef so the stream is re-attached
  // every time the <video> element mounts (e.g. after view switches / zoom).
  const localStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const localVideoRef = useCallback((videoNode) => {
    if (videoNode && localStreamRef.current) {
      videoNode.srcObject = localStreamRef.current;
    }
  }, []);

  // --- STATE ---
  const CURRENT_USER_ID = 1;
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Selection & View States
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [focusedUserId, setFocusedUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Tab & Chat States
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const [participants, setParticipants] = useState([
    { id: 1, name: 'You (Host)', initials: 'YH', isMuted: false, isVideoOn: true },
    { id: 2, name: 'Alice Smith', initials: 'AS', isMuted: false, isVideoOn: true },
    { id: 3, name: 'Bob Johnson', initials: 'BJ', isMuted: true, isVideoOn: false },
    { id: 4, name: 'Charlie Davis', initials: 'CD', isMuted: false, isVideoOn: true },
    { id: 5, name: 'Diana Prince', initials: 'DP', isMuted: true, isVideoOn: true }
  ]);

  const [waitingUsers, setWaitingUsers] = useState([
    { id: 6, name: 'Eve Wilson', initials: 'EW' },
    { id: 7, name: 'Frank Thomas', initials: 'FT' }
  ]);

  const lobbyInfo = {
    name: 'IT3040 ITPM Revision',
    type: 'Private',
    inviteCode: 'LK1PJ9',
    maxParticipants: 30
  };

  const ITEMS_PER_PAGE = 4;
  const totalPages = Math.ceil(participants.length / ITEMS_PER_PAGE);

  if (currentPage >= totalPages && totalPages > 0) {
    setCurrentPage(totalPages - 1);
  }

  const visibleParticipants = participants.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const selectedUser = participants.find(p => p.id === selectedUserId);
  const hostUser = participants.find(p => p.id === CURRENT_USER_ID);
  const focusedUser = participants.find(p => p.id === focusedUserId);

  const getFormattedTime = () => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  // --- GET USER MEDIA + VOICE ACTIVITY DETECTION ---
  useEffect(() => {
    let isMounted = true;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        
        // React 18 StrictMode double-mount fix: 
        // If the component unmounted while we were waiting for permission,
        // stop the stream immediately so we don't leak camera usage.
        if (!isMounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        localStreamRef.current = stream;
        const videoEl = document.getElementById('local-video-feed');
        if (videoEl) videoEl.srcObject = stream;

        // Set up Web Audio AnalyserNode for voice activity detection.
        // KEY FIX: pass an audio-only copy of the stream to createMediaStreamSource.
        // Chrome's AudioContext holds a hard reference to whatever MediaStream you pass in.
        // If you pass the full stream (video + audio), Chrome keeps the camera "in use"
        // even after track.stop() — that's why the camera light stayed on.
        // Using a new MediaStream with only the audio tracks breaks that link so the
        // video track.stop() immediately releases the camera hardware.
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioCtx;
        const audioOnlyStream = new MediaStream(stream.getAudioTracks());
        const source = audioCtx.createMediaStreamSource(audioOnlyStream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.3;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const SPEAKING_THRESHOLD = 18; // 0-255 scale; tweak if too sensitive

        const detectSpeaking = () => {
          if (!isMounted) return;
          analyserRef.current?.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((sum, v) => sum + v, 0) / dataArray.length;
          // Note: using localStreamRef.current to check mute since participants is a stale closure here
          const isAudioEnabled = localStreamRef.current?.getAudioTracks()[0]?.enabled;
          setIsSpeaking(avg > SPEAKING_THRESHOLD && isAudioEnabled);
          animFrameRef.current = requestAnimationFrame(detectSpeaking);
        };
        animFrameRef.current = requestAnimationFrame(detectSpeaking);
      } catch (err) {
        if (!isMounted) return;
        console.error('Camera/mic access denied:', err);
        setParticipants(prev => prev.map(p => p.id === CURRENT_USER_ID ? { ...p, isVideoOn: false } : p));
      }
    };
    startCamera();
    return () => {
      isMounted = false;
      cancelAnimationFrame(animFrameRef.current);
      audioContextRef.current?.close();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }
    };
  }, []);

  // --- LOGICAL HANDLERS ---
  const handleTogglePersonalMute = () => {
    // Toggle real audio track
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setParticipants(prev => prev.map(p => p.id === CURRENT_USER_ID ? { ...p, isMuted: !p.isMuted } : p));
  };
  const handleTogglePersonalVideo = async () => {
    const currentUser = participants.find(p => p.id === CURRENT_USER_ID);
    if (!currentUser) return;

    if (currentUser.isVideoOn) {
      // Stop + remove in ONE loop — calling getVideoTracks() twice is unreliable
      // because Chrome auto-removes stopped tracks, making the second call return [].
      if (localStreamRef.current) {
        const videoTracks = localStreamRef.current.getVideoTracks();
        videoTracks.forEach(track => {
          track.stop();                              // releases camera hardware
          localStreamRef.current?.removeTrack(track); // clean up stream
        });
      }
      // Detach from the video element so the browser fully releases the device
      const videoEl = document.getElementById('local-video-feed');
      if (videoEl) videoEl.srcObject = null;
      setParticipants(prev => prev.map(p => p.id === CURRENT_USER_ID ? { ...p, isVideoOn: false } : p));
    } else {
      // Re-acquire camera only (audio already running)
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const [newVideoTrack] = newStream.getVideoTracks();
        if (localStreamRef.current) {
          localStreamRef.current.addTrack(newVideoTrack);
        } else {
          localStreamRef.current = newStream;
        }
        const videoEl = document.getElementById('local-video-feed');
        if (videoEl) videoEl.srcObject = localStreamRef.current;
        setParticipants(prev => prev.map(p => p.id === CURRENT_USER_ID ? { ...p, isVideoOn: true } : p));
      } catch (err) {
        console.error('Could not re-acquire camera:', err);
      }
    }
  };
  const handleSelectUser = (id) => setSelectedUserId(prev => prev === id ? null : id);
  const handleDoubleClickUser = (id) => setFocusedUserId(prev => prev === id ? null : id);
  const handleHostToggleMute = (id) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, isMuted: !p.isMuted } : p));
  };
  const handleHostToggleVideo = (id) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, isVideoOn: !p.isVideoOn } : p));
  };

  const handleKickUser = (id) => {
    if (id === CURRENT_USER_ID) return;
    const userToKick = participants.find(p => p.id === id);
    setParticipants(prev => prev.filter(p => p.id !== id));
    if (selectedUserId === id) setSelectedUserId(null);
    if (focusedUserId === id) setFocusedUserId(null);
    if (userToKick) {
      setMessages(prev => [...prev, {
        id: Date.now(), type: 'system', text: `${userToKick.name} was kicked.`, time: getFormattedTime()
      }]);
    }
  };

  const handleAdmitUser = (id) => {
    const userToAdmit = waitingUsers.find(u => u.id === id);
    if (userToAdmit) {
      setWaitingUsers(prev => prev.filter(u => u.id !== id));
      setParticipants(prev => [...prev, { ...userToAdmit, isMuted: false, isVideoOn: true }]);
      setMessages(prev => [...prev, {
        id: Date.now(), type: 'system', text: `${userToAdmit.name} joined.`, time: getFormattedTime()
      }]);
    }
  };

  const handleRejectUser = (id) => setWaitingUsers(prev => prev.filter(u => u.id !== id));
  const stopAllTracks = () => {
    // Cancel VAD loop and close AudioContext FIRST — keeping it open can
    // hold a reference to the stream and prevent the camera light from turning off.
    cancelAnimationFrame(animFrameRef.current);
    audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    // Stop every track and release the stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    // Detach from the video element so the browser fully releases the device
    const videoEl = document.getElementById('local-video-feed');
    if (videoEl) videoEl.srcObject = null;
  };

  const handleLeaveLobby = () => { stopAllTracks(); navigate('/'); };
  const handleEndMeeting = () => { stopAllTracks(); alert('Meeting Ended!'); navigate('/'); };
  const handleCopyCode = () => { navigator.clipboard.writeText(lobbyInfo.inviteCode); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(), type: 'chat', sender: hostUser.name, text: chatInput.trim(), time: getFormattedTime()
    }]);
    setChatInput('');
  };

  // Helper component to render a single video card
  const renderVideoCard = (user, isSmall = false) => (
    <div
      key={user.id}
      onClick={() => handleSelectUser(user.id)}
      onDoubleClick={() => handleDoubleClickUser(user.id)}
      className={`video-card ${selectedUserId === user.id ? 'is-speaking' : ''}`}
      title="Click to select, Double-click to focus"
    >
      {user.id === CURRENT_USER_ID ? (
        // Real camera feed for the local user
        user.isVideoOn ? (
          <div className="camera-feed">
            <video
              id="local-video-feed"
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
            />
          </div>
        ) : (
          <div className="avatar" style={isSmall ? { width: '50px', height: '50px', fontSize: '1.2rem' } : {}}>
            {user.initials}
          </div>
        )
      ) : (
        // Placeholder for remote users (no WebRTC peer yet)
        user.isVideoOn ? (
          <div className="camera-feed"><span className="camera-placeholder">📹 Live Feed</span></div>
        ) : (
          <div className="avatar" style={isSmall ? { width: '50px', height: '50px', fontSize: '1.2rem' } : {}}>
            {user.initials}
          </div>
        )
      )}
      <div className={`name-tag${user.id === CURRENT_USER_ID && isSpeaking ? ' mic-active' : ''}`}>
        {user.name}
        <div style={{ display: 'flex', gap: '5px' }}>
          {user.isMuted
            ? <span title="Muted" style={{ filter: 'grayscale(100%)', opacity: 0.6 }}>🔇</span>
            : <span title="Unmuted">🎤</span>
          }
          {!user.isVideoOn && <span title="Video Off" style={{ filter: 'grayscale(100%)', opacity: 0.6 }}>🚫</span>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="lobby-container">

      {/* MAIN VIDEO AREA */}
      <div className="main-area">
        {focusedUser ? (
          <div className="focused-container">
            <div className="focused-main">
              {renderVideoCard(focusedUser)}
            </div>
            <div className="focused-strip">
              {participants.filter(p => p.id !== focusedUserId).map(user => renderVideoCard(user, true))}
            </div>
          </div>
        ) : (
          <div className="carousel-container">
            <button className="nav-arrow" onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 0} title="Previous Page">
              &#8592;
            </button>
            <div className="video-grid">
              {visibleParticipants.map(user => renderVideoCard(user))}
            </div>
            <button className="nav-arrow" onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage >= totalPages - 1} title="Next Page">
              &#8594;
            </button>
          </div>
        )}

        {/* BOTTOM CONTROL BAR */}
        <div className="control-bar">
          <button
            onClick={handleTogglePersonalMute}
            className={`control-btn ${hostUser?.isMuted ? 'btn-red' : 'btn-blue'}`}
          >
            {hostUser?.isMuted ? '🔇 Unmute' : '🎤 Mute'}
          </button>
          <button onClick={handleTogglePersonalVideo} className={`control-btn ${!hostUser?.isVideoOn ? 'btn-red' : 'btn-dark'}`}>
            {!hostUser?.isVideoOn ? '🚫 Start Video' : '📷 Stop Video'}
          </button>

          {focusedUserId && (
            <button onClick={() => setFocusedUserId(null)} className="control-btn btn-dark" style={{ borderColor: 'var(--ll-primary-color)', color: 'var(--ll-primary-color)' }}>
              🔍 Zoom Out
            </button>
          )}

          <div className="divider"></div>
          <button onClick={handleLeaveLobby} className="control-btn btn-dark" style={{ color: '#ef4444' }}>Leave</button>
          <button onClick={handleEndMeeting} className="control-btn btn-solid-red">End Meeting</button>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="sidebar">

        {/* TOP: LOBBY INFO (Gradient Panel) */}
        <div className="info-panel">
          <h2>Room Information</h2>
          <div className="info-item"><span className="info-label">Name</span><span className="info-value">{lobbyInfo.name}</span></div>
          <div className="info-item"><span className="info-label">Capacity</span><span className="info-value">{participants.length} / {lobbyInfo.maxParticipants} Active</span></div>
          <div className="info-item">
            <span className="info-label">Invite Code</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
              <span className="code-value">{lobbyInfo.inviteCode}</span>
              <button onClick={handleCopyCode} className="control-btn" style={{ padding: '4px 10px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.9)', color: 'var(--ll-text-primary)' }}>
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* HOST ACTIONS FOR SELECTED USER */}
        {selectedUser && selectedUser.id !== CURRENT_USER_ID && (
          <div className="host-actions-panel">
            <h3>Host Actions: {selectedUser.name}</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleHostToggleMute(selectedUser.id)}
                className={`control-btn ${selectedUser.isMuted ? 'btn-blue' : 'btn-dark'}`}
                style={{ flex: 1, padding: '6px', fontSize: '0.8rem' }}
              >
                {selectedUser.isMuted ? 'Unmute' : 'Mute'}
              </button>
              <button
                onClick={() => handleHostToggleVideo(selectedUser.id)}
                className={`control-btn ${!selectedUser.isVideoOn ? 'btn-blue' : 'btn-dark'}`}
                style={{ flex: 1, padding: '6px', fontSize: '0.8rem' }}
              >
                {!selectedUser.isVideoOn ? 'Ask to Start' : 'Stop Video'}
              </button>
              <button
                onClick={() => handleKickUser(selectedUser.id)}
                className="control-btn btn-red"
                style={{ width: '100%', padding: '6px', marginTop: '4px', fontSize: '0.8rem' }}
              >
                Remove Participant
              </button>
            </div>
          </div>
        )}

        {/* TAB NAVIGATION */}
        <div className="tab-nav">
          <button className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
            Chat
          </button>
          <button className={`tab-btn ${activeTab === 'participants' ? 'active' : ''}`} onClick={() => setActiveTab('participants')}>
            Participants
          </button>
        </div>

        {/* TAB CONTENT CONTAINER */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

          {/* --- CHAT TAB --- */}
          {activeTab === 'chat' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="chat-area">
                {messages.length === 0 ? (
                  <div style={{ color: 'var(--ll-text-secondary)', textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>No messages yet. Say hi!</div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id}>
                      {msg.type === 'system' ? (
                        <div className="chat-system">
                          ({msg.time}) {msg.text}
                        </div>
                      ) : (
                        <div className="chat-msg">
                          <span className="chat-time">{msg.time}</span>
                          <span className={`chat-sender ${msg.sender === hostUser.name ? 'host' : 'other'}`}>{msg.sender}: </span>
                          <span className="chat-text">{msg.text}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleSendMessage} className="chat-input-form">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                  className="chat-input"
                />
                <button type="submit" className="control-btn btn-blue" style={{ padding: '0 16px' }}>
                  Send
                </button>
              </form>
            </div>
          )}

          {/* --- PARTICIPANTS TAB --- */}
          {activeTab === 'participants' && (
            <div className="participant-list-container">
              <h2 className="participant-header">In Meeting <span className="participant-count">{participants.length}</span></h2>
              <div style={{ marginBottom: '20px' }}>
                {participants.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleSelectUser(user.id)}
                    className={`participant-item ${selectedUserId === user.id ? 'selected' : ''}`}
                  >
                    <div className="participant-info">
                      <div className="participant-avatar">{user.initials}</div>
                      <span className="participant-name">{user.name}</span>
                    </div>
                    <div className="participant-status">
                      <span title={user.isMuted ? "Click to Unmute" : "Click to Mute"} className={`status-icon ${user.isMuted ? 'muted' : ''}`} style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleHostToggleMute(user.id); }}>{user.isMuted ? '🔇' : '🎤'}</span>
                      <span title={user.isVideoOn ? "Click to Stop Video" : "Click to Start Video"} className={`status-icon ${!user.isVideoOn ? 'video-off' : ''}`} style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleHostToggleVideo(user.id); }}>{user.isVideoOn ? '📷' : '🚫'}</span>
                    </div>
                  </div>
                ))}
              </div>

              {lobbyInfo.type === 'Private' && waitingUsers.length > 0 && (
                <div style={{ paddingTop: '15px', borderTop: '1px solid var(--ll-border-color)' }}>
                  <h2 className="participant-header" style={{ color: '#d97706' }}>Waiting Room <span className="participant-count" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>{waitingUsers.length}</span></h2>
                  <div>
                    {waitingUsers.map((user) => (
                      <div key={user.id} className="participant-item">
                        <div className="participant-info">
                          <div className="participant-avatar" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>{user.initials}</div>
                          <span className="participant-name">{user.name}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleAdmitUser(user.id)} className="control-btn btn-blue" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Admit</button>
                          <button onClick={() => handleRejectUser(user.id)} className="control-btn btn-red" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}