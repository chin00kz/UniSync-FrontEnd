import { ShieldAlertIcon, WrenchIcon, ArrowLeftIcon, CpuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MaintenancePage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/90 backdrop-blur-sm">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-blue/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-pink/20 blur-[100px]" />
      </div>

      <div className="relative z-10 p-8 md:p-12 max-w-2xl w-full mx-4 premium-card border-none shadow-2xl bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden text-center">
        {/* Top Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-blue via-purple-500 to-brand-pink" />
        
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-blue/20 blur-xl rounded-full animate-pulse" />
            <div className="relative bg-white p-6 rounded-2xl shadow-xl shadow-brand-blue/10 border border-border flex items-center justify-center">
              <WrenchIcon className="size-16 text-brand-blue" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-brand-pink p-2 rounded-xl shadow-lg border-2 border-white animate-bounce">
              <ShieldAlertIcon className="size-6 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-pink mb-4">
          Maintenance Mode
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground font-medium mb-8">
          We are currently performing scheduled system upgrades to improve your UniSync experience. 
          Please check back shortly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-md mx-auto mb-8">
          <div className="bg-muted/50 p-4 rounded-xl border border-border flex items-start gap-3">
            <CpuIcon className="size-5 text-brand-blue shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground">System Upgrades</h4>
              <p className="text-sm text-muted-foreground">Deploying new features</p>
            </div>
          </div>
          <div className="bg-muted/50 p-4 rounded-xl border border-border flex items-start gap-3">
            <ShieldAlertIcon className="size-5 text-brand-pink shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground">Administrator Only</h4>
              <p className="text-sm text-muted-foreground">Temporarily locked</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            className="w-full sm:w-auto px-8 h-12 rounded-xl brand-gradient hover:opacity-90 shadow-lg shadow-brand-blue/20 text-white font-semibold transition-all hover:scale-105"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto px-8 h-12 rounded-xl border-border hover:bg-muted/50 font-semibold"
            asChild
          >
            <a href="/login">
              <ArrowLeftIcon className="mr-2 size-4" />
              Return to Login
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
