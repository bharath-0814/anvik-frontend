import React from 'react';
import { 
  ShieldAlert, 
  Search, 
  Network, 
  BellRing, 
  Clock, 
  Briefcase, 
  FlaskConical, 
  PlusCircle, 
  Layers
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'graph' | 'alerts' | 'timeline' | 'cases' | 'counterfactual';
  setActiveTab: (tab: 'graph' | 'alerts' | 'timeline' | 'cases' | 'counterfactual') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  openComplaintModal: () => void;
  alertCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  openComplaintModal,
  alertCount,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & PS Badge */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    ANVIK
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/60 rounded">
                    PS-16
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  UPI Fraud-Ring Graph Investigator
                </p>
              </div>
            </div>

            {/* Synthetic Data Guard Badge */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Synthetic Sandboxed Dataset</span>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-md mx-6 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search UPI VPA, Account No, Device IMEI, or UTR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200 px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={openComplaintModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 rounded-lg text-xs font-medium transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Link Complaint</span>
            </button>

            <div className="h-6 w-px bg-slate-800 hidden sm:block" />

            {/* System Status Ticker */}
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-500">Mules Flagged:</span>
              <span className="font-semibold text-rose-400 font-mono">4</span>
              <span className="text-slate-700">|</span>
              <span className="text-slate-500">At-Risk:</span>
              <span className="font-semibold text-amber-400 font-mono">₹4.8L</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 border-t border-slate-800/80 -mb-px overflow-x-auto">
          <button
            onClick={() => setActiveTab('graph')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'graph'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Graph Canvas</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'alerts'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <BellRing className="w-4 h-4" />
            <span>Evidence-Linked Alerts</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-300 font-bold">
              {alertCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'timeline'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Dispersion Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('cases')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'cases'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Investigation Dossiers</span>
          </button>

          <button
            onClick={() => setActiveTab('counterfactual')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'counterfactual'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>Counterfactual "What-If" Analysis</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-indigo-900/60 text-indigo-300 uppercase font-semibold">
              Signature
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
