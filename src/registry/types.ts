export type AnimationId =
  | 'paper-storm'
  | 'living-svg'
  | 'gravity-garden'
  | 'liquid-lens'
  | 'circular-carousel'
  | 'hold-button'
  | 'electric-logo'
  | 'tech-text';

export type AnimationCategory =
  | 'WebGL / 3D'
  | 'SVG & Crayon'
  | 'Canvas 2D Particles'
  | 'GLSL Shaders';

export type ExportFormat =
  | 'react'
  | 'vanilla'
  | 'typescript'
  | 'json';

export type ControlType = 'slider' | 'select' | 'color' | 'toggle';

export interface ParameterOption {
  label: string;
  value: string;
  colors?: [string, string, string];
}

export interface ParameterFieldSchema {
  key: string;
  label: string;
  description: string;
  type: ControlType;
  defaultValue: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: ParameterOption[];
}

export type AnimationConfig = Record<string, number | string | boolean>;

export interface AnimationPreset {
  id: string;
  name: string;
  description: string;
  values: AnimationConfig;
}

export interface DependencyRequirement {
  name: string;
  version: string;
  reason: string;
  optional?: boolean;
}

export interface PerformanceProfile {
  targetFps: number;
  bundleSizeKb: number;
  renderingEngine: string;
  complexityNote: string;
  gpuAccelerated: boolean;
}

export interface ExportBundle {
  format: ExportFormat;
  label: string;
  filename: string;
  language: 'tsx' | 'javascript' | 'typescript' | 'json';
  code: string;
  installCommand: string;
  usageExample: string;
  dependencies: DependencyRequirement[];
  cleanupNotes: string;
  accessibilityNotes: string;
}

export interface AnimationMetadata {
  id: AnimationId;
  indexNumber: string;
  name: string;
  subtitle: string;
  badge: string;
  category: AnimationCategory;
  tags: string[];
  summary: string;
  description: string;
  interactionGuide: string[];
  schema: ParameterFieldSchema[];
  defaultConfig: AnimationConfig;
  presets: AnimationPreset[];
  supportedExports: ExportFormat[];
  dependencies: DependencyRequirement[];
  performanceProfile: PerformanceProfile;
  accessibilityNotes: string[];
  limitations: string[];
  supportedStructures?: string[];
  license: string;
  version: string;
}
