export type NetworkNodeType = 'upi' | 'device' | 'collect' | 'mule';

export interface NetworkNode {
  id: string;
  type: NetworkNodeType;
  role: string;
  handle: string; // VPA, Hardware ID, or Collect Ref
  name: string;
  bank?: string;
  hardwareModel?: string;
  riskScore: number;
  status: 'active' | 'flagged' | 'frozen';
  timestamp: string; // IST
  x: number;
  y: number;
  disputeAmount?: number;
}

export type NetworkEdgeType = 'transaction' | 'device_link';

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  type: NetworkEdgeType;
  amount?: number;
  amountFormatted?: string;
  timestamp: string; // IST
  timelineIndex: number; // 0 to 4
  ruleTriggered?: string;
  curvature?: number;
}

export interface TimelineStep {
  time: string;
  label: string;
  description: string;
}

export const TIMELINE_STEPS: TimelineStep[] = [
  { time: '09:32:00', label: 'Collect Request Pull', description: 'Unauthorized collect request COL-008412 triggers ₹24,500 debit from ananya-42@upi' },
  { time: '09:32:41', label: 'Aggregator Inflow', description: 'Funds land in aggregator mule ravi-18@ybl (Yes Bank)' },
  { time: '09:33:22', label: 'Dispersion Hop 1', description: 'Ravi Kumar disperses ₹16,000 to secondary mule kiran-913@paytm' },
  { time: '09:34:03', label: 'Dispersion Hop 2', description: 'Ravi Kumar structures ₹7,800 to second mule vikram-55@sbi' },
  { time: '09:34:45', label: 'Final Cashout Transfer', description: 'Vikram Singh moves ₹7,500 to cashout endpoint deepak-77@icici' },
];

export const NETWORK_9_NODES: NetworkNode[] = [
  // 1. Origin Account (UPI Account Node)
  {
    id: 'acc_origin',
    type: 'upi',
    role: 'Origin account',
    handle: 'ananya-42@upi',
    name: 'Ananya Sharma',
    bank: 'HDFC Bank',
    riskScore: 14,
    status: 'flagged',
    timestamp: '09:31:30',
    x: 160,
    y: 220,
    disputeAmount: 24500,
  },
  // 2. Origin Device (Device Node)
  {
    id: 'dev_origin',
    type: 'device',
    role: 'Origin device',
    handle: 'DEV-208101',
    name: 'OnePlus 11 5G',
    hardwareModel: 'OnePlus CPH2449',
    riskScore: 10,
    status: 'active',
    timestamp: '09:31:30',
    x: 160,
    y: 380,
  },
  // 3. Collect Request (Collect Request Node)
  {
    id: 'col_req',
    type: 'collect',
    role: 'Collect request',
    handle: 'COL-008412',
    name: 'Unauthorized Collect Request',
    riskScore: 92,
    status: 'flagged',
    timestamp: '09:32:00',
    x: 340,
    y: 140,
    disputeAmount: 24500,
  },
  // 4. Receiving Account / Aggregator Mule (Potential Mule Node)
  {
    id: 'acc_receiving',
    type: 'mule',
    role: 'Receiving account',
    handle: 'ravi-18@ybl',
    name: 'Ravi Kumar',
    bank: 'Yes Bank',
    riskScore: 96,
    status: 'flagged',
    timestamp: '09:32:41',
    x: 520,
    y: 230,
    disputeAmount: 24500,
  },
  // 5. Shared Device (Device Node)
  {
    id: 'dev_shared',
    type: 'device',
    role: 'Shared device',
    handle: 'DEV-7F3A9C',
    name: 'Samsung Galaxy SM-G998B',
    hardwareModel: 'Samsung Exynos Farm Token',
    riskScore: 94,
    status: 'flagged',
    timestamp: '09:31:00',
    x: 520,
    y: 70,
  },
  // 6. Potential Mule 1 (Potential Mule Node)
  {
    id: 'acc_mule_1',
    type: 'mule',
    role: 'Potential mule',
    handle: 'kiran-913@paytm',
    name: 'Kiran Patel',
    bank: 'Paytm Payments Bank',
    riskScore: 89,
    status: 'flagged',
    timestamp: '09:33:22',
    x: 740,
    y: 130,
    disputeAmount: 16000,
  },
  // 7. Potential Mule 2 (Potential Mule Node)
  {
    id: 'acc_mule_2',
    type: 'mule',
    role: 'Potential mule',
    handle: 'vikram-55@sbi',
    name: 'Vikram Singh',
    bank: 'State Bank of India',
    riskScore: 87,
    status: 'flagged',
    timestamp: '09:34:03',
    x: 750,
    y: 270,
    disputeAmount: 7800,
  },
  // 8. Potential Mule 3 (Potential Mule Node)
  {
    id: 'acc_mule_3',
    type: 'mule',
    role: 'Potential mule',
    handle: 'deepak-77@icici',
    name: 'Deepak Verma',
    bank: 'ICICI Bank',
    riskScore: 84,
    status: 'flagged',
    timestamp: '09:34:45',
    x: 730,
    y: 410,
    disputeAmount: 7500,
  },
  // 9. Linked Account (UPI Account Node)
  {
    id: 'acc_linked',
    type: 'upi',
    role: 'Linked account',
    handle: 'priya-18@okhdfc',
    name: 'Priya Nair',
    bank: 'HDFC Bank',
    riskScore: 8,
    status: 'active',
    timestamp: '09:31:00',
    x: 340,
    y: 380,
  },
];

export const NETWORK_9_EDGES: NetworkEdge[] = [
  // 1. Device association: Origin Device -> Origin Account
  {
    id: 'edge_dev_origin',
    source: 'dev_origin',
    target: 'acc_origin',
    type: 'device_link',
    timestamp: '09:31:30',
    timelineIndex: 0,
    ruleTriggered: 'HARDWARE_AUTHENTICATION_BASELINE',
    curvature: 15,
  },
  // 2. Transaction 1: Origin Account -> Collect Request
  {
    id: 'edge_txn_collect',
    source: 'acc_origin',
    target: 'col_req',
    type: 'transaction',
    amount: 24500,
    amountFormatted: '₹24,500',
    timestamp: '09:32:00',
    timelineIndex: 0,
    ruleTriggered: 'UNAUTHORIZED_COLLECT_PULL',
    curvature: -25,
  },
  // 3. Transaction 2: Collect Request -> Receiving Account
  {
    id: 'edge_txn_receiving',
    source: 'col_req',
    target: 'acc_receiving',
    type: 'transaction',
    amount: 24500,
    amountFormatted: '₹24,500',
    timestamp: '09:32:41',
    timelineIndex: 1,
    ruleTriggered: 'IMMEDIATE_AGGREGATOR_INFLOW',
    curvature: -20,
  },
  // 4. Device association: Shared Device -> Receiving Account
  {
    id: 'edge_dev_mule_agg',
    source: 'dev_shared',
    target: 'acc_receiving',
    type: 'device_link',
    timestamp: '09:31:00',
    timelineIndex: 1,
    ruleTriggered: 'DEVICE_FARM_BINDING',
    curvature: 0,
  },
  // 5. Device association: Shared Device -> Mule 1
  {
    id: 'edge_dev_mule_1',
    source: 'dev_shared',
    target: 'acc_mule_1',
    type: 'device_link',
    timestamp: '09:31:00',
    timelineIndex: 2,
    ruleTriggered: 'DEVICE_FARM_COLLUSION',
    curvature: 30,
  },
  // 6. Device association: Shared Device -> Mule 2
  {
    id: 'edge_dev_mule_2',
    source: 'dev_shared',
    target: 'acc_mule_2',
    type: 'device_link',
    timestamp: '09:31:00',
    timelineIndex: 3,
    ruleTriggered: 'DEVICE_FARM_COLLUSION',
    curvature: 45,
  },
  // 7. Transaction 3: Receiving Account -> Mule 1
  {
    id: 'edge_txn_mule_1',
    source: 'acc_receiving',
    target: 'acc_mule_1',
    type: 'transaction',
    amount: 16000,
    amountFormatted: '₹16,000',
    timestamp: '09:33:22',
    timelineIndex: 2,
    ruleTriggered: 'RAPID_DISPERSION_HOP_1',
    curvature: -30,
  },
  // 8. Transaction 4: Receiving Account -> Mule 2
  {
    id: 'edge_txn_mule_2',
    source: 'acc_receiving',
    target: 'acc_mule_2',
    type: 'transaction',
    amount: 7800,
    amountFormatted: '₹7,800',
    timestamp: '09:34:03',
    timelineIndex: 3,
    ruleTriggered: 'LAYERING_STRUCTURING_HOP_2',
    curvature: 15,
  },
  // 9. Transaction 5: Mule 2 -> Mule 3
  {
    id: 'edge_txn_mule_3',
    source: 'acc_mule_2',
    target: 'acc_mule_3',
    type: 'transaction',
    amount: 7500,
    amountFormatted: '₹7,500',
    timestamp: '09:34:45',
    timelineIndex: 4,
    ruleTriggered: 'FINAL_CASHOUT_TRANSFER',
    curvature: 25,
  },
];
