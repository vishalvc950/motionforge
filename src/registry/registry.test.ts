import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getAllAnimations,
  getAnimationById,
  filterAnimations,
  validateAndClampConfig,
  serializeConfigToQuery,
  parseConfigFromQuery,
  getAvailableCategories,
} from './animations';
import { generateExportBundle, verifyExportBundle } from './exporters';
import { AnimationId, ExportFormat } from './types';

test('registry exposes all eight required animations with complete metadata', () => {
  const all = getAllAnimations();
  assert.equal(all.length, 8);
  const ids = all.map((a) => a.id);
  assert.deepEqual(ids, [
    'paper-storm',
    'living-svg',
    'gravity-garden',
    'liquid-lens',
    'circular-carousel',
    'hold-button',
    'electric-logo',
    'tech-text',
  ]);

  for (const anim of all) {
    assert.ok(anim.name.length > 0);
    assert.ok(anim.summary.length > 0);
    assert.ok(anim.schema.length >= 5);
    assert.ok(anim.presets.length >= 3);
    assert.ok(anim.supportedExports.length === 4);
    assert.ok(anim.accessibilityNotes.length >= 2);
  }
});

test('validateAndClampConfig clamps out-of-range numbers and rejects invalid options', () => {
  const clamped = validateAndClampConfig('paper-storm', {
    fragments: 99999, // max is 360
    intensity: -5.0, // min is 0.2
    duration: 'invalid-number',
    palette: 'non-existent-palette',
    reducedMotion: 'true',
  });

  assert.equal(clamped.fragments, 360);
  assert.equal(clamped.intensity, 0.2);
  assert.equal(clamped.duration, 1.8); // falls back to default
  assert.equal(clamped.palette, 'origami-sunset'); // falls back to default
  assert.equal(clamped.reducedMotion, true);
});

test('presets load valid configurations for every animation', () => {
  for (const anim of getAllAnimations()) {
    for (const preset of anim.presets) {
      const validated = validateAndClampConfig(anim.id, preset.values);
      for (const [k, v] of Object.entries(preset.values)) {
        assert.equal(validated[k], v, `Preset ${preset.id} field ${k} should be valid`);
      }
    }
  }
});

test('filterAnimations filters by category, search query, and handles empty results', () => {
  const svgOnly = filterAnimations({ category: 'SVG & Crayon' });
  assert.equal(svgOnly.length, 2);
  assert.equal(svgOnly[0].id, 'living-svg');
  assert.equal(svgOnly[1].id, 'hold-button');

  const searchShader = filterAnimations({ searchQuery: 'refraction' });
  assert.equal(searchShader.length, 1);
  assert.equal(searchShader[0].id, 'liquid-lens');

  const searchCarousel = filterAnimations({ searchQuery: 'CircularCarousel' });
  assert.equal(searchCarousel.length, 1);
  assert.equal(searchCarousel[0].id, 'circular-carousel');

  const searchTechText = filterAnimations({ searchQuery: 'TechText' });
  assert.equal(searchTechText.length, 1);
  assert.equal(searchTechText[0].id, 'tech-text');

  const noMatch = filterAnimations({ searchQuery: 'nonexistent-quantum-blockchain-xyz' });
  assert.equal(noMatch.length, 0);

  const sortedBySize = filterAnimations({ sortBy: 'bundleSize' });
  assert.equal(sortedBySize[0].id, 'living-svg');
});

test('serializeConfigToQuery and parseConfigFromQuery round-trip accurately', () => {
  const customConfig = {
    particleCount: 420,
    behaviorMode: 'orbiting-stars',
    strength: 2.4,
    pointerRadius: 240,
    trailLength: 0.65,
    reducedMotion: true,
  };
  const query = serializeConfigToQuery('gravity-garden', customConfig);
  const parsed = parseConfigFromQuery(query);
  assert.equal(parsed.animationId, 'gravity-garden');
  assert.deepEqual(parsed.config, customConfig);
});

test('generateExportBundle and verifyExportBundle succeed for all animations and formats with custom parameters', () => {
  const formats: ExportFormat[] = ['react', 'vanilla', 'typescript', 'json'];
  const customConfigs: Record<AnimationId, Record<string, number | string | boolean>> = {
    'paper-storm': {
      fragments: 260,
      intensity: 2.3,
      duration: 2.7,
      radius: 210,
      chaos: 245,
      palette: 'blueprint-cyan',
      reducedMotion: false,
    },
    'living-svg': {
      duration: 2.9,
      staggerDelay: 0.28,
      strokeWidth: 4.5,
      fillOpacity: 0.75,
      roughness: 3.2,
      palette: 'cobalt-studio',
      reducedMotion: false,
    },
    'gravity-garden': {
      particleCount: 380,
      behaviorMode: 'magnetic-dust',
      strength: 2.1,
      pointerRadius: 230,
      trailLength: 0.55,
      reducedMotion: false,
    },
    'liquid-lens': {
      distortion: 1.25,
      radius: 195,
      dispersion: 0.85,
      recoverySpeed: 2.1,
      artworkPreset: 'bauhaus-geometry',
      reducedMotion: false,
    },
    'circular-carousel': {
      preset: 'orbit',
      cardWidth: 230,
      gap: 32,
      curve: 0.75,
      tilt: -12,
      speed: 22,
      depthFade: 0.65,
      captions: true,
      reducedMotion: false,
    },
    'hold-button': {
      fillDirection: 'up',
      holdTime: 2100,
      releaseTime: 260,
      waveAmplitude: 11,
      radius: 18,
      pressScale: 0.95,
      palette: 'violet-surge',
      glow: true,
      reducedMotion: false,
    },
    'electric-logo': {
      shapePreset: 'orbital-atom',
      strands: 5,
      intensity: 1.6,
      crackle: 2.1,
      bend: 0.85,
      speed: 3.25,
      palette: 'cyan-arc',
      reducedMotion: false,
    },
    'tech-text': {
      textPreset: 'REACT BITS',
      fontSize: 140,
      reach: 240,
      strokeWidth: 2.2,
      dashLength: 6,
      specks: 22,
      palette: 'coral-draft',
      guides: true,
      labels: true,
      reducedMotion: false,
    },
  };

  for (const anim of getAllAnimations()) {
    const custom = customConfigs[anim.id];
    for (const fmt of formats) {
      const verification = verifyExportBundle(anim.id, custom, fmt);
      assert.equal(
        verification.valid,
        true,
        `Export verification failed for ${anim.id} (${fmt}): ${verification.errors.join('; ')}`
      );
      const bundle = generateExportBundle(anim.id, custom, fmt);
      assert.ok(bundle.filename.length > 0);
      assert.ok(bundle.installCommand.length > 0);
    }
  }
});

test('getAvailableCategories only returns categories with content', () => {
  const categories = getAvailableCategories();
  assert.ok(categories.length === 5); // ALL + 4 populated categories
  for (const c of categories) {
    assert.ok(c.count > 0);
  }
});
