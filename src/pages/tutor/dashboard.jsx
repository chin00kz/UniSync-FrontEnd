import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  MailCheck,
  ArrowRight,
  Calendar,
  Users
} from 'lucide-react';

const TutorDashboard = ({ questions, onAction, user }) => {
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tutor/bookings", {
          headers: { "x-user-id": user?.id || user?._id }
        });
        setBookings(res.data.data.filter(b => b.status === 'Pending' || b.status === 'Confirmed'));
      } catch (err) {
        console.error("Dashboard booking fetch error:", err);
      } finally {
        setIsLoadingBookings(false);
      }
    };
    if (user?.id || user?._id) {
      void fetchBookings();
    }
  }, [user?.id, user?._id]);

  const stats = [
    {
      label: "Total Requests",
      value: questions.length,
      icon: MessageSquare,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-500/10"
    },
    {
      label: "Active Sessions",
      value: bookings.length,
      icon: Calendar,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10"
    },
    {
      label: "Waiting",
      value: questions.filter(q => q.status === 'Not Started').length,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-500/10"
    },
    {
      label: "Replied",
      value: questions.filter(q => q.status === 'Replied').length,
      icon: MailCheck,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-500/10"
    }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      'Completed': { variant: 'default', className: 'bg-emerald-500 hover:bg-emerald-600' },
      'Replied': { variant: 'secondary', className: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
      'Not Started': { variant: 'outline', className: 'border-amber-200 text-amber-700 bg-amber-50 dark:bg-amber-500/10' }
    };

    const config = variants[status] || variants['Not Started'];

    return (
      <Badge variant={config.variant} className={config.className}>
        {status ? status.toUpperCase() : 'NOT STARTED'}
      </Badge>
    );
  };

  const getActionText = (status) => {
    switch (status) {
      case 'Not Started':
        return { text: 'Review Request', icon: Clock, variant: 'default' };
      case 'Replied':
        return { text: 'View Reply', icon: MailCheck, variant: 'outline' };
      case 'Completed':
        return { text: 'View Details', icon: CheckCircle2, variant: 'secondary' };
      default:
        return { text: 'View', icon: ArrowRight, variant: 'ghost' };
    }
  };

  return (
    <div className="space-y-8 p-6 bg-background min-h-screen">
      {/* Header Section */}
      <div className="space-y-2 text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Tutor Dashboard
        </h1>
        <p className="text-muted-foreground font-medium">
          Welcome back! Manage your sessions and student requests.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 text-left">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="premium-card p-6 flex flex-col gap-4 group hover:border-brand-blue/30 hover:translate-y-[-4px] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                <div className={`p-2.5 rounded-xl ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="size-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className={`text-4xl font-black tracking-tight ${stat.color}`}>{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Table */}
        <div className="lg:col-span-2 space-y-8">
          <section className="premium-card p-0 overflow-hidden text-left border-border/60 shadow-xl border border-border">
            <div className="p-8 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-foreground">Student Activity</h3>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1 text-left">Recent Q&A Threads</p>
              </div>
              <Button variant="ghost" className="text-brand-blue font-black uppercase text-[10px] tracking-widest">View All</Button>
            </div>

            <div className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="font-black text-muted-foreground uppercase tracking-widest text-[10px] pl-8">Student</TableHead>
                    <TableHead className="font-black text-muted-foreground uppercase tracking-widest text-[10px] text-center">Status</TableHead>
                    <TableHead className="font-black text-muted-foreground uppercase tracking-widest text-[10px] text-right pr-8">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((q) => {
                    const action = getActionText(q.status);
                    const ActionIcon = action.icon;
                    return (
                      <TableRow key={q._id} className="hover:bg-muted/30 transition-colors border-border">
                        <TableCell className="font-bold text-foreground py-5 pl-8 text-left">{q.studentName}</TableCell>
                        <TableCell className="text-center">{getStatusBadge(q.status)}</TableCell>
                        <TableCell className="text-right pr-8">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="font-black uppercase text-[10px] tracking-widest text-brand-blue hover:bg-brand-blue/5 gap-2"
                            onClick={() => onAction(q._id)}
                          >
                            {action.text}
                            <ActionIcon className="size-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              {questions.length === 0 && (
                <div className="text-center py-20 px-8">
                  <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground/80 mx-auto mb-4">
                    <MessageSquare className="size-8" />
                  </div>
                  <h4 className="text-lg font-black text-foreground">No requests yet</h4>
                  <p className="text-sm text-muted-foreground font-medium">New student questions will appear here.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar: Upcoming Sessions */}
        <div className="space-y-8 text-left">
          <section className="rounded-3xl bg-card p-8 text-card-foreground border border-border relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col h-full gap-6">
              <div className="flex items-center justify-between">
                <div className="size-12 rounded-2xl bg-muted flex items-center justify-center text-brand-blue">
                  <Calendar className="size-6" />
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold uppercase tracking-widest text-[9px]">Live Data</Badge>
              </div>

              <div>
                <h3 className="text-2xl font-black leading-tight text-foreground">Upcoming Sessions</h3>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">Next 24 Hours</p>
              </div>

              <div className="space-y-4">
                {isLoadingBookings ? (
                  <div className="flex items-center gap-3 animate-pulse">
                    <div className="size-10 rounded-full bg-muted"></div>
                    <div className="space-y-2">
                      <div className="h-3 w-24 bg-muted rounded"></div>
                      <div className="h-2 w-16 bg-muted rounded"></div>
                    </div>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="py-6 border border-border rounded-2xl border-dashed flex flex-col items-center gap-2">
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">No sessions scheduled</p>
                  </div>
                ) : (
                  bookings.slice(0, 3).map((b) => (
                    <div key={b._id} className="flex items-center gap-4 group cursor-pointer">
                      <div className="size-10 rounded-xl border-2 border-white/10 group-hover:scale-110 transition-transform overflow-hidden bg-slate-800">
                        <img
                          src={`https://api.dicebear.com/7.x/notionists/svg?seed=${b.student?.email || b.student?.name}`}
                          alt={b.student?.name}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-sm truncate text-foreground">{b.student?.name}</h5>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{b.timeSlot}</p>
                      </div>
                      <Badge className="bg-muted text-foreground border-0 text-[10px] font-black">{b.status}</Badge>
                    </div>
                  ))
                )}
              </div>

              <Button
                variant="outline"
                className="w-full h-12 rounded-xl bg-brand-blue text-white font-black uppercase text-[10px] tracking-widest hover:bg-brand-blue/90 mt-2 border-0"
                asChild
              >
                <a href="/tutor/bookings">Manage All Sessions</a>
              </Button>
            </div>
            <div className="absolute top-[-20%] right-[-10%] size-64 bg-brand-blue/20 rounded-full blur-3xl"></div>
          </section>

          <div className="premium-card p-8 border-brand-blue/10 bg-brand-blue/5 border-dashed border-2">
            <h4 className="font-bold text-foreground flex items-center gap-2">
              <Users className="size-4 text-brand-blue" />
              Tutor Tip
            </h4>
            <p className="text-sm text-muted-foreground font-medium mt-2 leading-relaxed">
              Accepting booking requests within 1 hour increases your student rating by up to 20%! Keep an eye on your notifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;