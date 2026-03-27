import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom"
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
import StudentWorkspace from "./pages/student/workspace"
import TutorWorkspace from "./pages/tutor/workspace"
import ProtectedRoute from "./components/protected-route"
import "./App.css"

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
        <Route path="/tutor" element={<ProtectedRoute><TutorWorkspace /></ProtectedRoute>} />
        <Route path="/tutor/dashboard" element={<ProtectedRoute><TutorWorkspace initialPage="dashboard" /></ProtectedRoute>} />
        <Route path="/tutor/sessionreview" element={<ProtectedRoute><TutorWorkspace initialPage="review" /></ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute><StudentWorkspace /></ProtectedRoute>} />
        <Route path="/student/dashboard" element={<ProtectedRoute><StudentWorkspace initialPage="dashboard" /></ProtectedRoute>} />
        <Route path="/student/post" element={<ProtectedRoute><StudentWorkspace initialPage="post" /></ProtectedRoute>} />
        <Route path="/student/account" element={<ProtectedRoute><StudentWorkspace initialPage="account" /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App