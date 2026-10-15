import React from 'react';
import { AlertTriangle, ArrowUpRight, ArrowRight, ShieldAlert, Clock, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SuspiciousAlert } from '../types';

interface ExplainableAlertsCardProps {
  alerts: SuspiciousAlert[];
  onOpenFullAlerts: () => void;
  onSelectAlert: (alert: SuspiciousAlert) => void;
}

export const ExplainableAlertsCard: React.FC<ExplainableAlertsCardProps> = ({
  alerts,
  onOpenFullAlerts,
  onSelectAlert,
}) => {
  const { theme } = useTheme();

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
            className={`w-6 h-6 rounded-md flex items-center justify-center ${
              theme === 'dark' ? 'bg-[#1C2F29] text-amber-400' : 'bg-amber-50 text-amber-600'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <span
            className={`text-xs font-bold tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            Explainable alerts
          </span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              theme === 'dark' ? 'bg-[#1A312A] text-slate-300' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {alerts.length}
          </span>
        </div>

        <button
          onClick={onOpenFullAlerts}
          title="Open full alerts view"
          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Alert Stream */}
      <div className="p-4 space-y-3.5 flex-1 overflow-y-auto">
        {alerts.map((alt) => (
          <div
            key={alt.id}
            className={`p-3.5 rounded-xl border transition-all duration-150 ${
              theme === 'dark'
                ? 'bg-[#0E1815] border-[#182E26] hover:border-emerald-700/50'
                : 'bg-[#FAFCFB] border-slate-200/70 hover:border-slate-300 shadow-xs'
            }`}
          >
            {/* Tag & Timestamp */}
            <div className="flex items-center justify-between text-[11px] mb-2">
              <span
                className={`px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 ${
                  alt.severity === 'CRITICAL' || alt.severity === 'HIGH'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200/70 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-900'
                    : 'bg-amber-50 text-amber-700 border border-amber-200/70 dark:bg-amber-950/60 dark:text-amber-400'
                }`}
              >
                <span>{alt.severity === 'CRITICAL' ? 'Critical priority' : 'High priority'}</span>
                <ArrowUpRight className="w-2.5 h-2.5" />
              </span>
              <span className="text-slate-400 text-[10px]">12 min ago</span>
            </div>

            {/* Title & Description */}
            <h4
              className={`text-xs font-bold tracking-tight mb-1 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              {alt.patternType === 'MULE_RING' ? 'Rapid onward transfers' : alt.title}
            </h4>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              {alt.summary}
            </p>

            {/* Bottom count & 'Why flagged' link */}
            <div className="flex items-center justify-between pt-2 border-t border-inherit text-[11px]">
              <span className="text-slate-400 font-mono">
                {alt.involvedEntitiesCount} entities • ₹{(alt.totalVolume / 1000).toFixed(0)}k
              </span>

              <button
                onClick={() => onSelectAlert(alt)}
                className="flex items-center gap-1 text-xs font-semibold text-[#0B6938] dark:text-emerald-400 hover:underline btn-press"
              >
                <span>Why flagged</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
