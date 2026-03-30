import React, { useState } from 'react';
import { 
  FileText, 
  ArrowRight, 
  Download,
  Flag
} from 'lucide-react';
import { mockOrganizedContent } from '@/lib/mockData';
import ReportModal from '@/components/report-modal';

export default function OrganizedContentPage({ user }) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1 text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Organized Content</h1>
        <p className="text-muted-foreground font-medium text-lg">Access all your study materials and lecture notes in one place.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockOrganizedContent.map((item) => (
          <div key={item.id} className="premium-card hover:translate-y-[-4px] transition-all border-border/60 p-6 flex flex-col gap-4 group text-left">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors duration-500">
                <FileText className="size-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xl text-foreground group-hover:text-brand-blue transition-colors">{item.title}</h4>
                  <button 
                    onClick={() => {
                      setReportTarget(item);
                      setIsReportModalOpen(true);
                    }}
                    className="p-2 rounded-lg hover:bg-rose-50 dark:bg-rose-500/10 text-muted-foreground/80 hover:text-rose-500 dark:text-rose-400 transition-colors"
                    title="Report Content"
                  >
                    <Flag className="size-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest mt-0.5">{item.subject}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-2">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">File Type</span>
                <span className="text-sm font-bold text-slate-700">{item.type}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Size</span>
                <span className="text-sm font-bold text-slate-700">{item.size}</span>
              </div>
              <button className="flex items-center gap-2 bg-brand-blue/5 hover:bg-brand-blue hover:text-white text-brand-blue px-4 py-2 rounded-xl font-bold text-sm transition-all group-hover:shadow-lg group-hover:shadow-brand-blue/20">
                <Download className="size-4" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <ReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetId={reportTarget?.id}
        targetName={reportTarget?.title}
        contentType="material"
      />

      {/* Empty State / Suggestions */}
      {mockOrganizedContent.length > 0 && (
        <div className="bg-muted/50 rounded-2xl p-8 border border-dashed border-border text-center">
          <p className="text-muted-foreground font-medium italic">"The beautiful thing about learning is that no one can take it away from you." — B.B. King</p>
        </div>
      )}
    </div>
  );
}
