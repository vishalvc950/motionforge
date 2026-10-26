import React from 'react';
import { FlaskConical, Grid, Sliders, Terminal, BookOpen } from 'lucide-react';

export type AppRoute = 'home' | 'gallery' | 'playground' | 'detail' | 'docs' | 'about';

export interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute, animId?: string) => void;
}

export default function Navbar({ currentRoute, onNavigate }: NavbarProps) {
  const navItems: { id: AppRoute; label: string }[] = [
    { id: 'home', label: 'Lab Hero' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'playground', label: 'Playground' },
    { id: 'docs', label: 'Documentation' },
    { id: 'about', label: 'Contributing' },
  ];

  return (
    <>
      {/* Top Bar following strict 3-zone contract */}
      <header className="sticky top-0 w-full z-40 bg-[#18181c]/95 text-[#f3f0f5] border-b border-white/10">
        <div className="max-w-[1440px] mx-auto h-15 px-4 sm:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
            className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#ff5a43]"
          >
            MotionForge
          </a>

          {/* Zone 2: Concise single-line navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium"
          >
            {navItems.map((item) => {
              const isActive =
                currentRoute === item.id ||
                (item.id === 'gallery' && currentRoute === 'detail');
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.id);
                  }}
                  className={`whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 ${
                    isActive
                      ? 'text-white border-[#ff5a43] font-semibold'
                      : 'text-[#dcd9de]/80 border-transparent hover:text-white hover:border-white/40'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Single primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('playground')}
              className="px-4 py-2 rounded bg-[#ff5a43] hover:bg-[#e04832] text-white font-mono text-xs font-semibold tracking-wider uppercase transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Open Workbench
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Navigation (< 768px) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fbf8fe]/95 border-t border-[#1b1b1f]/15 h-15 px-2 flex items-center justify-around"
      >
        <button
          type="button"
          onClick={() => onNavigate('home')}
          aria-current={currentRoute === 'home' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[60px] min-h-[44px] gap-0.5 cursor-pointer ${
            currentRoute === 'home' ? 'text-[#b52515] font-semibold' : 'text-[#5a403c]'
          }`}
        >
          <FlaskConical className="w-5 h-5" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-wider">Lab Hero</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('gallery')}
          aria-current={
            currentRoute === 'gallery' || currentRoute === 'detail' ? 'page' : undefined
          }
          className={`flex flex-col items-center justify-center min-w-[60px] min-h-[44px] gap-0.5 cursor-pointer ${
            currentRoute === 'gallery' || currentRoute === 'detail'
              ? 'text-[#b52515] font-semibold'
              : 'text-[#5a403c]'
          }`}
        >
          <Grid className="w-5 h-5" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-wider">Gallery</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('playground')}
          aria-current={currentRoute === 'playground' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[60px] min-h-[44px] gap-0.5 cursor-pointer ${
            currentRoute === 'playground' ? 'text-[#b52515] font-semibold' : 'text-[#5a403c]'
          }`}
        >
          <Sliders className="w-5 h-5" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-wider">Playground</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('docs')}
          aria-current={
            currentRoute === 'docs' || currentRoute === 'about' ? 'page' : undefined
          }
          className={`flex flex-col items-center justify-center min-w-[60px] min-h-[44px] gap-0.5 cursor-pointer ${
            currentRoute === 'docs' || currentRoute === 'about'
              ? 'text-[#b52515] font-semibold'
              : 'text-[#5a403c]'
          }`}
        >
          <Terminal className="w-5 h-5" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-wider">Code & Docs</span>
        </button>
      </nav>
    </>
  );
}
