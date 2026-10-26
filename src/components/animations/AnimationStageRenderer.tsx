import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AnimationConfig, AnimationId } from '../../registry/types';
import PaperStormStage, { StageProps } from './PaperStormStage';
import LivingSvgStage from './LivingSvgStage';
import GravityGardenStage from './GravityGardenStage';
import LiquidLensStage from './LiquidLensStage';
import CircularCarouselStage from './CircularCarouselStage';
import HoldButtonStage from './HoldButtonStage';
import ElectricLogoStage from './ElectricLogoStage';
import TechTextStage from './TechTextStage';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class StageErrorBoundary extends Component<
  { children: ReactNode; onReset?: () => void },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message || 'Rendering error in stage' };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('MotionForge Stage Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#18181c] text-[#f3f0f5] text-center gap-3"
        >
          <p className="font-mono text-xs text-[#ffb4a7] uppercase tracking-wider">
            Stage Renderer Protected Recovery
          </p>
          <p className="text-sm text-[#e4e1e7] max-w-md">{this.state.message}</p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, message: '' });
              this.props.onReset?.();
            }}
            className="px-3 py-1.5 rounded bg-[#ff5a43] text-white font-mono text-xs uppercase tracking-wider"
          >
            Reset Renderer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export interface AnimationStageRendererProps extends StageProps {
  animationId: AnimationId;
  onResetConfig?: () => void;
}

export default function AnimationStageRenderer({
  animationId,
  config,
  isPlaying = true,
  explodeTrigger = 0,
  assembleTrigger = 0,
  resetTrigger = 0,
  scrubProgress = null,
  compact = false,
  onTelemetryUpdate,
  onResetConfig,
}: AnimationStageRendererProps) {
  return (
    <StageErrorBoundary onReset={onResetConfig}>
      {animationId === 'paper-storm' && (
        <PaperStormStage
          config={config}
          isPlaying={isPlaying}
          explodeTrigger={explodeTrigger}
          assembleTrigger={assembleTrigger}
          resetTrigger={resetTrigger}
          scrubProgress={scrubProgress}
          compact={compact}
          onTelemetryUpdate={onTelemetryUpdate}
        />
      )}
      {animationId === 'living-svg' && (
        <LivingSvgStage
          config={config}
          isPlaying={isPlaying}
          explodeTrigger={explodeTrigger}
          assembleTrigger={assembleTrigger}
          resetTrigger={resetTrigger}
          scrubProgress={scrubProgress}
          compact={compact}
          onTelemetryUpdate={onTelemetryUpdate}
        />
      )}
      {animationId === 'gravity-garden' && (
        <GravityGardenStage
          config={config}
          isPlaying={isPlaying}
          explodeTrigger={explodeTrigger}
          assembleTrigger={assembleTrigger}
          resetTrigger={resetTrigger}
          scrubProgress={scrubProgress}
          compact={compact}
          onTelemetryUpdate={onTelemetryUpdate}
        />
      )}
      {animationId === 'liquid-lens' && (
        <LiquidLensStage
          config={config}
          isPlaying={isPlaying}
          explodeTrigger={explodeTrigger}
          assembleTrigger={assembleTrigger}
          resetTrigger={resetTrigger}
          scrubProgress={scrubProgress}
          compact={compact}
          onTelemetryUpdate={onTelemetryUpdate}
        />
      )}
      {animationId === 'circular-carousel' && (
        <CircularCarouselStage
          config={config}
          isPlaying={isPlaying}
          explodeTrigger={explodeTrigger}
          assembleTrigger={assembleTrigger}
          resetTrigger={resetTrigger}
          scrubProgress={scrubProgress}
          compact={compact}
          onTelemetryUpdate={onTelemetryUpdate}
        />
      )}
      {animationId === 'hold-button' && (
        <HoldButtonStage
          config={config}
          isPlaying={isPlaying}
          explodeTrigger={explodeTrigger}
          assembleTrigger={assembleTrigger}
          resetTrigger={resetTrigger}
          scrubProgress={scrubProgress}
          compact={compact}
          onTelemetryUpdate={onTelemetryUpdate}
        />
      )}
      {animationId === 'electric-logo' && (
        <ElectricLogoStage
          config={config}
          isPlaying={isPlaying}
          explodeTrigger={explodeTrigger}
          assembleTrigger={assembleTrigger}
          resetTrigger={resetTrigger}
          scrubProgress={scrubProgress}
          compact={compact}
          onTelemetryUpdate={onTelemetryUpdate}
        />
      )}
      {animationId === 'tech-text' && (
        <TechTextStage
          config={config}
          isPlaying={isPlaying}
          explodeTrigger={explodeTrigger}
          assembleTrigger={assembleTrigger}
          resetTrigger={resetTrigger}
          scrubProgress={scrubProgress}
          compact={compact}
          onTelemetryUpdate={onTelemetryUpdate}
        />
      )}
    </StageErrorBoundary>
  );
}
