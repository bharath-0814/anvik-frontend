import React from 'react';
import { 
  Download, 
  Plus, 
  Clock, 
  Sparkles,
  Layers,
  FileText,
  CreditCard,
  Bell,
  MessageSquare,
  FlaskConical
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface WorkspaceHeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onExportCase: () => void;
  onNewInvestigation: () => void;
  complaintCount?: number;
  transactionCount?: number;
  alertCount?: number;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  activeTab,
  onSelectTab,
  onExportCase,
  onNewInvestigation,
  complaintCount = 3,
  transactionCount = 7,
  alertCount = 3,
}) => {
  const { theme } = useTheme();

  return (
    <div className="space-y-4">
      {/* Title & Primary Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            Investigation workspace
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Connect the dots. Understand the signals. Investigate with confidence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Export Case Button */}
          <button
            onClick={onExportCase}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all btn-press ${
              theme === 'dark'
                ? 'bg-[#121F1B] border-[#1E3B33] text-slate-200 hover:bg-[#1A2E28]'
                : 'bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50 shadow-sm'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export case</span>
          </button>

          {/* New Investigation Button */}
          <button
            onClick={onNewInvestigation}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#0A5C36] hover:bg-[#07472A] text-white shadow-sm shadow-emerald-900/20 transition-all btn-press"
          >
            <Plus className="w-4 h-4" />
            <span>+ New investigation</span>
          </button>
        </div>
      </div>

      {/* Status Metadata line */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`font-semibold ${
              theme === 'dark' ? 'text-emerald-400' : 'text-[#0B6938]'
            }`}
          >
            Collect request network
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="font-mono text-slate-500 dark:text-slate-400">
            INV-2026-084
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              theme === 'dark'
                ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                : 'bg-amber-50 text-amber-700 border border-amber-200/80'
            }`}
          >
            In review
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
          <Clock className="w-3 h-3" />
          <span>Last updated 10:48 AM</span>
        </div>
      </div>

      {/* Tabs Row */}
      <div
        className={`flex items-center gap-1 border-b overflow-x-auto ${
          theme === 'dark' ? 'border-[#1C2E29]' : 'border-slate-200'
        }`}
      >
        <button
          onClick={() => onSelectTab('overview')}
          className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap btn-press ${
            activeTab === 'overview'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => onSelectTab('graph')}
          className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 btn-press ${
            activeTab === 'graph'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>Network graph</span>
        </button>

        <button
          onClick={() => onSelectTab('complaints')}
          className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 btn-press ${
            activeTab === 'complaints'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>Complaints</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
              theme === 'dark' ? 'bg-[#182924] text-slate-300' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {complaintCount}
          </span>
        </button>

        <button
          onClick={() => onSelectTab('timeline')}
          className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 btn-press ${
            activeTab === 'timeline'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>Transactions</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
              theme === 'dark' ? 'bg-[#182924] text-slate-300' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {transactionCount}
          </span>
        </button>

        <button
          onClick={() => onSelectTab('alerts')}
          className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 btn-press ${
            activeTab === 'alerts'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>Alerts</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
              theme === 'dark' ? 'bg-[#182924] text-slate-300' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {alertCount}
          </span>
        </button>

        <button
          onClick={() => onSelectTab('cases')}
          className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap btn-press ${
            activeTab === 'cases'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Case notes
        </button>

        <button
          onClick={() => onSelectTab('counterfactual')}
          className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 btn-press ${
            activeTab === 'counterfactual'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Counterfactual</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-[#0B6938] dark:bg-emerald-950 dark:text-emerald-300 uppercase font-bold">
            Sim
          </span>
        </button>
      </div>
    </div>
  );
};
