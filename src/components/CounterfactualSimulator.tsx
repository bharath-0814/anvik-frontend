import React from 'react';
import { 
  FlaskConical, 
  Lock, 
  Unlock, 
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { GraphNodeData, GraphEdgeData } from '../types';

interface CounterfactualSimulatorProps {
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
  frozenNodeIds: Set<string>;
  onToggleFreeze: (nodeId: string) => void;
  onClearAllFreezes: () => void;
  onOpenGraph: () => void;
}

export const CounterfactualSimulator: React.FC<CounterfactualSimulatorProps> = ({
  nodes,
  edges,
  frozenNodeIds,
  onToggleFreeze,
  onClearAllFreezes,
  onOpenGraph,
}) => {
  const { theme } = useTheme();
  const highRiskNodes = nodes.filter((n) => n.riskScore > 75);

  let blockedVolume = 0;
  let severedEdgesCount = 0;

  edges.forEach((e) => {
    if (frozenNodeIds.has(e.source) || frozenNodeIds.has(e.target)) {
      severedEdgesCount++;
      if (e.amount > 0) {
        blockedVolume += e.amount;
      }
    }
  });

  const totalHighRiskVolume = 480000;
  const fragilityPercentage = Math.min(
    100,
    Math.round((blockedVolume / totalHighRiskVolume) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Signature Feature Banner */}
      <div
        className={`p-6 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          theme === 'dark'
            ? 'bg-[#111E1A] border-[#1A332B]'
            : 'bg-white border-slate-200/90 shadow-sm'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                theme === 'dark'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-900'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Anvik Signature Capability</span>
            </span>
            <span className="text-xs text-slate-400">Counterfactual Fragility Engine</span>
          </div>
          <h2
            className={`text-xl font-bold tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            Intervention Simulation & Fragility Analysis
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl mt-0.5 leading-relaxed">
            Hypothetically sever bridges, mule hubs, or shared devices to evaluate ring vulnerability.
            Identify high-leverage intervention targets before issuing administrative lien freezes.
          </p>
        </div>

        {frozenNodeIds.size > 0 && (
          <button
            onClick={onClearAllFreezes}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all btn-press ${
              theme === 'dark'
                ? 'bg-[#162722] border-[#1E3B33] text-slate-200 hover:bg-[#1C332C]'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
            }`}
          >
            Reset Interventions ({frozenNodeIds.size})
          </button>
        )}
      </div>

      {/* Realtime Impact Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-2xl border ${
            theme === 'dark' ? 'bg-[#111E1A] border-[#1A332B]' : 'bg-white border-slate-200/90 shadow-sm'
          }`}
        >
          <span className="text-xs text-slate-400 font-medium">Intervened Nodes</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-[#0B6938] dark:text-emerald-400">
              {frozenNodeIds.size}
            </span>
            <span className="text-xs text-slate-400">of {nodes.length} entities</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active simulated lien locks</p>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            theme === 'dark' ? 'bg-[#111E1A] border-[#1A332B]' : 'bg-white border-slate-200/90 shadow-sm'
          }`}
        >
          <span className="text-xs text-slate-400 font-medium">Mitigated Outflow</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              ₹{(blockedVolume / 1000).toFixed(0)}k
            </span>
            <span className="text-xs text-slate-400">blocked</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Downstream cashout disrupted</p>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            theme === 'dark' ? 'bg-[#111E1A] border-[#1A332B]' : 'bg-white border-slate-200/90 shadow-sm'
          }`}
        >
          <span className="text-xs text-slate-400 font-medium">Severed Flow Edges</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {severedEdgesCount}
            </span>
            <span className="text-xs text-slate-400">broken paths</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Graph connectivity severed</p>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            theme === 'dark' ? 'bg-[#111E1A] border-[#1A332B]' : 'bg-white border-slate-200/90 shadow-sm'
          }`}
        >
          <span className="text-xs text-slate-400 font-medium">Ring Fragility</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">
              {fragilityPercentage}%
            </span>
            <span className="text-xs text-slate-400">vulnerability</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Disruption of primary ring</p>
        </div>
      </div>

      {/* Target Candidates for Intervention */}
      <div
        className={`p-5 rounded-2xl border space-y-4 ${
          theme === 'dark' ? 'bg-[#111E1A] border-[#1A332B]' : 'bg-white border-slate-200/90 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-inherit pb-3">
          <div>
            <h3
              className={`text-sm font-bold ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              Target Entities for Intervention
            </h3>
            <p className="text-xs text-slate-400">
              Toggle administrative lien freeze to see simulated real-time impact on the graph.
            </p>
          </div>
          <button
            onClick={onOpenGraph}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EAF7EE] text-[#0B6938] dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold transition-all self-start sm:self-auto btn-press"
          >
            <span>Inspect in Network Graph</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {highRiskNodes.map((n) => {
            const isFrozen = frozenNodeIds.has(n.id);
            return (
              <div
                key={n.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  isFrozen
                    ? 'bg-rose-50/50 border-rose-300 dark:bg-rose-950/30 dark:border-rose-900'
                    : theme === 'dark'
                    ? 'bg-[#0E1715] border-[#182B24] hover:border-slate-700'
                    : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold truncate">
                      {n.label}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                        n.riskScore > 85
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {n.riskScore}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 capitalize">{n.subText || n.type}</p>
                </div>

                <button
                  onClick={() => onToggleFreeze(n.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all btn-press ${
                    isFrozen
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                >
                  {isFrozen ? (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Reactivate</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Simulate Freeze</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
