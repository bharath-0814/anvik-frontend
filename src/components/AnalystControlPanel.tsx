import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  BarChart3, 
  UserCheck, 
  Sparkles,
  Layers
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ComplaintsPanel } from './ComplaintsPanel';
import { FraudTimelinePanel } from './FraudTimelinePanel';
import { InvestigationSummaryPanel } from './InvestigationSummaryPanel';
import { EntityInspector } from './EntityInspector';
import { 
  GraphNodeData, 
  GraphEdgeData, 
  ComplaintRecord, 
  TimelineEvent, 
  ComplaintStatus 
} from '../types';

export type ActiveControlTab = 'complaints' | 'timeline' | 'summary' | 'entity_inspector';

interface AnalystControlPanelProps {
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
  complaints: ComplaintRecord[];
  timeline: TimelineEvent[];
  selectedEntity: GraphNodeData | null;
  onSelectEntity: (entity: GraphNodeData | null) => void;
  selectedComplaint: ComplaintRecord | null;
  onSelectComplaint: (complaint: ComplaintRecord | null) => void;
  selectedTimelineEvent: TimelineEvent | null;
  onSelectTimelineEvent: (event: TimelineEvent | null) => void;
  onUpdateComplaintStatus: (complaintId: string, newStatus: ComplaintStatus) => void;
  isFrozen: boolean;
  onToggleFreeze: (nodeId: string) => void;
  activeControlTab: ActiveControlTab;
  setActiveControlTab: (tab: ActiveControlTab) => void;
}

export const AnalystControlPanel: React.FC<AnalystControlPanelProps> = ({
  nodes,
  edges,
  complaints,
  timeline,
  selectedEntity,
  onSelectEntity,
  selectedComplaint,
  onSelectComplaint,
  selectedTimelineEvent,
  onSelectTimelineEvent,
  onUpdateComplaintStatus,
  isFrozen,
  onToggleFreeze,
  activeControlTab,
  setActiveControlTab,
}) => {
  const { theme } = useTheme();

  return (
    <div className="h-full flex flex-col space-y-3">
      {/* 3 Prominent Interactive Buttons Header */}
      <div
        className={`p-1.5 rounded-2xl border transition-all flex items-center justify-between gap-1 shadow-xs select-none ${
          theme === 'dark'
            ? 'bg-[#111E1A] border-[#1A332B]'
            : 'bg-white border-slate-200/90'
        }`}
      >
        {/* Button 1: Complaints */}
        <button
          onClick={() => setActiveControlTab('complaints')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all btn-press ${
            activeControlTab === 'complaints'
              ? 'bg-[#0A5C36] text-white shadow-sm font-bold'
              : theme === 'dark'
              ? 'text-slate-400 hover:text-slate-200 hover:bg-[#162923]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Complaints</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${
              activeControlTab === 'complaints'
                ? 'bg-emerald-800 text-emerald-100'
                : 'bg-slate-200/70 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {complaints.length}
          </span>
        </button>

        {/* Button 2: Fraud Timeline */}
        <button
          onClick={() => setActiveControlTab('timeline')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all btn-press ${
            activeControlTab === 'timeline'
              ? 'bg-[#0A5C36] text-white shadow-sm font-bold'
              : theme === 'dark'
              ? 'text-slate-400 hover:text-slate-200 hover:bg-[#162923]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Timeline</span>
        </button>

        {/* Button 3: Investigation Summary */}
        <button
          onClick={() => setActiveControlTab('summary')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all btn-press ${
            activeControlTab === 'summary'
              ? 'bg-[#0A5C36] text-white shadow-sm font-bold'
              : theme === 'dark'
              ? 'text-slate-400 hover:text-slate-200 hover:bg-[#162923]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Summary</span>
        </button>
      </div>

      {/* Main Dynamic Panel Body */}
      <div className="flex-1 min-h-0 overflow-hidden transition-all duration-300 animate-in fade-in">
        {activeControlTab === 'complaints' && (
          <ComplaintsPanel
            complaints={complaints}
            onUpdateComplaintStatus={onUpdateComplaintStatus}
            selectedComplaintId={selectedComplaint?.id || null}
            onSelectComplaint={onSelectComplaint}
          />
        )}

        {activeControlTab === 'timeline' && (
          <FraudTimelinePanel
            timeline={timeline}
            selectedEventId={selectedTimelineEvent?.id || null}
            onSelectEvent={onSelectTimelineEvent}
          />
        )}

        {activeControlTab === 'summary' && (
          <InvestigationSummaryPanel
            nodes={nodes}
            edges={edges}
            complaints={complaints}
          />
        )}

        {activeControlTab === 'entity_inspector' && selectedEntity && (
          <EntityInspector
            entity={selectedEntity}
            onClose={() => {
              onSelectEntity(null);
              setActiveControlTab('complaints');
            }}
            edges={edges}
            nodes={nodes}
            isFrozen={isFrozen}
            onToggleFreeze={onToggleFreeze}
          />
        )}
      </div>
    </div>
  );
};
