import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"

export default function ProtectedRoute({ children }) {
  const [isVerifying, setIsVerifying] = useState(true)
  const navigate = useNavigate()
  
  // Directly read to ensure we have the most current value on every re-render
  // This is safe because ProtectedRoute re-renders on route changes
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

        if (!data.success || data.data.isBanned) {
          localStorage.removeItem("user")
          // Dispatch event so App.jsx knows to update its user state
          window.dispatchEvent(new Event("storage"))
          navigate("/login", { replace: true })
        } else {
          const freshUser = {
            id: data.data._id,
            role: data.data.role,
            name: data.data.name,
            email: data.data.email
          }
          const currentUserStr = localStorage.getItem("user")
          const freshUserStr = JSON.stringify(freshUser)
          
          if (currentUserStr !== freshUserStr) {
            localStorage.setItem("user", freshUserStr)
            window.dispatchEvent(new Event("storage"))
          }
        }
      } catch (error) {
        console.error("Session verification failed:", error)
      } finally {
        setIsVerifying(false)
      }
    }

    verifySession()
  }, [user?.id]) // navigation removed from deps to prevent loops

  if (!user || !user.id) {
    return <Navigate to="/login" replace />
  }

  if (isVerifying) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-brand-blue" />
      </div>
    )
  }

  // Redirect based on role if they are in the wrong side of the portal
  // Staff should go to /tutor/, Admins should go to /dashboard/
  const path = window.location.pathname

  if (user.role === "staff" && path.startsWith("/dashboard")) {
    return <Navigate to="/tutor/dashboard" replace />
  }

  if (user.role === "student" && (path.startsWith("/dashboard") || path.startsWith("/tutor"))) {
    return <Navigate to="/student/dashboard" replace />
  }

  if ((user.role === "admin" || user.role === "superadmin") && path.startsWith("/tutor")) {
    // Admins are naturally allowed to see everything, but let's keep them in the admin dashboard by default
    // or just let them stay if they explicitly went there.
  }

  return children
}
