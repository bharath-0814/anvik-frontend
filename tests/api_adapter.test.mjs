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

function adaptBackendComplaintToRecord(item) {
  const dateFormatted = item.complaint_date
    ? new Date(item.complaint_date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '15 Oct 2026';

  return {
    id: item.complaint_id,
    complaintRef: `NCRP-${item.complaint_id}`,
    date: dateFormatted,
    shortDescription: `Disputed transfer of ₹${(item.amount_inr || 0).toLocaleString('en-IN')} to ${
      item.beneficiary_vpa || item.beneficiary_account_id || 'unlinked beneficiary'
    }`,
    category: 'UPI Dispute',
    disputeAmount: item.amount_inr || 0,
    relatedAccountId: item.victim_account_id,
    relatedAccountUpi: item.victim_vpa,
    relatedBeneficiaryUpi: item.beneficiary_vpa || undefined,
    relatedTxnUtr: item.txn_id,
    riskLevel: 'HIGH',
    status: 'under_investigation',
    analystNotes: `Reported synthetic complaint against transaction ${item.txn_id}. Beneficiary: ${
      item.beneficiary_account_id || 'unknown'
    }.`,
  };
}

function buildComplaintsUrl(baseUrl, accountId) {
  const params = new URLSearchParams();
  if (accountId) params.set('account_id', accountId);
  const qs = params.toString();
  return `${baseUrl.replace(/\/+$/, '')}/api/complaints${qs ? `?${qs}` : ''}`;
}

test('adaptBackendComplaintToRecord maps backend complaint to frontend record', () => {
  const backendComplaint = {
    complaint_id: 'CMP0001',
    victim_account_id: 'ACC0001',
    victim_vpa: 'aarav.nair1@synaxis',
    txn_id: 'TXN000102',
    amount_inr: 308.86,
    beneficiary_account_id: 'ACC0157',
    beneficiary_vpa: 'isha.kumar@synaxis',
    complaint_date: '2026-09-03T18:19:51+00:00',
    status: 'UNDER_INVESTIGATION',
  };

  const record = adaptBackendComplaintToRecord(backendComplaint);
  assert.equal(record.id, 'CMP0001');
  assert.equal(record.complaintRef, 'NCRP-CMP0001');
  assert.equal(record.disputeAmount, 308.86);
  assert.equal(record.relatedAccountId, 'ACC0001');
  assert.equal(record.relatedAccountUpi, 'aarav.nair1@synaxis');
  assert.equal(record.relatedBeneficiaryUpi, 'isha.kumar@synaxis');
  assert.equal(record.relatedTxnUtr, 'TXN000102');
  assert.equal(record.status, 'under_investigation');
});

test('buildComplaintsUrl formats query parameters correctly', () => {
  assert.equal(buildComplaintsUrl('https://anvik-backend.onrender.com', 'ACC0001'), 'https://anvik-backend.onrender.com/api/complaints?account_id=ACC0001');
  assert.equal(buildComplaintsUrl('http://127.0.0.1:8000/'), 'http://127.0.0.1:8000/api/complaints');
});

function buildAlertsUrl(baseUrl, filters) {
  const params = new URLSearchParams();
  if (filters?.rule_id) params.set('rule_id', filters.rule_id);
  if (filters?.priority) params.set('priority', filters.priority);
  if (filters?.account_id) params.set('account_id', filters.account_id);
  if (filters?.txn_id) params.set('txn_id', filters.txn_id);
  const qs = params.toString();
  return `${baseUrl.replace(/\/+$/, '')}/api/alerts${qs ? `?${qs}` : ''}`;
}

test('buildAlertsUrl formats query parameters correctly', () => {
  assert.equal(
    buildAlertsUrl('https://anvik-backend.onrender.com', { rule_id: 'RAPID_ONWARD_TRANSFER', priority: 'high' }),
    'https://anvik-backend.onrender.com/api/alerts?rule_id=RAPID_ONWARD_TRANSFER&priority=high'
  );
  assert.equal(buildAlertsUrl('http://127.0.0.1:8000/'), 'http://127.0.0.1:8000/api/alerts');
});

