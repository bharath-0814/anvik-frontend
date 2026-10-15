import React from 'react';
import { 
  Network, 
  FileText, 
  Clock, 
  History
} from 'lucide-react';

export type LeftNavDrawer = 'complaints' | 'timeline' | 'summary' | null;

interface SidebarProps {
  activeDrawer: LeftNavDrawer;
  onToggleDrawer: (drawer: 'complaints' | 'timeline' | 'summary') => void;
  complaintCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeDrawer,
  onToggleDrawer,
  complaintCount = 4,
}) => {
  return (
    <aside className="w-16 shrink-0 flex flex-col items-center py-4 space-y-3.5 select-none relative z-50 bg-[#F4F7F5] text-slate-700 border-r border-[#E8E4D8]">
      {/* 1. Main Network Graph Active Button (Icon Only with Hover Tooltip) */}
      <div className="relative group">
        <button
          onClick={() => onToggleDrawer(activeDrawer ? (null as any) : 'complaints')}
          aria-label="Network Graph"
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all btn-press bg-emerald-50 border border-emerald-600 text-emerald-700 shadow-xs cursor-pointer"
        >
          <Network className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Hover Tooltip */}
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150 z-[100] shadow-xl bg-[#0B1A15] border border-[#183B2E] text-white">
          <span>Network Graph</span>
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#0B1A15]" />
        </div>
      </div>

      {/* 2. Complaints Button (Icon Only with Hover Tooltip) */}
      <div className="relative group">
        <button
          onClick={() => onToggleDrawer('complaints')}
          aria-label="Complaints"
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all btn-press relative cursor-pointer ${
            activeDrawer === 'complaints'
              ? 'bg-emerald-50 border border-emerald-600 text-emerald-800 shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900 shadow-2xs'
          }`}
        >
          <FileText className="w-4 h-4" />
          {complaintCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>

        {/* Hover Tooltip */}
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150 z-[100] shadow-xl bg-[#0B1A15] border border-[#183B2E] text-white flex items-center gap-1.5">
          <span>Complaints</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-950 text-rose-300 border border-rose-800 font-bold">
            {complaintCount}
          </span>
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#0B1A15]" />
        </div>
      </div>

      {/* 3. Timeline Button (Icon Only with Hover Tooltip) */}
      <div className="relative group">
        <button
          onClick={() => onToggleDrawer('timeline')}
          aria-label="Timeline"
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all btn-press ${
            activeDrawer === 'timeline'
              ? 'bg-emerald-50 border border-emerald-600 text-emerald-800 shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900 shadow-2xs'
          }`}
        >
          <Clock className="w-4 h-4" />
        </button>

        {/* Hover Tooltip */}
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150 z-[100] shadow-xl bg-[#0B1A15] border border-[#183B2E] text-white">
          <span>Timeline</span>
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#0B1A15]" />
        </div>
      </div>

      {/* 4. Past Record Button (Icon Only with Hover Tooltip) */}
      <div className="relative group">
        <button
          onClick={() => onToggleDrawer('summary')}
          aria-label="Past Record"
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all btn-press cursor-pointer ${
            activeDrawer === 'summary'
              ? 'bg-emerald-50 border border-emerald-600 text-emerald-800 shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900 shadow-2xs'
          }`}
        >
          <History className="w-4 h-4" />
        </button>

        {/* Hover Tooltip */}
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150 z-[100] shadow-xl bg-[#0B1A15] border border-[#183B2E] text-white">
          <span>Past Record</span>
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#0B1A15]" />
        </div>
      </div>
    </aside>
  );
};
