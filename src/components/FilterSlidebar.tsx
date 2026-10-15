import React from 'react';
import { X, Sliders, RotateCcw, Check, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface FilterSlidebarProps {
  isOpen: boolean;
  onClose: () => void;
  minRiskScore: number;
  setMinRiskScore: (val: number) => void;
  minAmount: number;
  setMinAmount: (val: number) => void;
  timeRange: string;
  setTimeRange: (val: string) => void;
  filterTypes: { [key: string]: boolean };
  setFilterTypes: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  layoutName: string;
  setLayoutName: (val: 'cose' | 'concentric' | 'breadthfirst' | 'circle') => void;
  onReset: () => void;
}

export const FilterSlidebar: React.FC<FilterSlidebarProps> = ({
  isOpen,
  onClose,
  minRiskScore,
  setMinRiskScore,
  minAmount,
  setMinAmount,
  timeRange,
  setTimeRange,
  filterTypes,
  setFilterTypes,
  layoutName,
  setLayoutName,
  onReset,
}) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className={`w-96 h-full flex flex-col border-l shadow-2xl animate-slide-in-right ${
          theme === 'dark'
            ? 'bg-[#0E1715] border-[#1C2E29] text-slate-200'
            : 'bg-white border-slate-200 text-slate-800'
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
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Graph & Signal Filters</h3>
              <p className="text-[11px] text-slate-400">Interactive threshold sliders</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors btn-press"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sliders Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Slider 1: Risk Score Threshold */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">Minimum Risk Score</span>
              <span
                className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                  minRiskScore > 75
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                    : minRiskScore > 40
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                }`}
              >
                {minRiskScore} / 100
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={minRiskScore}
              onChange={(e) => setMinRiskScore(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 (All Nodes)</span>
              <span>50 (Suspicious)</span>
              <span>80+ (Critical)</span>
            </div>
          </div>

          {/* Slider 2: Minimum Transaction Amount */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">Min Transaction Volume</span>
              <span className="font-mono font-bold px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                ₹{minAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="300000"
              step="10000"
              value={minAmount}
              onChange={(e) => setMinAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹0</span>
              <span>₹1.5L</span>
              <span>₹3.0L+</span>
            </div>
          </div>

          {/* Time Window */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold">Time Window</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Last 1 hour', 'Last 24 hours', 'Last 7 days', 'All time'].map((tr) => (
                <button
                  key={tr}
                  onClick={() => setTimeRange(tr)}
                  className={`py-1.5 px-3 rounded-xl border text-xs font-medium transition-all btn-press ${
                    timeRange === tr
                      ? 'bg-[#0B6938] text-white border-emerald-700 shadow-sm'
                      : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tr}
                </button>
              ))}
            </div>
          </div>

          {/* Entity Type Visibility */}
          <div className="space-y-2.5">
            <label className="block text-xs font-semibold">Entity Visibility</label>
            <div className="space-y-2 text-xs">
              {[
                { key: 'account', label: 'Bank & UPI Accounts' },
                { key: 'device', label: 'Hardware Devices & IMEIs' },
                { key: 'merchant', label: 'Cashout Merchants & QRs' },
                { key: 'complaint', label: 'NCRP Cyber Complaints' },
              ].map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#12211C] border border-slate-200/60 dark:border-[#1E372E] cursor-pointer"
                >
                  <span className="text-xs">{label}</span>
                  <input
                    type="checkbox"
                    checked={filterTypes[key]}
                    onChange={() =>
                      setFilterTypes((prev) => ({ ...prev, [key]: !prev[key] }))
                    }
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Graph Layout Switcher */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold">Graph Layout Algorithm</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(['cose', 'concentric', 'breadthfirst', 'circle'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLayoutName(l)}
                  className={`py-1.5 px-3 rounded-xl border capitalize text-xs font-medium transition-all btn-press ${
                    layoutName === l
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {l === 'cose' ? 'Force Physics' : l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-inherit flex items-center justify-between gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors btn-press"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0A5C36] hover:bg-[#07472A] text-white transition-all shadow-sm btn-press"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
