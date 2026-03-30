import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ClipboardList,
  Loader2,
  PlusCircle,
  Clock,
  MessageSquare,
  ChevronRight,
  Flag
} from 'lucide-react';
import ReportModal from '@/components/report-modal';

export default function QuestionHistoryPage({ user }) {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  // Removed JSON.parse here, using prop instead

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sessions");
      const currentUserId = user?.id || user?._id;
      const filtered = res.data.filter(q => 
        (q.studentId === currentUserId) || 
        (q.studentName?.trim() === user?.name?.trim())
      );
      setQuestions(filtered.reverse());
    } catch (err) {
      console.error("History fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchHistory();
  }, [user?.name]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Your Activity</h1>
          <p className="text-muted-foreground font-medium text-lg">Track all your questions and responses from tutors.</p>
        </div>

        <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-2xl border border-border">
          <div className="px-5 py-2 text-center border-r border-border">
            <span className="block text-2xl font-black text-brand-blue">{questions.length}</span>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Total Questions</span>
          </div>
          <div className="px-5 py-2 text-center">
            <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {questions.filter(q => q.status === 'Completed' || q.status === 'Resolved').length}
            </span>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Resolved</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="size-10 animate-spin text-brand-blue/40" />
        </div>
      ) : questions.length === 0 ? (
        <div className="premium-card text-center py-20 border-dashed border-2 flex flex-col items-center gap-6">
          <div className="size-20 rounded-full bg-brand-blue/5 flex items-center justify-center text-brand-blue">
            <MessageSquare className="size-10" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-extrabold text-foreground">No Questions Yet</p>
            <p className="text-muted-foreground font-medium max-w-xs mx-auto">It looks like you haven't asked anything yet. Start your journey by posting your first question!</p>
          </div>
          <a href="/student/post" className="bg-brand-gradient text-white px-8 py-4 rounded-xl font-black uppercase text-sm tracking-wider shadow-xl shadow-brand-blue/20 transition-all hover:scale-105 inline-flex items-center gap-2">
            <PlusCircle className="size-5" />
            Ask First Question
          </a>
        </div>
      ) : (
        <div className="grid gap-6">
          {questions.map((q) => (
            <div key={q._id} className="premium-card border-border/60 hover:border-brand-blue/30 transition-all p-0 overflow-hidden group">
              <div className="p-8 space-y-6 bg-card">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm ${
                        (q.status === 'Completed' || q.status === 'Resolved') 
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200" 
                        : (q.status === 'Replied' ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200" : "bg-brand-blue/5 text-brand-blue border border-brand-blue/20")
                        }`}>
                        {(q.status === 'Completed' || q.status === 'Resolved') ? <PlusCircle className="size-3" /> : <Clock className="size-3" />}
                        {q.status}
                      </span>
                      <span className="text-xs text-muted-foreground font-bold flex items-center gap-1.5">
                        <Clock className="size-3" />
                        {new Date(q.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="font-extrabold text-2xl text-foreground leading-snug group-hover:text-brand-blue transition-colors">{q.questionText}</p>

                    {q.questionImage && (
                      <div className="mt-4">
                        <img
                          src={q.questionImage}
                          alt="Question"
                          className="max-h-64 rounded-2xl border-4 border-muted object-cover shadow-lg hover:scale-[1.01] transition-transform cursor-zoom-in"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setReportTarget(q);
                      setIsReportModalOpen(true);
                    }}
                    className="p-3 rounded-xl hover:bg-rose-50 dark:bg-rose-500/10 text-muted-foreground/80 hover:text-rose-500 dark:text-rose-400 transition-all border border-transparent hover:border-rose-100 flex items-center gap-2 font-bold text-xs uppercase tracking-widest"
                  >
                    <Flag className="size-4" />
                    Report
                  </button>
                </div>

                {q.replyText ? (
                  <div className="p-8 rounded-3xl bg-muted/80 border border-border space-y-6 relative overflow-hidden group/reply transition-all hover:bg-card hover:shadow-xl dark:hover:shadow-none hover:shadow-slate-100">
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="size-10 rounded-2xl bg-brand-blue/10 flex items-center justify-center">
                        <PlusCircle className="size-5 text-brand-blue" />
                      </div>
                      <span className="text-sm font-black text-foreground uppercase tracking-widest mt-0.5">Tutor Solution</span>
                    </div>
                    <div className="flex flex-col gap-6 relative z-10">
                      <p className="text-lg font-bold text-foreground leading-relaxed pl-2 border-l-4 border-brand-blue/20">{q.replyText}</p>
                      {q.replyImage && (
                        <div className="relative inline-block self-start group/img">
                          <img
                            src={q.replyImage}
                            alt="Tutor Reply"
                            className="max-h-96 rounded-2xl border-4 border-border object-cover shadow-2xl transition-transform cursor-zoom-in"
                          />
                        </div>
                      )}
                    </div>
                    {/* Background Detail */}
                    <div className="absolute right-[-20px] bottom-[-20px] size-40 bg-brand-blue/5 rounded-full blur-3xl opacity-0 group-hover/reply:opacity-100 transition-opacity duration-700"></div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-500/10/50 border border-amber-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="size-5 text-amber-500 dark:text-amber-400 animate-pulse" />
                      <p className="text-sm font-bold text-amber-700 dark:text-amber-500">Your question is currently being reviewed by our tutors.</p>
                    </div>
                    <ChevronRight className="size-4 text-amber-300" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetId={reportTarget?._id}
        targetName={reportTarget?.questionText?.substring(0, 30) + "..."}
        contentType="session"
        reportedUserId={reportTarget?._tutorId} // Assuming there's a tutor ref
      />
    </div>
  );
}
