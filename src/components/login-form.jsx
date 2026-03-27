import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function LoginForm({
  className,
  ...props
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const normalizedEmail = email.trim().toLowerCase()

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail, password }),
      })

      const data = await response.json()

      if (data.success) {
        // Successful login
        const userToStore = {
          id: data.id,
          role: data.role,
          name: data.name,
          email: data.email || normalizedEmail
        }
        console.log("Storing in localStorage:", userToStore)
        localStorage.setItem("user", JSON.stringify(userToStore))
        
        // Role-based redirection
        if (data.role === "staff") {
          navigate("/tutor/dashboard")
        } else if (data.role === "student") {
          navigate("/student/dashboard")
        } else {
          navigate("/dashboard")
        }
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="premium-card border-slate-200/60 shadow-2xl shadow-slate-200/50">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-xl font-bold">Secure Login</CardTitle>
          <CardDescription className="text-xs font-medium">
            Enter your SLIIT credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {error && (
                <Alert variant="destructive" className="py-2.5">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="text-xs font-bold uppercase tracking-tight">Login Failed</AlertTitle>
                  <AlertDescription className="text-xs font-medium">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              <div className="grid gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="email">Work Email</label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@sliit.lk" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-50/50 focus:ring-brand-blue/20"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="password">Password</label>
                  <a href="#" className="ml-auto text-[10px] font-bold text-brand-blue hover:text-brand-pink transition-colors">
                    Reset Password
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-50/50 focus:ring-brand-blue/20"
                />
              </div>
              <Button type="submit" className="w-full brand-gradient border-0 text-sm font-bold shadow-lg shadow-brand-blue/25 hover:opacity-90 active:scale-[0.98] transition-all" disabled={isLoading}>
                {isLoading ? "Authenticating..." : "Sign In to Dashboard"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary px-6 text-center text-xs">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
