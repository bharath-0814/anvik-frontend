import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  GitBranch, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  User, 
  Smartphone, 
  ArrowUpDown, 
  CreditCard 
} from 'lucide-react';
import { NetworkNode, NetworkEdge } from '../mock/network9Data';

interface NetworkGraphCanvasProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  selectedNodeId: string | null;
  onSelectNode: (node: NetworkNode | null) => void;
  timelineIndex: number; // 0 to 4
  frozenNodeIds?: Set<string>;
}

export const NetworkGraphCanvas: React.FC<NetworkGraphCanvasProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  timelineIndex,
  frozenNodeIds = new Set(),
}) => {
  // Zoom & Pan transformation state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Hover state for tooltip micro-card
  const [hoveredNode, setHoveredNode] = useState<{
    node: NetworkNode;
    screenX: number;
    screenY: number;
    connectionCount: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic canvas dimensions via ResizeObserver
  const [dimensions, setDimensions] = useState({ width: 950, height: 520 });

  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        if (clientWidth > 0 && clientHeight > 0) {
          setDimensions({ width: clientWidth, height: clientHeight });
        }
      }
    };
    updateSize();

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Compute uniformly distributed node coordinates based on real-time canvas width & height
  const distributedNodes = useMemo(() => {
    const w = dimensions.width || 950;
    const h = dimensions.height || 520;

    // Relative topological anchors across 5 distinct topological columns with symmetric vertical alignment:
    const BASE_LAYOUT: Record<string, { nx: number; ny: number }> = {
      // Column 1: Origin account & Origin device (vertically aligned)
      acc_origin:    { nx: 0.10, ny: 0.50 },
      dev_origin:    { nx: 0.10, ny: 0.82 },

      // Column 2: Collect request (upper conduit)
      col_req:       { nx: 0.28, ny: 0.26 },

      // Column 3: Central Aggregator receiving spine & shared device (directly above)
      acc_receiving: { nx: 0.48, ny: 0.50 },
      dev_shared:    { nx: 0.48, ny: 0.18 },

      // Column 4: Symmetrical 3-Mule fan-out (upper +0.28, middle 0.50, lower -0.28)
      acc_mule_1:    { nx: 0.70, ny: 0.22 },
      acc_mule_2:    { nx: 0.70, ny: 0.50 },
      acc_mule_3:    { nx: 0.70, ny: 0.78 },

      // Column 5: Linked terminal account (aligned on central axis)
      acc_linked:    { nx: 0.90, ny: 0.50 },
    };

    const padX = Math.max(60, w * 0.08);
    const padY = Math.max(70, h * 0.14);
    const usableW = Math.max(300, w - 2 * padX);
    const usableH = Math.max(260, h - 2 * padY);

    return nodes.map((node) => {
      const pos = BASE_LAYOUT[node.id];
      if (pos) {
        return {
          ...node,
          x: Math.round(padX + pos.nx * usableW),
          y: Math.round(padY + pos.ny * usableH),
        };
      }
      return node;
    });
  }, [nodes, dimensions]);

  // Compute 1st-degree connected neighbors when a node is selected
  const activeNeighborIds = useMemo(() => {
    if (!selectedNodeId) return null;
    const neighborSet = new Set<string>([selectedNodeId]);
    edges.forEach((e) => {
      if (e.source === selectedNodeId) neighborSet.add(e.target);
      if (e.target === selectedNodeId) neighborSet.add(e.source);
    });
    return neighborSet;
  }, [selectedNodeId, edges]);

  // Compute active edges connected to selection
  const activeEdgeIds = useMemo(() => {
    if (!selectedNodeId) return null;
    return new Set(
      edges
        .filter((e) => e.source === selectedNodeId || e.target === selectedNodeId)
        .map((e) => e.id)
    );
  }, [selectedNodeId, edges]);

  // Determine node visibility based on current timeline index
  const isNodeActiveInTimeline = (node: NetworkNode) => {
    // Origin account and its device are always visible from the start
    if (node.id === 'acc_origin' || node.id === 'dev_origin' || node.id === 'acc_linked') return true;
    // Otherwise check if any visible edge connects to it
    return edges.some(
      (e) => (e.source === node.id || e.target === node.id) && e.timelineIndex <= timelineIndex
    );
  };

  // Zoom handlers
  const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.2, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev * 0.8, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Robust Pan handlers with window-level event tracking so dragging never drops
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag when clicking canvas background or non-node elements
    const target = e.target as HTMLElement;
    if (target.closest('[data-node="true"]')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  useEffect(() => {
    const onWindowMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    };

    const onWindowMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', onWindowMouseMove);
      window.addEventListener('mouseup', onWindowMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onWindowMouseMove);
      window.removeEventListener('mouseup', onWindowMouseUp);
    };
  }, [isDragging, dragStart]);

  // Auto Scroll / Trackpad 2-finger Pan & Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Pinch / Ctrl + Wheel: Zoom
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      setZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.4), 2.5));
    } else {
      // Auto Scroll / Pan in X and Y
      setPan((prev) => ({
        x: Math.round(prev.x - e.deltaX * 0.9),
        y: Math.round(prev.y - e.deltaY * 0.9),
      }));
    }
  };

  // Auto-scroll camera to center a node smoothly
  const autoCenterNode = (targetNode: NetworkNode) => {
    const w = dimensions.width || 950;
    const h = dimensions.height || 520;
    setPan({
      x: Math.round(w / 2 - targetNode.x * zoom),
      y: Math.round(h / 2 - targetNode.y * zoom),
    });
  };

  // Auto-scroll when selectedNodeId changes
  useEffect(() => {
    if (selectedNodeId) {
      const found = distributedNodes.find((n) => n.id === selectedNodeId);
      if (found) {
        autoCenterNode(found);
      }
    }
  }, [selectedNodeId, zoom, dimensions]);

  // Auto-scroll during timeline changes
  useEffect(() => {
    if (!selectedNodeId && dimensions.width > 0) {
      const stepTargetMap: Record<number, string> = {
        0: 'col_req',
        1: 'acc_receiving',
        2: 'acc_mule_1',
        3: 'acc_mule_2',
        4: 'acc_mule_3',
      };
      const targetId = stepTargetMap[timelineIndex];
      const found = distributedNodes.find((n) => n.id === targetId);
      if (found) {
        const w = dimensions.width;
        setPan((prev) => ({
          x: Math.round(w * 0.5 - found.x * zoom),
          y: prev.y,
        }));
      }
    }
  }, [timelineIndex, zoom, dimensions]);

  // Sort nodes so hovered node renders on top of all other nodes and edges
  const sortedNodes = useMemo(() => {
    if (!hoveredNodeId) return distributedNodes;
    return [...distributedNodes].sort((a, b) => {
      if (a.id === hoveredNodeId) return 1;
      if (b.id === hoveredNodeId) return -1;
      return 0;
    });
  }, [distributedNodes, hoveredNodeId]);

  // Helper to compute smooth quadratic curved bezier path
  const computeCurvedPath = (src: NetworkNode, tgt: NetworkNode, curvature = 0) => {
    const dx = tgt.x - src.x;
    const dy = tgt.y - src.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    // Normal vector perpendicular to line
    const nx = -dy / dist;
    const ny = dx / dist;

    // Midpoint displaced by curvature
    const midX = (src.x + tgt.x) / 2 + nx * curvature;
    const midY = (src.y + tgt.y) / 2 + ny * curvature;

    const pathData = `M ${src.x} ${src.y} Q ${midX} ${midY} ${tgt.x} ${tgt.y}`;

    // Label anchor at quadratic midpoint (t = 0.5)
    const labelX = 0.25 * src.x + 0.5 * midX + 0.25 * tgt.x;
    const labelY = 0.25 * src.y + 0.5 * midY + 0.25 * tgt.y;

    return { pathData, labelX, labelY };
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex flex-col overflow-hidden select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{ backgroundColor: '#FBF9F4' }}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
    >
      {/* 1. TOP SUB-HEADER INSIDE GRAPH */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 py-3.5 flex items-center justify-between border-b border-[#E8E4D8]/80 bg-[#FBF9F4]/90 backdrop-blur-md">
        {/* Left: Branch icon + Breadcrumb */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[#007065]/10 flex items-center justify-center text-[#007065]">
            <GitBranch className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold tracking-wider text-slate-800 uppercase text-[11px]">
              TRANSACTION NETWORK
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 font-medium">UPI NETWORK</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 font-medium">Evidence map</span>
          </div>
        </div>

        {/* Right: Entity counter badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2DFD7] shadow-2xs text-[11px] font-medium text-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-[#007065] animate-pulse" />
          <span>• 9 entities · 9 relationships · Uniformly Distributed</span>
        </div>
      </div>

      {/* 2. FLOATING CANVAS CONTROLS (Top-Right under header) */}
      <div className="absolute top-16 right-6 z-20 flex items-center gap-1 bg-white/95 border border-[#E2DFD7] p-1 rounded-full shadow-sm backdrop-blur-xs">
        <button
          onClick={handleZoomIn}
          title="Zoom In (+)"
          className="w-7 h-7 flex items-center justify-center rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out (-)"
          className="w-7 h-7 flex items-center justify-center rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-3.5 bg-slate-200 mx-0.5" />
        <button
          onClick={handleResetZoom}
          title="Fit-to-Screen / Recenter"
          className="w-7 h-7 flex items-center justify-center rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. MAIN SVG GRAPH CANVAS */}
      <svg
        id="graph-canvas-bg"
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onClick={(e) => {
          if ((e.target as HTMLElement).id === 'graph-canvas-bg') {
            onSelectNode(null);
          }
        }}
      >
        <defs>
          {/* Subtle Dot Grid Pattern (20px spacing in faint slate #E2DFD7 at 40% opacity) */}
          <pattern id="canvas-dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.1" fill="#E2DFD7" fillOpacity="0.4" />
          </pattern>

          {/* Sleek Arrowhead marker in teal */}
          <marker
            id="arrow-teal"
            viewBox="0 0 10 10"
            refX="36"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#007065" />
          </marker>

          {/* Glow filter for fund transfer moving particles */}
          <filter id="glow-particle" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* CSS Animation for Flowing Dashed Device Lines */}
          <style>{`
            @keyframes flowingDash {
              from { stroke-dashoffset: 16; }
              to { stroke-dashoffset: 0; }
            }
            .flowing-device-link {
              animation: flowingDash 1.2s linear infinite;
            }
          `}</style>
        </defs>

        {/* Dot Grid Background */}
        <rect width="100%" height="100%" fill="url(#canvas-dot-grid)" />

        {/* Canvas World transformed by Pan & Zoom */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* ================= EDGES LAYER ================= */}
          <g className="edges-layer">
            {edges.map((edge) => {
              const srcNode = distributedNodes.find((n) => n.id === edge.source);
              const tgtNode = distributedNodes.find((n) => n.id === edge.target);
              if (!srcNode || !tgtNode) return null;

              const isVisibleInTimeline = edge.timelineIndex <= timelineIndex;
              const isDimmed = activeEdgeIds !== null && !activeEdgeIds.has(edge.id);
              const { pathData, labelX, labelY } = computeCurvedPath(srcNode, tgtNode, edge.curvature || 0);

              if (edge.type === 'transaction') {
                return (
                  <g
                    key={edge.id}
                    className="transaction-edge transition-opacity duration-300"
                    style={{
                      opacity: !isVisibleInTimeline ? 0 : isDimmed ? 0.2 : 1,
                      pointerEvents: !isVisibleInTimeline ? 'none' : 'auto',
                    }}
                  >
                    {/* Solid curved bezier transfer edge in teal (#007065, stroke-width: 2px) */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#007065"
                      strokeWidth="2"
                      markerEnd="url(#arrow-teal)"
                      strokeLinecap="round"
                    />

                    {/* Continuous Glowing Circular Particle (3px diameter) moving along path at 1.5s interval */}
                    {isVisibleInTimeline && (
                      <circle r="3" fill="#007065" filter="url(#glow-particle)">
                        <animateMotion path={pathData} dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Edge Label: Rounded white pill centered along the line with rupee amount */}
                    {edge.amountFormatted && (
                      <g transform={`translate(${labelX}, ${labelY})`}>
                        <rect
                          x="-28"
                          y="-10"
                          width="56"
                          height="20"
                          rx="10"
                          fill="#FFFFFF"
                          stroke="#E2DFD7"
                          strokeWidth="1"
                          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
                        />
                        <text
                          x="0"
                          y="3.5"
                          textAnchor="middle"
                          fill="#0F172A"
                          fontSize="10"
                          fontWeight="700"
                          fontFamily="ui-monospace, monospace"
                        >
                          {edge.amountFormatted}
                        </text>
                      </g>
                    )}
                  </g>
                );
              }

              // Device Association Edge: Subtle dashed curved gray line with flowing dashoffset
              return (
                <g
                  key={edge.id}
                  className="device-association-edge transition-opacity duration-300"
                  style={{
                    opacity: !isVisibleInTimeline ? 0 : isDimmed ? 0.2 : 1,
                    pointerEvents: !isVisibleInTimeline ? 'none' : 'auto',
                  }}
                >
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="flowing-device-link"
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
          </g>

          {/* ================= NODES LAYER (UNIFORMLY DISTRIBUTED) ================= */}
          <g className="nodes-layer">
            {sortedNodes.map((node) => {
              const isVisibleInTimeline = isNodeActiveInTimeline(node);
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;
              const isOtherHovered = hoveredNodeId !== null && !isHovered;
              const isDimmed = activeNeighborIds !== null && !activeNeighborIds.has(node.id);
              const isFrozen = frozenNodeIds.has(node.id);

              return (
                <g
                  key={node.id}
                  data-node="true"
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer group"
                  style={{
                    opacity: !isVisibleInTimeline ? 0 : isDimmed ? 0.2 : isOtherHovered ? 0.55 : 1,
                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                    pointerEvents: !isVisibleInTimeline ? 'none' : 'auto',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectNode(isSelected ? null : node);
                  }}
                  onMouseEnter={(e) => {
                    setHoveredNodeId(node.id);
                    const rect = containerRef.current?.getBoundingClientRect();
                    const screenX = e.clientX - (rect?.left || 0);
                    const screenY = e.clientY - (rect?.top || 0);
                    const count = edges.filter((ed) => ed.source === node.id || ed.target === node.id).length;
                    setHoveredNode({
                      node,
                      screenX,
                      screenY,
                      connectionCount: count,
                    });
                  }}
                  onMouseLeave={() => {
                    setHoveredNodeId(null);
                    setHoveredNode(null);
                  }}
                >
                  {/* SELECTION HALO */}
                  {isSelected && (
                    <circle
                      cx="0"
                      cy="0"
                      r="36"
                      fill="none"
                      stroke="#007065"
                      strokeWidth="2.5"
                      strokeDasharray="4 3"
                      className="animate-spin"
                      style={{ animationDuration: '8s' }}
                    />
                  )}

                  {/* STANDOUT HOVER AURA: Distinctive glowing aura ring when cursor hovers */}
                  <circle
                    cx="0"
                    cy="0"
                    r="34"
                    fill="none"
                    className={`transition-all duration-200 pointer-events-none ${
                      isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                    } ${
                      node.type === 'mule'
                        ? 'stroke-rose-500 fill-rose-500/20'
                        : node.type === 'collect'
                        ? 'stroke-amber-500 fill-amber-500/20'
                        : node.type === 'device'
                        ? 'stroke-slate-400 fill-slate-500/15'
                        : 'stroke-[#007065] fill-[#007065]/20'
                    }`}
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />

                  {/* 1. UPI ACCOUNT NODE: Clean circular badge (48px diameter) with emerald ring (scales up 1.25x on hover) */}
                  {node.type === 'upi' && (
                    <g className="transition-transform duration-200 ease-out group-hover:scale-125">
                      <circle
                        cx="0"
                        cy="0"
                        r="24"
                        fill="#FFFFFF"
                        stroke="#007065"
                        strokeWidth="2"
                        filter="drop-shadow(0 6px 14px rgba(0, 112, 101, 0.25))"
                      />
                      <foreignObject x="-24" y="-24" width="48" height="48" className="pointer-events-none">
                        <div className="w-full h-full flex items-center justify-center text-[#007065]">
                          <User className="w-5 h-5 stroke-[2.2]" />
                        </div>
                      </foreignObject>
                    </g>
                  )}

                  {/* 2. DEVICE NODE: Symmetrical rounded badge (48px × 48px, rx: 12px) (scales up 1.25x on hover) */}
                  {node.type === 'device' && (
                    <g className="transition-transform duration-200 ease-out group-hover:scale-125">
                      <rect
                        x="-24"
                        y="-24"
                        width="48"
                        height="48"
                        rx="12"
                        fill="#F8FAFC"
                        stroke="#94A3B8"
                        strokeWidth="1.5"
                        filter="drop-shadow(0 6px 12px rgba(0,0,0,0.12))"
                      />
                      <foreignObject x="-24" y="-24" width="48" height="48" className="pointer-events-none">
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <Smartphone className="w-5 h-5 stroke-[2]" />
                        </div>
                      </foreignObject>
                    </g>
                  )}

                  {/* 3. COLLECT REQUEST NODE: Symmetrical rounded square (48px × 48px, rx: 12px) (scales up 1.25x on hover) */}
                  {node.type === 'collect' && (
                    <g className="transition-transform duration-200 ease-out group-hover:scale-125">
                      <rect
                        x="-24"
                        y="-24"
                        width="48"
                        height="48"
                        rx="12"
                        fill="#FEF3C7"
                        stroke="#D97706"
                        strokeWidth="1.5"
                        filter="drop-shadow(0 6px 14px rgba(217, 119, 6, 0.25))"
                      />
                      <foreignObject x="-24" y="-24" width="48" height="48" className="pointer-events-none">
                        <div className="w-full h-full flex items-center justify-center text-amber-700">
                          <ArrowUpDown className="w-5 h-5 stroke-[2.2]" />
                        </div>
                      </foreignObject>
                    </g>
                  )}

                  {/* 4. POTENTIAL MULE ACCOUNT NODE: Circular badge (48px diameter) with coral ring (scales up 1.25x on hover) */}
                  {node.type === 'mule' && (
                    <g className="transition-transform duration-200 ease-out group-hover:scale-125">
                      <circle
                        cx="0"
                        cy="0"
                        r="24"
                        fill="#FFF1F2"
                        stroke="#E11D48"
                        strokeWidth="2"
                        filter="drop-shadow(0 6px 16px rgba(225, 29, 72, 0.28))"
                      />
                      <foreignObject x="-24" y="-24" width="48" height="48" className="pointer-events-none">
                        <div className="w-full h-full flex items-center justify-center text-rose-600">
                          <CreditCard className="w-5 h-5 stroke-[2.2]" />
                        </div>
                      </foreignObject>
                    </g>
                  )}

                  {/* TEXT LABELS (BELOW NODE) */}
                  <g transform={`translate(0, ${isHovered ? 40 : 36})`} className="transition-transform duration-200">
                    {/* Top: Entity role in bold 11px */}
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      className={`text-[11px] select-none transition-colors ${
                        isHovered ? 'font-black drop-shadow-xs' : 'font-bold'
                      } ${
                        node.type === 'mule'
                          ? isHovered ? 'fill-rose-800' : 'fill-rose-700'
                          : node.type === 'collect'
                          ? isHovered ? 'fill-amber-950' : 'fill-amber-900'
                          : isHovered ? 'fill-slate-950' : 'fill-slate-800'
                      }`}
                    >
                      {isFrozen ? `${node.role} (FROZEN)` : node.role}
                    </text>

                    {/* Bottom: VPA handle / Hardware ID in muted 10px */}
                    <text
                      x="0"
                      y="14"
                      textAnchor="middle"
                      className={`text-[10px] select-none transition-colors ${
                        isHovered ? 'font-bold fill-slate-800' : 'fill-slate-500'
                      } ${node.type === 'device' ? 'font-mono' : ''}`}
                    >
                      {node.handle}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {/* 4. MICRO-CARD HOVER TOOLTIP */}
      {hoveredNode && (
        <div
          className="absolute z-30 pointer-events-none p-3 rounded-xl bg-white border border-[#E2DFD7] shadow-xl text-xs w-60 select-none animate-in fade-in zoom-in-95 duration-100"
          style={{
            left: `${Math.min(Math.max(hoveredNode.screenX + 16, 20), (containerRef.current?.clientWidth || 600) - 260)}px`,
            top: `${Math.min(Math.max(hoveredNode.screenY - 20, 50), (containerRef.current?.clientHeight || 400) - 130)}px`,
          }}
        >
          <div className="flex items-center justify-between gap-1 mb-1.5 pb-1 border-b border-slate-100">
            <span className="font-bold text-[12px] text-slate-900 truncate">
              {hoveredNode.node.name}
            </span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                hoveredNode.node.type === 'mule'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : hoveredNode.node.type === 'collect'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-[#007065] border border-emerald-200'
              }`}
            >
              {hoveredNode.node.type}
            </span>
          </div>

          <div className="space-y-1 text-[11px] text-slate-600">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Identifier:</span>
              <span className="font-mono text-slate-800 font-medium truncate max-w-[130px]">
                {hoveredNode.node.handle}
              </span>
            </div>
            {hoveredNode.node.bank && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Institution:</span>
                <span className="text-slate-800 font-medium">{hoveredNode.node.bank}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Connections:</span>
              <span className="text-slate-800 font-semibold">{hoveredNode.connectionCount} active links</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Activity:</span>
              <span className="font-mono text-[#007065] font-semibold">{hoveredNode.node.timestamp} IST</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. BOTTOM LEGEND BAR (Fixed horizontal strip directly above timeline) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 py-2 bg-[#FBF9F4]/95 border-t border-[#E8E4D8] flex items-center justify-between text-xs backdrop-blur-xs">
        <div className="flex items-center gap-6 text-[11px] font-medium text-slate-700">
          {/* [○ UPI account] */}
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-[#007065] bg-white inline-block" />
            <span>UPI account</span>
          </div>

          {/* [▢ Device] */}
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm border-1.5 border-slate-400 bg-[#F8FAFC] inline-block" />
            <span>Device</span>
          </div>

          {/* [○ Collect request] */}
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-xs border-1.5 border-[#D97706] bg-[#FEF3C7] inline-block" />
            <span>Collect request</span>
          </div>

          {/* [○ Potential mule] */}
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-[#E11D48] bg-[#FFF1F2] inline-block" />
            <span className="text-rose-700 font-semibold">Potential mule</span>
          </div>
        </div>

        {/* Status / Instructions */}
        <span className="text-[10px] text-slate-400 italic">
          Click node to isolate 1st-degree relationships • Drag to pan • Scroll to zoom
        </span>
      </div>
    </div>
  );
};
