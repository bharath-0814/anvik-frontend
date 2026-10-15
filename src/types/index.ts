export type NodeType = 'account' | 'device' | 'merchant' | 'complaint';

export type NodeRole = 'source_victim' | 'aggregator_mule' | 'secondary_mule' | 'cashout_merchant' | 'device_farm' | 'complaint' | 'verified_control';

export interface GraphNodeData {
  id: string;
  label: string;
  type: NodeType;
  role?: NodeRole;
  riskScore: number; // 0 - 100
  status: 'active' | 'frozen' | 'flagged' | 'verified';
  subText?: string;
  upiId?: string;
  accountNo?: string;
  bankName?: string;
  deviceId?: string;
  deviceModel?: string;
  merchantCategory?: string;
  complaintRef?: string;
  disputeAmount?: number;
  tags?: string[];
}

export interface GraphEdgeData {
  id: string;
  source: string;
  target: string;
  amount: number;
  timestamp: string;
  utr: string;
  channel: 'UPI_P2P' | 'UPI_P2M' | 'DEVICE_BIND' | 'COMPLAINT_LINK';
  isSuspicious: boolean;
  ruleTriggered?: string;
}

export type ComplaintStatus = 'under_investigation' | 'resolved' | 'pending_review';

export interface ComplaintRecord {
  id: string;
  complaintRef: string;
  date: string;
  shortDescription: string;
  category: string;
  disputeAmount: number;
  relatedAccountId: string;
  relatedAccountUpi: string;
  relatedBeneficiaryUpi?: string;
  relatedTxnUtr?: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: ComplaintStatus;
  analystNotes?: string;
}

export type TimelineEventType = 'SUSPICIOUS_PATTERN' | 'FLAGGED_TRANSACTION' | 'ANALYST_REVIEW' | 'CASHOUT';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  eventType: TimelineEventType;
  sender: string;
  senderName: string;
  senderUpi: string;
  receiver: string;
  receiverName: string;
  receiverUpi: string;
  amount: number;
  utr: string;
  timeDeltaSeconds?: number;
  explanation: string;
  anomalyReason?: string;
  isFlagged: boolean;
  edgeId?: string;
}

export interface SuspiciousAlert {
  id: string;
  title: string;
  clusterId: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  riskScore: number;
  patternType: 'MULE_RING' | 'DEVICE_FARM' | 'RAPID_DISPERSION' | 'STRUCTURING' | 'CIRCULAR_ROUTING';
  totalVolume: number;
  involvedEntitiesCount: number;
  detectedAt: string;
  summary: string;
  evidence: {
    ruleId: string;
    ruleName: string;
    description: string;
    metrics: Record<string, string | number>;
  }[];
  suggestedAction: string;
}

export interface CaseFile {
  id: string;
  title: string;
  analyst: string;
  status: 'OPEN' | 'IN_REVIEW' | 'ESCALATED_LEAS' | 'RESOLVED';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  createdAt: string;
  flaggedVolume: number;
  primaryClusterId: string;
  notes: {
    id: string;
    author: string;
    timestamp: string;
    text: string;
  }[];
}
