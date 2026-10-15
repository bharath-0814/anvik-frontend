import React from 'react';
import { 
  ChevronRight, 
  Search, 
  Network,
  Download,
  Plus
} from 'lucide-react';

interface HeaderProps {
  currentInvestigationId?: string;
  onOpenSearch: () => void;
  onOpenAlerts: () => void;
  alertCount?: number;
  onDownloadReport?: () => void;
  onReturnToIntake?: () => void;
  isGraphLoaded?: boolean;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentInvestigationId = 'INV-2026-084',
  onOpenSearch,
  onOpenAlerts,
  alertCount = 3,
  onDownloadReport,
  onReturnToIntake,
  isGraphLoaded = false,
  onLogout,
}) => {
  return (
    <header className="h-14 px-5 flex items-center justify-between border-b border-slate-200/90 bg-white shadow-2xs select-none z-20">
      {/* Left: Brand Logo + Breadcrumbs */}
      <div className="flex items-center gap-4">
        {/* Brand Icon & Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0A7347] flex items-center justify-center text-white shadow-xs">
            <Network className="w-4 h-4 stroke-[2.4]" />
          </div>
          <div className="flex items-baseline">
            <span className="text-base font-bold tracking-tight text-slate-900">
              anvik
            </span>
            <span className="text-[#10B981] font-bold text-lg leading-none ml-0.5">•</span>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs">
          <span 
            onClick={onReturnToIntake}
            className="text-slate-400 font-medium hover:text-[#007065] cursor-pointer transition-colors"
            title="Return to Complaints & records"
          >
            Workspace
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span 
            onClick={onReturnToIntake}
            className={`font-medium transition-colors cursor-pointer ${
              isGraphLoaded ? 'text-slate-400 hover:text-[#007065]' : 'font-semibold text-slate-900'
            }`}
            title="Return to Complaints & records"
          >
            Complaints & records
          </span>
          {isGraphLoaded && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono font-semibold text-xs text-slate-900">
                {currentInvestigationId}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right: Actions, Search, Avatar */}
      <div className="flex items-center gap-3">
        {/* New Case / Intake Button */}
        {isGraphLoaded && onReturnToIntake && (
          <button
            onClick={onReturnToIntake}
            title="Enter new Transaction ID & Device ID"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-all shadow-2xs btn-press"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Case</span>
          </button>
        )}

        {/* Download Report Button (Only appears after choosing an investigation) */}
        {isGraphLoaded && onDownloadReport && (
          <button
            onClick={onDownloadReport}
            title="Download Forensic Investigation Report (HTML + PDF with Graph Analysis)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0D6B42] hover:bg-[#0A5634] text-white transition-all shadow-xs btn-press"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download Report</span>
          </button>
        )}

        {/* Search Icon */}
        <button
          onClick={onOpenSearch}
          title="Search entities (Ctrl+K)"
          className="p-1.5 rounded-lg transition-colors btn-press text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Avatar BK with Logout Action */}
        <button
          onClick={onLogout}
          title="Analyst: Bharath K (Click to Log Out)"
          className="w-8 h-8 rounded-full bg-[#0D6B42] hover:bg-[#09472B] active:scale-95 text-white flex items-center justify-center font-bold text-xs ring-1 ring-emerald-500/40 select-none shadow-xs transition-all cursor-pointer"
        >
          BK
        </button>
      </div>
    </header>
  );
};
