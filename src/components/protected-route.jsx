import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { Loader2Icon } from "lucide-react"

export default function ProtectedRoute({ children }) {
  const [isVerifying, setIsVerifying] = useState(true)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "null")

  useEffect(() => {
    if (!user || !user.id) {
      setIsVerifying(false)
      return
    }

    const verifySession = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/me`, {
          headers: { "x-admin-id": user.id }
        })
        const data = await response.json()
        
        // If user is banned or not found, clear session and kick them out
        if (!data.success || data.data.isBanned) {
          localStorage.removeItem("user")
          navigate("/login", { replace: true })
        } else {
          // Sync fresh data (like role changes) to local storage
          const freshUser = { 
            id: data.data._id, 
            role: data.data.role, 
            name: data.data.name, 
            email: data.data.email 
          }
          localStorage.setItem("user", JSON.stringify(freshUser))
        }
      } catch (error) {
        console.error("Session verification failed:", error)
      } finally {
        setIsVerifying(false)
      }
    }

    verifySession()
  }, [user?.id, navigate])

  if (!user || !user.id) {
    return <Navigate to="/login" replace />
  }

  if (isVerifying) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2Icon className="size-8 animate-spin text-brand-blue" />
      </div>
    )
  }

  return children
}
