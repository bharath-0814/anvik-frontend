import React from 'react';
import { 
  ShieldAlert, 
  FileCheck, 
  ArrowRight, 
  Info 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SuspiciousAlert } from '../types';

interface AlertsPanelProps {
  alerts: SuspiciousAlert[];
  onInvestigateInGraph: (clusterId: string) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  onInvestigateInGraph,
}) => {
  const { theme } = useTheme();

  return (
    <div className="space-y-5">
      {/* Overview Banner */}
      <div
        className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          theme === 'dark'
            ? 'bg-[#111E1A] border-[#1A332B]'
            : 'bg-white border-slate-200/90 shadow-sm'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                theme === 'dark'
                  ? 'bg-rose-950 text-rose-300 border border-rose-900'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              Explainable Decision Support
            </span>
            <span className="text-xs text-slate-400">
              Deterministic Rules Engine + NetworkX
            </span>
          </div>
          <h2
            className={`text-lg font-bold tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            Evidence-Linked Fraud Ring Alerts
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl mt-0.5">
            Suspicious transaction patterns scored transparently with linked evidence metrics,
            hardware collusion fingerprints, and chronological velocity indicators.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`px-4 py-2 rounded-xl border text-center ${
              theme === 'dark' ? 'bg-[#0E1715] border-[#1A332B]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Rings</span>
            <p className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">3</p>
          </div>
          <div
            className={`px-4 py-2 rounded-xl border text-center ${
              theme === 'dark' ? 'bg-[#0E1715] border-[#1A332B]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Flagged Volume</span>
            <p
              className={`text-xl font-bold font-mono ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              ₹8.45L
            </p>
          </div>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-2xl border p-5 space-y-4 transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-[#111E1A] border-[#1A332B] hover:border-emerald-700/60'
                : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
            }`}
          >
            {/* Alert Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-inherit pb-3.5">
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                      : 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-900'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-900'
                          : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900'
                      }`}
                    >
                      {alert.severity} • RISK {alert.riskScore}/100
                    </span>
                    <span className="text-xs font-mono text-slate-400">{alert.id}</span>
                    <span className="text-xs text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-xs text-slate-400">{alert.detectedAt}</span>
                  </div>
                  <h3
                    className={`text-sm font-bold mt-1 ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {alert.title}
                  </h3>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onInvestigateInGraph(alert.clusterId)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EAF7EE] text-[#0B6938] dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold transition-all self-start sm:self-center btn-press"
              >
                <span>Spotlight in Graph</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Synopsis */}
            <p
              className={`text-xs p-3 rounded-xl border leading-relaxed ${
                theme === 'dark'
                  ? 'bg-[#0E1715] border-[#182B24] text-slate-300'
                  : 'bg-slate-50 border-slate-200/60 text-slate-700'
              }`}
            >
              <strong className="text-slate-900 dark:text-white">Incident Synopsis: </strong>
              {alert.summary}
            </p>

            {/* Evidence Breakdown */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Supporting Evidence Metrics & Deterministic Rules</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {alert.evidence.map((ev, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border space-y-1.5 ${
                      theme === 'dark'
                        ? 'bg-[#0E1715] border-[#182B24]'
                        : 'bg-white border-slate-200/80 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {ev.ruleId}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium">Verified</span>
                    </div>
                    <p
                      className={`text-xs font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {ev.ruleName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                      {ev.description}
                    </p>

                    <div className="pt-2 border-t border-inherit flex flex-wrap gap-1">
                      {Object.entries(ev.metrics).map(([k, v]) => (
                        <div
                          key={k}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-[#162722] text-slate-600 dark:text-slate-300 flex items-center gap-1 font-mono"
                        >
                          <span className="text-slate-400">{k}:</span>
                          <span className="font-bold">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  <strong className="text-slate-800 dark:text-slate-200">Recommended: </strong>
                  {alert.suggestedAction}
                </span>
              </div>
              <span className="text-[11px] font-mono font-medium">
                Exposure: ₹{alert.totalVolume.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
