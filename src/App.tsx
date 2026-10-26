/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import Navbar, { AppRoute } from './components/layout/Navbar';
import HomeView from './views/HomeView';
import GalleryView from './views/GalleryView';
import PlaygroundView from './views/PlaygroundView';
import AnimationDetailView from './views/AnimationDetailView';
import DocsAndAboutView from './views/DocsAndAboutView';
import {
  getAnimationById,
  parseConfigFromQuery,
  validateAndClampConfig,
} from './registry/animations';
import { AnimationConfig, AnimationId } from './registry/types';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const initialParsed = parseConfigFromQuery(
    typeof window !== 'undefined' ? window.location.search : ''
  );

  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    if (typeof window === 'undefined') return 'home';
    const hash = window.location.hash.replace('#', '');
    if (
      hash === 'gallery' ||
      hash === 'playground' ||
      hash === 'detail' ||
      hash === 'docs' ||
      hash === 'about'
    ) {
      return hash;
    }
    if (window.location.search.includes('anim=')) {
      return 'playground';
    }
    return 'home';
  });

  const [activeAnimationId, setActiveAnimationId] = useState<AnimationId>(
    initialParsed.animationId
  );

  const [configsByAnim, setConfigsByAnim] = useState<
    Record<AnimationId, AnimationConfig>
  >(() => ({
    'paper-storm':
      initialParsed.animationId === 'paper-storm'
        ? initialParsed.config
        : getAnimationById('paper-storm').defaultConfig,
    'living-svg':
      initialParsed.animationId === 'living-svg'
        ? initialParsed.config
        : getAnimationById('living-svg').defaultConfig,
    'gravity-garden':
      initialParsed.animationId === 'gravity-garden'
        ? initialParsed.config
        : getAnimationById('gravity-garden').defaultConfig,
    'liquid-lens':
      initialParsed.animationId === 'liquid-lens'
        ? initialParsed.config
        : getAnimationById('liquid-lens').defaultConfig,
    'circular-carousel':
      initialParsed.animationId === 'circular-carousel'
        ? initialParsed.config
        : getAnimationById('circular-carousel').defaultConfig,
    'hold-button':
      initialParsed.animationId === 'hold-button'
        ? initialParsed.config
        : getAnimationById('hold-button').defaultConfig,
    'electric-logo':
      initialParsed.animationId === 'electric-logo'
        ? initialParsed.config
        : getAnimationById('electric-logo').defaultConfig,
    'tech-text':
      initialParsed.animationId === 'tech-text'
        ? initialParsed.config
        : getAnimationById('tech-text').defaultConfig,
  }));

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const t = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(t);
  }, [toastMessage]);

  useEffect(() => {
    const syncFromLocation = () => {
      const hash = window.location.hash.replace('#', '');
      if (
        hash === 'home' ||
        hash === 'gallery' ||
        hash === 'playground' ||
        hash === 'detail' ||
        hash === 'docs' ||
        hash === 'about'
      ) {
        setCurrentRoute(hash);
      }
      if (window.location.search.includes('anim=')) {
        const parsed = parseConfigFromQuery(window.location.search);
        setActiveAnimationId(parsed.animationId);
        setConfigsByAnim((prev) => ({
          ...prev,
          [parsed.animationId]: parsed.config,
        }));
      }
    };
    window.addEventListener('hashchange', syncFromLocation);
    window.addEventListener('popstate', syncFromLocation);
    return () => {
      window.removeEventListener('hashchange', syncFromLocation);
      window.removeEventListener('popstate', syncFromLocation);
    };
  }, []);

  const handleNavigate = (
    route: AppRoute,
    animId?: AnimationId | string,
    customConfig?: AnimationConfig
  ) => {
    if (
      animId &&
      (animId === 'paper-storm' ||
        animId === 'living-svg' ||
        animId === 'gravity-garden' ||
        animId === 'liquid-lens' ||
        animId === 'circular-carousel' ||
        animId === 'hold-button' ||
        animId === 'electric-logo' ||
        animId === 'tech-text')
    ) {
      setActiveAnimationId(animId);
      if (customConfig) {
        const validated = validateAndClampConfig(animId, customConfig);
        setConfigsByAnim((prev) => ({
          ...prev,
          [animId]: validated,
        }));
      }
    }
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      window.location.hash = route;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectAnimation = (
    id: AnimationId,
    presetConfig?: AnimationConfig
  ) => {
    setActiveAnimationId(id);
    if (presetConfig) {
      setConfigsByAnim((prev) => ({
        ...prev,
        [id]: validateAndClampConfig(id, presetConfig),
      }));
    }
  };

  const handleUpdateActiveConfig = (nextConfig: AnimationConfig) => {
    setConfigsByAnim((prev) => ({
      ...prev,
      [activeAnimationId]: validateAndClampConfig(activeAnimationId, nextConfig),
    }));
  };

  const activeConfig = configsByAnim[activeAnimationId];

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf8fe] text-[#1b1b1f] pb-16 md:pb-0">
      <Navbar currentRoute={currentRoute} onNavigate={handleNavigate} />

      <main className="flex-1 w-full">
        {currentRoute === 'home' && (
          <HomeView onNavigate={handleNavigate} onNotify={triggerToast} />
        )}

        {currentRoute === 'gallery' && (
          <GalleryView onNavigate={handleNavigate} />
        )}

        {currentRoute === 'playground' && (
          <PlaygroundView
            activeAnimationId={activeAnimationId}
            activeConfig={activeConfig}
            onSelectAnimation={handleSelectAnimation}
            onUpdateConfig={handleUpdateActiveConfig}
            onNavigate={handleNavigate}
            onNotify={triggerToast}
          />
        )}

        {currentRoute === 'detail' && (
          <AnimationDetailView
            animationId={activeAnimationId}
            config={activeConfig}
            onUpdateConfig={handleUpdateActiveConfig}
            onNavigate={handleNavigate}
            onNotify={triggerToast}
          />
        )}

        {(currentRoute === 'docs' || currentRoute === 'about') && (
          <DocsAndAboutView
            initialTab={currentRoute === 'about' ? 'about' : 'docs'}
            onNavigate={handleNavigate}
            onNotify={triggerToast}
          />
        )}
      </main>

      {/* Clean Studio Footer */}
      <footer className="border-t border-[#1b1b1f]/12 bg-[#f6f2f8] py-8 px-4 sm:px-8 mt-12">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#5a403c]">
          <div>
            <strong className="text-[#1b1b1f]">MotionForge</strong> — Open-Source Web
            Animation Laboratory · MIT License
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => handleNavigate('gallery')}
              className="hover:text-[#1b1b1f] cursor-pointer"
            >
              Gallery
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('playground')}
              className="hover:text-[#1b1b1f] cursor-pointer"
            >
              Playground
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('docs')}
              className="hover:text-[#1b1b1f] cursor-pointer"
            >
              Documentation
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('about')}
              className="hover:text-[#1b1b1f] cursor-pointer"
            >
              Contributing
            </button>
          </div>
        </div>
      </footer>

      {/* Tactile Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#18181c] text-[#f3f0f5] border border-white/15 shadow-xl font-mono text-xs flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-[#88f3ff] shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
