import React, { useEffect, useRef, useState, useMemo } from 'react';
import cytoscape, { Core, EventObject } from 'cytoscape';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Search, 
  Type, 
  AlertTriangle,
  SlidersHorizontal,
  Download
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { GraphNodeData, GraphEdgeData } from '../types';

interface GraphExplorerProps {
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
  selectedEntity: GraphNodeData | null;
  onSelectEntity: (entity: GraphNodeData | null) => void;
  frozenNodeIds: Set<string>;
  highlightedRingActive: boolean;
  setHighlightedRingActive: (active: boolean) => void;
  highlightedNodeIds?: string[];
  highlightedEdgeId?: string | null;
  searchFilter?: string;
  setSearchFilter?: (q: string) => void;
  minRiskScore?: number;
  minAmount?: number;
  filterTypes?: { [key: string]: boolean };
  layoutName?: 'cose' | 'concentric' | 'breadthfirst' | 'circle';
  onOpenFilters?: () => void;
  timeRange?: string;
  setTimeRange?: (tr: string) => void;
  onToggleFreeze?: (nodeId: string) => void;
  onRegisterExport?: (exporter: () => string | null) => void;
  onDownloadReport?: () => void;
}

interface HoveredNodeInfo extends GraphNodeData {
  pos: { x: number; y: number };
  connections: { label: string; amount: string; isOut: boolean }[];
}

export const GraphExplorer: React.FC<GraphExplorerProps> = ({
  nodes,
  edges,
  selectedEntity,
  onSelectEntity,
  frozenNodeIds,
  highlightedRingActive,
  setHighlightedRingActive,
  highlightedNodeIds = [],
  highlightedEdgeId = null,
  searchFilter = '',
  setSearchFilter,
  minRiskScore = 0,
  minAmount = 0,
  filterTypes = { account: true, device: true, merchant: true, complaint: true },
  layoutName = 'cose',
  onOpenFilters,
  timeRange = 'Last 24 hours',
  setTimeRange,
  onRegisterExport,
  onDownloadReport,
}) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const animCanvasRef = useRef<HTMLCanvasElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [showLabels, setShowLabels] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<HoveredNodeInfo | null>(null);

  // Filter visible nodes
  const visibleNodes = useMemo(() => {
    return nodes.filter((n) => {
      if (!filterTypes[n.type]) return false;
      if (selectedTypeFilter !== 'ALL' && n.type !== selectedTypeFilter) return false;
      if (n.riskScore < minRiskScore) return false;

      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchLabel = n.label.toLowerCase().includes(q);
        const matchUpi = n.upiId?.toLowerCase().includes(q);
        const matchDev = n.deviceId?.toLowerCase().includes(q);
        const matchBank = n.bankName?.toLowerCase().includes(q);
        return matchLabel || matchUpi || matchDev || matchBank;
      }
      return true;
    });
  }, [nodes, filterTypes, selectedTypeFilter, minRiskScore, searchFilter]);

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map((n) => n.id)), [visibleNodes]);

  const visibleEdges = useMemo(() => {
    return edges.filter((e) => {
      if (e.amount > 0 && e.amount < minAmount) return false;
      return visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target);
    });
  }, [edges, minAmount, visibleNodeIds]);

  // Color & styling helper matching the reference palette
  const getNodeColor = (node: GraphNodeData, isFrozen: boolean): string => {
    if (isFrozen) return '#1E293B';
    if (node.id === 'ACC_VICTIM_1') return '#14B8A6'; // Teal circle (anand.verma@axis)
    if (node.id === 'ACC_LEGIT_1') return '#10B981'; // Green circle (priya.nair@okhdfc)
    if (node.type === 'merchant') return '#9333EA'; // Purple hexagon
    if (node.type === 'device') return '#F97316'; // Orange diamond
    if (node.type === 'complaint') return '#E11D48'; // Pink-Red octagon (NCRP-2026-8812)
    // Fraud mules (rohit.sharma, karan.singh, deepak.gupta, amit.patel)
    if (node.riskScore > 50 || node.role?.includes('mule')) return '#E11D48';
    return '#10B981';
  };

  const getNodeBorderColor = (node: GraphNodeData, isFrozen: boolean): string => {
    if (isFrozen) return '#64748B';
    if (node.id === 'ACC_VICTIM_1') return '#2DD4BF';
    if (node.id === 'ACC_LEGIT_1') return '#34D399';
    if (node.type === 'merchant') return '#C084FC';
    if (node.type === 'device') return '#FDBA74';
    if (node.type === 'complaint') return '#FDA4AF';
    if (node.riskScore > 50 || node.role?.includes('mule')) return '#FDA4AF';
    return '#34D399';
  };

  const getNodeSize = (node: GraphNodeData): number => {
    if (node.id === 'ACC_PRIMARY_MULE') return 46;
    if (node.type === 'merchant') return 44;
    if (node.type === 'device') return 42;
    if (node.type === 'complaint') return 42;
    return 38;
  };

  const getEdgeLabel = (e: GraphEdgeData): string => {
    if (e.channel === 'DEVICE_BIND') return 'BasedOn';
    if (e.channel === 'COMPLAINT_LINK') return 'Dispute';
    if (e.source === 'ACC_VICTIM_1' && e.target === 'ACC_PRIMARY_MULE') return 'Transaction';
    if (e.amount > 0) return `Linked`;
    return 'Linked';
  };

  // Cytoscape initialization
  useEffect(() => {
    if (!containerRef.current) return;

    const isDark = theme === 'dark';

    // Preset cluster coordinates
    const getInitialPosition = (id: string) => {
      const positions: Record<string, { x: number; y: number }> = {
        // Left Cluster: Mule Ring & Device Collusion
        'ACC_VICTIM_1': { x: 440, y: 390 },
        'COMPLAINT_NCRP_8812': { x: 550, y: 290 },
        'ACC_PRIMARY_MULE': { x: 310, y: 300 },
        'ACC_MULE_2': { x: 300, y: 440 },
        'ACC_MULE_3': { x: 280, y: 120 },
        'ACC_MULE_4': { x: 210, y: 200 },
        'DEV_FARM_1': { x: 190, y: 350 },
        'MERCH_CASHOUT': { x: 380, y: 210 },
        // Right Cluster: Legitimate Baseline Control
        'ACC_LEGIT_1': { x: 740, y: 150 },
        'DEV_USER_LEGIT': { x: 670, y: 270 },
        'MERCH_GROCERY': { x: 810, y: 290 },
      };
      return positions[id] || undefined;
    };

    const cyElements = [
      ...visibleNodes.map((n) => {
        const isFrozen = frozenNodeIds.has(n.id);
        const size = getNodeSize(n);
        const pos = getInitialPosition(n.id);
        return {
          data: {
            id: n.id,
            label: n.label,
            type: n.type,
            role: n.role,
            riskScore: n.riskScore,
            isFrozen: isFrozen,
            subText: n.subText,
            upiId: n.upiId,
            bankName: n.bankName,
            accountNo: n.accountNo,
            deviceId: n.deviceId,
            deviceModel: n.deviceModel,
            disputeAmount: n.disputeAmount,
            color: getNodeColor(n, isFrozen),
            borderColor: getNodeBorderColor(n, isFrozen),
            nodeSize: size,
          },
          position: pos ? { x: pos.x, y: pos.y } : undefined,
        };
      }),
      ...visibleEdges.map((e) => {
        const isMuleEdge = e.isSuspicious;
        const isSevered = frozenNodeIds.has(e.source) || frozenNodeIds.has(e.target);
        const isDevice = e.channel === 'DEVICE_BIND';
        return {
          data: {
            id: e.id,
            source: e.source,
            target: e.target,
            amount: e.amount,
            channel: e.channel,
            utr: e.utr,
            ruleTriggered: e.ruleTriggered,
            label: getEdgeLabel(e),
            isSuspicious: e.isSuspicious,
            isSevered: isSevered,
            lineStyle: isDevice ? 'dashed' : 'solid',
            lineColor: isSevered 
              ? (isDark ? '#1F332C' : '#CBD5E1') 
              : isDevice
              ? '#F97316'
              : isMuleEdge 
              ? '#E11D48' 
              : '#10B981',
            width: isMuleEdge ? 2.2 : isDevice ? 1.8 : 1.6,
          },
        };
      }),
    ];

    const cy = cytoscape({
      container: containerRef.current,
      elements: cyElements,
      style: [
        // Base Node Style: Clean, no persistent label unless toggled or hovered
        {
          selector: 'node',
          style: {
            'label': showLabels ? 'data(label)' : '',
            'color': '#F8FAFC',
            'font-size': '10px',
            'font-family': 'Inter, system-ui, sans-serif',
            'font-weight': 600,
            'text-valign': 'bottom',
            'text-margin-y': 7,
            'background-color': 'data(color)',
            'border-width': 2.5,
            'border-color': 'data(borderColor)',
            'width': 'data(nodeSize)',
            'height': 'data(nodeSize)',
            'text-outline-width': 2,
            'text-outline-color': '#060E0B',
            'underlay-color': 'data(color)',
            'underlay-padding': 2,
            'underlay-opacity': 0,
            'transition-property': 'background-color, line-color, target-arrow-color, opacity, border-color, border-width, underlay-color, underlay-opacity, underlay-padding, width, height, font-size',
            'transition-duration': 0.25,
          },
        },
        {
          selector: 'node[type = "device"]',
          style: {
            'shape': 'diamond',
          },
        },
        {
          selector: 'node[type = "merchant"]',
          style: {
            'shape': 'hexagon',
          },
        },
        {
          selector: 'node[type = "complaint"]',
          style: {
            'shape': 'octagon',
          },
        },
        // Interactive Hover State on Node: reveals label directly on canvas with glowing halo
        {
          selector: '.hovered-node',
          style: {
            'label': 'data(label)',
            'color': '#FFFFFF',
            'font-size': '11px',
            'font-weight': 700,
            'text-valign': 'bottom',
            'text-margin-y': 9,
            'text-outline-width': 2.5,
            'text-outline-color': '#060E0B',
            'border-width': 3.5,
            'border-color': '#FFFFFF',
            'underlay-color': 'data(color)',
            'underlay-padding': 9,
            'underlay-opacity': 0.45,
            'z-index': 9999,
          } as any,
        },
        // Selected Hub Node
        {
          selector: ':selected',
          style: {
            'label': 'data(label)',
            'border-width': 4,
            'border-color': '#06B6D4',
            'underlay-color': '#06B6D4',
            'underlay-padding': 10,
            'underlay-opacity': 0.5,
          } as any,
        },
        {
          selector: 'node[?isFrozen]',
          style: {
            'opacity': 0.35,
            'background-color': '#1E293B',
            'border-color': '#64748B',
            'border-style': 'dashed',
          },
        },
        // Base Edge Style: Clean
        {
          selector: 'edge',
          style: {
            'width': 'data(width)',
            'line-color': 'data(lineColor)',
            'line-style': 'data(lineStyle)' as any,
            'target-arrow-color': 'data(lineColor)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 1.15,
            'label': showLabels ? 'data(label)' : '',
            'font-size': '9px',
            'color': '#94A3B8',
            'font-weight': 600,
            'text-outline-width': 1.5,
            'text-outline-color': '#060E0B',
            'text-rotation': 'autorotate',
            'underlay-color': 'data(lineColor)',
            'underlay-padding': 0,
            'underlay-opacity': 0,
            'transition-property': 'width, line-color, target-arrow-color, opacity, underlay-color, underlay-opacity, underlay-padding',
            'transition-duration': 0.25,
          },
        },
        // Interactive Hover State on Edge
        {
          selector: '.hovered-edge',
          style: {
            'label': 'data(label)',
            'color': '#FFFFFF',
            'font-size': '10px',
            'font-weight': 700,
            'text-outline-width': 2,
            'text-outline-color': '#060E0B',
            'width': 3.6,
            'underlay-color': 'data(lineColor)',
            'underlay-padding': 6,
            'underlay-opacity': 0.45,
            'z-index': 9998,
          } as any,
        },
        {
          selector: 'edge[?isSevered]',
          style: {
            'opacity': 0.2,
            'line-color': '#94A3B8',
            'target-arrow-color': '#94A3B8',
          },
        },
        {
          selector: '.highlighted-ring',
          style: {
            'line-color': '#F59E0B',
            'target-arrow-color': '#F59E0B',
            'width': 4.5,
            'underlay-color': '#F59E0B',
            'underlay-padding': 4,
            'underlay-opacity': 0.35,
          } as any,
        },
        {
          selector: '.cross-highlighted-node',
          style: {
            'label': 'data(label)',
            'border-width': 4,
            'border-color': '#06B6D4',
            'underlay-color': '#06B6D4',
            'underlay-padding': 10,
            'underlay-opacity': 0.45,
            'z-index': 999,
          } as any,
        },
        {
          selector: '.cross-highlighted-edge',
          style: {
            'label': 'data(label)',
            'width': 4.5,
            'line-color': '#06B6D4',
            'target-arrow-color': '#06B6D4',
            'underlay-color': '#06B6D4',
            'underlay-padding': 6,
            'underlay-opacity': 0.45,
            'z-index': 998,
          } as any,
        },
        {
          selector: '.dimmed',
          style: {
            'opacity': 0.15,
          },
        },
      ],
      layout: (visibleNodes.length > 0 && visibleNodes.every((n) => !!getInitialPosition(n.id)))
        ? {
            name: 'preset',
            fit: true,
            padding: 60,
          }
        : {
            name: layoutName || 'cose',
            animate: false,
            fit: true,
            padding: 60,
            componentSpacing: 100,
          },
    });

    // Tap handlers
    cy.on('tap', 'node', (evt: EventObject) => {
      const nodeData = nodes.find((n) => n.id === evt.target.id());
      if (nodeData) {
        onSelectEntity(nodeData);
      }
    });

    cy.on('tap', (evt: EventObject) => {
      if (evt.target === cy) {
        onSelectEntity(null);
      }
    });

    // HOVER EVENT: Automatically displays the sleek glass hover box and highlights incident edges
    cy.on('mouseover', 'node', (evt: EventObject) => {
      const target = evt.target;
      target.addClass('hovered-node');
      target.connectedEdges().addClass('hovered-edge');

      const nodeData = nodes.find((n) => n.id === target.id());
      if (!nodeData || !containerRef.current) return;

      const pos = target.renderedPosition();
      
      // Calculate connected nodes
      const directEdges = edges.filter(
        (e) => e.source === nodeData.id || e.target === nodeData.id
      );
      const connections = directEdges.map((e) => {
        const otherId = e.source === nodeData.id ? e.target : e.source;
        const otherNode = nodes.find((n) => n.id === otherId);
        const isOut = e.source === nodeData.id;
        const amountStr = e.amount > 0 
          ? `₹${(e.amount / 1000).toFixed(0)}k` 
          : e.channel === 'DEVICE_BIND' ? 'Bound' : 'Dispute';
        return {
          label: otherNode?.label || otherId,
          amount: amountStr,
          isOut,
        };
      });

      setHoveredNode({
        ...nodeData,
        pos: { x: pos.x, y: pos.y },
        connections,
      });
    });

    cy.on('mouseout', 'node', (evt: EventObject) => {
      evt.target.removeClass('hovered-node');
      evt.target.connectedEdges().removeClass('hovered-edge');
      setHoveredNode(null);
    });

    cy.on('mouseover', 'edge', (evt: EventObject) => {
      evt.target.addClass('hovered-edge');
    });

    cy.on('mouseout', 'edge', (evt: EventObject) => {
      evt.target.removeClass('hovered-edge');
    });

    cyRef.current = cy;

    // Handle container resize cleanly
    const resizeObserver = new ResizeObserver(() => {
      if (cyRef.current) {
        cyRef.current.resize();
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      cy.destroy();
    };
  }, [
    visibleNodes.length, 
    visibleEdges.length, 
    frozenNodeIds, 
    theme, 
    showLabels
  ]);

  // CONTINUOUS MOVABLE ANIMATED ARROWS LOOP (Flowing along edges continuously in general!)
  useEffect(() => {
    let animId: number;
    const canvas = animCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = performance.now();

    const renderLoop = (now: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      if (cyRef.current) {
        const cy = cyRef.current;
        const elapsed = now - startTime;

        // Iterate over visible edges to draw flowing, moving arrowheads in general
        cy.edges().forEach((edge) => {
          if (!edge.visible()) return;

          const src = edge.source();
          const tgt = edge.target();
          if (!src.visible() || !tgt.visible()) return;

          const srcPos = src.renderedPosition();
          const tgtPos = tgt.renderedPosition();

          const dx = tgtPos.x - srcPos.x;
          const dy = tgtPos.y - srcPos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 35) return;

          const angle = Math.atan2(dy, dx);
          const isSuspicious = edge.data('isSuspicious');
          const isDevice = edge.data('channel') === 'DEVICE_BIND';

          // Arrow color palette
          const arrowColor = isSuspicious 
            ? '#FB7185' // Luminous pink/red for fraud hops
            : isDevice 
            ? '#FBA044' // Luminous amber for device links
            : '#34D399'; // Luminous emerald for legitimate flows

          const glowColor = isSuspicious 
            ? '#E11D48' 
            : isDevice 
            ? '#D97706' 
            : '#059669';

          // Moving speed & spacing
          const speed = 0.075; // pixels per ms
          const arrowSpacing = 65; // pixels between successive movable arrows
          const totalOffset = (elapsed * speed) % arrowSpacing;

          const srcRadius = 20;
          const tgtRadius = 24;
          const usableDist = dist - srcRadius - tgtRadius;
          if (usableDist <= 0) return;

          for (let d = totalOffset; d < usableDist; d += arrowSpacing) {
            const t = (srcRadius + d) / dist;
            const x = srcPos.x + dx * t;
            const y = srcPos.y + dy * t;

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);

            // Draw glowing movable chevron arrow
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 7;
            ctx.fillStyle = arrowColor;

            ctx.beginPath();
            ctx.moveTo(5.5, 0);
            ctx.lineTo(-4, -4);
            ctx.lineTo(-1, 0);
            ctx.lineTo(-4, 4);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
          }
        });
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [visibleNodes.length, visibleEdges.length]);

  // Spotlight ring effect
  useEffect(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;

    if (highlightedRingActive) {
      const ringNodeIds = [
        'ACC_VICTIM_1',
        'ACC_PRIMARY_MULE',
        'ACC_MULE_2',
        'ACC_MULE_3',
        'ACC_MULE_4',
        'DEV_FARM_1',
        'MERCH_CASHOUT',
      ];
      cy.elements().addClass('dimmed');
      ringNodeIds.forEach((id) => cy.getElementById(id).removeClass('dimmed'));
      cy.edges().forEach((edge) => {
        const src = edge.data('source');
        const tgt = edge.data('target');
        if (ringNodeIds.includes(src) && ringNodeIds.includes(tgt)) {
          edge.removeClass('dimmed');
          edge.addClass('highlighted-ring');
        }
      });
    } else {
      cy.elements().removeClass('dimmed');
      cy.edges().removeClass('highlighted-ring');
    }
  }, [highlightedRingActive]);

  // Cross-highlighting from Complaints or Timeline
  useEffect(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;

    const hasHighlight = (highlightedNodeIds && highlightedNodeIds.length > 0) || highlightedEdgeId;

    if (hasHighlight) {
      cy.elements().removeClass('cross-highlighted-node cross-highlighted-edge');
      cy.elements().addClass('dimmed');

      if (highlightedNodeIds && highlightedNodeIds.length > 0) {
        highlightedNodeIds.forEach((id) => {
          const ele = cy.getElementById(id);
          ele.removeClass('dimmed');
          ele.addClass('cross-highlighted-node');
        });
      }

      if (highlightedEdgeId) {
        const edgeEle = cy.getElementById(highlightedEdgeId);
        edgeEle.removeClass('dimmed');
        edgeEle.addClass('cross-highlighted-edge');
        const src = edgeEle.data('source');
        const tgt = edgeEle.data('target');
        if (src) cy.getElementById(src).removeClass('dimmed');
        if (tgt) cy.getElementById(tgt).removeClass('dimmed');
      }
    } else {
      cy.elements().removeClass('cross-highlighted-node cross-highlighted-edge');
      if (!highlightedRingActive) {
        cy.elements().removeClass('dimmed');
      }
    }
  }, [highlightedNodeIds, highlightedEdgeId, highlightedRingActive]);

  // Register graph image exporter for forensic reporting
  useEffect(() => {
    if (onRegisterExport) {
      onRegisterExport(() => {
        if (!cyRef.current) return null;
        try {
          return cyRef.current.png({
            full: true,
            scale: 2,
            bg: '#07130F',
          });
        } catch (e) {
          console.error('Failed to export graph image', e);
          return null;
        }
      });
    }
  }, [onRegisterExport]);

  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const handleFit = () => cyRef.current?.fit(undefined, 60);

  return (
    <div
      className={`rounded-2xl border transition-all h-full w-full flex flex-col relative overflow-hidden select-none ${
        theme === 'dark'
          ? 'bg-[#091612] border-[#142921]'
          : 'bg-white border-slate-200/90 shadow-sm'
      }`}
    >
      {/* Top Inner Header Bar */}
      <div className="px-5 py-3.5 border-b border-inherit flex flex-wrap items-center justify-between gap-4">
        {/* Title + 11 Entities Badge + Subtitle */}
        <div>
          <div className="flex items-center gap-2">
            <h2
              className={`text-sm font-bold tracking-tight ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              Network graph
            </h2>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                theme === 'dark'
                  ? 'bg-[#133026] text-[#34D399]'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {visibleNodes.length} entities
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Connected activity across complaints, accounts, and devices
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-2.5">
          {/* Find an entity... Search */}
          <div className="relative min-w-[180px] max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Find an entity..."
              value={searchFilter}
              onChange={(e) => setSearchFilter && setSearchFilter(e.target.value)}
              className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none transition-all ${
                theme === 'dark'
                  ? 'bg-[#0E1E19] border-[#18362B] text-slate-200 placeholder-slate-500 focus:border-emerald-500'
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500'
              }`}
            />
          </div>

          {/* All entity types Dropdown */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className={`px-3 py-1.5 text-xs rounded-xl border focus:outline-none cursor-pointer ${
              theme === 'dark'
                ? 'bg-[#0E1E19] border-[#18362B] text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="ALL">All entity types</option>
            <option value="account">Accounts only</option>
            <option value="device">Devices only</option>
            <option value="merchant">Merchants only</option>
            <option value="complaint">Complaints only</option>
          </select>

          {/* Last 24 hours Dropdown */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange && setTimeRange(e.target.value)}
            className={`px-3 py-1.5 text-xs rounded-xl border focus:outline-none cursor-pointer ${
              theme === 'dark'
                ? 'bg-[#0E1E19] border-[#18362B] text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="Last 24 hours">Last 24 hours</option>
            <option value="Last 7 days">Last 7 days</option>
            <option value="All time">All time</option>
          </select>

          {/* Filter Sliders Button */}
          <button
            onClick={onOpenFilters}
            title="Open filters slidebar"
            className={`p-2 rounded-xl border transition-all btn-press ${
              theme === 'dark'
                ? 'bg-[#0E1E19] border-[#18362B] text-slate-400 hover:text-white'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* Download Report Button */}
          {onDownloadReport && (
            <button
              onClick={onDownloadReport}
              title="Download Forensic Investigation Report (Descriptive Analysis + Graph)"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all btn-press ${
                theme === 'dark'
                  ? 'bg-[#0E261E] hover:bg-[#153D30] border-[#1C4E3D] text-[#34D399]'
                  : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Download Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 dot-grid overflow-hidden">
        {/* Top-Left Floating Badge inside Canvas */}
        <div className="absolute top-4 left-5 z-10 flex items-center gap-2 text-[11px] font-medium text-slate-400 bg-[#07130F]/85 px-3 py-1 rounded-full backdrop-blur-md border border-[#163328] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>Investigation network • 15 Oct 2026</span>
        </div>

        {/* Cytoscape Container */}
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* 60FPS MOVABLE ANIMATED ARROWS OVERLAY CANVAS (Continuous flow across edges!) */}
        <canvas
          ref={animCanvasRef}
          className="absolute inset-0 pointer-events-none z-10 w-full h-full"
        />

        {/* AUTOMATIC GLASS EFFECT HOVER TEXT BOX (Appears on cursor hover) */}
        {hoveredNode && (
          <div
            className={`absolute z-30 pointer-events-none p-3.5 rounded-2xl border shadow-2xl backdrop-blur-2xl transition-all duration-150 animate-in fade-in zoom-in-95 ease-out text-xs w-72 overflow-hidden select-none ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-[#0F2820]/90 via-[#081A14]/92 to-[#040E0B]/96 border-white/20 text-slate-100 shadow-[0_16px_40px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.35)]'
                : 'bg-white/95 border-slate-300 text-slate-800 shadow-2xl'
            }`}
            style={{
              left: `${Math.min(Math.max(hoveredNode.pos.x + 18, 14), (containerRef.current?.clientWidth || 500) - 305)}px`,
              top: `${Math.min(Math.max(hoveredNode.pos.y - 35, 14), (containerRef.current?.clientHeight || 400) - 235)}px`,
            }}
          >
            {/* Mirror Top Specular Reflection Line */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

            {/* Mirror Sheen Diagonal Layer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 pointer-events-none rounded-2xl" />

            {/* Header: Title + Role + Risk Badge */}
            <div className="flex items-start justify-between gap-2 mb-1.5 relative">
              <div className="min-w-0">
                <span className="font-bold text-[13px] tracking-tight truncate block text-white">
                  {hoveredNode.label}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {hoveredNode.role?.replace(/_/g, ' ') || hoveredNode.type}
                </span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0 shadow-xs ${
                  hoveredNode.riskScore > 75
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : hoveredNode.riskScore > 40
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                Risk {hoveredNode.riskScore}/100
              </span>
            </div>

            {/* Metadata Rows */}
            <div className="space-y-1 py-1.5 border-t border-white/10 text-[10px]">
              {hoveredNode.bankName && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Bank:</span>
                  <span className="text-slate-200 font-medium truncate">{hoveredNode.bankName}</span>
                </div>
              )}
              {hoveredNode.upiId && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">UPI:</span>
                  <span className="font-mono text-slate-200 truncate">{hoveredNode.upiId}</span>
                </div>
              )}
              {hoveredNode.deviceId && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Hardware ID:</span>
                  <span className="font-mono text-slate-200 truncate">{hoveredNode.deviceId}</span>
                </div>
              )}
              {hoveredNode.disputeAmount && (
                <div className="flex items-center justify-between text-rose-300 font-bold">
                  <span>Disputed Amount:</span>
                  <span>₹{hoveredNode.disputeAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* Connected Nodes Pathway */}
            {hoveredNode.connections && hoveredNode.connections.length > 0 && (
              <div className="border-t border-white/10 pt-1.5 mt-0.5">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  Active Connections ({hoveredNode.connections.length}):
                </span>
                <div className="space-y-1">
                  {hoveredNode.connections.slice(0, 3).map((conn, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-[10px] font-mono text-slate-200 bg-white/5 border border-white/5 px-2 py-0.5 rounded-lg"
                    >
                      <span className="truncate max-w-[150px]">{conn.label}</span>
                      <span className="text-cyan-300 text-[9px] shrink-0 font-bold">{conn.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Floating Bottom Toolbar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg transition-all bg-[#091713]/90 border-[#18362B]">
          {/* Fit to screen */}
          <button
            onClick={handleFit}
            title="Fit graph"
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-[#142821] transition-colors btn-press"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Labels */}
          <button
            onClick={() => setShowLabels(!showLabels)}
            title={showLabels ? 'Show labels on hover only' : 'Always show labels'}
            className={`p-1.5 rounded-full transition-colors btn-press ${
              showLabels
                ? 'text-[#34D399]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-3.5 bg-[#1C3A2F]" />

          {/* Spotlight Mule Ring */}
          <button
            onClick={() => setHighlightedRingActive(!highlightedRingActive)}
            title="Spotlight suspicious ring"
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all btn-press ${
              highlightedRingActive
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Spotlight</span>
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-[#142821] transition-colors btn-press"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-[#142821] transition-colors btn-press"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
