import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Folder, 
  RotateCw, 
  FileText, 
  ArrowRight, 
  SlidersHorizontal, 
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  X
} from 'lucide-react';

export interface ComplaintItem {
  id: string; // e.g. NCRP-2026-0841
  dateReceived: string; // e.g. 15 Oct 2026
  transactionReference: string; // e.g. UPI260915084127
  deviceId: string; // e.g. DEV-208101
  status: 'Open' | 'In review' | 'Resolved';
  riskScore: string; // e.g. "—", "88", "94"
  amount: number;
}

const DEFAULT_COMPLAINTS: ComplaintItem[] = [
  {
    id: 'NCRP-2026-0841',
    dateReceived: '15 Oct 2026',
    transactionReference: 'UPI260915084127',
    deviceId: 'DEV-208101',
    status: 'Open',
    riskScore: '—',
    amount: 24500,
  },
  {
    id: 'NCRP-2026-0839',
    dateReceived: '15 Oct 2026',
    transactionReference: 'UPI260915083902',
    deviceId: 'ANDR_09F2',
    status: 'In review',
    riskScore: '—',
    amount: 16000,
  },
  {
    id: 'NCRP-2026-0836',
    dateReceived: '14 Oct 2026',
    transactionReference: 'UPI260914092611',
    deviceId: 'DEV-7F3A9C',
    status: 'Open',
    riskScore: '—',
    amount: 7800,
  },
  {
    id: 'NCRP-2026-0824',
    dateReceived: '13 Oct 2026',
    transactionReference: 'UPI260913140288',
    deviceId: 'DEV-33019A',
    status: 'In review',
    riskScore: '88',
    amount: 52000,
  },
  {
    id: 'NCRP-2026-0812',
    dateReceived: '12 Oct 2026',
    transactionReference: 'UPI260912110543',
    deviceId: 'DEV-889021',
    status: 'Open',
    riskScore: '94',
    amount: 31000,
  },
];

interface InvestigationIntakeScreenProps {
  onLoadGraph: (transactionId: string, deviceId: string, caseId: string) => void;
  isLoading?: boolean;
}

export const InvestigationIntakeScreen: React.FC<InvestigationIntakeScreenProps> = ({
  onLoadGraph,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Open' | 'In review' | 'Resolved'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  // Manual Custom Case inputs
  const [manualTxn, setManualTxn] = useState('UPI260915084127');
  const [manualDev, setManualDev] = useState('ANDR_09F2');
  const [manualCase, setManualCase] = useState('NCRP-2026-0841');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowManualModal(false);
    onLoadGraph(manualTxn || 'UPI260915084127', manualDev || 'ANDR_09F2', manualCase || 'NCRP-2026-0841');
  };

  const filteredComplaints = useMemo(() => {
    return DEFAULT_COMPLAINTS.filter((c) => {
      const matchesSearch =
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.transactionReference.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="w-full h-full bg-[#FBF9F4] text-slate-800 flex flex-col overflow-y-auto select-none p-6 sm:p-10">
      <div className="max-w-5xl w-full mx-auto space-y-6">
        {/* 1. Header Section */}
        <div className="flex items-start justify-between gap-4">
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-0.5 bg-[#007065]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#007065]">
                INVESTIGATION WORKSPACE
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-1.5 font-sans">
              Complaints & records
            </h1>

            {/* Subtitle */}
            <p className="text-sm text-slate-500">
              A connected view starts with a complaint or custom investigation workspace.
            </p>
          </div>

          {/* Top-Right Action: + New Workspace Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowManualModal(true)}
              title="Create New Investigation Workspace"
              className="px-4 py-2.5 rounded-xl bg-[#007065] hover:bg-[#005a52] active:scale-95 text-white flex items-center gap-2 shadow-xs transition-all cursor-pointer font-bold text-xs shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Workspace</span>
            </button>
          </div>
        </div>

        {/* 2. Tabs Row */}
        <div className="flex items-center justify-between border-b border-[#E8E4D8] pt-2">
          <div className="flex items-center gap-6">
            {/* Tab: All complaints */}
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 pb-3 text-sm font-semibold transition-all relative cursor-pointer ${
                activeTab === 'all'
                  ? 'text-[#007065]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>All complaints</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-[#E8F5F1] text-[#007065]'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                5
              </span>
              {activeTab === 'all' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007065] rounded-full" />
              )}
            </button>

            {/* Tab: Saved investigations */}
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 pb-3 text-sm font-semibold transition-all relative cursor-pointer ${
                activeTab === 'saved'
                  ? 'text-[#007065]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>Saved investigations</span>
              <span className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-400">
                0
              </span>
              {activeTab === 'saved' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007065] rounded-full" />
              )}
            </button>
          </div>

          {/* Refresh Action Button */}
          <button
            onClick={handleRefresh}
            title="Refresh Complaints Feed"
            className={`p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer ${
              isRefreshing ? 'animate-spin text-[#007065]' : ''
            }`}
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* 3. Search & Filter Bar (Clean, Uncluttered, Spacious) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by complaint ID or transaction reference..."
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#E2DFD7] hover:border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007065] focus:ring-2 focus:ring-[#007065]/10 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right side: Status Filter & Record Count */}
          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
            {/* Status Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="pl-3.5 pr-8 py-2.5 bg-white border border-[#E2DFD7] hover:border-slate-300 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-[#007065] focus:ring-2 focus:ring-[#007065]/10 shadow-2xs cursor-pointer appearance-none"
              >
                <option value="all">All statuses</option>
                <option value="Open">Open</option>
                <option value="In review">In review</option>
                <option value="Resolved">Resolved</option>
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Record Count Badge */}
            <span className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold whitespace-nowrap border border-slate-200 shadow-2xs">
              {filteredComplaints.length} {filteredComplaints.length === 1 ? 'record' : 'records'}
            </span>
          </div>
        </div>

        {/* 4. Table / Feed Card */}
        {activeTab === 'all' ? (
          <div className="border border-[#E2DFD7] rounded-2xl bg-white overflow-hidden shadow-2xs">
            {/* Table Header Strip */}
            <div className="grid grid-cols-12 px-6 py-3 bg-[#EEF2F6] text-[11px] font-bold uppercase tracking-wider text-slate-600 border-b border-[#E2DFD7]">
              <div className="col-span-3">COMPLAINT ID</div>
              <div className="col-span-2">DATE RECEIVED</div>
              <div className="col-span-3">TRANSACTION REFERENCE</div>
              <div className="col-span-2">STATUS</div>
              <div className="col-span-1">RISK SCORE</div>
              <div className="col-span-1 text-right">ACTION</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[#EAE7DC]">
              {filteredComplaints.map((c) => (
                <div
                  key={c.id}
                  className="grid grid-cols-12 px-6 py-4 items-center text-xs hover:bg-[#FAF9F5] transition-colors"
                >
                  {/* Complaint ID with File Icon */}
                  <div className="col-span-3 flex items-center gap-2.5 font-bold text-slate-900">
                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="tracking-tight">{c.id}</span>
                  </div>

                  {/* Date Received */}
                  <div className="col-span-2 text-slate-600 font-medium">
                    {c.dateReceived}
                  </div>

                  {/* Transaction Reference */}
                  <div className="col-span-3 font-mono text-slate-700 font-medium">
                    {c.transactionReference}
                  </div>

                  {/* Status Pill */}
                  <div className="col-span-2">
                    {c.status === 'Open' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                        <span>Open</span>
                      </span>
                    ) : c.status === 'In review' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FEF3C7] text-amber-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>In review</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>Resolved</span>
                      </span>
                    )}
                  </div>

                  {/* Risk Score */}
                  <div className="col-span-1 font-mono font-semibold text-slate-600">
                    {c.riskScore}
                  </div>

                  {/* Action Link: Investigate -> */}
                  <div className="col-span-1 text-right">
                    <button
                      onClick={() => onLoadGraph(c.transactionReference, c.deviceId, c.id)}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1 font-bold text-xs text-[#007065] hover:text-[#005a52] active:scale-95 group transition-all cursor-pointer whitespace-nowrap"
                    >
                      <span>Investigate</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredComplaints.length === 0 && (
                <div className="p-10 text-center text-slate-400 text-xs">
                  No complaints match your search or filter criteria.
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Saved Investigations Empty State */
          <div className="border border-[#E2DFD7] rounded-2xl bg-white p-12 text-center shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No saved investigations yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Select any active complaint from the "All complaints" tab and click "Investigate" to launch and save your network graph analysis.
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={() => setActiveTab('all')}
                className="px-4 py-2 rounded-xl bg-[#007065] text-white font-semibold text-xs transition-colors hover:bg-[#005a52] cursor-pointer"
              >
                Browse Active Complaints
              </button>
              <button
                onClick={() => setShowManualModal(true)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Workspace</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. CREATE NEW WORKSPACE MODAL */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2DFD7] shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E8F5F1] text-[#007065] flex items-center justify-center">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Create New Workspace</h3>
                  <span className="text-[11px] text-slate-500">Initialize a custom fraud case workspace</span>
                </div>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm p-1 rounded-md hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Complaint / Case ID
                </label>
                <input
                  type="text"
                  value={manualCase}
                  onChange={(e) => setManualCase(e.target.value)}
                  placeholder="e.g. NCRP-2026-0841"
                  className="w-full bg-[#FAF9F5] border border-[#DDD8CA] rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#007065]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Transaction Reference (UTR / UPI)
                </label>
                <input
                  type="text"
                  value={manualTxn}
                  onChange={(e) => setManualTxn(e.target.value)}
                  placeholder="e.g. UPI260915084127"
                  className="w-full bg-[#FAF9F5] border border-[#DDD8CA] rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#007065]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Device Identifier
                </label>
                <input
                  type="text"
                  value={manualDev}
                  onChange={(e) => setManualDev(e.target.value)}
                  placeholder="e.g. ANDR_09F2"
                  className="w-full bg-[#FAF9F5] border border-[#DDD8CA] rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#007065]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#007065] hover:bg-[#005a52] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
