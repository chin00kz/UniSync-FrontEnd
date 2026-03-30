import React, { useState } from 'react';
import axios from 'axios';
import {
  X,
  AlertTriangle,
  Send,
  Loader2,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';

export default function ReportModal({
  isOpen,
  onClose,
  targetId,
  targetName,
  contentType,
  reportedUserId
}) {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id || user._id;

      await axios.post("http://localhost:5000/api/student/reports", {
        reportedUser: reportedUserId,
        contentId: targetId,
        contentType: contentType, // 'material', 'tutor', 'session'
        reason: `${reason}: ${message}`
      }, {
        headers: { "x-user-id": userId }
      });

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setReason("");
        setMessage("");
        setIsSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Report error:", err);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const reasons = [
    "Inappropriate content",
    "Spam",
    "Harassment",
    "Incorrect information",
    "Copyright violation",
    "Other"
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden relative animate-in zoom-in-95 duration-300 border border-border">
        {isSuccess ? (
          <div className="p-12 text-center space-y-6 flex flex-col items-center">
            <div className="size-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 dark:text-emerald-400 animate-bounce">
              <CheckCircle2 className="size-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-foreground">Report Submitted</h2>
              <p className="text-muted-foreground font-medium">Thank you for helping keep UniSync safe. Our admins will review this shortly.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-rose-500 p-6 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="size-4" />
              </button>
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <AlertTriangle className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Report {contentType}</h2>
                  <p className="text-white/80 font-bold text-xs tracking-widest uppercase">Target: {targetName}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Reason for report</label>
                <div className="grid grid-cols-2 gap-2">
                  {reasons.map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReason(r)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border-2 transition-all ${reason === r
                          ? "border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-sm"
                          : "border-slate-50 bg-muted/50 text-muted-foreground hover:border-border hover:text-muted-foreground"
                        }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Additional Details</label>
                <div className="relative group">
                  <MessageSquare className="absolute left-4 top-4 size-4 text-muted-foreground group-focus-within:text-rose-500 dark:text-rose-400 transition-colors" />
                  <textarea
                    required
                    placeholder="Please provide more context..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-32 pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-50 focus:border-rose-500 focus:ring-8 focus:ring-rose-500/5 outline-none transition-all font-bold text-slate-700 resize-none bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !reason}
                  className="w-full h-14 rounded-2xl bg-rose-500 hover:bg-rose-600 disabled:bg-slate-200 disabled:text-muted-foreground text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-rose-500/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <>
                      Submit Report
                      <Send className="size-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
