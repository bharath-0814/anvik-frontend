import React, { useState } from 'react';
import { 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldAlert, 
  ArrowRight, 
  RotateCcw,
  X,
  CreditCard,
  User,
  Filter
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ComplaintRecord, ComplaintStatus } from '../types';

interface ComplaintsPanelProps {
  complaints: ComplaintRecord[];
  onUpdateComplaintStatus: (complaintId: string, newStatus: ComplaintStatus) => void;
  selectedComplaintId: string | null;
  onSelectComplaint: (complaint: ComplaintRecord | null) => void;
  onClose?: () => void;
}

export const ComplaintsPanel: React.FC<ComplaintsPanelProps> = ({
  complaints,
  onUpdateComplaintStatus,
  selectedComplaintId,
  onSelectComplaint,
  onClose,
}) => {
  const { theme } = useTheme();
  const [filterStatus, setFilterStatus] = useState<'ALL' | ComplaintStatus>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(complaints[0]?.id || null);

  const filteredComplaints = complaints.filter((c) => {
    if (filterStatus === 'ALL') return true;
    return c.status === filterStatus;
  });

  const getStatusDot = (status: ComplaintStatus) => {
    switch (status) {
      case 'under_investigation':
        return <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-rose-500/20 shrink-0" />;
      case 'resolved':
        return <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20 shrink-0" />;
      case 'pending_review':
        return <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-amber-500/20 shrink-0" />;
    }
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'under_investigation':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900">
            {getStatusDot(status)}
            <span>Under Investigation</span>
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900">
            {getStatusDot(status)}
            <span>Resolved</span>
          </span>
        );
      case 'pending_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900">
            {getStatusDot(status)}
            <span>Pending Review</span>
          </span>
        );
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all h-full flex flex-col ${
        theme === 'dark'
          ? 'bg-[#111E1A] border-[#1A332B]'
          : 'bg-white border-slate-200/90 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-inherit flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              theme === 'dark' ? 'bg-[#182C26] text-rose-400' : 'bg-rose-50 text-rose-600'
            }`}
          >
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3
                className={`text-xs font-bold tracking-tight ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              >
                Previous Complaints
              </h3>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  theme === 'dark' ? 'bg-[#1A312A] text-slate-300' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {complaints.length}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Formal NCRP dispute registry</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors btn-press"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Filter Bar */}
      <div
        className={`px-3 py-2 border-b border-inherit flex items-center justify-between text-[11px] ${
          theme === 'dark' ? 'bg-[#0E1815]' : 'bg-[#FAFCFB]'
        }`}
      >
        <div className="flex items-center gap-1">
          <Filter className="w-3 h-3 text-slate-400" />
          <span className="text-slate-400 font-medium">Status:</span>
        </div>
        <div className="flex items-center gap-1">
          {(['ALL', 'under_investigation', 'pending_review', 'resolved'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all capitalize btn-press ${
                filterStatus === st
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All' : st === 'under_investigation' ? 'Investigating' : st === 'pending_review' ? 'Pending' : 'Resolved'}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Complaints List */}
      <div className="p-3.5 space-y-3 flex-1 overflow-y-auto">
        {filteredComplaints.map((c) => {
          const isSelected = selectedComplaintId === c.id;
          const isExpanded = expandedId === c.id;

          return (
            <div
              key={c.id}
              className={`rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'border-emerald-500 shadow-sm ring-1 ring-emerald-500/30'
                  : theme === 'dark'
                  ? 'bg-[#0E1715] border-[#182B24] hover:border-slate-700'
                  : 'bg-[#FAFCFB] border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Card Header (Always Visible) */}
              <div
                onClick={() => {
                  setExpandedId(isExpanded ? null : c.id);
                  onSelectComplaint(c);
                }}
                className="p-3 cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-[#0B6938] dark:text-emerald-400">
                      {c.complaintRef}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">• {c.date}</span>
                  </div>

                  {getStatusBadge(c.status)}
                </div>

                <p className="text-[11px] font-medium text-slate-700 dark:text-slate-200 line-clamp-2">
                  {c.shortDescription}
                </p>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1 font-mono">
                    <CreditCard className="w-3 h-3 text-slate-400" />
                    <span>₹{c.disputeAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>{isExpanded ? 'Less details' : 'Highlight in Graph'}</span>
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </div>
                </div>
              </div>

              {/* Expanded Card Details */}
              {isExpanded && (
                <div
                  className={`px-3 pb-3 pt-2 border-t border-inherit text-[11px] space-y-3 animate-in fade-in duration-150 ${
                    theme === 'dark' ? 'bg-[#0B1311]' : 'bg-slate-50/60'
                  }`}
                >
                  {/* Account Links */}
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 rounded bg-white dark:bg-[#121E1B] border border-slate-200 dark:border-[#1E3B33]">
                      <span className="text-slate-400 block font-semibold">Originator / Victim VPA</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate block">
                        {c.relatedAccountUpi}
                      </span>
                    </div>

                    <div className="p-2 rounded bg-white dark:bg-[#121E1B] border border-slate-200 dark:border-[#1E3B33]">
                      <span className="text-slate-400 block font-semibold">Beneficiary VPA</span>
                      <span className="font-mono font-bold text-rose-600 dark:text-rose-400 truncate block">
                        {c.relatedBeneficiaryUpi || 'Unassigned'}
                      </span>
                    </div>
                  </div>

                  {c.relatedTxnUtr && (
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
                      <span>UTR: {c.relatedTxnUtr}</span>
                      <span>Category: {c.category}</span>
                    </div>
                  )}

                  {c.analystNotes && (
                    <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200/60 dark:bg-amber-950/30 dark:border-amber-900/40 text-[10px] text-amber-800 dark:text-amber-300">
                      <strong>Analyst Note: </strong>
                      {c.analystNotes}
                    </div>
                  )}

                  {/* Interactive Status-Update Controls */}
                  <div className="pt-2 border-t border-inherit">
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                      Update Investigation Status:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateComplaintStatus(c.id, 'under_investigation');
                        }}
                        className={`py-1 px-1.5 rounded-lg text-[10px] font-semibold transition-all btn-press border ${
                          c.status === 'under_investigation'
                            ? 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs'
                            : 'bg-white dark:bg-[#142320] border-slate-200 dark:border-[#1E3B33] text-slate-500 hover:text-rose-600'
                        }`}
                      >
                        • Investigating
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateComplaintStatus(c.id, 'pending_review');
                        }}
                        className={`py-1 px-1.5 rounded-lg text-[10px] font-semibold transition-all btn-press border ${
                          c.status === 'pending_review'
                            ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs'
                            : 'bg-white dark:bg-[#142320] border-slate-200 dark:border-[#1E3B33] text-slate-500 hover:text-amber-600'
                        }`}
                      >
                        • Pending Review
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateComplaintStatus(c.id, 'resolved');
                        }}
                        className={`py-1 px-1.5 rounded-lg text-[10px] font-semibold transition-all btn-press border ${
                          c.status === 'resolved'
                            ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                            : 'bg-white dark:bg-[#142320] border-slate-200 dark:border-[#1E3B33] text-slate-500 hover:text-emerald-600'
                        }`}
                      >
                        ✓ Resolved
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
