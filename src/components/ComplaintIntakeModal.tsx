import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { GraphNodeData, GraphEdgeData } from '../types';

interface ComplaintIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddComplaint: (newComplaintNode: GraphNodeData, newEdge: GraphEdgeData) => void;
  existingAccounts: GraphNodeData[];
}

export const ComplaintIntakeModal: React.FC<ComplaintIntakeModalProps> = ({
  isOpen,
  onClose,
  onAddComplaint,
  existingAccounts,
}) => {
  const { theme } = useTheme();
  const [complaintRef, setComplaintRef] = useState(`NCRP-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [victimUpi, setVictimUpi] = useState('anand.verma@okaxis');
  const [disputeAmount, setDisputeAmount] = useState('480000');
  const [category, setCategory] = useState('Extortion / Malicious APK Scam');
  const [description, setDescription] = useState('Victim reported unauthorized UPI debit initiated after fake utility bill APK installation.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintRef.trim() || !victimUpi.trim()) return;

    const amountNum = parseFloat(disputeAmount) || 50000;
    const complaintNodeId = `COMPLAINT_${complaintRef.replace(/[^a-zA-Z0-9]/g, '_')}`;

    const newComplaintNode: GraphNodeData = {
      id: complaintNodeId,
      label: complaintRef,
      type: 'complaint',
      riskScore: 100,
      status: 'active',
      subText: `${category} • ₹${amountNum.toLocaleString('en-IN')}`,
      complaintRef: complaintRef,
      disputeAmount: amountNum,
      tags: [category, 'NCRP Report', 'High Priority'],
    };

    const targetAccount = existingAccounts.find(
      (a) => a.upiId?.toLowerCase() === victimUpi.toLowerCase() || a.id === victimUpi
    ) || existingAccounts[0];

    const newEdge: GraphEdgeData = {
      id: `E_CMP_${Date.now()}`,
      source: complaintNodeId,
      target: targetAccount.id,
      amount: amountNum,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      utr: `DISPUTE_${Date.now().toString().slice(-6)}`,
      channel: 'COMPLAINT_LINK',
      isSuspicious: true,
      ruleTriggered: 'RULE_FORMAL_DISPUTE_FILED',
    };

    onAddComplaint(newComplaintNode, newEdge);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${
          theme === 'dark'
            ? 'bg-[#0E1715] border-[#1C2E29] text-slate-200'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-inherit flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                theme === 'dark' ? 'bg-rose-950/70 text-rose-400' : 'bg-rose-50 text-rose-600'
              }`}
            >
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Link Synthetic Cyber Complaint</h3>
              <p className="text-[11px] text-slate-400">Formal Dispute Intake & Graph Association</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors btn-press"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">
              Complaint / NCRP Reference ID
            </label>
            <input
              type="text"
              value={complaintRef}
              onChange={(e) => setComplaintRef(e.target.value)}
              className={`w-full p-2.5 border rounded-xl font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                theme === 'dark'
                  ? 'bg-[#142320] border-[#1E3B33] text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">
                Disputed Amount (₹)
              </label>
              <input
                type="number"
                value={disputeAmount}
                onChange={(e) => setDisputeAmount(e.target.value)}
                className={`w-full p-2.5 border rounded-xl font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                  theme === 'dark'
                    ? 'bg-[#142320] border-[#1E3B33] text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Fraud Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full p-2.5 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#142320] border-[#1E3B33] text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="Extortion / Malicious APK Scam">Extortion / Fake APK</option>
                <option value="Investment / Telegram Task Scam">Investment / Telegram Scam</option>
                <option value="Impersonation / Courier Customs Fraud">Courier Customs Scam</option>
                <option value="SIM Swap & Unauthorized UPI Debit">SIM Swap / QR Phishing</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">
              Associate to Victim UPI Identifier
            </label>
            <select
              value={victimUpi}
              onChange={(e) => setVictimUpi(e.target.value)}
              className={`w-full p-2.5 border rounded-xl font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#142320] border-[#1E3B33] text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {existingAccounts.map((acc) => (
                <option key={acc.id} value={acc.label}>
                  {acc.label} ({acc.bankName || 'UPI VPA'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">
              Case Narrative Summary
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`w-full p-2.5 border rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none ${
                theme === 'dark'
                  ? 'bg-[#142320] border-[#1E3B33] text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-inherit">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border-slate-200 dark:border-slate-800 text-xs font-semibold transition-all btn-press"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0A5C36] hover:bg-[#07472A] text-white font-bold rounded-xl text-xs transition-all shadow-sm btn-press"
            >
              Link to Graph
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
