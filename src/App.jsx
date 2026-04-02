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

  if (isLoadingSettings) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="size-10 animate-spin text-brand-blue" />
      </div>
    );
  }

  // Determine if the current user is an admin
  const isAdmin = user && ['admin', 'superadmin', 'moderator'].includes(user.role);

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
        <Route path="/dashboard" element={<ProtectedRoute><AdminWorkspace initialPage="dashboard" user={user} /></ProtectedRoute>} />
        <Route path="/dashboard/admins" element={<ProtectedRoute><AdminWorkspace initialPage="admins" user={user} /></ProtectedRoute>} />
        <Route path="/dashboard/users" element={<ProtectedRoute><AdminWorkspace initialPage="users" user={user} /></ProtectedRoute>} />
        <Route path="/dashboard/reports" element={<ProtectedRoute><AdminWorkspace initialPage="reports" user={user} /></ProtectedRoute>} />
        <Route path="/dashboard/audit-logs" element={<ProtectedRoute><AdminWorkspace initialPage="audit-logs" user={user} /></ProtectedRoute>} />
        <Route path="/dashboard/bans" element={<ProtectedRoute><AdminWorkspace initialPage="bans" user={user} /></ProtectedRoute>} />
        <Route path="/dashboard/account" element={<ProtectedRoute><AdminWorkspace initialPage="account" user={user} /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute><AdminWorkspace initialPage="settings" user={user} /></ProtectedRoute>} />

        <Route path="/tutor" element={<ProtectedRoute><TutorWorkspace user={user} /></ProtectedRoute>} />
        <Route path="/tutor/dashboard" element={<ProtectedRoute><TutorWorkspace initialPage="dashboard" user={user} /></ProtectedRoute>} />
        <Route path="/tutor/bookings" element={<ProtectedRoute><TutorWorkspace initialPage="bookings" user={user} /></ProtectedRoute>} />
        <Route path="/tutor/sessionreview" element={<ProtectedRoute><TutorWorkspace initialPage="review" user={user} /></ProtectedRoute>} />
        <Route path="/tutor/account" element={<ProtectedRoute><TutorWorkspace initialPage="account" user={user} /></ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute><StudentWorkspace user={user} /></ProtectedRoute>} />
        <Route path="/student/dashboard" element={<ProtectedRoute><StudentWorkspace initialPage="dashboard" user={user} /></ProtectedRoute>} />
        <Route path="/student/materials" element={<ProtectedRoute><StudentWorkspace initialPage="materials" user={user} /></ProtectedRoute>} />
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