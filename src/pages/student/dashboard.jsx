import { useState, useEffect } from "react"
import axios from "axios"
import { ClipboardList, Loader2Icon, PlusCircle } from "lucide-react"

export default function StudentDashboard({ user }) {
  const [myQuestions, setMyQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchMySessions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sessions")
      // Filter sessions for this specific student
      const filtered = res.data.filter(q => q.studentName === user?.name)
      setMyQuestions(filtered.reverse()) // Show newest first
    } catch (err) {
      console.error("Fetch error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchMySessions()
  }, [user?.name])

  return (
    <div className="space-y-6">
      <div className="premium-card bg-brand-gradient text-white border-0 py-8">
        <h2 className="text-3xl font-bold">Welcome back, {user?.name}!</h2>
        <p className="opacity-90 font-medium text-lg mt-1">You have {myQuestions.length} questions in your history.</p>
      </div>
      
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ClipboardList className="size-5 text-brand-blue" />
          My Question History
        </h3>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2Icon className="size-8 animate-spin text-brand-blue" />
          </div>
        ) : myQuestions.length === 0 ? (
          <div className="premium-card text-center py-12 border-dashed">
            <p className="text-muted-foreground font-medium">No questions submitted yet. Quick submit one to get started!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {myQuestions.map((q) => (
              <div key={q._id} className="premium-card border-slate-200/60 hover:border-brand-blue/30 transition-all">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          q.status === "Resolved" ? "bg-emerald-100 text-emerald-600" : "bg-brand-blue/10 text-brand-blue"
                        }`}>
                          {q.status}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          Submitted on {new Date(q.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-bold text-slate-900 leading-tight mt-2">{q.questionText}</p>

                      {q.questionImage && (
                        <div className="mt-3">
                          <img 
                            src={q.questionImage} 
                            alt="Question" 
                            className="max-h-48 rounded-lg border border-slate-200 object-cover hover:scale-[1.02] transition-transform cursor-zoom-in"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {q.replyText && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded-lg bg-brand-blue/20 flex items-center justify-center">
                          <PlusCircle className="size-3 text-brand-blue" />
                        </div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">Tutor Reply</span>
                      </div>
                      <div className="flex flex-col gap-3">
                        <p className="text-sm font-medium text-slate-700 leading-relaxed">{q.replyText}</p>
                        {q.replyImage && (
                          <img 
                            src={q.replyImage} 
                            alt="Tutor Reply" 
                            className="max-h-64 rounded-lg border border-slate-200 object-cover shadow-sm self-start hover:scale-[1.02] transition-transform cursor-zoom-in"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
