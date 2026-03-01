'use client';

import React from 'react';
import { Maximize2, X, ArrowLeft } from 'lucide-react';

type HeaderProps = {
  animationEnabled: boolean;
  onToggleAnimation: () => void;
  selectedTxId: number | null;
  onBackToLive: () => void;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
};

export function Header({
  animationEnabled,
  onToggleAnimation,
  selectedTxId,
  onBackToLive,
  fullscreen,
  onToggleFullscreen,
}: HeaderProps) {
  const isLive = selectedTxId === null;

  return (
    <header className="viz-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {fullscreen && (
          <button
            className="viz-toolbar-btn"
            onClick={onToggleFullscreen}
            title="Exit fullscreen (Esc)"
            aria-label="Exit fullscreen"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <h3 className="viz-title">
          Prose<span className="viz-title-accent">Mirror</span> Visualizer
        </h3>
      </div>
      <div className="viz-header-controls">
        {isLive ? (
          <span className="viz-hdr-chip viz-hdr-chip-live">
            <span className="viz-hdr-chip-dot viz-hdr-chip-dot-live" />
            LIVE
          </span>
        ) : (
          <button
            key={selectedTxId}
            className="viz-hdr-chip viz-hdr-chip-tx"
            onClick={onBackToLive}
          >
            <span className="viz-hdr-chip-dot viz-hdr-chip-dot-tx" />
            TX #{selectedTxId}
            <span className="viz-hdr-chip-dismiss">
              <X size={12} strokeWidth={2} aria-hidden />
            </span>
          </button>
        )}
        <button
          className={`viz-hdr-chip viz-hdr-chip-toggle ${animationEnabled ? 'active' : ''}`}
          onClick={onToggleAnimation}
        >
          <span
            className={`viz-hdr-chip-dot ${animationEnabled ? 'viz-hdr-chip-dot-on' : ''}`}
          />
          {animationEnabled ? 'Animate' : 'Paused'}
        </button>
        {!fullscreen && (
          <button
            className="viz-hdr-chip viz-hdr-chip-fullscreen"
            onClick={onToggleFullscreen}
            title="Fullscreen"
          >
            <Maximize2 size={16} strokeWidth={2} aria-hidden />
          </button>
        )}
      </div>
    </header>
  );
}
