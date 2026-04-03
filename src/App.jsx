import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import LoginPage from "./pages/login"
import AdminWorkspace from "./pages/admin/workspace"
import StudentWorkspace from "./pages/student/workspace"
import TutorWorkspace from "./pages/tutor/workspace"
import ProtectedRoute from "./components/protected-route"
import MaintenancePage from "./pages/maintenance"
import { Loader2 } from "lucide-react"
import "./App.css"

function App() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('uniSyncSubjects');
    return saved ? JSON.parse(saved) : {
      "Year 1": [
        { code: "IT1010", name: "Introduction to Programming" },
        { code: "IT1020", name: "Computer Systems" },
        { code: "IT1030", name: "Mathematics for IT" }
      ],
      "Year 2": [
        { code: "IT2010", name: "Object Oriented Programming" },
        { code: "IT2020", name: "Database Management Systems" },
        { code: "SE2030", name: "Software Engineering" }
      ],
      "Year 3": [
        { code: "IT3040", name: "Data Structures & Algorithms" },
        { code: "SE3050", name: "Software Testing" },
        { code: "IT3060", name: "Network Engineering" }
      ],
      "Year 4": [
        { code: "IT4010", name: "Final Year Project" },
        { code: "IT4020", name: "Advanced Data Science" }
      ]
    };
  });

  const [notes, setNotes] = useState([]);

  // Fetch notes from backend on mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('/api/notes');
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          // Map backend notes to frontend format if needed
          setNotes(result.data.map(n => ({
            ...n,
            id: n._id || n.id,
            uploadedAt: n.createdAt,
          })));
        }
      } catch (err) {
        console.error('Failed to fetch notes:', err);
      }
    };
    fetchNotes();
  }, []);

  const [reportHistory, setReportHistory] = useState(() => {
    const saved = localStorage.getItem('uniSyncReportHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Apply theme as soon as possible (optimistically)
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(savedUser);

    // Fetch live system settings
    const fetchSettings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/settings");
        const result = await response.json();
        if (result.success && result.data) {
          if (result.data.maintenance_mode === true) {
            setIsMaintenanceMode(true);
          }
          // Live theme update
          if (result.data.system_theme === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setIsLoadingSettings(false);
      }
    };
    fetchSettings();
  }, []);

  // Listen for storage changes to sync user across tabs/sessions
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('uniSyncSubjects', JSON.stringify(subjects));
    localStorage.setItem('uniSyncNotes', JSON.stringify(notes));
    localStorage.setItem('uniSyncReportHistory', JSON.stringify(reportHistory));
  }, [subjects, notes, reportHistory]);

  // Notes Handlers
  const handleAddNote = (newNote) => setNotes(prev => [newNote, ...prev]);
  const handleDeleteNote = (id) => setNotes(prev => prev.filter(n => n.id !== id));
  const handleRateNote = (id, rating) => setNotes(prev => prev.map(n => n.id === id ? { ...n, rating } : n));
  const handleReportNote = (id, reason) => setNotes(prev => prev.map(n => n.id === id ? { ...n, isReported: true, reportReason: reason, reportedBy: user?.name } : n));

  const handleAdminRemoveNote = (noteId) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setReportHistory(prev => [{ noteTitle: note.title, action: 'Note Removed', handledBy: user?.name, date: new Date().toISOString() }, ...prev]);
      setNotes(prev => prev.filter(n => n.id !== noteId));
    }
  };

  const handleAdminDismissReport = (noteId) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setReportHistory(prev => [{ noteTitle: note.title, action: 'Dismissed', handledBy: user?.name, date: new Date().toISOString() }, ...prev]);
      setNotes(prev => prev.map(n => n.id === noteId ? { ...n, isReported: false } : n));
    }
  };

  const handleAddSubject = async (year, code, name) => {
  try {
    const response = await fetch("http://localhost:5000/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year, code, name }),
    });
    const result = await response.json();
    if (result.success) {
      // Optionally update local state or refetch subjects
      setSubjects(prev => {
        const existing = prev[year] || [];
        return { ...prev, [year]: [...existing, { code, name }] };
      });
    } else {
      alert(result.error || "Failed to add subject");
    }
  } catch (err) {
    alert("Error adding subject: " + err.message);
  }
};

  if (isLoadingSettings) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="size-10 animate-spin text-brand-blue" />
      </div>
    );
  }

  // Role checking helpers
  const isAdmin = user && ['admin', 'superadmin'].includes(user.role);
  const isModerator = user?.role === 'moderator';
  const canAccessDashboard = isAdmin || isModerator;

  // If maintenance mode is ON, and user is NOT an admin, intercept
  if (isMaintenanceMode && !isAdmin) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<MaintenancePage />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><AdminWorkspace initialPage="dashboard" user={user} notes={notes} subjects={subjects} onAddNote={handleAddNote} onDeleteNote={handleDeleteNote} onRateNote={handleRateNote} onReportNote={handleReportNote} onRemoveNote={handleAdminRemoveNote} onDismissReport={handleAdminDismissReport} onAddSubject={handleAddSubject} /></ProtectedRoute>} />
        <Route path="/dashboard/admins" element={<ProtectedRoute><AdminWorkspace initialPage="admins" user={user} /></ProtectedRoute>} />
        <Route path="/dashboard/users" element={<ProtectedRoute><AdminWorkspace initialPage="users" user={user} /></ProtectedRoute>} />
        <Route path="/dashboard/reports" element={<ProtectedRoute><AdminWorkspace initialPage="reports" user={user} /></ProtectedRoute>} />
        <Route path="/dashboard/audit-logs" element={<ProtectedRoute><AdminWorkspace initialPage="audit-logs" user={user} /></ProtectedRoute>} />
        <Route path="/dashboard/bans" element={<ProtectedRoute><AdminWorkspace initialPage="bans" user={user} /></ProtectedRoute>} />
        <Route path="/dashboard/account" element={<ProtectedRoute><AdminWorkspace initialPage="account" user={user} /></ProtectedRoute>} />
        <Route path="/dashboard/notes" element={<ProtectedRoute><AdminWorkspace initialPage="notes" user={user} notes={notes} subjects={subjects} onAddNote={handleAddNote} onDeleteNote={handleDeleteNote} onRateNote={handleRateNote} onReportNote={handleReportNote} onRemoveNote={handleAdminRemoveNote} onDismissReport={handleAdminDismissReport} onAddSubject={handleAddSubject} /></ProtectedRoute>} />
        <Route path="/dashboard/sessions" element={<ProtectedRoute><AdminWorkspace initialPage="sessions" user={user} /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute><AdminWorkspace initialPage="settings" user={user} /></ProtectedRoute>} />
        <Route path="/dashboard/add-subject" element={<ProtectedRoute><AdminWorkspace initialPage="add-subject" user={user} subjects={subjects} onAddSubject={handleAddSubject} /></ProtectedRoute>} />

        <Route path="/tutor" element={<ProtectedRoute><TutorWorkspace user={user} /></ProtectedRoute>} />
        <Route path="/tutor/dashboard" element={<ProtectedRoute><TutorWorkspace initialPage="dashboard" user={user} /></ProtectedRoute>} />
        <Route path="/tutor/bookings" element={<ProtectedRoute><TutorWorkspace initialPage="bookings" user={user} /></ProtectedRoute>} />
        <Route path="/tutor/sessionreview" element={<ProtectedRoute><TutorWorkspace initialPage="review" user={user} /></ProtectedRoute>} />
        <Route path="/tutor/account" element={<ProtectedRoute><TutorWorkspace initialPage="account" user={user} /></ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute><StudentWorkspace user={user} notes={notes} subjects={subjects} onAddNote={handleAddNote} onDeleteNote={handleDeleteNote} onRateNote={handleRateNote} onReportNote={handleReportNote} /></ProtectedRoute>} />
        <Route path="/student/dashboard" element={<ProtectedRoute><StudentWorkspace initialPage="dashboard" user={user} /></ProtectedRoute>} />
        <Route path="/student/notes" element={<ProtectedRoute><StudentWorkspace initialPage="notes" user={user} notes={notes} subjects={subjects} onAddNote={handleAddNote} onDeleteNote={handleDeleteNote} onRateNote={handleRateNote} onReportNote={handleReportNote} /></ProtectedRoute>} />
        <Route path="/student/tutors" element={<ProtectedRoute><StudentWorkspace initialPage="tutors" user={user} /></ProtectedRoute>} />
        <Route path="/student/session-lobby" element={<ProtectedRoute><StudentWorkspace initialPage="session-lobby" user={user} /></ProtectedRoute>} />
        <Route path="/student/live-lobby" element={<ProtectedRoute><StudentWorkspace initialPage="live-lobby" user={user} /></ProtectedRoute>} />
        <Route path="/student/post" element={<ProtectedRoute><StudentWorkspace initialPage="post" user={user} /></ProtectedRoute>} />
        <Route path="/student/history" element={<ProtectedRoute><StudentWorkspace initialPage="history" user={user} /></ProtectedRoute>} />
        <Route path="/student/account" element={<ProtectedRoute><StudentWorkspace initialPage="account" user={user} /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App