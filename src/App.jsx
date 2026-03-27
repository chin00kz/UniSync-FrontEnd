import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import LoginPage from "./pages/login"
import AdminWorkspace from "./pages/admin/workspace"
import StudentWorkspace from "./pages/student/workspace"
import TutorWorkspace from "./pages/tutor/workspace"
import ProtectedRoute from "./components/protected-route"
import "./App.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><AdminWorkspace initialPage="dashboard" /></ProtectedRoute>} />
        <Route path="/dashboard/admins" element={<ProtectedRoute><AdminWorkspace initialPage="admins" /></ProtectedRoute>} />
        <Route path="/dashboard/users" element={<ProtectedRoute><AdminWorkspace initialPage="users" /></ProtectedRoute>} />
        <Route path="/dashboard/reports" element={<ProtectedRoute><AdminWorkspace initialPage="reports" /></ProtectedRoute>} />
        <Route path="/dashboard/audit-logs" element={<ProtectedRoute><AdminWorkspace initialPage="audit-logs" /></ProtectedRoute>} />
        <Route path="/dashboard/bans" element={<ProtectedRoute><AdminWorkspace initialPage="bans" /></ProtectedRoute>} />
        <Route path="/dashboard/account" element={<ProtectedRoute><AdminWorkspace initialPage="account" /></ProtectedRoute>} />

        <Route path="/tutor" element={<ProtectedRoute><TutorWorkspace /></ProtectedRoute>} />
        <Route path="/tutor/dashboard" element={<ProtectedRoute><TutorWorkspace initialPage="dashboard" /></ProtectedRoute>} />
        <Route path="/tutor/bookings" element={<ProtectedRoute><TutorWorkspace initialPage="bookings" /></ProtectedRoute>} />
        <Route path="/tutor/sessionreview" element={<ProtectedRoute><TutorWorkspace initialPage="review" /></ProtectedRoute>} />
        <Route path="/tutor/account" element={<ProtectedRoute><TutorWorkspace initialPage="account" /></ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute><StudentWorkspace /></ProtectedRoute>} />
        <Route path="/student/dashboard" element={<ProtectedRoute><StudentWorkspace initialPage="dashboard" /></ProtectedRoute>} />
        <Route path="/student/materials" element={<ProtectedRoute><StudentWorkspace initialPage="materials" /></ProtectedRoute>} />
        <Route path="/student/tutors" element={<ProtectedRoute><StudentWorkspace initialPage="tutors" /></ProtectedRoute>} />
        <Route path="/student/post" element={<ProtectedRoute><StudentWorkspace initialPage="post" /></ProtectedRoute>} />
        <Route path="/student/history" element={<ProtectedRoute><StudentWorkspace initialPage="history" /></ProtectedRoute>} />
        <Route path="/student/account" element={<ProtectedRoute><StudentWorkspace initialPage="account" /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App