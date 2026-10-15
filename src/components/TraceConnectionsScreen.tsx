import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, GitFork, Shield } from 'lucide-react';

interface TraceConnectionsScreenProps {
  complaintId: string;
  defaultTransactionId: string;
  defaultDeviceId: string;
  onBackToComplaints: () => void;
  onOpenInvestigation: (transactionId: string, deviceId: string, complaintId: string) => void;
}

export const TraceConnectionsScreen: React.FC<TraceConnectionsScreenProps> = ({
  complaintId = 'NCRP-2026-0841',
  defaultTransactionId = 'UPI260915084127',
  defaultDeviceId = 'DEV-7F3A9C',
  onBackToComplaints,
  onOpenInvestigation,
}) => {
  const [transactionId, setTransactionId] = useState(defaultTransactionId);
  const [deviceId, setDeviceId] = useState(defaultDeviceId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTransactionId(defaultTransactionId);
    setDeviceId(defaultDeviceId);
  }, [defaultTransactionId, defaultDeviceId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onOpenInvestigation(transactionId, deviceId, complaintId);
    }, 250);
  };

  return (
    <div className="w-full h-full min-h-0 bg-[#FBF9F4] text-slate-800 flex flex-col overflow-y-auto select-none p-6 sm:p-10">
      <div className="max-w-2xl w-full mx-auto space-y-8 animate-in fade-in duration-200">
        {/* Top-Left Back Link: ← Complaints & records */}
        <div>
          <button
            onClick={onBackToComplaints}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer group mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Complaints & records</span>
          </button>

          {/* Large Title & Subtitle */}
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-sans">
            {complaintId}
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            New investigation
          </p>
        </div>

        {/* Centered Content Form Box */}
        <div className="pt-2">
          {/* Mint Green Hierarchical Network Icon Badge */}
          <div className="w-12 h-12 rounded-xl bg-[#E8F5F1] text-[#007065] flex items-center justify-center border border-[#007065]/20 shadow-2xs mb-5">
            <GitFork className="w-6 h-6 stroke-[2]" />
          </div>

          {/* Section Heading & Subtitle */}
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2 font-sans">
            Trace the connections.
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Start with the transaction and device associated with this complaint.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Transaction ID */}
            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-2">
                Transaction ID
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. UPI260915084127"
                required
                className="w-full bg-white border border-[#E2DFD7] rounded-xl px-4 py-3 text-sm font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007065] focus:ring-1 focus:ring-[#007065] transition-all shadow-2xs"
              />
            </div>

            {/* Device ID */}
            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-2">
                Device ID
              </label>
              <input
                type="text"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                placeholder="e.g. DEV-7F3A9C"
                required
                className="w-full bg-white border border-[#E2DFD7] rounded-xl px-4 py-3 text-sm font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007065] focus:ring-1 focus:ring-[#007065] transition-all shadow-2xs"
              />
            </div>

            {/* Open Investigation Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-[#005A4B] hover:bg-[#004A3E] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-between transition-all shadow-sm cursor-pointer"
              >
                <span>{isSubmitting ? 'Opening investigation...' : 'Open investigation'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>

            {/* Legal Footnote */}
            <div className="pt-4 flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Device associations are signals, not evidence.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
