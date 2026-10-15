import React, { useState } from 'react';
import { 
  Clock, 
  ArrowRight, 
  AlertCircle, 
  Timer, 
  ShieldAlert 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { TimelineEvent } from '../types';

interface TimelineViewProps {
  events: TimelineEvent[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ events }) => {
  const { theme } = useTheme();
  const [flaggedOnly, setFlaggedOnly] = useState(false);

  const filteredEvents = flaggedOnly ? events.filter((e) => e.isFlagged) : events;

  return (
    <div className="space-y-6">
      {/* Header */}
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
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-900'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              Chronological Propagation
            </span>
            <span className="text-xs text-slate-400">Rapid Dispersion & Velocity</span>
          </div>
          <h2
            className={`text-lg font-bold tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            Transaction Velocity & Time Delta Sequence
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl">
            Tracks rapid multi-hop transfers showing how quickly funds leave the victim's
            account and disperse across mule accounts into cashout merchant points.
          </p>
        </div>

        <button
          onClick={() => setFlaggedOnly(!flaggedOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all btn-press ${
            flaggedOnly
              ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-[#152520] dark:text-slate-300 dark:border-[#1E3B33]'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{flaggedOnly ? 'Showing Flagged Only' : 'Show All Txns'}</span>
        </button>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-rose-500 before:to-purple-500">
        {filteredEvents.map((evt) => (
          <div key={evt.id} className="relative group">
            {/* Dot */}
            <div
              className={`absolute -left-[27px] top-4 w-4 h-4 rounded-full border-2 transition-all ${
                theme === 'dark' ? 'border-[#0A1210]' : 'border-white'
              } ${
                evt.isFlagged
                  ? 'bg-rose-500 ring-4 ring-rose-500/20'
                  : 'bg-emerald-500 ring-4 ring-emerald-500/20'
              }`}
            />

            {/* Event Card */}
            <div
              className={`p-4 rounded-2xl border transition-all duration-150 ${
                theme === 'dark'
                  ? 'bg-[#111E1A] border-[#1A332B] hover:border-emerald-700/60'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-inherit pb-2.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1.5 font-mono text-xs px-2 py-0.5 rounded border ${
                      theme === 'dark'
                        ? 'bg-[#0E1715] border-[#182B24] text-emerald-400'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>{evt.timestamp} IST</span>
                  </div>

                  {evt.timeDeltaSeconds !== undefined && (
                    <div
                      className={`flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border ${
                        theme === 'dark'
                          ? 'bg-amber-950/40 text-amber-300 border-amber-900/60'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      <Timer className="w-3 h-3" />
                      <span>+{evt.timeDeltaSeconds}s hop</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">UTR: {evt.utr}</span>
                  <span
                    className={`text-sm font-bold font-mono ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    ₹{evt.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Sender & Receiver */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
                <div className="flex items-center gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Origin</span>
                    <p className="text-xs font-semibold">{evt.senderName}</p>
                    <p className="text-[10px] font-mono text-slate-400">{evt.sender}</p>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Beneficiary</span>
                    <p className="text-xs font-semibold">{evt.receiverName}</p>
                    <p className="text-[10px] font-mono text-slate-400">{evt.receiver}</p>
                  </div>
                </div>

                {evt.anomalyReason && (
                  <div
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-xl border self-start sm:self-auto font-medium ${
                      theme === 'dark'
                        ? 'bg-rose-950/40 border-rose-900/60 text-rose-300'
                        : 'bg-rose-50 border-rose-200 text-rose-700'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>{evt.anomalyReason}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
