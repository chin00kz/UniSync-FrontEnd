import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Star, 
  Search, 
  Filter, 
  Loader2Icon,
  ArrowRight,
  Calendar,
  Clock,
  MessageSquare,
  X,
  CheckCircle2Icon,
  Sparkles
} from 'lucide-react';

export default function PeerTutoringPage() {
  const [tutors, setTutors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: "",
    timeSlot: "10:00 AM",
    message: ""
  });

  const fetchTutors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/tutors");
      setTutors(res.data.data);
    } catch (err) {
      console.error("Tutor fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchTutors();
  }, []);

  const handleOpenBooking = (tutor) => {
    setSelectedTutor(tutor);
    setIsModalOpen(true);
    setBookingSuccess(false);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id || user._id; // Fallback to _id if id is missing
      
      if (!userId) {
        throw new Error("User ID missing from session. Please relogin.");
      }

      const response = await axios.post("http://localhost:5000/api/bookings", {
        tutorId: selectedTutor._id,
        subject: selectedTutor.subject || "General Mentorship",
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
        message: bookingData.message
      }, {
        headers: { "x-user-id": userId }
      });
      
      setBookingSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setBookingSuccess(false);
        setBookingData({ date: "", timeSlot: "10:00 AM", message: "" });
      }, 2000);
    } catch (err) {
      console.error("Booking error details:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.error || err.message || "Failed to book tutor. Please try again.";
      alert(`Error: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTutors = tutors.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.subject && t.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Peer Tutoring</h1>
          <p className="text-muted-foreground font-medium text-lg">Connect with expert tutors to excel in your studies.</p>
        </div>
        
        <div className="relative group w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name or subject..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all outline-none font-medium bg-white"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2Icon className="size-10 animate-spin text-brand-blue/40" />
        </div>
      ) : filteredTutors.length === 0 ? (
        <div className="premium-card text-center py-20 border-dashed border-2 flex flex-col items-center gap-4">
          <div className="size-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
            <Users className="size-8" />
          </div>
          <div className="space-y-1">
            <p className="text-xl font-extrabold text-slate-800">No Tutors Found</p>
            <p className="text-slate-500 font-medium">Try searching for a different subject or name.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map((tutor) => (
            <div key={tutor._id} className="premium-card border-slate-200/60 flex flex-col items-center text-center p-8 gap-5 group hover:border-brand-blue/30 transition-all hover:translate-y-[-4px]">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-blue/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                <div className="size-24 rounded-full border-4 border-white shadow-xl relative z-10 p-0.5 group-hover:rotate-3 transition-transform overflow-hidden bg-slate-50">
                  <img 
                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${tutor.email || tutor.name}`} 
                    alt={tutor.name} 
                    className="size-full object-cover" 
                  />
                </div>
                <div className="absolute bottom-1 right-1 size-5 bg-emerald-500 rounded-full border-4 border-white z-20 shadow-sm animate-pulse"></div>
              </div>
              
              <div className="space-y-1">
                <h4 className="font-extrabold text-2xl text-slate-800 group-hover:text-brand-blue transition-colors">{tutor.name}</h4>
                <p className="text-sm font-bold text-brand-blue uppercase tracking-widest">{tutor.subject || "Expert Tutor"}</p>
              </div>
              
              <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 shadow-sm">
                <Star className="size-4 fill-amber-500 text-amber-500" />
                <span className="text-sm font-black">{tutor.rating || "5.0"}</span>
                <span className="text-xs text-amber-600/60 font-medium ml-1">(24 Reviews)</span>
              </div>
              
              <div className="w-full h-px bg-slate-100 mt-2"></div>
              
              <div className="flex items-center justify-between w-full pt-2">
                <div className="flex flex-col items-start px-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Rate</span>
                  <span className="text-xl font-black text-slate-800 tracking-tight">{tutor.price || "$15/hr"}</span>
                </div>
                <button 
                  onClick={() => handleOpenBooking(tutor)}
                  className="bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-3 rounded-xl font-black uppercase text-sm tracking-wider shadow-lg shadow-brand-blue/20 transition-all hover:scale-105 active:scale-95 group-hover:translate-x-1"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden relative animate-in zoom-in-95 duration-300">
            {bookingSuccess ? (
              <div className="p-12 text-center space-y-6 flex flex-col items-center">
                <div className="size-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-bounce">
                  <CheckCircle2Icon className="size-12" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-slate-800">Booking Confirmed!</h2>
                  <p className="text-slate-500 font-medium text-lg">Your session with {selectedTutor?.name} has been requested.</p>
                </div>
                <div className="pt-4 px-6 py-2 rounded-full bg-slate-50 border border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Redirecting to dashboard...
                </div>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="bg-brand-gradient p-8 text-white relative">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <X className="size-5" />
                  </button>
                  <div className="flex items-center gap-6">
                    <div className="size-20 rounded-2xl border-4 border-white/20 shadow-xl overflow-hidden bg-white/10 shrink-0">
                      <img 
                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${selectedTutor?.email || selectedTutor?.name}`} 
                        alt={selectedTutor?.name}
                        className="size-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest mb-2">
                        <Sparkles className="size-3" />
                        Booking Session
                      </div>
                      <h2 className="text-2xl font-black leading-tight">Book {selectedTutor?.name}</h2>
                      <p className="text-white/80 font-bold text-sm tracking-wide">{selectedTutor?.subject || "Mentorship"}</p>
                    </div>
                  </div>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleBookingSubmit} className="p-8 space-y-6 text-left">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label text="Select Date" />
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                        <input 
                          type="date" 
                          required
                          value={bookingData.date}
                          onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                          className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-slate-100 focus:border-brand-blue focus:ring-8 focus:ring-brand-blue/5 outline-none transition-all font-bold text-slate-700"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label text="Time Slot" />
                      <div className="relative group">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                        <select 
                          required
                          value={bookingData.timeSlot}
                          onChange={(e) => setBookingData({...bookingData, timeSlot: e.target.value})}
                          className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-slate-100 focus:border-brand-blue focus:ring-8 focus:ring-brand-blue/5 outline-none transition-all font-bold text-slate-700 appearance-none bg-white"
                        >
                          {timeSlots.map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label text="Specific Topic (Optional)" />
                    <div className="relative group">
                      <MessageSquare className="absolute left-4 top-4 size-5 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                      <textarea 
                        placeholder="What do you need help with?"
                        value={bookingData.message}
                        onChange={(e) => setBookingData({...bookingData, message: e.target.value})}
                        className="w-full h-32 pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-brand-blue focus:ring-8 focus:ring-brand-blue/5 outline-none transition-all font-bold text-slate-700 resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between gap-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Price</span>
                      <span className="text-2xl font-black text-slate-800 tracking-tight">{selectedTutor?.price || "$15/hr"}</span>
                    </div>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 h-14 rounded-2xl bg-brand-gradient border-0 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-blue/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2Icon className="size-5 animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Confirm Booking
                          <ArrowRight className="size-5" />
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Label({ text }) {
  return <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 block">{text}</label>;
}
