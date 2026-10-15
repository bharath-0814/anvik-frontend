import React from 'react';
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Lock, 
  X,
  Info,
  DollarSign,
  Network,
  Download
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { GraphNodeData, GraphEdgeData, ComplaintRecord } from '../types';

interface InvestigationSummaryPanelProps {
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
  complaints: ComplaintRecord[];
  onClose?: () => void;
  onDownloadReport?: () => void;
}

export const InvestigationSummaryPanel: React.FC<InvestigationSummaryPanelProps> = ({
  nodes,
  edges,
  complaints,
  onClose,
  onDownloadReport,
}) => {
  const { theme } = useTheme();

  // Dynamic calculations
  const linkedAccountsCount = nodes.filter((n) => n.type === 'account').length;
  const totalTransactionsCount = edges.filter((e) => e.amount > 0).length;
  const associatedComplaintsCount = complaints.length;
  const complaintsUnderInvestigation = complaints.filter((c) => c.status === 'under_investigation').length;
  const complaintsPendingReview = complaints.filter((c) => c.status === 'pending_review').length;
  const resolvedComplaints = complaints.filter((c) => c.status === 'resolved').length;

  const totalTransactionValue = edges.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const suspiciousConnectionsCount = edges.filter((e) => e.isSuspicious).length;
  const hardwareCollusionCount = nodes.filter((n) => n.type === 'device').length;

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
              theme === 'dark' ? 'bg-[#182C26] text-emerald-400' : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3
              className={`text-xs font-bold tracking-tight ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              Investigation Summary
            </h3>
            <p className="text-[10px] text-slate-400">Quantitative metrics & audit metrics</p>
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

      {/* Metrics Grid */}
      <div className="p-4 space-y-4 flex-1 overflow-y-auto text-xs">
        {/* Core Stats 2x2 Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Linked Accounts */}
          <div
            className={`p-3 rounded-xl border ${
              theme === 'dark' ? 'bg-[#0E1715] border-[#182B24]' : 'bg-[#FAFCFB] border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
              <span>Linked Accounts</span>
              <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span
              className={`text-xl font-bold font-mono ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              {linkedAccountsCount}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">1 victim • 4 mules • 1 control</p>
          </div>

          {/* Total Transactions */}
          <div
            className={`p-3 rounded-xl border ${
              theme === 'dark' ? 'bg-[#0E1715] border-[#182B24]' : 'bg-[#FAFCFB] border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
              <span>Graph Transactions</span>
              <CreditCard className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <span
              className={`text-xl font-bold font-mono ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              {totalTransactionsCount}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">UPI P2P & P2M hops</p>
          </div>

          {/* Associated Complaints */}
          <div
            className={`p-3 rounded-xl border ${
              theme === 'dark' ? 'bg-[#0E1715] border-[#182B24]' : 'bg-[#FAFCFB] border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
              <span>NCRP Complaints</span>
              <FileText className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <span
              className={`text-xl font-bold font-mono ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              {associatedComplaintsCount}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">Active dispute records</p>
          </div>

          {/* Total Flow Volume */}
          <div
            className={`p-3 rounded-xl border ${
              theme === 'dark' ? 'bg-[#0E1715] border-[#182B24]' : 'bg-[#FAFCFB] border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
              <span>Total Volume</span>
              <DollarSign className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <span
              className={`text-xl font-bold font-mono ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              ₹{(totalTransactionValue / 100000).toFixed(2)}L
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">₹{totalTransactionValue.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Complaints Breakdown Card */}
        <div
          className={`p-3.5 rounded-xl border space-y-2.5 ${
            theme === 'dark' ? 'bg-[#0E1715] border-[#182B24]' : 'bg-[#FAFCFB] border-slate-200/80'
          }`}
        >
          <span className="text-[11px] font-bold tracking-tight block">
            Complaint Resolution Status
          </span>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Under Investigation:</span>
              </span>
              <span className="font-mono font-bold">{complaintsUnderInvestigation}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Pending Review:</span>
              </span>
              <span className="font-mono font-bold">{complaintsPendingReview}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Resolved & Settled:</span>
              </span>
              <span className="font-mono font-bold">{resolvedComplaints}</span>
            </div>
          </div>
        </div>

        {/* Network Signals & Connections */}
        <div
          className={`p-3.5 rounded-xl border space-y-2.5 ${
            theme === 'dark' ? 'bg-[#0E1715] border-[#182B24]' : 'bg-[#FAFCFB] border-slate-200/80'
          }`}
        >
          <span className="text-[11px] font-bold tracking-tight block">
            Suspicious Signals & Collusion
          </span>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Suspicious Connections:</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                {suspiciousConnectionsCount} flagged edges
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Hardware Fingerprints:</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                {hardwareCollusionCount} shared device
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Structuring Latency:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                &lt; 4 mins total hop
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: Download Comprehensive Forensic Report */}
        {onDownloadReport && (
          <button
            onClick={onDownloadReport}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs bg-[#0D6B42] hover:bg-[#0A5634] text-white transition-all shadow-md btn-press cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Investigation Report (HTML & PDF)</span>
          </button>
        )}

        {/* Legal Disclaimer Box */}
        <div
          className={`p-3 rounded-xl border flex items-start gap-2 text-[10px] leading-relaxed ${
            theme === 'dark'
              ? 'bg-[#12221D] border-[#1C3B32] text-slate-400'
              : 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
          }`}
        >
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
          <span>
            <strong>Decision Support Protocol: </strong>
            Suspicious connections indicate high investigative priority. Risk indicators are 
            deterministic decision-support metrics and must not be treated as automated legal proof of guilt.
          </span>
        </div>
      </div>
    </div>
  );
};
