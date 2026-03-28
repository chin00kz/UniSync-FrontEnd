import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, 
  Users, 
  ClipboardList, 
  Clock, 
  PlusCircle, 
  Star, 
  ArrowRight, 
  Download,
  BookOpen,
  Bell,
  Sparkles,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { mockNotifications } from '@/lib/mockData';

export default function StudentDashboard({ user }) {
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0
  })
  const [latestBooking, setLatestBooking] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    try {
      const userId = user?.id || JSON.parse(localStorage.getItem('user') || '{}').id;
      
      // Fetch Questions/Sessions stats
      const sessionRes = await axios.get(`http://localhost:5000/api/student/sessions?name=${user?.name}`)
      const myQuestions = sessionRes.data.data
      
      // Fetch Latest Booking
      const bookingRes = await axios.get("http://localhost:5000/api/student/bookings", {
        headers: { "x-user-id": userId }
      })
      
      const upcoming = bookingRes.data.data.find(b => b.status === 'Pending' || b.status === 'Confirmed');

      setStats({
        total: myQuestions.length,
        resolved: myQuestions.filter(q => q.status === 'Resolved').length,
        pending: myQuestions.filter(q => q.status !== 'Resolved').length
      })
      setLatestBooking(upcoming);
    } catch (err) {
      console.error("Dashboard fetch error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchData()
  }, [user?.name])

  const quickLinks = [
    {
      title: "Study Materials",
      desc: "Access notes & resources",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/student/materials"
    },
    {
      title: "Peer Tutoring",
      desc: "Find and book tutors",
      icon: Users,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      link: "/student/tutors"
    },
    {
      title: "My History",
      desc: "Track your questions",
      icon: ClipboardList,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      link: "/student/history"
    }
  ]

  return (
    <div className="space-y-8 pb-10">
      {/* Premium Header */}
      <div className="bg-brand-gradient rounded-3xl text-white py-12 px-10 relative overflow-hidden shadow-2xl shadow-brand-blue/20 group">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="size-3" />
              Student Portal
            </div>
            <h2 className="text-5xl font-black tracking-tight">How's it going, {user?.name?.split(' ')[0]}?</h2>
            <p className="opacity-90 font-medium text-lg max-w-xl">
              Ready to crush your goals today? You have {stats.pending} pending questions and {latestBooking ? "1 upcoming session" : "no upcoming sessions"}.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="glass-morphism p-6 rounded-3xl text-center min-w-[120px] border-white/20">
              <span className="block text-3xl font-black mb-1">{stats.total}</span>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Total Goals</span>
            </div>
            <div className="glass-morphism p-6 rounded-3xl text-center min-w-[120px] border-white/20">
              <span className="block text-3xl font-black mb-1 text-emerald-300">{stats.resolved}</span>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Success</span>
            </div>
          </div>
        </div>
        
        {/* Animated Background Blobs */}
        <div className="absolute top-[-20%] right-[-10%] size-80 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-[-20%] left-[-5%] size-64 bg-brand-pink/20 rounded-full blur-3xl group-hover:bg-brand-pink/30 transition-all duration-1000"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quick Actions & Notifications */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Session Highlight */}
          {latestBooking && (
            <section className="animate-in fade-in slide-in-from-bottom-4">
              <div className="premium-card p-6 bg-emerald-50 border-emerald-100 flex items-center justify-between group cursor-pointer hover:border-emerald-200 transition-all">
                <div className="flex items-center gap-6">
                  <div className="size-14 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-sm group-hover:scale-110 transition-transform">
                    <Calendar className="size-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-100 px-2 py-0.5 rounded-full">Upcoming Session</span>
                      <span className="text-xs font-bold text-slate-400 capitalize">{latestBooking.status}</span>
                    </div>
                    <h4 className="text-xl font-black text-slate-800 mt-1">
                      {latestBooking.subject} with {latestBooking.tutor?.name}
                    </h4>
                    <div className="flex items-center gap-4 mt-1 text-sm font-bold text-slate-500">
                      <span className="flex items-center gap-1.5"><Calendar className="size-4" /> {new Date(latestBooking.date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><Clock className="size-4" /> {latestBooking.timeSlot}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="size-6 text-emerald-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </div>
            </section>
          )}

          {/* Quick Access Grid */}
          <section>
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 text-left">
              <TrendingUp className="size-5 text-brand-blue" />
              Quick Access
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {quickLinks.map((item) => (
                <a 
                  key={item.title} 
                  href={item.link} 
                  className="premium-card p-6 flex flex-col gap-4 group hover:border-brand-blue/30 hover:translate-y-[-4px] transition-all"
                >
                  <div className={`size-12 rounded-2xl ${item.bgColor} ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <item.icon className="size-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{item.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                  </div>
                  <ChevronRight className="size-4 text-slate-300 group-hover:text-brand-blue group-hover:translate-x-1 transition-all ml-auto" />
                </a>
              ))}
            </div>
          </section>

          {/* Activity Feed / Notifications */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 text-left">
                <Bell className="size-5 text-brand-blue" />
                Latest Updates
              </h3>
              <button className="text-brand-blue font-bold text-xs uppercase tracking-widest hover:underline">Mark all read</button>
            </div>
            <div className="space-y-4 text-left">
              {mockNotifications.map((notif) => (
                <div key={notif.id} className="premium-card p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer border-slate-100">
                  <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${
                    notif.type === 'material' ? 'bg-blue-50 text-blue-500' : 
                    notif.type === 'session' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'
                  }`}>
                    {notif.type === 'material' ? <BookOpen className="size-5" /> : 
                     notif.type === 'session' ? <Users className="size-5" /> : <Sparkles className="size-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-800 text-sm">{notif.title}</h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{notif.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{notif.content}</p>
                  </div>
                  {notif.isNew && <div className="size-2 bg-brand-blue rounded-full mt-2 shadow-sm shadow-brand-blue/50"></div>}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar info */}
        <div className="space-y-8 text-left">
          {/* Study Tip Card */}
          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-slate-200">
            <div className="relative z-10 space-y-4">
              <div className="size-10 rounded-2xl bg-white/10 flex items-center justify-center text-brand-pink">
                <Sparkles className="size-5" />
              </div>
              <h4 className="text-xl font-black leading-tight">Pro Tip: Use Active Recall</h4>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Testing yourself on a topic rather than re-reading it can increase retention by up to 50%! Try our practice quizzes in the Materials section.
              </p>
              <button className="w-full py-3 rounded-xl bg-white text-slate-900 font-black uppercase text-xs tracking-widest hover:bg-slate-100 transition-colors">
                Explore More Tips
              </button>
            </div>
            {/* Visual Decor */}
            <div className="absolute top-[-50px] right-[-50px] size-40 bg-brand-pink/10 rounded-full blur-3xl"></div>
          </div>
          
          {/* Support / Quick Help */}
          <div className="premium-card p-8 border-brand-blue/10 bg-brand-blue/5 border-dashed border-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <MessageSquare className="size-4 text-brand-blue" />
              Need Quick Help?
            </h4>
            <p className="text-sm text-slate-500 font-medium mt-2 mb-4 leading-relaxed">
              Don't stay stuck! Our peer tutors are online and ready to help you with any subject.
            </p>
            <a 
              href="/student/post" 
              className="flex items-center justify-center gap-2 bg-brand-blue text-white py-3 rounded-xl font-black uppercase text-[11px] tracking-widest shadow-lg shadow-brand-blue/20 hover:scale-[1.02] active:scale-95 transition-all text-center"
            >
              <PlusCircle className="size-4" />
              Ask a Question
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
