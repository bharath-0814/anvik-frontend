import React from 'react';
import { 
  Clock, 
  ArrowRight, 
  ShieldAlert, 
  X, 
  Timer, 
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Zap,
  Activity
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { TimelineEvent, TimelineEventType } from '../types';

interface FraudTimelinePanelProps {
  timeline: TimelineEvent[];
  selectedEventId: string | null;
  onSelectEvent: (event: TimelineEvent | null) => void;
  onClose?: () => void;
}

export const FraudTimelinePanel: React.FC<FraudTimelinePanelProps> = ({
  timeline,
  selectedEventId,
  onSelectEvent,
  onClose,
}) => {
  const { theme } = useTheme();

  const getEventBadge = (type: TimelineEventType) => {
    switch (type) {
      case 'FLAGGED_TRANSACTION':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900 uppercase">
            Flagged Transaction
          </span>
        );
      case 'SUSPICIOUS_PATTERN':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900 uppercase">
            Suspicious Pattern
          </span>
        );
      case 'CASHOUT':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900 uppercase">
            Cashout Convergence
          </span>
        );
      case 'ANALYST_REVIEW':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900 uppercase">
            Analyst Review
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
              theme === 'dark' ? 'bg-[#182C26] text-emerald-400' : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3
              className={`text-xs font-bold tracking-tight ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              Fraud Timeline Sequence
            </h3>
            <p className="text-[10px] text-slate-400">Chronological fraud propagation</p>
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

      {/* Subheader info note */}
      <div
        className={`px-3.5 py-2 border-b border-inherit text-[10px] flex items-center justify-between ${
          theme === 'dark' ? 'bg-[#0E1815] text-slate-400' : 'bg-[#FAFCFB] text-slate-500'
        }`}
      >
        <span>Sequence: Oldest (10:02 AM) $\rightarrow$ Latest (10:15 AM)</span>
        <span className="font-mono">{timeline.length} events</span>
      </div>

      {/* Chronological Stream */}
      <div className="p-4 space-y-4 flex-1 overflow-y-auto relative before:absolute before:left-7 before:top-6 before:bottom-6 before:w-0.5 before:bg-gradient-to-b before:from-rose-500 before:via-amber-500 before:to-emerald-500">
        {timeline.map((evt, idx) => {
          const isSelected = selectedEventId === evt.id;

          return (
            <div
              key={evt.id}
              onClick={() => onSelectEvent(evt)}
              className={`relative pl-8 cursor-pointer group transition-all`}
            >
              {/* Event Marker */}
              <div
                className={`absolute left-1 top-2.5 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                  theme === 'dark' ? 'border-[#0B1311]' : 'border-white'
                } ${
                  isSelected
                    ? 'bg-emerald-500 ring-4 ring-emerald-500/30 scale-125'
                    : evt.eventType === 'FLAGGED_TRANSACTION'
                    ? 'bg-rose-500 ring-2 ring-rose-500/20'
                    : evt.eventType === 'CASHOUT'
                    ? 'bg-purple-500 ring-2 ring-purple-500/20'
                    : evt.eventType === 'ANALYST_REVIEW'
                    ? 'bg-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-amber-500 ring-2 ring-amber-500/20'
                }`}
              />

              {/* Event Card */}
              <div
                className={`p-3 rounded-xl border transition-all duration-150 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-sm ring-1 ring-emerald-500/30'
                    : theme === 'dark'
                    ? 'bg-[#0E1715] border-[#182B24] hover:border-slate-700'
                    : 'bg-[#FAFCFB] border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {evt.timestamp}
                    </span>
                    {evt.timeDeltaSeconds !== undefined && (
                      <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">
                        (+{evt.timeDeltaSeconds}s)
                      </span>
                    )}
                  </div>

                  {getEventBadge(evt.eventType)}
                </div>

                <h4
                  className={`text-xs font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {evt.title}
                </h4>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {evt.explanation}
                </p>

                {/* Sender -> Receiver Pill */}
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-inherit text-[10px]">
                  <div className="flex items-center gap-1 truncate text-slate-600 dark:text-slate-300 font-mono">
                    <span className="truncate max-w-[90px]">{evt.senderUpi}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate max-w-[90px] text-emerald-600 dark:text-emerald-400 font-bold">
                      {evt.receiverUpi}
                    </span>
                  </div>

                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 ml-2 shrink-0">
                    {evt.amount > 0 ? `₹${evt.amount.toLocaleString('en-IN')}` : 'Collusion'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
