/**
 * Anvik API Service Client
 * Connects frontend to the Anvik FastAPI / NetworkX backend.
 */

import { GraphNodeData, GraphEdgeData } from '../types';

// Resolve base URL from Vite environment variable (default empty string for relative paths or mock fallback)
export const API_BASE_URL: string = (
  import.meta.env.VITE_API_BASE_URL || ''
).replace(/\/+$/, '');

export interface BackendNodeData {
  id: string;
  label: string;
  node_type: 'account' | 'device';
  account_id?: string | null;
  holder_name?: string | null;
  vpa?: string | null;
  bank?: string | null;
  device_id?: string | null;
}

export interface BackendGraphNode {
  data: BackendNodeData;
}

export interface BackendEdgeData {
  id: string;
  source: string;
  target: string;
  edge_type: 'transaction' | 'uses_device';
  txn_id?: string | null;
  amount_paise?: number | null;
  amount_inr?: number | null;
  timestamp_utc?: string | null;
  raw_timestamp?: string | null;
  txn_type?: string | null;
  status?: string | null;
  device_id?: string | null;
}

export interface BackendGraphEdge {
  data: BackendEdgeData;
}

export interface BackendGraphMetadata {
  dataset_id: string;
  node_count: number;
  edge_count: number;
  account_node_count: number;
  device_node_count: number;
  transaction_edge_count: number;
  device_edge_count: number;
  generated_at_utc: string;
}

export interface BackendGraphResponse {
  nodes: BackendGraphNode[];
  edges: BackendGraphEdge[];
  metadata: BackendGraphMetadata;
}

export interface HealthResponse {
  status: string;
  service: string;
}

export interface ReadyResponse {
  status: string;
  database: {
    connected: boolean;
    message: string;
  };
  environment: string;
}

export interface GraphFilters {
  status?: string;
  limit?: number;
}

/**
 * Health check probe (liveness)
 */
export async function getHealth(): Promise<HealthResponse> {
  const url = `${API_BASE_URL}/api/health`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Health check failed with HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * Database readiness probe
 */
export async function getReady(): Promise<ReadyResponse> {
  const url = `${API_BASE_URL}/api/ready`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Readiness probe failed with HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch Cytoscape graph topology from backend
 */
export async function getGraph(filters?: GraphFilters): Promise<BackendGraphResponse> {
  const params = new URLSearchParams();
  if (filters?.status) {
    params.set('status', filters.status);
  }
  if (filters?.limit && filters.limit > 0) {
    params.set('limit', String(filters.limit));
  }

  const queryString = params.toString();
  const url = `${API_BASE_URL}/api/graph${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url);
  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`Failed to fetch graph (HTTP ${res.status}): ${errorText || res.statusText}`);
  }
  return res.json();
}

/**
 * Cleanly adapt backend Cytoscape elements to frontend UI types.
 * Preserves exact backend IDs (acc:..., dev:..., txn:..., link:...) without fabricated identifiers.
 */
export function adaptBackendGraphToFrontend(backendData: BackendGraphResponse): {
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
  metadata: BackendGraphMetadata;
} {
  const nodes: GraphNodeData[] = (backendData.nodes || []).map((gn) => {
    const d = gn.data;
    const isDevice = d.node_type === 'device';

    return {
      id: d.id,
      label: d.label || d.id,
      type: isDevice ? 'device' : 'account',
      role: isDevice ? 'device_farm' : 'verified_control',
      riskScore: 0, // Baseline heuristic score pending Aryan's final scoring formula
      status: 'active',
      subText: isDevice ? (d.device_id || d.label) : (d.bank ? `${d.bank} · ${d.holder_name || ''}` : (d.vpa || '')),
      upiId: d.vpa || undefined,
      bankName: d.bank || undefined,
      deviceId: d.device_id || undefined,
      accountNo: d.account_id || undefined,
    };
  });

  const edges: GraphEdgeData[] = (backendData.edges || []).map((ge) => {
    const d = ge.data;
    const isDeviceLink = d.edge_type === 'uses_device';

    return {
      id: d.id,
      source: d.source,
      target: d.target,
      amount: d.amount_inr || 0,
      timestamp: d.raw_timestamp || d.timestamp_utc || '',
      utr: d.txn_id || d.id,
      channel: isDeviceLink ? 'DEVICE_BIND' : 'UPI_P2P',
      isSuspicious: false,
      ruleTriggered: undefined,
    };
  });

  return {
    nodes,
    edges,
    metadata: backendData.metadata,
  };
}
