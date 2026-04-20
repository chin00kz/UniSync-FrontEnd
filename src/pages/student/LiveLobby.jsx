import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  Copy, 
  Check, 
  Users, 
  MessageSquare, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Share2,
  Maximize2
} from 'lucide-react';
import {
  LiveKitRoom,
  useTracks,
  useLocalParticipant,
  RoomAudioRenderer,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';
import './LiveLobby.css';

// The Backend URL for token generation
const API_BASE_URL = 'http://localhost:5000/api/sessions';
const LIVEKIT_URL = 'wss://unisync-lobby-yhm6nffn.livekit.cloud';

export default function LiveLobby({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve roomName from navigation state (passed from SessionLobby)
  const roomNameFromState = location.state?.roomName || 'General Study Session';
  const inviteCodeFromState = location.state?.inviteCode || 'N/A';

  const isAdmin = user && ['admin', 'superadmin', 'moderator'].includes(user.role);
  const exitPath = isAdmin ? '/dashboard/sessions' : '/student/session-lobby';

  const { showToast, confirm } = useNotification();
  const [token, setToken] = useState(null);
  const [roomName, setRoomName] = useState(roomNameFromState);
  const [participantName, setParticipantName] = useState(user?.name || 'Student ' + Math.floor(Math.random() * 100));


  // Fetch token on mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/token?roomName=${encodeURIComponent(roomName)}&participantName=${encodeURIComponent(participantName)}`);
        const data = await response.json();
        if (data.token) {
          setToken(data.token);
        } else {
          console.error('Failed to get token:', data.error);
          showToast('Failed to connect to session server.', 'error');
        }
      } catch (err) {
        console.error('Error fetching LiveKit token:', err);
        showToast('Connection error. Please try again.', 'error');
      }
    };

    fetchToken();
  }, [roomName, participantName]);

  if (!token) {
    return (
      <div className="lobby-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
        <div className="loading-spinner">
          <h2>Initializing Secure Connection...</h2>
          <p>Connecting to LiveKit Cloud...</p>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={LIVEKIT_URL}
      onDisconnected={() => navigate(exitPath)}
      data-lk-theme="default"
      style={{ height: '100%' }}
    >
      <LiveKitLobbyContent roomName={roomName} inviteCode={inviteCodeFromState} user={user} showToast={showToast} confirm={confirm} />
    </LiveKitRoom>
  );
}

// Internal component to use LiveKit hooks within the context of LiveKitRoom
function LiveKitLobbyContent({ roomName, inviteCode, user, showToast, confirm }) {
  const navigate = useNavigate();
  const { localParticipant } = useLocalParticipant();
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [focusedTrack, setFocusedTrack] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);

  const lobbyInfo = {
    name: roomName,
    type: inviteCode !== 'N/A' ? 'Private' : 'Public',
    inviteCode: inviteCode,
    maxParticipants: 10
  };

  const ITEMS_PER_PAGE = 4;
  const totalPages = Math.ceil(tracks.length / ITEMS_PER_PAGE);
  const visibleTracks = tracks.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

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

  const handleCopyCode = () => {
    navigator.clipboard.writeText(lobbyInfo.inviteCode);
    setCopied(true);
    showToast('Invite code copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(), type: 'chat', sender: localParticipant?.identity || 'You', text: chatInput.trim(), time: getFormattedTime()
    }]);
    setChatInput('');
  };

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, activeTab]);

  const renderTrack = (trackReference, isStrip = false) => {
    const isLocal = trackReference.participant.identity === localParticipant?.identity;
    const isSpeaking = trackReference.participant.isSpeaking;
    const isCameraDisabled = !trackReference.participant.isCameraEnabled;

    return (
      <div 
        key={trackReference.participant.sid} 
        className={`video-card ${isStrip ? 'in-strip' : ''} ${isSpeaking ? 'is-speaking' : ''}`}
        onClick={() => !isStrip && setFocusedTrack(trackReference)}
      >
        <div className="camera-feed">
          {isCameraDisabled ? (
            <div className="avatar">
              {trackReference.participant.identity.substring(0, 2).toUpperCase()}
            </div>
          ) : (
            <VideoTrack track={trackReference.publication.track} isLocal={isLocal} />
          )}
        </div>
        
        <div className={`name-tag ${isSpeaking ? 'mic-active' : ''}`}>
          <span className="name-text">{trackReference.participant.identity} {isLocal ? '(You)' : ''}</span>
          <div className="status-icons">
            {!trackReference.participant.isMicrophoneEnabled && <MicOff size={12} className="text-red-500" />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="lobby-container">
      <RoomAudioRenderer />
      
      {/* MAIN VIDEO AREA */}
      <div className="main-area">
        {focusedTrack ? (
          <div className="focused-container">
            <div className="focused-main" onClick={() => setFocusedTrack(null)}>
              {renderTrack(focusedTrack)}
            </div>
            <div className="focused-strip">
              {tracks.filter(t => t !== focusedTrack).map(t => renderTrack(t, true))}
            </div>
          </div>
        ) : (
          <div className="carousel-container">
            <button className="nav-arrow" onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0}>
              <ChevronLeft size={24} />
            </button>
            <div className="video-grid">
              {visibleTracks.map(t => renderTrack(t))}
            </div>
            <button className="nav-arrow" onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))} disabled={currentPage >= totalPages - 1}>
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        {/* FLOATING CONTROL BAR */}
        <div className="control-bar-wrapper">
          <div className="control-bar">
            <button 
              onClick={() => localParticipant.setMicrophoneEnabled(!localParticipant.isMicrophoneEnabled)}
              className={`control-btn ${!localParticipant?.isMicrophoneEnabled ? 'btn-red' : 'btn-light'}`}
              title={localParticipant?.isMicrophoneEnabled ? 'Mute' : 'Unmute'}
            >
              {localParticipant?.isMicrophoneEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <button 
              onClick={() => localParticipant.setCameraEnabled(!localParticipant.isCameraEnabled)}
              className={`control-btn ${!localParticipant?.isCameraEnabled ? 'btn-red' : 'btn-light'}`}
              title={localParticipant?.isCameraEnabled ? 'Stop Video' : 'Start Video'}
            >
              {localParticipant?.isCameraEnabled ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
            
            <div className="divider"></div>
            
            <button className="control-btn btn-light" title="Share Screen">
              <Share2 size={20} />
            </button>
            
            <button className="control-btn btn-light" title="Settings">
              <Settings size={20} />
            </button>

            <button 
              onClick={async () => {
                const confirmed = await confirm({
                  title: 'Leave Session',
                  message: 'Are you sure you want to leave the live session?',
                  confirmText: 'Leave',
                  variant: 'destructive'
                });
                
                if (confirmed) {
                  const isAdmin = user && ['admin', 'superadmin', 'moderator'].includes(user.role);
                  navigate(isAdmin ? '/dashboard/sessions' : '/student/session-lobby');
                }
              }} 
              className="control-btn btn-danger-pill" 
              title="Leave Session"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="sidebar">
        <div className="info-panel">
          <div className="info-header">
            <div className="accent-dot"></div>
            <h2>Live Session</h2>
          </div>
          <div className="info-item">
            <span className="info-label">Room Name</span>
            <span className="info-value">{lobbyInfo.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Availability</span>
            <div className="info-row">
              <span className="info-value">{tracks.length} / {lobbyInfo.maxParticipants} Participants</span>
            </div>
          </div>
          <div className="info-item">
            <span className="info-label">Invite Access</span>
            <div className="invite-box">
              <span className="code-value">{lobbyInfo.inviteCode === 'N/A' ? 'Public' : lobbyInfo.inviteCode}</span>
              <button onClick={handleCopyCode} className="icon-btn-sm" title="Copy Invite Code">
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>

        <div className="tab-nav">
          <button className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
            <MessageSquare size={16} />
            Chat
          </button>
          <button className={`tab-btn ${activeTab === 'participants' ? 'active' : ''}`} onClick={() => setActiveTab('participants')}>
            <Users size={16} />
            Participants
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'chat' && (
            <div className="chat-table">
              <div className="chat-header-grid">
                <div>Time</div>
                <div>Sender</div>
                <div>Message</div>
              </div>
              <div className="chat-area">
                {messages.map(msg => (
                  <div key={msg.id} className="chat-row-grid">
                    <div className="chat-time-col">{msg.time}</div>
                    <div className={`chat-sender-col ${msg.sender === (localParticipant?.identity || 'You') ? 'host' : ''}`}>
                      {msg.sender}
                    </div>
                    <div className="chat-text-col">{msg.text}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="chat-input-form">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a message..." className="chat-input" />
                <button type="submit" className="control-btn btn-blue" style={{ background: 'var(--ll-brand-primary)', color: 'white', borderRadius: '100px', width: 'auto', padding: '0 20px' }}>Send</button>
              </form>
            </div>
          )}

          {activeTab === 'participants' && (
            <div className="participant-table">
              <div className="participant-header-grid">
                <div>#</div>
                <div>Participant Name</div>
                <div>Status</div>
              </div>
              <div className="participant-list-container">
                {tracks.map((t) => (
                  <div key={t.participant.sid} className="participant-row-grid">
                    <div className="participant-avatar-col">
                      {t.participant.identity.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="participant-name-col">
                      {t.participant.identity} {t.participant.identity === localParticipant?.identity ? '(You)' : ''}
                    </div>
                    <div className={`participant-status-col ${t.participant.isMicrophoneEnabled ? 'active' : ''}`}>
                      {t.participant.isMicrophoneEnabled ? 'Live' : 'Muted'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper to render individual video tracks
function VideoTrack({ track, isLocal }) {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current) {
      track.attach(videoRef.current);
    }
    return () => {
      track.detach();
    };
  }, [track]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={isLocal}
      style={{ width: '100%', height: '100%', objectFit: 'cover', transform: isLocal ? 'scaleX(-1)' : 'none' }}
    />
  );
}