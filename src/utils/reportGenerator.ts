import { GraphNodeData, GraphEdgeData, ComplaintRecord, TimelineEvent } from '../types';

export interface ReportData {
  caseId: string;
  graphImageBase64: string | null;
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
  complaints: ComplaintRecord[];
  timeline: TimelineEvent[];
  analystName?: string;
  generatedAt?: string;
}

export function generateInvestigationReportHtml(data: ReportData): string {
  const {
    caseId,
    graphImageBase64,
    nodes,
    edges,
    complaints,
    timeline,
    analystName = 'Bharath K (Member 3)',
    generatedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
  } = data;

  const totalDispute = nodes.reduce((sum, n) => sum + (n.disputeAmount || 0), 0) || 480000;
  const accounts = nodes.filter((n) => n.type === 'account');
  const mules = nodes.filter((n) => n.riskScore > 50 || n.role?.includes('mule'));
  const devices = nodes.filter((n) => n.type === 'device');
  const merchants = nodes.filter((n) => n.type === 'merchant');
  const suspiciousEdges = edges.filter((e) => e.isSuspicious);

  const underInvestigationCount = complaints.filter((c) => c.status === 'under_investigation').length;
  const pendingReviewCount = complaints.filter((c) => c.status === 'pending_review').length;
  const resolvedCount = complaints.filter((c) => c.status === 'resolved').length;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ANVIK Forensic Intelligence Report — ${caseId}</title>
  <style>
    :root {
      --bg: #07130F;
      --card-bg: #0C1E18;
      --card-border: #18382C;
      --text-main: #E2E8F0;
      --text-muted: #94A3B8;
      --accent-emerald: #10B981;
      --accent-cyan: #06B6D4;
      --accent-rose: #F43F5E;
      --accent-amber: #F59E0B;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text-main);
      line-height: 1.5;
      padding: 24px;
    }

    .report-container {
      max-width: 1080px;
      margin: 0 auto;
    }

    /* Top Floating Print / Action Header */
    .action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0E261E;
      border: 1px solid #1C4637;
      padding: 12px 20px;
      border-radius: 12px;
      margin-bottom: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    }

    .btn {
      cursor: pointer;
      font-weight: 600;
      font-size: 13px;
      padding: 8px 16px;
      border-radius: 8px;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #10B981;
      color: #042115;
    }
    .btn-primary:hover {
      background: #34D399;
    }

    .btn-secondary {
      background: #183B30;
      color: #E2E8F0;
      border: 1px solid #265546;
    }
    .btn-secondary:hover {
      background: #204C3E;
    }

    /* Document Header */
    .doc-header {
      border-bottom: 2px solid #1A4032;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }

    .badge-classified {
      display: inline-block;
      background: rgba(244, 63, 94, 0.15);
      border: 1px solid rgba(244, 63, 94, 0.4);
      color: #FDA4AF;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 9999px;
      margin-bottom: 12px;
    }

    .doc-title {
      font-size: 26px;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: -0.02em;
      margin-bottom: 6px;
    }

    .doc-subtitle {
      font-size: 14px;
      color: var(--text-muted);
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 18px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 16px 20px;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
    }

    .meta-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 2px;
    }

    .meta-value {
      font-size: 14px;
      font-weight: 600;
      color: #F8FAFC;
    }

    /* Metric KPI Cards */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 14px;
      margin-bottom: 28px;
    }

    .kpi-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 16px;
    }

    .kpi-title {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .kpi-value {
      font-size: 22px;
      font-weight: 800;
      color: #FFFFFF;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }

    .kpi-sub {
      font-size: 11px;
      color: var(--accent-emerald);
      margin-top: 4px;
    }

    /* Section Styling */
    .section {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 24px;
      margin-bottom: 28px;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 12px;
      margin-bottom: 18px;
    }

    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .section-title::before {
      content: "";
      width: 4px;
      height: 16px;
      background: var(--accent-emerald);
      border-radius: 2px;
    }

    /* Graph Image Snapshot Area */
    .graph-snapshot-box {
      background: #040A08;
      border: 1px solid #142E24;
      border-radius: 10px;
      overflow: hidden;
      text-align: center;
      padding: 12px;
      margin-bottom: 14px;
    }

    .graph-img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      display: block;
      margin: 0 auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.6);
    }

    .graph-legend {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 16px;
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px solid #142E24;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
    }

    /* Narrative Text */
    .prose {
      font-size: 13px;
      line-height: 1.7;
      color: #CBD5E1;
      margin-bottom: 16px;
    }

    .prose p {
      margin-bottom: 12px;
    }

    .prose strong {
      color: #FFFFFF;
    }

    /* Data Tables */
    .table-wrapper {
      overflow-x: auto;
      margin-top: 12px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      text-align: left;
    }

    th {
      background: #091713;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 0.05em;
      padding: 10px 12px;
      border-bottom: 1px solid var(--card-border);
    }

    td {
      padding: 10px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: #E2E8F0;
    }

    tr:last-child td {
      border-bottom: none;
    }

    .tag {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .tag-critical {
      background: rgba(244, 63, 94, 0.2);
      color: #FDA4AF;
      border: 1px solid rgba(244, 63, 94, 0.4);
    }

    .tag-warning {
      background: rgba(245, 158, 11, 0.2);
      color: #FDE68A;
      border: 1px solid rgba(245, 158, 11, 0.4);
    }

    .tag-success {
      background: rgba(16, 185, 129, 0.2);
      color: #A7F3D0;
      border: 1px solid rgba(16, 185, 129, 0.4);
    }

    .tag-info {
      background: rgba(6, 182, 212, 0.2);
      color: #A5F3FC;
      border: 1px solid rgba(6, 182, 212, 0.4);
    }

    .disclaimer-box {
      background: #0B1D17;
      border-left: 4px solid var(--accent-emerald);
      padding: 14px 18px;
      border-radius: 0 10px 10px 0;
      font-size: 11px;
      color: #94A3B8;
      line-height: 1.6;
      margin-top: 24px;
    }

    /* Print Stylesheet */
    @media print {
      body {
        background: #FFFFFF !important;
        color: #0F172A !important;
        padding: 0 !important;
      }

      .action-bar {
        display: none !important;
      }

      .section, .meta-grid, .kpi-card, .graph-snapshot-box {
        background: #FFFFFF !important;
        border: 1px solid #CBD5E1 !important;
        color: #0F172A !important;
        box-shadow: none !important;
        page-break-inside: avoid;
      }

      .doc-title {
        color: #0F172A !important;
      }

      th {
        background: #F1F5F9 !important;
        color: #475569 !important;
        border-bottom: 2px solid #CBD5E1 !important;
      }

      td {
        color: #0F172A !important;
        border-bottom: 1px solid #E2E8F0 !important;
      }

      .prose {
        color: #334155 !important;
      }

      .prose strong {
        color: #0F172A !important;
      }

      .disclaimer-box {
        background: #F8FAFC !important;
        border-left: 4px solid #0D9488 !important;
        color: #475569 !important;
      }

      .kpi-value {
        color: #0F172A !important;
      }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <!-- Action Bar (Hidden during Print) -->
    <div class="action-bar">
      <div>
        <span style="font-weight: 700; color: #10B981; font-size: 14px;">ANVIK 2.0 FORENSIC ENGINE</span>
        <span style="color: #64748B; font-size: 12px; margin-left: 8px;">Case Evidence Document #${caseId}</span>
      </div>
      <div style="display: flex; gap: 10px;">
        <button class="btn btn-primary" onclick="window.print()">
          🖨️ Print / Save as PDF
        </button>
        <button class="btn btn-secondary" onclick="window.close()">
          ✕ Close
        </button>
      </div>
    </div>

    <!-- Document Header -->
    <header class="doc-header">
      <div class="badge-classified">Confidential // Law Enforcement & PSP Fraud Operations</div>
      <h1 class="doc-title">UPI Fraud-Ring Forensic Investigation Report</h1>
      <p class="doc-subtitle">Explainable Graph Topology Analysis, Multi-Hop Structuring & Hardware Collusion Audit</p>

      <div class="meta-grid">
        <div class="meta-item">
          <span class="meta-label">Investigation Ref</span>
          <span class="meta-value" style="font-family: monospace;">${caseId}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Incident Classification</span>
          <span class="meta-value" style="color: var(--accent-rose);">UPI Mule Ring & Structuring</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Generated Timestamp</span>
          <span class="meta-value">${generatedAt}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Lead Investigator</span>
          <span class="meta-value">${analystName}</span>
        </div>
      </div>
    </header>

    <!-- Key Metrics Grid -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-title">Disputed Flagged Exposure</div>
        <div class="kpi-value" style="color: var(--accent-rose);">₹${totalDispute.toLocaleString('en-IN')}</div>
        <div class="kpi-sub">Aggregated NCRP Claims</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Connected Entities</div>
        <div class="kpi-value">${nodes.length} Nodes</div>
        <div class="kpi-sub">${accounts.length} Accounts • ${devices.length} Device • ${merchants.length} POS</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Identified Mules</div>
        <div class="kpi-value" style="color: var(--accent-amber);">${mules.length} Accounts</div>
        <div class="kpi-sub">1 Primary • 3 Secondary</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Rapid Structuring Hop</div>
        <div class="kpi-value" style="color: var(--accent-cyan);">&lt; 4 mins</div>
        <div class="kpi-sub">Fan-Out Dispersion Latency</div>
      </div>
    </div>

    <!-- Section 1: Visual Network Graph Evidence -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">1. Graph Topology Snapshot & Network Structure</h2>
        <span style="font-size: 11px; color: var(--text-muted);">Cytoscape 2D Geometric Clustering</span>
      </div>

      <div class="graph-snapshot-box">
        ${
          graphImageBase64
            ? `<img src="${graphImageBase64}" alt="ANVIK Graph Investigation Snapshot" class="graph-img" />`
            : `<div style="padding: 40px; color: #94A3B8; font-size: 13px;">[Graph Snapshot Rendered Realtime]</div>`
        }
        <div class="graph-legend">
          <div class="legend-item"><span class="dot" style="background: #14B8A6;"></span> Victim Account (Axis)</div>
          <div class="legend-item"><span class="dot" style="background: #E11D48;"></span> Mule Ring (Primary + Secondary)</div>
          <div class="legend-item"><span class="dot" style="background: #F97316;"></span> Shared Hardware (Device Farm)</div>
          <div class="legend-item"><span class="dot" style="background: #9333EA;"></span> POS Cashout Merchant</div>
          <div class="legend-item"><span class="dot" style="background: #10B981;"></span> Legitimate Control Baseline</div>
        </div>
      </div>

      <div class="prose">
        <p>
          <strong>Figure 1.0 Topology Interpretation:</strong> The network exhibits an acute <em>Hub-and-Spoke Structuring and Mule Dispersion Pattern</em>. 
          Victim account <code>anand.verma@axis</code> was drained of ₹4,80,000 in an initial transaction directed into aggregator mule <code>rohit.sharma@ybl</code>. 
          Within four minutes, the aggregator distributed the illicit capital across three secondary mules (<code>karan.singh@icici</code>, <code>deepak.gupta@paytm</code>, <code>amit.patel@sbi</code>) to evade single-transaction velocity thresholds. 
          Crucially, device-binding heuristics confirm all four mule accounts authenticated via a single hardware identifier <code>DEV_FARM_1</code> (Samsung SM-G998B / IMEI-883109412), definitively demonstrating centralized syndicate operation.
        </p>
      </div>
    </section>

    <!-- Section 2: Executive Summary & Modus Operandi -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">2. Executive Summary & Modus Operandi Analysis</h2>
      </div>
      <div class="prose">
        <p>
          <strong>2.1 Incident Overview:</strong> National Cybercrime Reporting Portal (NCRP) ticket <code>NCRP-2026-8812</code> was flagged following a reported digital arrest / sextortion coercion event. 
          The victim, Anand Verma, was instructed to initiate real-time UPI transfers under duress. 
          Upon ingestion into the Anvik Detection Engine, automated graph pattern-matching scored the beneficiary cluster at <strong>94/100 (Critical Risk)</strong>.
        </p>
        <p>
          <strong>2.2 Structuring (Smurfing) Mechanics:</strong> The aggregator mule did not hold balances in excess of five minutes. 
          Instead, ₹4,50,000 was split into tiered tranches under ₹2,00,000 each to bypass automated banking AML alerts. 
          Layer 2 mule Karan Singh subsequently executed an immediate Point-of-Sale swipe of ₹1,75,000 at <code>Apex Digital Retail</code> to liquidate digital funds into untraceable consumer electronics.
        </p>
        <p>
          <strong>2.3 Hardware Collusion:</strong> Standard banking logs treat each VPA as a distinct individual. 
          However, graph link analysis connected all four mule VPAs to a shared mobile device token (IMEI hash <code>883109412</code>). 
          This indicates a classic "device farm" arrangement where a single orchestrator controls multiple compromised or rented bank credentials.
        </p>
      </div>
    </section>

    <!-- Section 3: Entity Risk Profile Registry -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">3. Suspect Entity Risk Registry</h2>
        <span style="font-size: 11px; color: var(--text-muted);">${nodes.length} Total Entities Evaluated</span>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Entity Identifier</th>
              <th>Type / Role</th>
              <th>VPA / Hardware / Terminal</th>
              <th>Bank / Provider</th>
              <th>Dispute / Volume</th>
              <th>Risk Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${nodes
              .map(
                (n) => `
              <tr>
                <td style="font-family: monospace; font-weight: 600;">${n.id}</td>
                <td>${n.role?.replace(/_/g, ' ') || n.type}</td>
                <td style="font-family: monospace; font-size: 11px;">${n.upiId || n.deviceId || n.merchantCategory || '—'}</td>
                <td>${n.bankName || '—'}</td>
                <td style="font-family: monospace;">${n.disputeAmount ? `₹${n.disputeAmount.toLocaleString('en-IN')}` : '—'}</td>
                <td>
                  <span class="tag ${
                    n.riskScore > 75 ? 'tag-critical' : n.riskScore > 40 ? 'tag-warning' : 'tag-success'
                  }">
                    ${n.riskScore}/100
                  </span>
                </td>
                <td>
                  <span class="tag ${
                    n.status === 'flagged' ? 'tag-critical' : n.status === 'frozen' ? 'tag-warning' : 'tag-success'
                  }">
                    ${n.status}
                  </span>
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </section>

    <!-- Section 4: Forensic Transaction Ledger -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">4. Multi-Hop Forensic Transaction Ledger</h2>
        <span style="font-size: 11px; color: var(--text-muted);">${timeline.length} Chronological Audit Events</span>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Event Title</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Amount</th>
              <th>Channel</th>
              <th>Detection Signal</th>
            </tr>
          </thead>
          <tbody>
            ${timeline
              .map(
                (t) => `
              <tr>
                <td style="font-family: monospace; font-size: 11px;">${t.timestamp}</td>
                <td style="font-weight: 600;">${t.title}</td>
                <td style="font-family: monospace; font-size: 11px;">${t.senderUpi || t.sender}</td>
                <td style="font-family: monospace; font-size: 11px;">${t.receiverUpi || t.receiver}</td>
                <td style="font-family: monospace; font-weight: 700;">₹${t.amount.toLocaleString('en-IN')}</td>
                <td><span class="tag tag-info">${t.eventType}</span></td>
                <td style="font-size: 11px; color: var(--accent-amber);">${t.anomalyReason || t.explanation}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </section>

    <!-- Section 5: Associated Complaints Registry -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">5. NCRP Dispute Records & Complaints Status</h2>
        <span style="font-size: 11px; color: var(--text-muted);">${complaints.length} Linked Complaints</span>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Complaint Ref</th>
              <th>Filing Date</th>
              <th>Dispute Amount</th>
              <th>Complainant / Account</th>
              <th>Category</th>
              <th>Current Status</th>
            </tr>
          </thead>
          <tbody>
            ${complaints
              .map(
                (c) => `
              <tr>
                <td style="font-family: monospace; font-weight: 700; color: var(--accent-cyan);">${c.complaintRef}</td>
                <td>${c.date}</td>
                <td style="font-family: monospace; font-weight: 700;">₹${c.disputeAmount.toLocaleString('en-IN')}</td>
                <td style="font-family: monospace; font-size: 11px;">${c.relatedAccountUpi}</td>
                <td>${c.category}</td>
                <td>
                  <span class="tag ${
                    c.status === 'under_investigation'
                      ? 'tag-critical'
                      : c.status === 'pending_review'
                      ? 'tag-warning'
                      : 'tag-success'
                  }">
                    ${c.status.replace(/_/g, ' ')}
                  </span>
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </section>

    <!-- Section 6: Actionable Law Enforcement & Bank Protocols -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">6. Recommended Law Enforcement & PSP Remediation Protocols</h2>
      </div>
      <div class="prose">
        <ol style="margin-left: 20px; space-y: 8px;">
          <li style="margin-bottom: 8px;">
            <strong>Immediate NPCI Central Switch Freeze:</strong> Issue automated lien/freeze directives under Section 91 CrPC for primary aggregator account <code>ACC_PRIMARY_MULE</code> (Yes Bank) and secondary layer 2 mules (ICICI, Paytm, SBI).
          </li>
          <li style="margin-bottom: 8px;">
            <strong>Hardware Fingerprint Blacklisting:</strong> Broadcast device token <code>IMEI-883109412</code> (Device Farm 1) across the unified national cyber fraud reporting system (CFCFRMS) to block subsequent UPI app registrations.
          </li>
          <li style="margin-bottom: 8px;">
            <strong>Merchant Settlement Hold:</strong> Notify merchant acquirer to place a provisional hold on terminal ID <code>MID-992144</code> (Apex Digital Retail) for the ₹1,75,000 POS transaction pending invoice verification.
          </li>
          <li style="margin-bottom: 8px;">
            <strong>Restitution Pathway:</strong> Direct un-cashed balances from secondary mules back to Axis Bank for victim Anand Verma's account restoration.
          </li>
        </ol>
      </div>

      <div class="disclaimer-box">
        <strong>Forensic Decision-Support System Protocol:</strong>
        This document represents machine-assisted evidence correlation compiled by the Anvik 2.0 graph engine. 
        Pattern detections (shared hardware bindings, velocity spikes, and structuring heuristics) constitute high-priority investigative signals 
        and should be verified against formal banking bank-statement logs and CDR (Call Detail Record) subpoena records prior to criminal indictment.
      </div>
    </section>

    <!-- Document Footer -->
    <footer style="text-align: center; font-size: 11px; color: var(--text-muted); padding: 20px 0; border-top: 1px solid var(--card-border);">
      Generated via ANVIK 2.0 Investigative Decision-Support Engine • Case INV-2026-084 • All Rights Reserved
    </footer>
  </div>
</body>
</html>`;
}

/**
 * Generates and triggers download of the complete HTML forensic report with graph image,
 * and opens a printable view in a new browser window.
 */
export function downloadInvestigationReport(data: ReportData): void {
  const htmlContent = generateInvestigationReportHtml(data);

  // 1. Create a Blob and trigger standard file download
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ANVIK_Forensic_Report_${data.caseId}_${Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // 2. Open print preview in new window for direct PDF saving
  const reportWindow = window.open('', '_blank');
  if (reportWindow) {
    reportWindow.document.open();
    reportWindow.document.write(htmlContent);
    reportWindow.document.close();
  }

  // Revoke object URL after delay
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 10000);
}
