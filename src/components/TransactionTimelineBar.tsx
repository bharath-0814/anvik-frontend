import React, { useEffect, useState } from 'react';
import { RotateCcw, Play, Pause, Shield } from 'lucide-react';
import { TIMELINE_STEPS } from '../mock/network9Data';

interface TransactionTimelineBarProps {
  timelineIndex: number;
  setTimelineIndex: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export const TransactionTimelineBar: React.FC<TransactionTimelineBarProps> = ({
  timelineIndex,
  setTimelineIndex,
  isPlaying,
  setIsPlaying,
}) => {
  const activeStep = TIMELINE_STEPS[timelineIndex] || TIMELINE_STEPS[0];

  // Auto-play interval ticker
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimelineIndex((prev) => {
        if (prev >= TIMELINE_STEPS.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2200);

    return () => clearInterval(timer);
  }, [isPlaying, setIsPlaying, setTimelineIndex]);

  const handleReset = () => {
    setIsPlaying(false);
    setTimelineIndex(0);
  };

  const handleTogglePlay = () => {
    if (timelineIndex >= TIMELINE_STEPS.length - 1) {
      setTimelineIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  // Percentage played along the 5 step markers
  const playedPercent = (timelineIndex / (TIMELINE_STEPS.length - 1)) * 100;

  return (
    <div className="w-full bg-white border-t border-[#E8E4D8] px-6 py-3.5 flex flex-col justify-between shadow-2xs select-none">
      {/* 1. Header Bar: Title, Playback Controls, Active Timestamp */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          {/* Label: TRANSACTION TIMELINE · IST */}
          <span className="text-[11px] font-bold tracking-widest uppercase text-slate-800">
            TRANSACTION TIMELINE · IST
          </span>

          <span className="text-slate-300">|</span>

          {/* Active Step Description */}
          <span className="text-xs text-slate-500 font-medium truncate max-w-md hidden sm:inline">
            {activeStep.description}
          </span>
        </div>

        {/* Playback Controls & Time Display */}
        <div className="flex items-center gap-3">
          {/* Reset (↺) icon button */}
          <button
            onClick={handleReset}
            title="Reset to 09:32:00"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Play/Pause (▷ / ||) toggle button */}
          <button
            onClick={handleTogglePlay}
            title={isPlaying ? 'Pause timeline playback' : 'Play timeline chronologically'}
            className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#007065] text-white hover:bg-[#059669] transition-all shadow-xs cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-white" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
            )}
          </button>

          {/* Active time display in teal bold mono */}
          <div className="px-2.5 py-1 rounded-md bg-[#007065]/10 border border-[#007065]/20 font-mono font-bold text-xs text-[#007065]">
            {activeStep.time}
          </div>
        </div>
      </div>

      {/* 2. Scrubber Track & Markers */}
      <div className="relative pt-1 pb-2">
        {/* Full-width Scrubber Track with played section filled in teal */}
        <div className="relative w-full h-2 rounded-full bg-[#E8E4D8]/80 cursor-pointer overflow-visible">
          {/* Played Teal Section */}
          <div
            className="h-full rounded-full bg-[#007065] transition-all duration-300"
            style={{ width: `${playedPercent}%` }}
          />

          {/* Interactive Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#007065] shadow-md transition-all duration-300 pointer-events-none"
            style={{ left: `${playedPercent}%` }}
          />
        </div>

        {/* Native Range input overlaid for smooth scrubbing */}
        <input
          type="range"
          min={0}
          max={TIMELINE_STEPS.length - 1}
          step={1}
          value={timelineIndex}
          onChange={(e) => {
            setIsPlaying(false);
            setTimelineIndex(Number(e.target.value));
          }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />

        {/* Timestamp Scale Markers Beneath Track */}
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-2 px-1">
          {TIMELINE_STEPS.map((step, idx) => (
            <button
              key={step.time}
              onClick={() => {
                setIsPlaying(false);
                setTimelineIndex(idx);
              }}
              className={`hover:text-[#007065] transition-colors cursor-pointer ${
                idx === timelineIndex
                  ? 'font-bold text-[#007065] scale-105'
                  : idx < timelineIndex
                  ? 'text-slate-700'
                  : 'text-slate-400'
              }`}
            >
              {step.time}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Lower Legal Footnote */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-100">
        <Shield className="w-3.5 h-3.5 text-[#007065] shrink-0" />
        <span>Risk informs judgement. It does not replace it.</span>
      </div>
    </div>
  );
};
