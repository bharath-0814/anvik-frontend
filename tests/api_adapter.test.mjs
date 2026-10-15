import test from 'node:test';
import assert from 'node:assert/strict';

// Test the pure adapter logic identical to src/services/api.ts
function adaptBackendGraphToFrontend(backendData) {
  const nodes = (backendData.nodes || []).map((gn) => {
    const d = gn.data;
    const isDevice = d.node_type === 'device';

    return {
      id: d.id,
      label: d.label || d.id,
      type: isDevice ? 'device' : 'account',
      role: isDevice ? 'device_farm' : 'verified_control',
      riskScore: 0,
      status: 'active',
      subText: isDevice ? (d.device_id || d.label) : (d.bank ? `${d.bank} · ${d.holder_name || ''}` : (d.vpa || '')),
      upiId: d.vpa || undefined,
      bankName: d.bank || undefined,
      deviceId: d.device_id || undefined,
      accountNo: d.account_id || undefined,
    };
  });

  const edges = (backendData.edges || []).map((ge) => {
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

function buildGraphUrl(baseUrl, filters) {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.limit && filters.limit > 0) params.set('limit', String(filters.limit));
  const qs = params.toString();
  return `${baseUrl.replace(/\/+$/, '')}/api/graph${qs ? `?${qs}` : ''}`;
}

test('adaptBackendGraphToFrontend preserves Cytoscape IDs without fabrication', () => {
  const sampleBackendData = {
    nodes: [
      {
        data: {
          id: 'acc:ACC0001',
          label: 'ACC0001',
          node_type: 'account',
          account_id: 'ACC0001',
          holder_name: 'Aarav Nair',
          vpa: 'aarav.nair1@synaxis',
          bank: 'AXIS',
          device_id: null,
        },
      },
      {
        data: {
          id: 'dev:DEV0163',
          label: 'DEV0163',
          node_type: 'device',
          account_id: null,
          holder_name: null,
          vpa: null,
          bank: null,
          device_id: 'DEV0163',
        },
      },
    ],
    edges: [
      {
        data: {
          id: 'link:ACC0001_DEV0163',
          source: 'acc:ACC0001',
          target: 'dev:DEV0163',
          edge_type: 'uses_device',
          txn_id: null,
          amount_paise: null,
          amount_inr: null,
          timestamp_utc: null,
          raw_timestamp: null,
          txn_type: null,
          status: null,
          device_id: 'DEV0163',
        },
      },
      {
        data: {
          id: 'txn:TXN000102',
          source: 'acc:ACC0001',
          target: 'acc:ACC0157',
          edge_type: 'transaction',
          txn_id: 'TXN000102',
          amount_paise: 30886,
          amount_inr: 308.86,
          timestamp_utc: '2026-09-03T18:19:51+00:00',
          raw_timestamp: '2026-09-03 23:49:51',
          txn_type: 'PAY',
          status: 'SUCCESS',
          device_id: 'DEV0163',
        },
      },
    ],
    metadata: {
      dataset_id: 'test_dataset',
      node_count: 2,
      edge_count: 2,
      account_node_count: 1,
      device_node_count: 1,
      transaction_edge_count: 1,
      device_edge_count: 1,
      generated_at_utc: '2026-10-16T00:00:00Z',
    },
  };

  const adapted = adaptBackendGraphToFrontend(sampleBackendData);

  assert.equal(adapted.nodes.length, 2);
  assert.equal(adapted.edges.length, 2);

  // Exact node IDs preserved
  assert.equal(adapted.nodes[0].id, 'acc:ACC0001');
  assert.equal(adapted.nodes[0].type, 'account');
  assert.equal(adapted.nodes[0].upiId, 'aarav.nair1@synaxis');
  assert.equal(adapted.nodes[0].bankName, 'AXIS');

  assert.equal(adapted.nodes[1].id, 'dev:DEV0163');
  assert.equal(adapted.nodes[1].type, 'device');
  assert.equal(adapted.nodes[1].deviceId, 'DEV0163');

  // Exact edge IDs and channel mapping preserved
  assert.equal(adapted.edges[0].id, 'link:ACC0001_DEV0163');
  assert.equal(adapted.edges[0].channel, 'DEVICE_BIND');
  assert.equal(adapted.edges[0].source, 'acc:ACC0001');
  assert.equal(adapted.edges[0].target, 'dev:DEV0163');

  assert.equal(adapted.edges[1].id, 'txn:TXN000102');
  assert.equal(adapted.edges[1].channel, 'UPI_P2P');
  assert.equal(adapted.edges[1].amount, 308.86);
  assert.equal(adapted.edges[1].utr, 'TXN000102');
});

test('buildGraphUrl formats query parameters correctly', () => {
  const url1 = buildGraphUrl('http://127.0.0.1:8000', { status: 'SUCCESS', limit: 50 });
  assert.equal(url1, 'http://127.0.0.1:8000/api/graph?status=SUCCESS&limit=50');

  const url2 = buildGraphUrl('https://anvik-backend.onrender.com/', {});
  assert.equal(url2, 'https://anvik-backend.onrender.com/api/graph');

  const url3 = buildGraphUrl('https://api.example.com', { limit: 100 });
  assert.equal(url3, 'https://api.example.com/api/graph?limit=100');
});

test('adaptBackendGraphToFrontend handles empty graph response safely', () => {
  const emptyBackendData = {
    nodes: [],
    edges: [],
    metadata: {
      dataset_id: 'empty',
      node_count: 0,
      edge_count: 0,
      account_node_count: 0,
      device_node_count: 0,
      transaction_edge_count: 0,
      device_edge_count: 0,
      generated_at_utc: '2026-10-16T00:00:00Z',
    },
  };

  const adapted = adaptBackendGraphToFrontend(emptyBackendData);
  assert.equal(adapted.nodes.length, 0);
  assert.equal(adapted.edges.length, 0);
  assert.equal(adapted.metadata.node_count, 0);
});
