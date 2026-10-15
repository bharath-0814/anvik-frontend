import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  AlertTriangle, 
  Smartphone, 
  FileText, 
  ArrowRight, 
  Lock, 
  Unlock, 
  Download, 
  Radio, 
  Layers, 
  CheckCircle2,
  Users,
  Network,
  Maximize2
} from 'lucide-react';
import { NetworkNode, NetworkEdge } from '../mock/network9Data';

interface InvestigationInsightsRailProps {
  selectedNode: NetworkNode | null;
  onClearSelection: () => void;
  edges: NetworkEdge[];
  nodes: NetworkNode[];
  frozenNodeIds: Set<string>;
  onToggleFreeze: (nodeId: string) => void;
  onDownloadReport: () => void;
  onOpenComplaints: () => void;
  complaintCount?: number;
  onShowGraph?: () => void;
  onRunAnalysis?: () => void;
  isGraphVisible?: boolean;
  caseId?: string;
}

export const InvestigationInsightsRail: React.FC<InvestigationInsightsRailProps> = ({
  selectedNode,
  onClearSelection,
  edges,
  nodes,
  frozenNodeIds,
  onToggleFreeze,
  onDownloadReport,
  onOpenComplaints,
  complaintCount = 4,
  onShowGraph,
  onRunAnalysis,
  isGraphVisible = false,
  caseId = 'NCRP-2026-0841',
}) => {
  // Connected edges for the selected node
  const connectedEdges = selectedNode
    ? edges.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
    : [];

  const handleTriggerAnalysis = onRunAnalysis || onShowGraph;

  return (
    <aside className="w-full h-full bg-[#FFFFFF] border-r md:border-r-0 border-[#E8E4D8] flex flex-col justify-between overflow-hidden select-none">
      {/* 1. Rail Header */}
      <div className="px-5 py-3.5 border-b border-[#E8E4D8] flex items-center justify-between bg-white shrink-0 gap-2">
        <div className="min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 block truncate">
            INVESTIGATION INSIGHTS
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Case #{caseId}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Analysis Button: Graph only appears after clicking on Analysis */}
          {handleTriggerAnalysis && (
            <button
              onClick={handleTriggerAnalysis}
              title={isGraphVisible ? "Focus on Network Graph Analysis" : "Run Analysis to generate Graph"}
              className="px-3 py-1 rounded-lg text-[11px] font-bold bg-[#007065] hover:bg-[#005a52] active:scale-95 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Analysis</span>
            </button>
          )}

          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
            Critical · 94/100
          </span>
        </div>
      </div>

      {/* 2. Scrollable Body Content (Text reflows and adjusts evenly across widths) */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
        {/* Interactive Launch Graph / Analysis Banner Card */}
        {handleTriggerAnalysis && (
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#007065] text-white flex items-center justify-center shadow-xs">
                  <Activity className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 leading-tight">
                    Network Crime Analysis
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    9 entities · 9 relationships
                  </span>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed text-balance">
              Click below to generate and display the interactive transaction network graph with particle flows and timeline controls.
            </p>

            <button
              onClick={handleTriggerAnalysis}
              className="w-full py-2.5 px-3 rounded-lg bg-[#007065] hover:bg-[#005a52] active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{isGraphVisible ? 'View / Focus Graph Analysis' : 'Run Analysis (Show Graph) →'}</span>
            </button>
          </div>
        )}

        {selectedNode ? (
          /* ================= SELECTED NODE DOSSIER ================= */
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Header Card */}
            <div className="p-4 rounded-xl border border-[#E2DFD7] bg-[#FAFAFA]">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mb-1.5 ${
                      selectedNode.type === 'mule'
                        ? 'bg-rose-100 text-rose-800'
                        : selectedNode.type === 'collect'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-[#007065]'
                    }`}
                  >
                    {selectedNode.role}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 leading-tight">
                    {selectedNode.name}
                  </h3>
                </div>

                <button
                  onClick={onClearSelection}
                  className="text-slate-400 hover:text-slate-600 text-xs px-2 py-0.5 rounded-md hover:bg-slate-200 transition-colors"
                >
                  ✕ Close
                </button>
              </div>

              {/* VPA / Handle */}
              <div className="font-mono text-xs text-slate-700 font-semibold mb-2 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <span className="truncate">{selectedNode.handle}</span>
                <span className="text-[10px] text-[#007065] font-bold">VERIFIED</span>
              </div>

              {/* Node Details Grid (Adjusts evenly based on available width) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                {selectedNode.bank && (
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Institution</span>
                    <span className="font-semibold text-slate-800">{selectedNode.bank}</span>
                  </div>
                )}
                {selectedNode.hardwareModel && (
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Hardware Fingerprint</span>
                    <span className="font-semibold text-slate-800 font-mono text-[10px]">{selectedNode.hardwareModel}</span>
                  </div>
                )}
                {selectedNode.disputeAmount && (
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Associated Flow</span>
                    <span className="font-bold text-rose-700 font-mono">₹{selectedNode.disputeAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Risk Assessment</span>
                  <span className="font-bold text-slate-900">{selectedNode.riskScore}/100</span>
                </div>
              </div>
            </div>

            {/* Counterfactual Freeze Simulator Button */}
            <div className="p-3.5 rounded-xl border border-[#E2DFD7] bg-[#FAFAFA] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-[11px]">Counterfactual Simulation</span>
                <span className="text-[10px] text-slate-400">What-If Analysis</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed text-balance">
                Simulate early intervention by freezing this node to trace impact on downstream dispersion paths.
              </p>
              <button
                onClick={() => onToggleFreeze(selectedNode.id)}
                className={`w-full py-2 px-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                  frozenNodeIds.has(selectedNode.id)
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                    : 'bg-[#007065] text-white hover:bg-[#005a52]'
                }`}
              >
                {frozenNodeIds.has(selectedNode.id) ? (
                  <>
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Unfreeze Account (Active Simulation)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Simulate Account Freeze</span>
                  </>
                )}
              </button>
            </div>

            {/* Connected Transactions List */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 block">
                Direct Links ({connectedEdges.length})
              </span>
              <div className="space-y-1.5">
                {connectedEdges.map((e) => {
                  const otherNodeId = e.source === selectedNode.id ? e.target : e.source;
                  const otherNode = nodes.find((n) => n.id === otherNodeId);
                  const isOutflow = e.source === selectedNode.id;

                  return (
                    <div
                      key={e.id}
                      className="p-2.5 rounded-lg border border-[#E2DFD7] bg-white flex items-center justify-between hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            e.type === 'device_link' ? 'bg-slate-400' : isOutflow ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                        />
                        <div>
                          <span className="font-semibold text-slate-800 text-xs block">
                            {otherNode?.name || otherNodeId}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {otherNode?.handle}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        {e.amountFormatted ? (
                          <span className="font-bold font-mono text-xs text-slate-900 block">
                            {e.amountFormatted}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-medium">Device Bind</span>
                        )}
                        <span className="text-[9px] text-slate-400">{e.timestamp}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ================= DEFAULT OVERVIEW DOSSIER ================= */
          <div className="space-y-4">
            {/* Quick Metrics Grid (Adjusts evenly based on left panel width) */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl border border-[#E2DFD7] bg-[#FAFAFA]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Total Disputed Flow
                </span>
                <span className="font-mono font-extrabold text-base text-rose-700 block">
                  ₹24,500
                </span>
                <span className="text-[10px] text-slate-500 font-medium">100% Layered</span>
              </div>

              <div className="p-3 rounded-xl border border-[#E2DFD7] bg-[#FAFAFA]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Speed of Extraction
                </span>
                <span className="font-mono font-extrabold text-base text-slate-900 block">
                  3m 15s
                </span>
                <span className="text-[10px] text-slate-500 font-medium">4 Rapid Hops</span>
              </div>

              <div className="p-3 rounded-xl border border-[#E2DFD7] bg-[#FAFAFA]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Identified Mules
                </span>
                <span className="font-mono font-extrabold text-base text-amber-700 block">
                  3 accounts
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Active Layering</span>
              </div>

              <div className="p-3 rounded-xl border border-[#E2DFD7] bg-[#FAFAFA]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Shared Device
                </span>
                <span className="font-mono font-extrabold text-base text-slate-900 block">
                  1 farm
                </span>
                <span className="text-[10px] text-slate-500 font-medium">DEV-7F3A9C</span>
              </div>
            </div>

            {/* High-Priority Explainable Detection Signals (Adjusts evenly across widths) */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 block">
                Explainable Detection Signals (3)
              </span>

              {/* Signal 1 */}
              <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-rose-800">
                    ⚡ Rapid Dispersion Churn
                  </span>
                  <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-rose-200 text-rose-900">
                    HIGH
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed text-balance">
                  Aggregator <strong>ravi-18@ybl</strong> split ₹23,800 across 2 secondary mules within 41 seconds of receipt.
                </p>
              </div>

              {/* Signal 2 */}
              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-amber-900">
                    ⚡ Hardware Collusion Farm
                  </span>
                  <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-amber-200 text-amber-900">
                    MED
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed text-balance">
                  Physical device <strong>DEV-7F3A9C</strong> bound and authorized across 3 distinct mule bank accounts.
                </p>
              </div>

              {/* Signal 3 */}
              <div className="p-3 rounded-xl border border-[#E2DFD7] bg-[#FAFAFA] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-slate-800">
                    ⚡ Collect Pull Without Latency
                  </span>
                  <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-800">
                    CRIT
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed text-balance">
                  Collect request <strong>COL-008412</strong> drained origin account without standard 2FA approval pause.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Action Buttons Strip at Bottom */}
      <div className="p-4 border-t border-[#E8E4D8] bg-[#FAFAFA] space-y-2 shrink-0">
        {/* Download Forensic Report */}
        <button
          onClick={onDownloadReport}
          className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-[#007065] hover:bg-[#059669] text-white flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-98"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Forensic Report</span>
        </button>

        {/* View Associated Complaints */}
        <button
          onClick={onOpenComplaints}
          className="w-full py-2 px-3 rounded-xl font-semibold text-xs border border-[#E2DFD7] bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          <span>View Associated Complaints ({complaintCount})</span>
        </button>
      </div>
    </aside>
  );
};
