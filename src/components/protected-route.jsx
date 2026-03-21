import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null")

  if (!user || !user.id) {
    return <Navigate to="/login" replace />
  }

  return children
}
