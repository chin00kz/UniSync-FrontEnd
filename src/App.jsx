import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/login"
import DashboardPage from "./pages/dashboard"
import AdminManagementPage from "./pages/admin-management"
import UserManagementPage from "./pages/user-management"
import ReportsPage from "./pages/reports"
import AuditLogsPage from "./pages/audit-logs"
import BannedUsersPage from "./pages/banned-users"
import AccountPage from "./pages/account"
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
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
