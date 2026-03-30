import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Loader2,
  MessageSquare,
  AlertCircle,
  ChevronRight,
  Filter,
  CheckCircle,
  X,
  UserCheck
} from 'lucide-react';

export default function TutorBookingsPage({ user }) {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tutor/bookings", {
        headers: { "x-user-id": user?.id || user?._id }
      });
      setBookings(res.data.data);
    } catch (err) {
      console.error("Booking fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id || user?._id) {
      void fetchBookings();
    }
  }, [user?.id, user?._id]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/tutor/bookings/${bookingId}`,
        { status: newStatus },
        { headers: { "x-user-id": user?.id || user?._id } }
      );
      // Refresh bookings
      void fetchBookings();
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update status.");
    }
  };

  const filteredBookings = filter === 'All'
    ? bookings
    : bookings.filter(b => b.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100';
      case 'Confirmed': return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100';
      case 'Cancelled': return 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100';
      case 'Completed': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100';
      default: return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Manage Bookings</h1>
          <p className="text-muted-foreground font-medium text-lg">Track and manage your student tutoring sessions.</p>
        </div>

        <div className="flex items-center gap-2 bg-muted p-1 rounded-2xl border border-border shadow-sm">
          {['All', 'Pending', 'Confirmed', 'Completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === f
                  ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'
                  : 'text-muted-foreground hover:text-muted-foreground hover:bg-muted/50'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="size-10 animate-spin text-brand-blue/40" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="premium-card text-center py-20 border-dashed border-2 flex flex-col items-center gap-4">
          <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground/80">
            <Calendar className="size-8" />
          </div>
          <div className="space-y-1">
            <p className="text-xl font-extrabold text-foreground">No Bookings Found</p>
            <p className="text-muted-foreground font-medium">You don't have any bookings matching this filter.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="premium-card p-0 overflow-hidden border-border/60 group hover:border-brand-blue/30 transition-all hover:translate-x-1">
              <div className="flex flex-col md:flex-row">
                {/* Student Info Sidebar */}
                <div className="md:w-64 bg-muted/50 p-8 flex flex-col items-center text-center gap-4 border-r border-border">
                  <div className="relative">
                    <div className="size-20 rounded-2xl border-4 border-card shadow-lg relative z-10 overflow-hidden bg-muted/50">
                      <img
                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${booking.student?.email || booking.student?.name}`}
                        alt={booking.student?.name}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 size-8 bg-card rounded-xl shadow-sm border border-border flex items-center justify-center z-20">
                      <UserCheck className="size-4 text-brand-blue" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-foreground">{booking.student?.name}</h4>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{booking.student?.sliitId}</p>
                  </div>
                </div>

                {/* Booking Content */}
                <div className="flex-1 p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        <span className="text-[10px] font-black text-muted-foreground/80 uppercase tracking-widest">
                          ID: {booking._id.slice(-6).toUpperCase()}
                        </span>
                      </div>

                      <h3 className="text-2xl font-black text-foreground">{booking.subject}</h3>

                      <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                        <div className="flex items-center gap-2 font-bold text-sm">
                          <Calendar className="size-4 text-brand-blue" />
                          {new Date(booking.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2 font-bold text-sm">
                          <Clock className="size-4 text-brand-blue" />
                          {booking.timeSlot}
                        </div>
                      </div>

                      {booking.message && (
                        <div className="bg-muted/50 rounded-2xl p-4 flex gap-3 items-start border border-border italic text-muted-foreground font-medium text-sm">
                          <MessageSquare className="size-4 shrink-0 mt-0.5 text-muted-foreground/80" />
                          "{booking.message}"
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col gap-3">
                      {booking.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(booking._id, 'Confirmed')}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[11px] tracking-widest shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                          >
                            <CheckCircle className="size-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(booking._id, 'Cancelled')}
                            className="bg-card border-2 border-border hover:border-rose-100 hover:text-rose-600 dark:text-rose-400 text-muted-foreground px-6 py-3 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all hover:bg-rose-50 dark:bg-rose-500/10 flex items-center gap-2"
                          >
                            <X className="size-4" />
                            Reject
                          </button>
                        </>
                      )}
                      {booking.status === 'Confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(booking._id, 'Completed')}
                          className="bg-brand-blue hover:bg-brand-blue/90 text-white px-6 py-3 rounded-xl font-black uppercase text-[11px] tracking-widest shadow-lg shadow-brand-blue/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                          <CheckCircle2 className="size-4" />
                          Mark Completed
                        </button>
                      )}
                      {(booking.status === 'Completed' || booking.status === 'Cancelled') && (
                        <div className="text-[10px] font-black text-muted-foreground/80 uppercase tracking-widest italic border border-border px-4 py-2 rounded-xl">
                          Session {booking.status}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
