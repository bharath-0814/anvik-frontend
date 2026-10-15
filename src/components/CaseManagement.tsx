import React, { useState } from 'react';
import { 
  Briefcase, 
  User, 
  Clock, 
  Send, 
  Download 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CaseFile } from '../types';

interface CaseManagementProps {
  cases: CaseFile[];
  onAddNote: (caseId: string, noteText: string) => void;
  onUpdateStatus: (caseId: string, newStatus: CaseFile['status']) => void;
}

export const CaseManagement: React.FC<CaseManagementProps> = ({
  cases,
  onAddNote,
  onUpdateStatus,
}) => {
  const { theme } = useTheme();
  const [activeCaseId, setActiveCaseId] = useState<string>(cases[0]?.id || '');
  const [newNote, setNewNote] = useState('');

  const currentCase = cases.find((c) => c.id === activeCaseId) || cases[0];

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !currentCase) return;
    onAddNote(currentCase.id, newNote);
    setNewNote('');
  };

  const handleExportSummary = () => {
    if (!currentCase) return;
    const report = {
      caseId: currentCase.id,
      title: currentCase.title,
      analyst: currentCase.analyst,
      status: currentCase.status,
      flaggedVolume: currentCase.flaggedVolume,
      notes: currentCase.notes,
      exportedAt: new Date().toISOString(),
      disclaimer: 'Generated via Anvik Synthetic Decision Support System. Not conclusive legal proof.',
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentCase.id}_Dossier_Export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
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
              Investigation Records
            </span>
            <span className="text-xs text-slate-400">Auditable Case Files & LEA Escalations</span>
          </div>
          <h2
            className={`text-lg font-bold tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            Case Management & Investigation Dossiers
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl">
            Maintain tamper-evident audit trails, analyst findings, entity bookmarks, and
            law-enforcement escalation dossiers.
          </p>
        </div>

        <button
          onClick={handleExportSummary}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all btn-press ${
            theme === 'dark'
              ? 'bg-[#152520] border-[#1E3B33] text-slate-200 hover:bg-[#1A312A]'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
          }`}
        >
          <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Export Case Dossier (JSON)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cases Sidebar List */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Case Files ({cases.length})
          </span>
          {cases.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveCaseId(c.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 ${
                activeCaseId === c.id
                  ? theme === 'dark'
                    ? 'bg-[#142621] border-emerald-500/80 shadow-md ring-1 ring-emerald-500/30'
                    : 'bg-emerald-50/60 border-emerald-500/70 shadow-sm ring-1 ring-emerald-500/20'
                  : theme === 'dark'
                  ? 'bg-[#0E1715] border-[#1A332B] hover:border-slate-700'
                  : 'bg-white border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0B6938] dark:text-emerald-400">
                  {c.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    c.status === 'IN_REVIEW'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-400'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400'
                  }`}
                >
                  {c.status.replace('_', ' ')}
                </span>
              </div>
              <h4
                className={`text-xs font-semibold mt-1.5 line-clamp-1 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              >
                {c.title}
              </h4>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-inherit text-[11px] text-slate-400 font-mono">
                <span>Exposure: ₹{(c.flaggedVolume / 1000).toFixed(0)}k</span>
                <span>{c.notes.length} notes</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Case Detail Dossier */}
        {currentCase && (
          <div
            className={`md:col-span-2 rounded-2xl border p-6 space-y-6 ${
              theme === 'dark' ? 'bg-[#111E1A] border-[#1A332B]' : 'bg-white border-slate-200/90 shadow-sm'
            }`}
          >
            {/* Title & Metadata */}
            <div className="border-b border-inherit pb-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <span className="text-xs font-mono font-bold text-[#0B6938] dark:text-emerald-400">
                  {currentCase.id}
                </span>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-400">Status:</span>
                  <select
                    value={currentCase.status}
                    onChange={(e) =>
                      onUpdateStatus(currentCase.id, e.target.value as CaseFile['status'])
                    }
                    className={`border rounded-lg px-2.5 py-1 text-xs font-medium focus:ring-1 focus:ring-emerald-500 cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-[#0E1715] border-[#1A332B] text-slate-200'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="ESCALATED_LEAS">Escalated to LEAs</option>
                    <option value="RESOLVED">Resolved / Closed</option>
                  </select>
                </div>
              </div>

              <h3
                className={`text-lg font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              >
                {currentCase.title}
              </h3>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Lead: <strong className="text-slate-700 dark:text-slate-200">{currentCase.analyst}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Initiated: <span className="font-mono">{currentCase.createdAt}</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Flagged:</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                    ₹{currentCase.flaggedVolume.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes & Audit Log */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Investigator Chronology & Notes ({currentCase.notes.length})
              </span>

              <div className="space-y-3">
                {currentCase.notes.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                      theme === 'dark'
                        ? 'bg-[#0E1715] border-[#182B24]'
                        : 'bg-slate-50 border-slate-200/70'
                    }`}
                  >
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{n.author}</span>
                      <span className="font-mono text-[11px]">{n.timestamp}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{n.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handlePostNote} className="space-y-2 pt-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record an analytical observation or LEA communication note..."
                  rows={3}
                  className={`w-full p-3 border rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none ${
                    theme === 'dark'
                      ? 'bg-[#0E1715] border-[#1A332B] text-slate-200'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newNote.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#0A5C36] hover:bg-[#07472A] disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-sm btn-press"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Record Case Note</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
