import React from 'react';
import {
  AnimationConfig,
  AnimationMetadata,
  ParameterFieldSchema,
} from '../../registry/types';
import { Sliders, HelpCircle, RotateCcw, Share2 } from 'lucide-react';

export interface ParameterEditorProps {
  animation: AnimationMetadata;
  config: AnimationConfig;
  onChangeField: (key: string, value: number | string | boolean) => void;
  onReset: () => void;
  onShareLink: () => void;
}

export default function ParameterEditor({
  animation,
  config,
  onChangeField,
  onReset,
  onShareLink,
}: ParameterEditorProps) {
  const renderField = (field: ParameterFieldSchema) => {
    const rawValue = config[field.key] ?? field.defaultValue;

    if (field.type === 'slider') {
      const numVal = Number(rawValue);
      const displayVal =
        field.step && field.step < 1 ? numVal.toFixed(2).replace(/\.00$/, '.0') : String(numVal);

      return (
        <div key={field.key} className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center gap-2">
            <label
              htmlFor={`param-${field.key}`}
              className="font-mono text-[11px] font-semibold tracking-[0.08em] text-[#5a403c] uppercase flex items-center gap-1.5"
              title={field.description}
            >
              <span>{field.label}</span>
              <HelpCircle className="w-3.5 h-3.5 text-[#8f706b] shrink-0" aria-hidden="true" />
            </label>
            <output
              htmlFor={`param-${field.key}`}
              className="px-2 py-0.5 bg-[#f0edf2] border border-[#1b1b1f]/10 rounded font-mono text-xs font-medium text-[#1b1b1f] tabular-nums"
              data-testid={`readout-${field.key}`}
            >
              {displayVal}
              {field.unit || ''}
            </output>
          </div>
          <input
            id={`param-${field.key}`}
            type="range"
            min={field.min}
            max={field.max}
            step={field.step}
            value={numVal}
            aria-label={field.label}
            onChange={(e) => onChangeField(field.key, parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[#eae7ed] rounded-full appearance-none accent-[#b52515] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#b52515]"
          />
          <p className="text-[11px] text-[#5a403c]/80 leading-snug">{field.description}</p>
        </div>
      );
    }

    if (field.type === 'select' && field.options) {
      const currentStr = String(rawValue);
      return (
        <div key={field.key} className="flex flex-col gap-2 pt-1">
          <span className="font-mono text-[11px] font-semibold tracking-[0.08em] text-[#5a403c] uppercase">
            {field.label}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label={field.label}>
            {field.options.map((opt) => {
              const isSelected = currentStr === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onChangeField(field.key, opt.value)}
                  className={`flex flex-col p-2 rounded-lg text-left gap-1.5 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#eae7ed] border-[#1b1b1f] shadow-[2px_2px_0px_#1b1b1f]'
                      : 'bg-[#f6f2f8] border-[#1b1b1f]/15 hover:bg-[#eae7ed]/70'
                  }`}
                >
                  {opt.colors && (
                    <div className="flex gap-1 h-2.5 w-full rounded overflow-hidden border border-[#1b1b1f]/10">
                      <span className="w-1/3 h-full" style={{ backgroundColor: opt.colors[0] }} />
                      <span className="w-1/3 h-full" style={{ backgroundColor: opt.colors[1] }} />
                      <span className="w-1/3 h-full" style={{ backgroundColor: opt.colors[2] }} />
                    </div>
                  )}
                  <span
                    className={`font-mono text-[11px] truncate ${
                      isSelected ? 'text-[#1b1b1f] font-semibold' : 'text-[#5a403c]'
                    }`}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (field.type === 'toggle') {
      const checked = Boolean(rawValue);
      return (
        <div
          key={field.key}
          className="flex items-center justify-between p-3 bg-[#f6f2f8] border border-[#1b1b1f]/12 rounded-lg mt-1"
        >
          <div className="flex flex-col min-w-0 pr-3">
            <span className="font-display font-semibold text-[13px] text-[#1b1b1f]">
              {field.label}
            </span>
            <span className="text-xs text-[#5a403c] leading-snug">{field.description}</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={field.label}
            onClick={() => onChangeField(field.key, !checked)}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 shrink-0 relative cursor-pointer border border-[#1b1b1f]/20 ${
              checked ? 'bg-[#ff5a43]' : 'bg-[#e4e1e7]'
            }`}
          >
            <span
              className={`block w-4.5 h-4.5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                checked ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <section
      aria-label="Kinetic Parameters Editor"
      className="flex flex-col bg-white border border-[#1b1b1f]/15 rounded-xl overflow-hidden shadow-sm"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#f6f2f8] border-b border-[#1b1b1f]/10">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#b52515]" aria-hidden="true" />
          <h2 className="font-display font-semibold text-base text-[#1b1b1f]">
            Kinetic Parameters
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onShareLink}
            className="px-2.5 py-1 rounded bg-white hover:bg-[#eae7ed] border border-[#1b1b1f]/15 font-mono text-[11px] font-medium text-[#1b1b1f] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Share2 className="w-3 h-3 text-[#006971]" aria-hidden="true" />
            <span>Share URL</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="px-2.5 py-1 rounded bg-white hover:bg-[#eae7ed] border border-[#1b1b1f]/15 font-mono text-[11px] font-medium text-[#5a403c] hover:text-[#1b1b1f] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Parameter Controls List */}
      <div className="p-4 flex flex-col gap-4">{animation.schema.map(renderField)}</div>
    </section>
  );
}
