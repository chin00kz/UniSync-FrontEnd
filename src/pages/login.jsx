import { BoxesIcon } from "lucide-react"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-slate-50 relative overflow-hidden p-6 md:p-10">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] size-[400px] rounded-full bg-brand-blue/10 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] size-[400px] rounded-full bg-brand-pink/10 blur-[100px]" />

      <div className="flex w-full max-w-sm flex-col gap-8 relative z-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient text-white shadow-xl shadow-brand-blue/20">
            <BoxesIcon className="size-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Uni<span className="text-brand-blue">Sync</span>
            </h1>
            <p className="text-muted-foreground font-medium text-sm">UniSync Login Portal</p>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
