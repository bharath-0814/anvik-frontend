import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Store, 
  FileText, 
  UserCheck, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Lock, 
  Unlock, 
  Copy, 
  Check, 
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { GraphNodeData, GraphEdgeData } from '../types';

interface EntityInspectorProps {
  entity: GraphNodeData | null;
  onClose: () => void;
  edges: GraphEdgeData[];
  nodes: GraphNodeData[];
  isFrozen: boolean;
  onToggleFreeze: (nodeId: string) => void;
}

export const EntityInspector: React.FC<EntityInspectorProps> = ({
  entity,
  onClose,
  edges,
  nodes,
  isFrozen,
  onToggleFreeze,
}) => {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  if (!entity) return null;

  const relatedEdges = edges.filter(
    (e) => e.source === entity.id || e.target === entity.id
  );

  const inboundEdges = relatedEdges.filter((e) => e.target === entity.id && e.amount > 0);
  const outboundEdges = relatedEdges.filter((e) => e.source === entity.id && e.amount > 0);
  const deviceEdges = relatedEdges.filter((e) => e.channel === 'DEVICE_BIND');

  const totalInflow = inboundEdges.reduce((acc, curr) => acc + curr.amount, 0);
  const totalOutflow = outboundEdges.reduce((acc, curr) => acc + curr.amount, 0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`w-96 flex flex-col h-full border-l shadow-2xl z-40 transition-all duration-300 animate-slide-in-right ${
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
              entity.type === 'account'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                : entity.type === 'device'
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                : entity.type === 'merchant'
                ? 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
            }`}
          >
            {entity.type === 'account' && <UserCheck className="w-4 h-4" />}
            {entity.type === 'device' && <Smartphone className="w-4 h-4" />}
            {entity.type === 'merchant' && <Store className="w-4 h-4" />}
            {entity.type === 'complaint' && <FileText className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-tight">Entity inspector</h3>
            <p className="text-[10px] text-slate-400 capitalize">{entity.type} node</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors btn-press"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Main Entity Card */}
        <div
          className={`p-4 rounded-xl border ${
            theme === 'dark'
              ? 'bg-[#111E1A] border-[#1A332B]'
              : 'bg-slate-50/80 border-slate-200/80'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                Identifier
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold break-all text-xs">
                  {entity.label}
                </span>
                <button
                  onClick={() => copyToClipboard(entity.label)}
                  title="Copy identifier"
                  className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              {entity.subText && (
                <p className="text-[11px] text-slate-400">{entity.subText}</p>
              )}
            </div>

            {/* Risk Badge */}
            <div
              className={`flex flex-col items-end px-2 py-1 rounded-lg border shrink-0 ${
                entity.riskScore > 80
                  ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950 dark:border-rose-900 dark:text-rose-300'
                  : entity.riskScore > 50
                  ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-300'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-900 dark:text-emerald-300'
              }`}
            >
              <span className="text-[9px] uppercase font-bold">Risk</span>
              <span className="text-base font-black font-mono leading-none">
                {entity.riskScore}
              </span>
            </div>
          </div>

          {/* Tags */}
          {entity.tags && entity.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-inherit">
              {entity.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Counterfactual Freeze Simulator Button */}
        <div
          className={`p-3.5 rounded-xl border ${
            theme === 'dark'
              ? 'bg-[#12221D] border-[#1C3B32]'
              : 'bg-[#F2FAF5] border-emerald-200/80'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-[#0B6938] dark:text-emerald-400">
              Counterfactual "What-If" Test
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-semibold">
              {isFrozen ? 'Frozen' : 'Live Node'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
            Simulate administrative lien freeze to observe ring disruption and severed flow in graph.
          </p>
          <button
            onClick={() => onToggleFreeze(entity.id)}
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all btn-press ${
              isFrozen
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
            }`}
          >
            {isFrozen ? (
              <>
                <Unlock className="w-3.5 h-3.5" />
                <span>Reactivate Node in Graph</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Simulate Immediate Freeze</span>
              </>
            )}
          </button>
        </div>

        {/* Financial Flow Summary */}
        {entity.type === 'account' && (
          <div className="grid grid-cols-2 gap-2">
            <div
              className={`p-3 rounded-xl border ${
                theme === 'dark' ? 'bg-[#111E1A] border-[#1A332B]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 mb-0.5 font-medium">
                <ArrowDownLeft className="w-3 h-3" />
                <span>Inflow</span>
              </div>
              <span className="text-sm font-bold font-mono">
                ₹{totalInflow.toLocaleString('en-IN')}
              </span>
              <p className="text-[9px] text-slate-400 mt-0.5">{inboundEdges.length} transfers</p>
            </div>

            <div
              className={`p-3 rounded-xl border ${
                theme === 'dark' ? 'bg-[#111E1A] border-[#1A332B]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 mb-0.5 font-medium">
                <ArrowUpRight className="w-3 h-3" />
                <span>Outflow</span>
              </div>
              <span className="text-sm font-bold font-mono">
                ₹{totalOutflow.toLocaleString('en-IN')}
              </span>
              <p className="text-[9px] text-slate-400 mt-0.5">{outboundEdges.length} transfers</p>
            </div>
          </div>
        )}

        {/* Bound Hardware Devices */}
        {deviceEdges.length > 0 && (
          <div
            className={`p-3 rounded-xl border space-y-2 ${
              theme === 'dark' ? 'bg-[#111E1A] border-[#1A332B]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span className="text-xs font-semibold flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Hardware Device Associations</span>
            </span>
            {deviceEdges.map((de) => {
              const devNode = nodes.find((n) => n.id === de.source);
              return (
                <div
                  key={de.id}
                  className="p-2 rounded-lg bg-white dark:bg-[#0E1715] border border-slate-200 dark:border-[#1E3B33] text-[11px]"
                >
                  <div className="flex justify-between items-center font-mono font-medium">
                    <span>{devNode?.label || de.source}</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded font-semibold">
                      Collusion
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {devNode?.deviceModel || 'Associated IMEI Fingerprint'}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Transaction Trail */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Transaction Trail ({relatedEdges.length})
          </span>
          <div className="space-y-1.5">
            {relatedEdges.map((edge) => {
              const isOut = edge.source === entity.id;
              const otherNodeId = isOut ? edge.target : edge.source;
              const otherNode = nodes.find((n) => n.id === otherNodeId);

              return (
                <div
                  key={edge.id}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    edge.isSuspicious
                      ? 'bg-rose-50/50 border-rose-200/80 dark:bg-rose-950/20 dark:border-rose-900/50'
                      : 'bg-white dark:bg-[#111E1A] border-slate-200/80 dark:border-[#1A332B]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[11px] truncate">
                      {isOut ? 'Sent to' : 'From'}{' '}
                      <strong className="text-slate-800 dark:text-slate-200 font-mono">
                        {otherNode?.label || otherNodeId}
                      </strong>
                    </span>
                    <span className="font-mono font-bold text-xs">
                      {edge.amount > 0 ? `₹${edge.amount.toLocaleString('en-IN')}` : edge.channel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>{edge.timestamp.slice(11)}</span>
                    <span>UTR: {edge.utr.slice(-6)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
