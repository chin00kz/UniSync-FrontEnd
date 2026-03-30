import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ShieldAlert,
  Loader2,
  CheckCircle2,
  Trash2,
  Slash,
  Search,
  Users,
  MessageSquare,
  FileText,
  Clock,
  X,
  Calendar
} from 'lucide-react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { UserBadge } from "@/components/user-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminReportsPage({ isSubPage = false, user }) {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // 'pending', 'resolved', 'dismissed'
  const [searchQuery, setSearchQuery] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const adminId = user?.id || user?._id || JSON.parse(localStorage.getItem("user") || "{}").id;
      const res = await axios.get("http://localhost:5000/api/admin/reports", {
        headers: { "x-admin-id": adminId }
      });
      setReports(res.data.data);
    } catch (err) {
      console.error("Fetch reports error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id || user?._id) {
      fetchReports();
    }
  }, [user?.id, user?._id]);

  const handleAction = async (reportId, action, banReason = "") => {
    setIsActionLoading(true);
    try {
      const adminId = JSON.parse(localStorage.getItem("user") || "{}").id;
      await axios.post(`http://localhost:5000/api/admin/reports/${reportId}/action`, {
        action,
        banReason
      }, {
        headers: { "x-admin-id": adminId }
      });
      setSelectedReport(null);
      fetchReports();
    } catch (err) {
      console.error("Report action error:", err);
      alert("Action failed. Please try again.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const filteredReports = reports.filter(r => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const matchesSearch =
      (r.reason || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.contentType || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.reporter?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'dismissed': return 'bg-slate-100 text-slate-700 border-border';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'tutor':
      case 'student': return <Users className="size-4" />;
      case 'material': return <FileText className="size-4" />;
      case 'session': return <MessageSquare className="size-4" />;
      case 'booking': return <Calendar className="size-4" />;
      default: return <ShieldAlert className="size-4" />;
    }
  };

  const content = (
    <div className="flex flex-1 flex-col gap-6 p-6 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            <ShieldAlert className="size-8 text-rose-500 dark:text-rose-400" />
            Moderation Center
          </h1>
          <p className="text-muted-foreground font-medium">Review and manage community reports and flags.</p>
        </div>

        <div className="flex items-center gap-2">
          {['pending', 'resolved', 'dismissed', 'all'].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border-2 ${filter === t
                  ? "bg-foreground text-background border-foreground shadow-lg shadow-border"
                  : "bg-card text-muted-foreground border-border hover:border-muted-foreground/30"
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="size-10 animate-spin text-brand-blue/40" />
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="premium-card text-center py-20 border-dashed border-2 flex flex-col items-center gap-4 bg-card/50">
          <div className="size-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground/50">
            <CheckCircle2 className="size-8" />
          </div>
          <div className="space-y-1">
            <p className="text-xl font-extrabold text-foreground">No reports found</p>
            <p className="text-muted-foreground font-medium">All caught up! The community is clean.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredReports.map((report) => (
            <div
              key={report._id}
              className={`premium-card border-l-4 transition-all overflow-hidden ${report.status === 'pending' ? 'border-l-amber-500' : 'border-l-border opacity-80 hover:opacity-100 shadow-sm'
                }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge className={`${getStatusColor(report.status)} font-black text-[10px] uppercase tracking-widest border-2 py-1`}>
                      {report.status}
                    </Badge>
                    <Badge variant="outline" className="font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 py-1">
                      {getTypeIcon(report.contentType)}
                      {report.contentType}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-bold flex items-center gap-1.5">
                      <Clock className="size-3" />
                      {new Date(report.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-foreground">{report.reason}</h3>
                    <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-tighter text-muted-foreground font-black">Reporter:</span>
                        <UserBadge name={report.reporter?.name} email={report.reporter?.sliitId} size="sm" />
                      </div>
                      {report.reportedUser && (
                        <>
                          <div className="h-4 w-px bg-slate-200"></div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-tighter text-muted-foreground font-black">Reported:</span>
                            <UserBadge name={report.reportedUser?.name} email={report.reportedUser?.sliitId} variant="secondary" size="sm" />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {report.status === 'pending' && (
                  <div className="flex items-center gap-2 lg:border-l lg:pl-6 border-border flex-wrap">
                    <Button
                      variant="outline"
                      className="text-muted-foreground hover:text-foreground font-black uppercase text-[10px] tracking-widest h-11 px-6 rounded-xl border border-border transition-all hover:bg-muted"
                      onClick={() => handleAction(report._id, 'discard')}
                    >
                      <Trash2 className="size-4 mr-2" />
                      Discard
                    </Button>
                    <Button
                      variant="outline"
                      className="text-amber-500 dark:text-amber-400 hover:bg-amber-50 dark:bg-amber-500/10 font-black uppercase text-[10px] tracking-widest h-11 px-6 rounded-xl border border-amber-100 transition-all"
                      onClick={() => handleAction(report._id, 'resolve')}
                    >
                      <CheckCircle2 className="size-4 mr-2" />
                      Resolve
                    </Button>
                    <Button
                      className="bg-rose-500 hover:bg-rose-600 text-white font-black uppercase text-[10px] tracking-widest h-11 px-6 rounded-xl shadow-lg shadow-rose-500/20 transition-all hover:scale-105"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to BAN ${report.reportedUser?.name}?`)) {
                          handleAction(report._id, 'ban');
                        }
                      }}
                    >
                      <Slash className="size-4 mr-2" />
                      Ban User
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (isSubPage) return content;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="flex items-center gap-2 text-left">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-slate-200 mx-2"></div>
            <span className="text-sm font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">Moderation Center</span>
          </div>

          <div className="relative w-full max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-rose-500 dark:text-rose-400 transition-colors" />
            <input
              placeholder="Search reports by reason or type..."
              className="pl-10 h-10 w-full rounded-xl border-none bg-muted/50 focus:bg-background focus:ring-4 focus:ring-rose-500/5 transition-all outline-none text-sm font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-background">
          {content}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
