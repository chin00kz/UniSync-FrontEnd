import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import LoginPage from "./pages/login"
import DashboardPage from "./pages/admin/dashboard"
import AdminManagementPage from "./pages/admin/admin-management"
import UserManagementPage from "./pages/admin/user-management"
import ReportsPage from "./pages/admin/reports"
import AuditLogsPage from "./pages/admin/audit-logs"
import BannedUsersPage from "./pages/admin/banned-users"
import AccountPage from "./pages/admin/account"
import TutorDashboard from "./pages/TutorDashboard"
import SessionReview from "./pages/SessionReview"
import StudentPost from "./pages/StudentPost"
import ProtectedRoute from "./components/protected-route"
import "./App.css"

function TutorWorkspace({ initialPage = "dashboard" }) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [questions, setQuestions] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  const fetchSessions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sessions")
      setQuestions(res.data)
    } catch (err) {
      console.error("Fetch error:", err)
    }
  }

  useEffect(() => {
    void fetchSessions()
  }, [])

  useEffect(() => {
    setCurrentPage(initialPage)
  }, [initialPage])

  const handleSelectQuestion = (id) => {
    setSelectedId(id)
    setCurrentPage("review")
  }

  const handleUpdate = async (id, status, reply, replyImage) => {
    try {
      await axios.patch(`http://localhost:5000/api/sessions/${id}`, {
        status,
        replyText: reply,
        replyImage,
      })
      void fetchSessions()
    } catch {
      alert("Update failed")
    }
  }

  return (
    <div style={{ display: "flex", width: "100vw", minHeight: "100vh", backgroundColor: "#f4f7fe", fontFamily: "Inter, sans-serif" }}>
      <aside style={{ width: "280px", backgroundColor: "#0b1437", color: "white", padding: "40px 20px", display: "flex", flexDirection: "column" }}>
        <h2 style={{ marginBottom: "50px" }}>UniSync</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div onClick={() => { setCurrentPage("dashboard"); setSelectedId(null) }} style={{ padding: "15px", borderRadius: "12px", cursor: "pointer", backgroundColor: currentPage === "dashboard" ? "#4318ff" : "transparent" }}>Dashboard</div>
          <div onClick={() => { setCurrentPage("review"); setSelectedId(null) }} style={{ padding: "15px", borderRadius: "12px", cursor: "pointer", backgroundColor: currentPage === "review" ? "#4318ff" : "transparent" }}>Session Reviews</div>
          <div onClick={() => setCurrentPage("post")} style={{ padding: "15px", borderRadius: "12px", cursor: "pointer", backgroundColor: currentPage === "post" ? "#4318ff" : "transparent" }}>Ask Question</div>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
        {currentPage === "dashboard" && <TutorDashboard questions={questions} onAction={handleSelectQuestion} />}
        {currentPage === "review" && <SessionReview questions={questions} onUpdate={handleUpdate} initialSelectedId={selectedId} />}
        {currentPage === "post" && <StudentPost onPostSuccess={() => { void fetchSessions(); setCurrentPage("dashboard") }} />}
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/admins" element={<ProtectedRoute><AdminManagementPage /></ProtectedRoute>} />
        <Route path="/dashboard/users" element={<ProtectedRoute><UserManagementPage /></ProtectedRoute>} />
        <Route path="/dashboard/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/dashboard/audit-logs" element={<ProtectedRoute><AuditLogsPage /></ProtectedRoute>} />
        <Route path="/dashboard/bans" element={<ProtectedRoute><BannedUsersPage /></ProtectedRoute>} />
        <Route path="/dashboard/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="/tutor" element={<TutorWorkspace />} />
        <Route path="/tutor/dashboard" element={<TutorWorkspace initialPage="dashboard" />} />
        <Route path="/tutor/sessionreview" element={<TutorWorkspace initialPage="review" />} />
        <Route path="/tutor/studentpost" element={<TutorWorkspace initialPage="post" />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App