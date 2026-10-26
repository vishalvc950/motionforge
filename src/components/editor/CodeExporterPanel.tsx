import React, { useMemo, useState } from 'react';
import {
  AnimationConfig,
  AnimationId,
  ExportFormat,
} from '../../registry/types';
import {
  generateExportBundle,
  verifyExportBundle,
} from '../../registry/exporters';
import { Check, Copy, Download, Terminal, ShieldCheck } from 'lucide-react';

export interface CodeExporterPanelProps {
  animationId: AnimationId;
  config: AnimationConfig;
  onNotify?: (message: string) => void;
}

const FORMAT_TABS: { id: ExportFormat; label: string }[] = [
  { id: 'react', label: 'React Component' },
  { id: 'vanilla', label: 'Vanilla JS' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'json', label: 'JSON Preset' },
];

export default function CodeExporterPanel({
  animationId,
  config,
  onNotify,
}: CodeExporterPanelProps) {
  const [activeFormat, setActiveFormat] = useState<ExportFormat>('react');
  const [copiedState, setCopiedState] = useState<'none' | 'code' | 'npm'>('none');

  const bundle = useMemo(
    () => generateExportBundle(animationId, config, activeFormat),
    [animationId, config, activeFormat]
  );

  const verification = useMemo(
    () => verifyExportBundle(animationId, config, activeFormat),
    [animationId, config, activeFormat]
  );

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(bundle.code);
    } catch {
      // Fallback if clipboard API restricted
    }
    setCopiedState('code');
    onNotify?.(`Copied ${bundle.filename} to clipboard`);
    window.setTimeout(() => setCopiedState('none'), 2000);
  };

  const handleCopyNpm = async () => {
    try {
      await navigator.clipboard.writeText(bundle.installCommand);
    } catch {
      // Fallback
    }
    setCopiedState('npm');
    onNotify?.(`Copied command: ${bundle.installCommand}`);
    window.setTimeout(() => setCopiedState('none'), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([bundle.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = bundle.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    onNotify?.(`Downloaded ${bundle.filename}`);
  };

  return (
    <section
      aria-label="Production Code Exporter"
      className="flex flex-col bg-[#18181c] text-[#f3f0f5] rounded-xl overflow-hidden border border-[#1b1b1f] shadow-md"
    >
      {/* Format Tabs Header */}
      <div className="flex items-center justify-between px-3 pt-2.5 bg-[#232329] border-b border-white/10 gap-2">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar" role="tablist" aria-label="Export Code Format">
          {FORMAT_TABS.map((tab) => {
            const isActive = activeFormat === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFormat(tab.id)}
                className={`px-3 py-1.5 rounded-t-lg font-mono text-xs whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#18181c] text-[#ffb4a7] font-semibold border-t-2 border-[#ff5a43]'
                    : 'text-[#dcd9de]/75 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="hidden sm:flex items-center gap-1.5 pb-1.5 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-[#3ed9e9]" aria-hidden="true" />
          <span className="font-mono text-[10px] text-[#88f3ff] uppercase tracking-wider">
            {verification.valid ? 'VERIFIED STANDALONE' : 'CHECK PARAMS'}
          </span>
        </div>
      </div>

      {/* Filename & Install Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-[#1f1f25] border-b border-white/10 text-xs font-mono">
        <span className="text-[#dcd9de]">
          File: <strong className="text-white">{bundle.filename}</strong>
        </span>
        <span className="text-[#88f3ff] truncate max-w-full">{bundle.installCommand}</span>
      </div>

      {/* Live Code Block */}
      <div className="relative p-4 bg-[#18181c] overflow-x-auto max-h-[380px] overflow-y-auto">
        <pre
          className="font-mono text-[12.5px] leading-relaxed text-[#e4e1e7] select-all"
          data-testid="exported-code-block"
        >
          <code>{bundle.code}</code>
        </pre>
      </div>

      {/* Dependency & Cleanup Metadata Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#232329] border-t border-white/10 font-mono text-[11px] text-[#dcd9de]">
        <div className="flex flex-wrap items-center gap-3">
          {bundle.dependencies.length === 0 ? (
            <span className="text-[#3ed9e9]">Zero External Runtime Dependencies</span>
          ) : (
            bundle.dependencies.map((dep) => (
              <span key={dep.name} className="text-[#88f3ff]">
                {dep.name} {dep.version}
              </span>
            ))
          )}
          <span aria-hidden="true" className="text-white/25">·</span>
          <span className="text-[#ffb4a7]">MIT Licensed</span>
        </div>
        <span className="text-[11px] text-[#dcd9de]/80">{bundle.cleanupNotes}</span>
      </div>

      {/* Action Buttons Footer */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-3.5 gap-2.5 bg-[#282830] border-t border-white/10">
        <button
          type="button"
          onClick={handleCopyCode}
          className="h-10 px-5 rounded-lg bg-[#ff5a43] hover:bg-[#e04832] text-white font-display font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:translate-y-0.5 cursor-pointer whitespace-nowrap"
        >
          {copiedState === 'code' ? (
            <>
              <Check className="w-4 h-4" aria-hidden="true" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" aria-hidden="true" />
              <span>Copy Component</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadFile}
            className="flex-1 sm:flex-none h-10 px-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-[#88f3ff]" aria-hidden="true" />
            <span>Download {bundle.filename}</span>
          </button>
          <button
            type="button"
            onClick={handleCopyNpm}
            className="flex-1 sm:flex-none h-10 px-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Terminal className="w-3.5 h-3.5 text-[#ffb4a7]" aria-hidden="true" />
            <span>{copiedState === 'npm' ? 'Copied Recipe!' : 'NPM Recipe'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
