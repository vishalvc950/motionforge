import {
  AnimationCategory,
  AnimationConfig,
  AnimationId,
  AnimationMetadata,
} from './types';

export const ANIMATION_REGISTRY: Record<AnimationId, AnimationMetadata> = {
  'paper-storm': {
    id: 'paper-storm',
    indexNumber: '01',
    name: 'PaperStorm',
    subtitle: '3D Origami Deconstruction Engine',
    badge: 'HOT',
    category: 'WebGL / 3D',
    tags: ['THREE.JS', 'R3F', 'ORIGAMI MESH'],
    summary:
      'Faceted geometric paper origami simulation utilizing coordinated transform displacement. Dynamically shatters on pointer impulse before smoothly refolding into resting equilibrium.',
    description:
      'PaperStorm breaks an art-directed layered paper sculpture into calibrated triangular facets and reconstructs it using damped spring harmonics. Rather than running expensive independent rigid-body collisions per shard, it uses deterministic Voronoi-inspired facet centroids and coordinated 3D transforms for crisp 60fps performance.',
    interactionGuide: [
      'Move or drag pointer across the stage to apply directional radial impulse to nearby paper facets.',
      'Click EXPLODE to trigger a full-stage kinetic dispersal wave.',
      'Click ASSEMBLE to smoothly fold all shards back into their resting origami geometry.',
      'Scrub the timeline or adjust Rotation Chaos and Explosion Intensity in real time.',
    ],
    schema: [
      {
        key: 'fragments',
        label: 'FRAGMENT COUNT',
        description: 'Number of triangular paper facets in the active deconstruction cluster (clamped 40–360 for optimal frame pacing).',
        type: 'slider',
        defaultValue: 180,
        min: 40,
        max: 360,
        step: 10,
        unit: '',
      },
      {
        key: 'intensity',
        label: 'EXPLOSION INTENSITY',
        description: 'Radial velocity multiplier applied during impulse and explosion states.',
        type: 'slider',
        defaultValue: 1.4,
        min: 0.2,
        max: 3.0,
        step: 0.1,
        unit: 'x',
      },
      {
        key: 'duration',
        label: 'REASSEMBLY DURATION',
        description: 'Cycle duration in seconds for fragments to fold back into resting equilibrium.',
        type: 'slider',
        defaultValue: 1.8,
        min: 0.5,
        max: 5.0,
        step: 0.1,
        unit: 's',
      },
      {
        key: 'radius',
        label: 'INTERACTION RADIUS',
        description: 'Pointer force-field radius in CSS pixels for local facet repulsion.',
        type: 'slider',
        defaultValue: 140,
        min: 50,
        max: 300,
        step: 5,
        unit: 'px',
      },
      {
        key: 'chaos',
        label: 'ROTATION CHAOS',
        description: 'Maximum angular pitch/yaw/roll variance per facet during dispersal.',
        type: 'slider',
        defaultValue: 180,
        min: 0,
        max: 360,
        step: 5,
        unit: '°',
      },
      {
        key: 'palette',
        label: 'CHROMATIC THEME',
        description: 'Art-directed paper stock and rim-light pigment palette.',
        type: 'select',
        defaultValue: 'origami-sunset',
        options: [
          {
            label: 'Origami Sunset',
            value: 'origami-sunset',
            colors: ['#ff5a43', '#88f3ff', '#ffffff'],
          },
          {
            label: 'Blueprint Cyan',
            value: 'blueprint-cyan',
            colors: ['#006971', '#3ed9e9', '#e4e1e7'],
          },
          {
            label: 'Ink Mono',
            value: 'ink-monochrome',
            colors: ['#18181c', '#8f706b', '#ffffff'],
          },
        ],
      },
      {
        key: 'reducedMotion',
        label: 'Respect Reduced Motion',
        description: 'Replaces kinetic blast with a gentle opacity crossfade and minimal drift.',
        type: 'toggle',
        defaultValue: false,
      },
    ],
    defaultConfig: {
      fragments: 180,
      intensity: 1.4,
      duration: 1.8,
      radius: 140,
      chaos: 180,
      palette: 'origami-sunset',
      reducedMotion: false,
    },
    presets: [
      {
        id: 'subtle',
        name: 'Subtle',
        description: 'Gentle breathing creases with low angular chaos.',
        values: {
          fragments: 90,
          intensity: 0.6,
          duration: 1.2,
          radius: 80,
          chaos: 45,
          palette: 'origami-sunset',
          reducedMotion: false,
        },
      },
      {
        id: 'cinematic',
        name: 'Cinematic',
        description: 'Balanced studio calibration with crisp facet separation.',
        values: {
          fragments: 180,
          intensity: 1.4,
          duration: 1.8,
          radius: 140,
          chaos: 180,
          palette: 'origami-sunset',
          reducedMotion: false,
        },
      },
      {
        id: 'playful',
        name: 'Playful',
        description: 'Bouncy wide-radius pointer repulsion with cyan pigments.',
        values: {
          fragments: 240,
          intensity: 2.1,
          duration: 2.2,
          radius: 220,
          chaos: 270,
          palette: 'blueprint-cyan',
          reducedMotion: false,
        },
      },
      {
        id: 'extreme',
        name: 'Extreme Dispersal',
        description: 'Maximum 360-shard radial shatter and high angular spin.',
        values: {
          fragments: 360,
          intensity: 3.0,
          duration: 3.4,
          radius: 280,
          chaos: 360,
          palette: 'origami-sunset',
          reducedMotion: false,
        },
      },
    ],
    supportedExports: ['react', 'vanilla', 'typescript', 'json'],
    dependencies: [
      {
        name: 'three',
        version: '>= 0.150.0',
        reason: 'Instanced BufferGeometry and Lambert/Matcap facet shading in 3D exports.',
      },
      {
        name: '@react-three/fiber',
        version: '>= 8.0.0',
        reason: 'Declarative React scene graph and useFrame loop for R3F component export.',
        optional: true,
      },
    ],
    performanceProfile: {
      targetFps: 60,
      bundleSizeKb: 14.2,
      renderingEngine: 'Coordinated 3D Facet Projection / Instanced Mesh',
      complexityNote: 'O(N) deterministic spring-damper update per frame without O(N²) collision checks.',
      gpuAccelerated: true,
    },
    accessibilityNotes: [
      'Automatically honors prefers-reduced-motion media query or explicit reducedMotion prop.',
      'Replaces high-velocity shard explosions with calm opacity/scale breathing when reduced motion is active.',
      'Stage includes descriptive aria-label and keyboard-accessible transport controls.',
    ],
    limitations: [
      'Operates on pre-triangulated origami facet meshes rather than arbitrary unsegmented bitmaps.',
      'Fragment count is clamped at 360 to guarantee 60fps across mobile and integrated GPUs.',
    ],
    license: 'MIT',
    version: '2.4.0',
  },

  'living-svg': {
    id: 'living-svg',
    indexNumber: '02',
    name: 'LivingSVG',
    subtitle: 'Hand-Drawn Stroke Reveal & Crayon Fill',
    badge: 'ULTRA LIGHT',
    category: 'SVG & Crayon',
    tags: ['SVG PATHS', 'STAGGERED DRAW', 'CRAYON MASK'],
    summary:
      'Animates multi-path vector illustrations as though drawn by hand with staggered stroke-dashoffset sequencing, organic speed jitter, and layered paper fill reveal.',
    description:
      'LivingSVG sequences SVG <path>, <circle>, and <polyline> elements using normalized pathLength=1 calculations and tactile SVG displacement filters. It emulates physical pastel crayon grain and cut-paper layering without requiring external runtime dependencies.',
    interactionGuide: [
      'Click REPLAY or toggle LOOP to watch the staggered botanical & architectural illustration draw from scratch.',
      'Hover or drag across the illustration to subtly parallax the cut-paper backing layers.',
      'Adjust Stroke Duration, Stagger Delay, Stroke Width, and Fill Reveal opacity in the parameter editor.',
    ],
    schema: [
      {
        key: 'duration',
        label: 'STROKE DURATION',
        description: 'Time in seconds for each primary SVG path to complete its hand-drawn stroke.',
        type: 'slider',
        defaultValue: 1.6,
        min: 0.4,
        max: 4.5,
        step: 0.1,
        unit: 's',
      },
      {
        key: 'staggerDelay',
        label: 'STAGGER DELAY',
        description: 'Sequential delay in seconds between consecutive vector paths.',
        type: 'slider',
        defaultValue: 0.18,
        min: 0.0,
        max: 0.6,
        step: 0.02,
        unit: 's',
      },
      {
        key: 'strokeWidth',
        label: 'STROKE WIDTH',
        description: 'Base stroke thickness in SVG user units.',
        type: 'slider',
        defaultValue: 2.5,
        min: 1.0,
        max: 6.0,
        step: 0.5,
        unit: 'px',
      },
      {
        key: 'fillOpacity',
        label: 'PAPER FILL REVEAL',
        description: 'Target opacity of the layered cut-paper pigment fills after strokes complete.',
        type: 'slider',
        defaultValue: 0.85,
        min: 0.0,
        max: 1.0,
        step: 0.05,
        unit: '',
      },
      {
        key: 'roughness',
        label: 'CRAYON GRAIN',
        description: 'Amplitude of the SVG feTurbulence / feDisplacementMap hand-drawn edge texture.',
        type: 'slider',
        defaultValue: 1.8,
        min: 0.0,
        max: 5.0,
        step: 0.2,
        unit: 'px',
      },
      {
        key: 'palette',
        label: 'PIGMENT PALETTE',
        description: 'Primary stroke and cut-paper fill pigment combination.',
        type: 'select',
        defaultValue: 'botanical-crayon',
        options: [
          {
            label: 'Botanical Crayon',
            value: 'botanical-crayon',
            colors: ['#b52515', '#006971', '#ffc83b'],
          },
          {
            label: 'Cobalt Studio',
            value: 'cobalt-studio',
            colors: ['#5d48ca', '#3ed9e9', '#ff5a43'],
          },
          {
            label: 'Archival Charcoal',
            value: 'archival-charcoal',
            colors: ['#1b1b1f', '#5a403c', '#e2dacb'],
          },
        ],
      },
      {
        key: 'reducedMotion',
        label: 'Respect Reduced Motion',
        description: 'Displays completed illustration immediately with a gentle fade-in.',
        type: 'toggle',
        defaultValue: false,
      },
    ],
    defaultConfig: {
      duration: 1.6,
      staggerDelay: 0.18,
      strokeWidth: 2.5,
      fillOpacity: 0.85,
      roughness: 1.8,
      palette: 'botanical-crayon',
      reducedMotion: false,
    },
    presets: [
      {
        id: 'sketchbook',
        name: 'Sketchbook',
        description: 'Brisk pastel crayon strokes with warm paper fills.',
        values: {
          duration: 1.6,
          staggerDelay: 0.18,
          strokeWidth: 2.5,
          fillOpacity: 0.85,
          roughness: 1.8,
          palette: 'botanical-crayon',
          reducedMotion: false,
        },
      },
      {
        id: 'technical-pen',
        name: 'Technical Pen',
        description: 'Crisp zero-grain drafting lines with rapid stagger.',
        values: {
          duration: 1.1,
          staggerDelay: 0.1,
          strokeWidth: 1.5,
          fillOpacity: 0.35,
          roughness: 0.0,
          palette: 'archival-charcoal',
          reducedMotion: false,
        },
      },
      {
        id: 'bold-crayon',
        name: 'Bold Crayon',
        description: 'Heavy textured wax strokes with vivid cobalt and coral fills.',
        values: {
          duration: 2.4,
          staggerDelay: 0.26,
          strokeWidth: 4.5,
          fillOpacity: 0.95,
          roughness: 3.6,
          palette: 'cobalt-studio',
          reducedMotion: false,
        },
      },
    ],
    supportedExports: ['react', 'vanilla', 'typescript', 'json'],
    dependencies: [],
    performanceProfile: {
      targetFps: 60,
      bundleSizeKb: 3.8,
      renderingEngine: 'Native SVG pathLength + CSS/WAAPI Keyframes',
      complexityNote: 'Zero external dependencies; uses normalized pathLength="1" for exact dashoffset math.',
      gpuAccelerated: true,
    },
    accessibilityNotes: [
      'Uses semantic <svg role="img"> with <title> and <desc> elements.',
      'When prefers-reduced-motion or reducedMotion is enabled, paths render fully drawn without dashoffset motion.',
    ],
    limitations: [
      'Requires SVG elements that support stroke-dasharray (<path>, <line>, <polyline>, <circle>, <rect>).',
      'Font <text> outlines must be converted to <path> vectors in your design tool before export.',
    ],
    supportedStructures: [
      '<path d="..." /> with open or closed Bezier subpaths',
      '<circle />, <rect />, <line />, and <polyline /> primitives',
      'Grouped <g data-layer="fill"> elements for post-stroke paper fill reveals',
    ],
    license: 'MIT',
    version: '2.4.0',
  },

  'gravity-garden': {
    id: 'gravity-garden',
    indexNumber: '03',
    name: 'GravityGarden',
    subtitle: 'Art-Directed Particle & Flocking Ecosystem',
    badge: '120 FPS',
    category: 'Canvas 2D Particles',
    tags: ['CANVAS 2D', 'FLOCKING BOIDS', 'ECOSYSTEM'],
    summary:
      'Interactive particle ecosystem featuring art-directed presets: Floating Paper, Magnetic Dust, Orbiting Stars, and Organic Trails.',
    description:
      'GravityGarden uses a zero-allocation Canvas 2D typed-array particle solver with velocity fields, vortex attractors, and pointer interaction. Canvas 2D was deliberately chosen over WebGL here for its crisp 4kB footprint, instant context initialization, and native path/ribbon drawing for paper confetti and organic trails.',
    interactionGuide: [
      'Move your pointer across the canvas to attract or swirl particles depending on the active preset.',
      'Switch between Floating Paper, Magnetic Dust, Orbiting Stars, and Organic Trails presets.',
      'Adjust Particle Count, Movement Strength, and Trail Persistence in real time.',
    ],
    schema: [
      {
        key: 'particleCount',
        label: 'PARTICLE COUNT',
        description: 'Number of active bodies in the simulation (clamped 40–600 for smooth 60fps Canvas 2D rendering).',
        type: 'slider',
        defaultValue: 220,
        min: 40,
        max: 600,
        step: 20,
        unit: '',
      },
      {
        key: 'behaviorMode',
        label: 'BEHAVIOR PRESET',
        description: 'Kinematics and rendering style for the particle field.',
        type: 'select',
        defaultValue: 'floating-paper',
        options: [
          {
            label: 'Floating Paper',
            value: 'floating-paper',
            colors: ['#ff5a43', '#ffc83b', '#fbf8fe'],
          },
          {
            label: 'Magnetic Dust',
            value: 'magnetic-dust',
            colors: ['#3ed9e9', '#ffdad4', '#c8bfff'],
          },
          {
            label: 'Orbiting Stars',
            value: 'orbiting-stars',
            colors: ['#88f3ff', '#9281ff', '#ff5a43'],
          },
          {
            label: 'Organic Trails',
            value: 'organic-trails',
            colors: ['#2ecc71', '#3ed9e9', '#ffc83b'],
          },
        ],
      },
      {
        key: 'strength',
        label: 'MOVEMENT STRENGTH',
        description: 'Velocity field speed and pointer attractor force multiplier.',
        type: 'slider',
        defaultValue: 1.2,
        min: 0.2,
        max: 3.0,
        step: 0.1,
        unit: 'x',
      },
      {
        key: 'pointerRadius',
        label: 'POINTER ATTRACTOR RADIUS',
        description: 'Effective radius in pixels of the interactive cursor force well.',
        type: 'slider',
        defaultValue: 160,
        min: 60,
        max: 320,
        step: 10,
        unit: 'px',
      },
      {
        key: 'trailLength',
        label: 'TRAIL PERSISTENCE',
        description: 'Canvas motion-blur persistence (0 = crisp shapes, 0.9 = long silk ribbons).',
        type: 'slider',
        defaultValue: 0.25,
        min: 0.0,
        max: 0.85,
        step: 0.05,
        unit: '',
      },
      {
        key: 'reducedMotion',
        label: 'Respect Reduced Motion',
        description: 'Freezes high-frequency swarming into a calm static constellation.',
        type: 'toggle',
        defaultValue: false,
      },
    ],
    defaultConfig: {
      particleCount: 220,
      behaviorMode: 'floating-paper',
      strength: 1.2,
      pointerRadius: 160,
      trailLength: 0.25,
      reducedMotion: false,
    },
    presets: [
      {
        id: 'floating-paper',
        name: 'Floating Paper',
        description: 'Cut-paper rectangles drifting on warm studio thermals.',
        values: {
          particleCount: 160,
          behaviorMode: 'floating-paper',
          strength: 1.0,
          pointerRadius: 150,
          trailLength: 0.1,
          reducedMotion: false,
        },
      },
      {
        id: 'magnetic-dust',
        name: 'Magnetic Dust',
        description: 'Fine iron-filing particles snapping to pointer field lines.',
        values: {
          particleCount: 340,
          behaviorMode: 'magnetic-dust',
          strength: 1.6,
          pointerRadius: 200,
          trailLength: 0.25,
          reducedMotion: false,
        },
      },
      {
        id: 'orbiting-stars',
        name: 'Orbiting Stars',
        description: 'Harmonic keplerian orbital rings with tangential cursor boost.',
        values: {
          particleCount: 260,
          behaviorMode: 'orbiting-stars',
          strength: 1.3,
          pointerRadius: 180,
          trailLength: 0.45,
          reducedMotion: false,
        },
      },
      {
        id: 'organic-trails',
        name: 'Organic Trails',
        description: 'Flow-field ribbons leaving luminous calligraphic trails.',
        values: {
          particleCount: 180,
          behaviorMode: 'organic-trails',
          strength: 1.5,
          pointerRadius: 220,
          trailLength: 0.75,
          reducedMotion: false,
        },
      },
    ],
    supportedExports: ['react', 'vanilla', 'typescript', 'json'],
    dependencies: [],
    performanceProfile: {
      targetFps: 60,
      bundleSizeKb: 4.2,
      renderingEngine: 'HTML5 Canvas 2D with DPR Clamping (max 2x)',
      complexityNote: 'Uses pre-allocated particle structs and ResizeObserver with automatic unmount cleanup.',
      gpuAccelerated: true,
    },
    accessibilityNotes: [
      'Canvas includes aria-label and role="img" fallback description.',
      'Honors prefers-reduced-motion by rendering a serene stationary star/paper arrangement.',
    ],
    limitations: [
      'Uses Canvas 2D for broad compatibility and zero-dependency bundle size; for >10,000 particles, a WebGL transform-feedback shader is recommended instead.',
    ],
    license: 'MIT',
    version: '2.4.0',
  },

  'liquid-lens': {
    id: 'liquid-lens',
    indexNumber: '04',
    name: 'LiquidLens',
    subtitle: 'Pointer-Responsive UV Refraction & Chromatic Orb',
    badge: 'FRAGMENT',
    category: 'GLSL Shaders',
    tags: ['WEBGL', 'GLSL SHADER', 'UV REFRACTION'],
    summary:
      'Pointer-responsive optical lens distortion with RGB chromatic dispersion, meniscus ripple recovery, and automatic WebGL capability detection + fallback.',
    description:
      'LiquidLens distorts an editorial typographic & geometric poster composition underneath a fluid glass meniscus that tracks pointer velocity. Rather than claiming physically raytraced index-of-refraction through 3D volume, it computes a fast 2D radial UV displacement field with per-channel RGB offset in a WebGL fragment shader (with an automatic Canvas 2D lens fallback when WebGL is unavailable).',
    interactionGuide: [
      'Glide your pointer across the viewport to bend the editorial grid and typography through the liquid lens.',
      'Quickly flick the pointer to stretch the meniscus wake and observe elastic recovery.',
      'Customize Distortion Strength, Lens Radius, Chromatic Dispersion, and Recovery Speed.',
    ],
    schema: [
      {
        key: 'distortion',
        label: 'DISTORTION STRENGTH',
        description: 'Magnitude of the radial UV magnification and barrel refraction inside the lens.',
        type: 'slider',
        defaultValue: 0.65,
        min: 0.1,
        max: 1.5,
        step: 0.05,
        unit: 'x',
      },
      {
        key: 'radius',
        label: 'INTERACTION RADIUS',
        description: 'Radius of the refractive liquid meniscus in CSS pixels.',
        type: 'slider',
        defaultValue: 135,
        min: 60,
        max: 260,
        step: 5,
        unit: 'px',
      },
      {
        key: 'dispersion',
        label: 'CHROMATIC DISPERSION',
        description: 'RGB channel separation at the high-curvature rim of the lens.',
        type: 'slider',
        defaultValue: 0.45,
        min: 0.0,
        max: 1.0,
        step: 0.05,
        unit: '',
      },
      {
        key: 'recoverySpeed',
        label: 'RECOVERY DAMPING',
        description: 'Spring interpolation speed for the lens to settle toward the pointer target.',
        type: 'slider',
        defaultValue: 1.4,
        min: 0.4,
        max: 3.0,
        step: 0.1,
        unit: 's',
      },
      {
        key: 'artworkPreset',
        label: 'SOURCE ARTWORK',
        description: 'Procedural high-DPI specimen texture rendered beneath the refractive shader.',
        type: 'select',
        defaultValue: 'editorial-specimen',
        options: [
          {
            label: 'Editorial Specimen',
            value: 'editorial-specimen',
            colors: ['#fbf8fe', '#b52515', '#1b1b1f'],
          },
          {
            label: 'Bauhaus Geometry',
            value: 'bauhaus-geometry',
            colors: ['#ff5a43', '#006971', '#ffc83b'],
          },
          {
            label: 'Dark Blueprint',
            value: 'dark-blueprint',
            colors: ['#18181c', '#3ed9e9', '#9281ff'],
          },
        ],
      },
      {
        key: 'reducedMotion',
        label: 'Respect Reduced Motion',
        description: 'Disables velocity ripple oscillation and uses direct 1:1 calm magnifier.',
        type: 'toggle',
        defaultValue: false,
      },
    ],
    defaultConfig: {
      distortion: 0.65,
      radius: 135,
      dispersion: 0.45,
      recoverySpeed: 1.4,
      artworkPreset: 'editorial-specimen',
      reducedMotion: false,
    },
    presets: [
      {
        id: 'optical-glass',
        name: 'Optical Glass',
        description: 'Calibrated studio loupe with subtle rim dispersion.',
        values: {
          distortion: 0.65,
          radius: 135,
          dispersion: 0.45,
          recoverySpeed: 1.4,
          artworkPreset: 'editorial-specimen',
          reducedMotion: false,
        },
      },
      {
        id: 'heavy-prism',
        name: 'Heavy Prism',
        description: 'Wide high-dispersion chromatic meniscus over Bauhaus shapes.',
        values: {
          distortion: 1.15,
          radius: 190,
          dispersion: 0.9,
          recoverySpeed: 1.0,
          artworkPreset: 'bauhaus-geometry',
          reducedMotion: false,
        },
      },
      {
        id: 'blueprint-loupe',
        name: 'Blueprint Loupe',
        description: 'Precision low-aberration inspection lens over dark CAD grid.',
        values: {
          distortion: 0.5,
          radius: 115,
          dispersion: 0.15,
          recoverySpeed: 2.2,
          artworkPreset: 'dark-blueprint',
          reducedMotion: false,
        },
      },
    ],
    supportedExports: ['react', 'vanilla', 'typescript', 'json'],
    dependencies: [],
    performanceProfile: {
      targetFps: 60,
      bundleSizeKb: 5.4,
      renderingEngine: 'Raw WebGL Fragment Shader + Automatic Canvas 2D Fallback',
      complexityNote: 'Single full-screen quad draw call; automatically falls back to Canvas 2D magnifier if WebGL context creation fails.',
      gpuAccelerated: true,
    },
    accessibilityNotes: [
      'Includes automatic WebGL capability check (gl.getContext("webgl")) with graceful fallback notice.',
      'Honors prefers-reduced-motion by disabling elastic velocity wobble.',
    ],
    limitations: [
      'Implements 2D UV radial displacement and RGB channel offset rather than 3D volumetric raytracing.',
      'Operates on canvas/image textures rather than live interactive HTML DOM subtrees due to browser security restrictions on reading arbitrary DOM pixels in WebGL.',
    ],
    license: 'MIT',
    version: '2.4.0',
  },

  'circular-carousel': {
    id: 'circular-carousel',
    indexNumber: '05',
    name: 'CircularCarousel',
    subtitle: '3D Cylindrical & Orbital Card Ring (@react-bits)',
    badge: 'REACT BITS',
    category: 'WebGL / 3D',
    tags: ['REACT BITS', '3D PRESERVE-3D', 'SPRING INERTIA'],
    summary:
      'Cylindrical, orbital, wheel, and panoramic 3D card ring with sliced-tile curvature, pointer drag momentum, spring snapping, and reel digit counters.',
    description:
      'CircularCarousel (@react-bits/CircularCarousel-JS-CSS) projects a ring of cards in 3D CSS perspective space using 8-strip tile subdivision to bend flat DOM cards along a true cylindrical or panoramic arc. Includes spring-damped inertial dragging, horizontal wheel scrubbing, keyboard arrow navigation, and IntersectionObserver RAF sleep.',
    interactionGuide: [
      'Drag horizontally (or vertically in Wheel mode) to spin the 3D carousel ring with spring-damped momentum.',
      'Click any card in the ring to smoothly focus and snap that slide to the front camera axis.',
      'Switch between Cylinder, Orbit, Wheel, and Panorama 3D projection topologies in the parameter editor.',
      'Use Left/Right arrow keys when focused for accessible keyboard slide stepping.',
    ],
    schema: [
      {
        key: 'preset',
        label: '3D RING TOPOLOGY',
        description: 'Spatial arrangement of the ring: Cylinder, Orbit (billboarded), Wheel (X-axis), or inward Panorama.',
        type: 'select',
        defaultValue: 'cylinder',
        options: [
          {
            label: 'Cylinder Ring',
            value: 'cylinder',
            colors: ['#ff5a43', '#3ed9e9', '#ffc83b'],
          },
          {
            label: 'Billboard Orbit',
            value: 'orbit',
            colors: ['#3ed9e9', '#9281ff', '#ff5a43'],
          },
          {
            label: 'Vertical Wheel',
            value: 'wheel',
            colors: ['#ffc83b', '#ff5a43', '#2ecc71'],
          },
          {
            label: 'Inward Panorama',
            value: 'panorama',
            colors: ['#9281ff', '#3ed9e9', '#fbf8fe'],
          },
        ],
      },
      {
        key: 'cardWidth',
        label: 'CARD WIDTH',
        description: 'Base width of each slide in CSS pixels before automatic viewport fit-scaling.',
        type: 'slider',
        defaultValue: 210,
        min: 140,
        max: 320,
        step: 10,
        unit: 'px',
      },
      {
        key: 'gap',
        label: 'INTER-CARD GAP',
        description: 'Chord spacing in CSS pixels between adjacent cards around the 3D circumference.',
        type: 'slider',
        defaultValue: 24,
        min: 4,
        max: 64,
        step: 4,
        unit: 'px',
      },
      {
        key: 'curve',
        label: 'TILE CURVATURE',
        description: 'Cylindrical surface bending across the 8 vertical tile strips per card (0 = flat planes, 1 = full arc).',
        type: 'slider',
        defaultValue: 1.0,
        min: 0.0,
        max: 1.0,
        step: 0.05,
        unit: '',
      },
      {
        key: 'tilt',
        label: 'CAMERA PITCH TILT',
        description: 'Camera elevation tilt angle in degrees relative to the ring equator.',
        type: 'slider',
        defaultValue: -6,
        min: -25,
        max: 25,
        step: 1,
        unit: '°',
      },
      {
        key: 'speed',
        label: 'DRIFT ANGULAR SPEED',
        description: 'Continuous angular drift speed in degrees per second when autoplay is active.',
        type: 'slider',
        defaultValue: 16,
        min: 0,
        max: 48,
        step: 2,
        unit: '°/s',
      },
      {
        key: 'depthFade',
        label: 'DEPTH SHADE INTENSITY',
        description: 'Atmospheric darkening applied to cards facing away from the camera.',
        type: 'slider',
        defaultValue: 0.55,
        min: 0.0,
        max: 0.95,
        step: 0.05,
        unit: '',
      },
      {
        key: 'captions',
        label: 'Show Slide Captions & Reel Counter',
        description: 'Displays the active slide title, subtitle, and mechanical rolling digit counter.',
        type: 'toggle',
        defaultValue: true,
      },
      {
        key: 'reducedMotion',
        label: 'Respect Reduced Motion',
        description: 'Disables continuous drift, intro spin, and parallax tilt for vestibular comfort.',
        type: 'toggle',
        defaultValue: false,
      },
    ],
    defaultConfig: {
      preset: 'cylinder',
      cardWidth: 210,
      gap: 24,
      curve: 1.0,
      tilt: -6,
      speed: 16,
      depthFade: 0.55,
      captions: true,
      reducedMotion: false,
    },
    presets: [
      {
        id: 'cylinder-studio',
        name: 'Cylinder Studio',
        description: 'Curved 8-tile cylindrical drum with subtle negative camera pitch.',
        values: {
          preset: 'cylinder',
          cardWidth: 210,
          gap: 24,
          curve: 1.0,
          tilt: -6,
          speed: 16,
          depthFade: 0.55,
          captions: true,
          reducedMotion: false,
        },
      },
      {
        id: 'orbital-ring',
        name: 'Billboard Orbit',
        description: 'Wide-spread planetary orbit where cards counter-rotate to face the camera.',
        values: {
          preset: 'orbit',
          cardWidth: 190,
          gap: 32,
          curve: 0.0,
          tilt: -16,
          speed: 20,
          depthFade: 0.65,
          captions: true,
          reducedMotion: false,
        },
      },
      {
        id: 'vertical-wheel',
        name: 'Vertical Wheel',
        description: 'X-axis rotary reel with curved horizontal slats and zero tilt.',
        values: {
          preset: 'wheel',
          cardWidth: 220,
          gap: 20,
          curve: 0.65,
          tilt: 0,
          speed: 14,
          depthFade: 0.6,
          captions: true,
          reducedMotion: false,
        },
      },
      {
        id: 'inward-panorama',
        name: 'Inward Panorama',
        description: 'Immersive concave cyclorama viewed from the center of the ring.',
        values: {
          preset: 'panorama',
          cardWidth: 240,
          gap: 16,
          curve: 1.0,
          tilt: 0,
          speed: 12,
          depthFade: 0.35,
          captions: true,
          reducedMotion: false,
        },
      },
    ],
    supportedExports: ['react', 'vanilla', 'typescript', 'json'],
    dependencies: [],
    performanceProfile: {
      targetFps: 60,
      bundleSizeKb: 6.8,
      renderingEngine: 'CSS 3D preserve-3d Ring + Spring-Damped RAF Controller',
      complexityNote: 'Sleeps RAF loop automatically when idle, offscreen (IntersectionObserver), or tab-hidden.',
      gpuAccelerated: true,
    },
    accessibilityNotes: [
      'Includes role="region" aria-roledescription="carousel", per-slide aria-label, and aria-live="polite" slide announcements.',
      'Supports keyboard navigation (ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Home, End) and honors prefers-reduced-motion.',
    ],
    limitations: [
      'Uses 8-strip CSS 3D tile subdivision for cylindrical curvature; very high tile counts (>16 per card) can increase DOM compositing layers on low-end mobile devices.',
    ],
    license: 'MIT',
    version: '2.4.0',
  },

  'hold-button': {
    id: 'hold-button',
    indexNumber: '06',
    name: 'HoldButton',
    subtitle: 'Tactile Liquid-Crest Press & Hold Action (@react-bits)',
    badge: 'REACT BITS',
    category: 'SVG & Crayon',
    tags: ['REACT BITS', 'SVG WAVE MASK', 'POINTER CAPTURE'],
    summary:
      'Destructive or high-intent confirmation button with animated SVG wave-crest liquid fill, pointer drift cancellation, and keyboard Space/Enter hold support.',
    description:
      'HoldButton (@react-bits/HoldButton-JS-CSS) guards high-consequence actions behind a calibrated press-and-hold gesture. As the user holds the pointer or Space/Enter key, an SVG-masked sinusoidal wave crest sweeps across or upward through the button with dual-layer clipped label contrast and a completion pulse.',
    interactionGuide: [
      'Press and hold the primary button with your mouse, touch, or Space/Enter key until the liquid wave fill reaches 100%.',
      'Release early to observe the cubic-bezier spring-back recession and short-tap detection.',
      'Customize Fill Direction (Right vs. Up), Hold Duration, Wave Crest Amplitude, and Pigment Theme.',
    ],
    schema: [
      {
        key: 'fillDirection',
        label: 'WAVE FILL DIRECTION',
        description: 'Sweep axis of the liquid crest mask during a press-and-hold gesture.',
        type: 'select',
        defaultValue: 'right',
        options: [
          {
            label: 'Sweep Right',
            value: 'right',
            colors: ['#ff5a43', '#3ed9e9', '#ffffff'],
          },
          {
            label: 'Rising Tide (Up)',
            value: 'up',
            colors: ['#5227FF', '#3ed9e9', '#ffc83b'],
          },
        ],
      },
      {
        key: 'holdTime',
        label: 'HOLD DURATION',
        description: 'Required continuous press duration in milliseconds to trigger confirmation.',
        type: 'slider',
        defaultValue: 1600,
        min: 600,
        max: 3500,
        step: 100,
        unit: 'ms',
      },
      {
        key: 'releaseTime',
        label: 'RECESSION DURATION',
        description: 'Snap-back duration in milliseconds when the user releases early.',
        type: 'slider',
        defaultValue: 220,
        min: 100,
        max: 600,
        step: 20,
        unit: 'ms',
      },
      {
        key: 'waveAmplitude',
        label: 'WAVE CREST AMPLITUDE',
        description: 'Peak-to-trough height in CSS pixels of the sinusoidal SVG liquid mask.',
        type: 'slider',
        defaultValue: 7,
        min: 0,
        max: 16,
        step: 1,
        unit: 'px',
      },
      {
        key: 'radius',
        label: 'CORNER RADIUS',
        description: 'Border radius in CSS pixels applied to the button and its inset clip-path.',
        type: 'slider',
        defaultValue: 14,
        min: 4,
        max: 28,
        step: 2,
        unit: 'px',
      },
      {
        key: 'pressScale',
        label: 'PRESS SCALE COMPRESSION',
        description: 'Tactile scale factor applied while the pointer is actively holding the button.',
        type: 'slider',
        defaultValue: 0.96,
        min: 0.9,
        max: 1.0,
        step: 0.01,
        unit: 'x',
      },
      {
        key: 'palette',
        label: 'PIGMENT THEME',
        description: 'Button housing and liquid wave fill color pairing.',
        type: 'select',
        defaultValue: 'origami-coral',
        options: [
          {
            label: 'Origami Coral',
            value: 'origami-coral',
            colors: ['#27272e', '#ff5a43', '#ffffff'],
          },
          {
            label: 'Violet Surge',
            value: 'violet-surge',
            colors: ['#232030', '#5227FF', '#ffffff'],
          },
          {
            label: 'Blueprint Cyan',
            value: 'blueprint-cyan',
            colors: ['#1c282c', '#006971', '#88f3ff'],
          },
        ],
      },
      {
        key: 'glow',
        label: 'Enable Completion Pulse & Aura',
        description: 'Renders a radial color-mix glow during hold and a shockwave ring on completion.',
        type: 'toggle',
        defaultValue: true,
      },
      {
        key: 'reducedMotion',
        label: 'Respect Reduced Motion',
        description: 'Replaces wave crest movement and scale compression with a calm opacity crossfade.',
        type: 'toggle',
        defaultValue: false,
      },
    ],
    defaultConfig: {
      fillDirection: 'right',
      holdTime: 1600,
      releaseTime: 220,
      waveAmplitude: 7,
      radius: 14,
      pressScale: 0.96,
      palette: 'origami-coral',
      glow: true,
      reducedMotion: false,
    },
    presets: [
      {
        id: 'coral-deploy',
        name: 'Coral Deploy',
        description: 'Horizontal liquid sweep in Origami Coral with 1.6s confirmation.',
        values: {
          fillDirection: 'right',
          holdTime: 1600,
          releaseTime: 220,
          waveAmplitude: 7,
          radius: 14,
          pressScale: 0.96,
          palette: 'origami-coral',
          glow: true,
          reducedMotion: false,
        },
      },
      {
        id: 'violet-vessel',
        name: 'Rising Tide',
        description: 'Vertical upward liquid fill in deep electric violet.',
        values: {
          fillDirection: 'up',
          holdTime: 2000,
          releaseTime: 260,
          waveAmplitude: 10,
          radius: 18,
          pressScale: 0.95,
          palette: 'violet-surge',
          glow: true,
          reducedMotion: false,
        },
      },
      {
        id: 'rapid-cyan',
        name: 'Brisk Calibration',
        description: 'Snappy 900ms technical confirmation with crisp low-amplitude crest.',
        values: {
          fillDirection: 'right',
          holdTime: 900,
          releaseTime: 160,
          waveAmplitude: 4,
          radius: 8,
          pressScale: 0.98,
          palette: 'blueprint-cyan',
          glow: true,
          reducedMotion: false,
        },
      },
    ],
    supportedExports: ['react', 'vanilla', 'typescript', 'json'],
    dependencies: [],
    performanceProfile: {
      targetFps: 60,
      bundleSizeKb: 4.1,
      renderingEngine: 'CSS Custom Property --hb-p + SVG Data-URI Mask Crest',
      complexityNote: 'Zero external dependencies; runs RAF only while actively pressed or receding.',
      gpuAccelerated: true,
    },
    accessibilityNotes: [
      'Includes aria-describedby instructions and aria-live="polite" completion announcement.',
      'Full keyboard support via Space/Enter hold and Escape cancellation, plus @media (prefers-reduced-motion: reduce) CSS rules.',
    ],
    limitations: [
      'Requires pointer capture or keyboard focus; automatically cancels hold if window loses focus or pointer drifts outside hit padding.',
    ],
    license: 'MIT',
    version: '2.4.0',
  },

  'electric-logo': {
    id: 'electric-logo',
    indexNumber: '07',
    name: 'ElectricLogo',
    subtitle: 'Signed Distance Field Plasma Arc Shader (@react-bits)',
    badge: 'OGL SHADER',
    category: 'GLSL Shaders',
    tags: ['REACT BITS', 'OGL WEBGL2', 'SDF PLASMA'],
    summary:
      'Traces arbitrary vector/raster silhouettes into a Euclidean Distance Transform field and wraps them in multi-strand procedural plasma arcs.',
    description:
      'ElectricLogo (@react-bits/ElectricLogo-JS-CSS) rasterizes an input SVG or image emblem onto an offscreen canvas, computes an exact 2D Euclidean Distance Transform (EDT) and dual-radius Gaussian glow field, and uploads them into floating-point WebGL2 textures via OGL. The fragment shader advects up to 6 procedural electrical strands and spark arcs around the contour with interactive pointer heat attraction.',
    interactionGuide: [
      'Move your pointer near the emblem contour to attract high-heat plasma filaments and intensify corona bloom.',
      'Click anywhere on the stage to trigger a radial electromagnetic surge wave and arc burst.',
      'Switch between Lightning Bolt, Origami Prism, and Orbital Atom silhouettes or adjust Plasma Strands and Crackle.',
    ],
    schema: [
      {
        key: 'shapePreset',
        label: 'SILHOUETTE EMBLEM',
        description: 'Vector silhouette traced into a 2D Euclidean Signed Distance Field.',
        type: 'select',
        defaultValue: 'bolt',
        options: [
          {
            label: 'Lightning Bolt',
            value: 'bolt',
            colors: ['#ecc7ff', '#ad6dff', '#18181c'],
          },
          {
            label: 'Origami Prism',
            value: 'origami-prism',
            colors: ['#ffe5b4', '#ff5a43', '#18181c'],
          },
          {
            label: 'Orbital Atom',
            value: 'orbital-atom',
            colors: ['#b8f9ff', '#00d2eb', '#18181c'],
          },
        ],
      },
      {
        key: 'strands',
        label: 'PLASMA STRANDS',
        description: 'Number of concurrent electrical filaments orbiting the SDF contour (1–6).',
        type: 'slider',
        defaultValue: 4,
        min: 1,
        max: 6,
        step: 1,
        unit: '',
      },
      {
        key: 'intensity',
        label: 'EXPOSURE GAIN',
        description: 'HDR tone-mapped energy multiplier for filament core and corona bloom.',
        type: 'slider',
        defaultValue: 1.2,
        min: 0.4,
        max: 2.2,
        step: 0.1,
        unit: 'x',
      },
      {
        key: 'crackle',
        label: 'ARC CRACKLE JAG',
        description: 'High-frequency multi-octave Jacobian noise displacement along electrical arcs.',
        type: 'slider',
        defaultValue: 1.5,
        min: 0.3,
        max: 3.0,
        step: 0.1,
        unit: '',
      },
      {
        key: 'bend',
        label: 'FILAMENT SWAY REACH',
        description: 'How far plasma strands wander outward from the signed distance zero-contour.',
        type: 'slider',
        defaultValue: 0.65,
        min: 0.15,
        max: 1.2,
        step: 0.05,
        unit: '',
      },
      {
        key: 'speed',
        label: 'ADVECTION SPEED',
        description: 'Temporal evolution rate of the curl-warped electrical filaments.',
        type: 'slider',
        defaultValue: 2.5,
        min: 0.5,
        max: 4.5,
        step: 0.25,
        unit: 'x',
      },
      {
        key: 'palette',
        label: 'PLASMA SPECTRUM',
        description: 'Core filament and outer corona emission chromaticity.',
        type: 'select',
        defaultValue: 'violet-plasma',
        options: [
          {
            label: 'Violet Plasma',
            value: 'violet-plasma',
            colors: ['#ecc7ff', '#ad6dff', '#18181c'],
          },
          {
            label: 'Cyan Arc',
            value: 'cyan-arc',
            colors: ['#b8f9ff', '#00d2eb', '#18181c'],
          },
          {
            label: 'Solar Flare',
            value: 'solar-flare',
            colors: ['#ffe5b4', '#ff5a43', '#18181c'],
          },
        ],
      },
      {
        key: 'reducedMotion',
        label: 'Respect Reduced Motion',
        description: 'Eliminates high-frequency flicker and slows plasma drift to a calm corona.',
        type: 'toggle',
        defaultValue: false,
      },
    ],
    defaultConfig: {
      shapePreset: 'bolt',
      strands: 4,
      intensity: 1.2,
      crackle: 1.5,
      bend: 0.65,
      speed: 2.5,
      palette: 'violet-plasma',
      reducedMotion: false,
    },
    presets: [
      {
        id: 'tesla-violet',
        name: 'Tesla Violet',
        description: 'Classic 4-strand high-voltage violet corona around the lightning glyph.',
        values: {
          shapePreset: 'bolt',
          strands: 4,
          intensity: 1.2,
          crackle: 1.5,
          bend: 0.65,
          speed: 2.5,
          palette: 'violet-plasma',
          reducedMotion: false,
        },
      },
      {
        id: 'cyan-reactor',
        name: 'Cyan Reactor',
        description: 'Dense 6-strand blueprint cyan containment field on the Orbital Atom.',
        values: {
          shapePreset: 'orbital-atom',
          strands: 6,
          intensity: 1.5,
          crackle: 1.9,
          bend: 0.8,
          speed: 3.0,
          palette: 'cyan-arc',
          reducedMotion: false,
        },
      },
      {
        id: 'solar-prism',
        name: 'Solar Prism',
        description: 'Warm Origami Coral plasma filaments hugging the geometric diamond.',
        values: {
          shapePreset: 'origami-prism',
          strands: 3,
          intensity: 1.3,
          crackle: 1.1,
          bend: 0.45,
          speed: 1.75,
          palette: 'solar-flare',
          reducedMotion: false,
        },
      },
    ],
    supportedExports: ['react', 'vanilla', 'typescript', 'json'],
    dependencies: [
      {
        name: 'ogl',
        version: '>= 1.0.0',
        reason: 'Lightweight WebGL2 Renderer, Program, Mesh, Triangle, and float Texture pipeline.',
      },
    ],
    performanceProfile: {
      targetFps: 60,
      bundleSizeKb: 11.4,
      renderingEngine: 'OGL WebGL2 (#version 300 es) + CPU Euclidean Distance Transform',
      complexityNote: 'Computes 2D EDT once per logo change; renders single full-screen triangle per frame with 4M pixel budget cap.',
      gpuAccelerated: true,
    },
    accessibilityNotes: [
      'Automatically zeroes strobe flicker (uFlicker = 0) and reduces advection speed when prefers-reduced-motion or reducedMotion is active.',
      'Pauses WebGL rendering automatically via IntersectionObserver when scrolled out of view.',
    ],
    limitations: [
      'Requires WebGL2 context (R16F and RG16F floating-point textures) for the hardware SDF shader.',
    ],
    license: 'MIT',
    version: '2.4.0',
  },

  'tech-text': {
    id: 'tech-text',
    indexNumber: '08',
    name: 'TechText',
    subtitle: 'Interactive CAD Wireframe & Glyph Telemetry (@react-bits)',
    badge: 'TYPOGRAPHY',
    category: 'Canvas 2D Particles',
    tags: ['REACT BITS', 'CAD TYPOGRAPHY', 'SPRING GLYPHS'],
    summary:
      'kinetic typographic specimen that decomposes live font glyphs into draggable spring-physics sprites, dashed wireframe outlines, CAD dimension guides, and coordinate readouts.',
    description:
      'TechText (@react-bits/TechText-JS-CSS) measures individual character bounding boxes on an HTML5 Canvas 2D stage and pre-renders solid and dashed wireframe glyph sprites. As the pointer sweeps across the word, a soft radial proximity lens crossfades between solid ink and dashed CAD strokes, spawns orbital particle specks, draws typographic ascender/cap-height/x-height/baseline guides, and lets users drag and fling individual letters on damped springs.',
    interactionGuide: [
      'Hover across the letters to reveal dashed wireframe strokes, bounding-box selection frames, and floating pixel dimension labels.',
      'Click and drag any individual character to stretch it away from its kerning home and release to watch it spring back.',
      'Click a letter for an angular velocity kick, or enable Typography Guides to inspect cap-height, x-height, and baseline metrics.',
    ],
    schema: [
      {
        key: 'textPreset',
        label: 'SPECIMEN WORDMARK',
        description: 'Headline string decomposed into interactive spring-mounted glyph sprites.',
        type: 'select',
        defaultValue: 'MOTION FORGE',
        options: [
          {
            label: 'MOTION FORGE',
            value: 'MOTION FORGE',
            colors: ['#f3f0f5', '#3ed9e9', '#18181c'],
          },
          {
            label: 'REACT BITS',
            value: 'REACT BITS',
            colors: ['#fbf8fe', '#ff5a43', '#18181c'],
          },
          {
            label: 'KINETIC LAB',
            value: 'KINETIC LAB',
            colors: ['#f3f0f5', '#9281ff', '#18181c'],
          },
        ],
      },
      {
        key: 'fontSize',
        label: 'BASE FONT SIZE',
        description: 'Target typographic size in CSS pixels before responsive container fit-clamping.',
        type: 'slider',
        defaultValue: 130,
        min: 80,
        max: 180,
        step: 10,
        unit: 'px',
      },
      {
        key: 'reach',
        label: 'LENS INTERACTION REACH',
        description: 'Radius in CSS pixels of the pointer proximity field that reveals wireframe strokes.',
        type: 'slider',
        defaultValue: 200,
        min: 80,
        max: 320,
        step: 10,
        unit: 'px',
      },
      {
        key: 'strokeWidth',
        label: 'WIREFRAME STROKE WIDTH',
        description: 'Outline thickness in pixels of the dashed CAD glyph contours.',
        type: 'slider',
        defaultValue: 1.6,
        min: 1.0,
        max: 3.5,
        step: 0.2,
        unit: 'px',
      },
      {
        key: 'dashLength',
        label: 'CAD DASH LENGTH',
        description: 'Dash segment length in pixels for the wireframe glyph stroke.',
        type: 'slider',
        defaultValue: 4,
        min: 2,
        max: 12,
        step: 1,
        unit: 'px',
      },
      {
        key: 'specks',
        label: 'ORBITAL SPECK DENSITY',
        description: 'Number of ambient micro-particles orbiting active wireframe glyphs.',
        type: 'slider',
        defaultValue: 16,
        min: 0,
        max: 35,
        step: 1,
        unit: '',
      },
      {
        key: 'palette',
        label: 'CAD INK & ACCENT',
        description: 'Primary glyph fill and wireframe/telemetry accent color pairing.',
        type: 'select',
        defaultValue: 'cyan-cad',
        options: [
          {
            label: 'Cyan CAD',
            value: 'cyan-cad',
            colors: ['#f3f0f5', '#3ed9e9', '#18181c'],
          },
          {
            label: 'Coral Draft',
            value: 'coral-draft',
            colors: ['#fbf8fe', '#ff5a43', '#18181c'],
          },
          {
            label: 'Violet Spec',
            value: 'violet-spec',
            colors: ['#f3f0f5', '#9281ff', '#18181c'],
          },
        ],
      },
      {
        key: 'guides',
        label: 'Show Ascender / X-Height / Baseline Guides',
        description: 'Renders full-bleed typographic metric lines across the canvas.',
        type: 'toggle',
        defaultValue: true,
      },
      {
        key: 'labels',
        label: 'Show Glyph Coordinate Telemetry',
        description: 'Displays live W×H pixel dimensions and Δx,Δy spring displacement per letter.',
        type: 'toggle',
        defaultValue: true,
      },
      {
        key: 'reducedMotion',
        label: 'Respect Reduced Motion',
        description: 'Disables autonomous sweep wave, particle specks, and click-kick impulses.',
        type: 'toggle',
        defaultValue: false,
      },
    ],
    defaultConfig: {
      textPreset: 'MOTION FORGE',
      fontSize: 130,
      reach: 200,
      strokeWidth: 1.6,
      dashLength: 4,
      specks: 16,
      palette: 'cyan-cad',
      guides: true,
      labels: true,
      reducedMotion: false,
    },
    presets: [
      {
        id: 'cyan-cad-spec',
        name: 'Cyan CAD Spec',
        description: 'Precision blueprint wireframe with typographic metric lines and coordinate labels.',
        values: {
          textPreset: 'MOTION FORGE',
          fontSize: 130,
          reach: 200,
          strokeWidth: 1.6,
          dashLength: 4,
          specks: 16,
          palette: 'cyan-cad',
          guides: true,
          labels: true,
          reducedMotion: false,
        },
      },
      {
        id: 'coral-editorial',
        name: 'Coral Draft',
        description: 'Bold Origami Coral wireframe strokes on REACT BITS with wide pointer reach.',
        values: {
          textPreset: 'REACT BITS',
          fontSize: 140,
          reach: 250,
          strokeWidth: 2.2,
          dashLength: 6,
          specks: 22,
          palette: 'coral-draft',
          guides: true,
          labels: true,
          reducedMotion: false,
        },
      },
      {
        id: 'violet-minimal',
        name: 'Clean Wireframe',
        description: 'Minimalist KINETIC LAB specimen with fine dashed contours and guides hidden.',
        values: {
          textPreset: 'KINETIC LAB',
          fontSize: 130,
          reach: 180,
          strokeWidth: 1.4,
          dashLength: 3,
          specks: 8,
          palette: 'violet-spec',
          guides: false,
          labels: true,
          reducedMotion: false,
        },
      },
    ],
    supportedExports: ['react', 'vanilla', 'typescript', 'json'],
    dependencies: [],
    performanceProfile: {
      targetFps: 60,
      bundleSizeKb: 8.6,
      renderingEngine: 'HTML5 Canvas 2D Pre-Rendered Glyph Sprites + Spring Solver',
      complexityNote: 'Pre-rasterizes solid and wireframe glyph bitmaps on layout change; sleeps RAF automatically when springs settle.',
      gpuAccelerated: true,
    },
    accessibilityNotes: [
      'Exposes role="img" and aria-label={text} on the root element so screen readers read the wordmark naturally.',
      'Honors prefers-reduced-motion by disabling autonomous sweep pulses, intro waves, and particle specks.',
    ],
    limitations: [
      'Designed for single-line display headlines (1–24 characters) rather than multi-paragraph body copy.',
    ],
    license: 'MIT',
    version: '2.4.0',
  },
};

export const ANIMATION_LIST: AnimationMetadata[] = Object.values(ANIMATION_REGISTRY);

export function getAnimationById(id: string | undefined | null): AnimationMetadata {
  if (id && id in ANIMATION_REGISTRY) {
    return ANIMATION_REGISTRY[id as AnimationId];
  }
  return ANIMATION_REGISTRY['paper-storm'];
}

export function getAllAnimations(): AnimationMetadata[] {
  return ANIMATION_LIST;
}

export function getAvailableCategories(): { category: AnimationCategory | 'ALL'; count: number }[] {
  const counts: Record<string, number> = {
    ALL: ANIMATION_LIST.length,
  };
  for (const anim of ANIMATION_LIST) {
    counts[anim.category] = (counts[anim.category] || 0) + 1;
  }
  return [
    { category: 'ALL', count: ANIMATION_LIST.length },
    { category: 'WebGL / 3D', count: counts['WebGL / 3D'] || 0 },
    { category: 'SVG & Crayon', count: counts['SVG & Crayon'] || 0 },
    { category: 'Canvas 2D Particles', count: counts['Canvas 2D Particles'] || 0 },
    { category: 'GLSL Shaders', count: counts['GLSL Shaders'] || 0 },
  ].filter((item) => item.count > 0);
}

export interface FilterOptions {
  category?: AnimationCategory | 'ALL';
  searchQuery?: string;
  exportFormat?: string;
  sortBy?: 'index' | 'bundleSize' | 'fps';
}

export function filterAnimations(options: FilterOptions): AnimationMetadata[] {
  const { category = 'ALL', searchQuery = '', exportFormat = 'ALL', sortBy = 'index' } = options;
  const q = searchQuery.trim().toLowerCase();

  const filtered = ANIMATION_LIST.filter((anim) => {
    if (category !== 'ALL' && anim.category !== category) {
      return false;
    }
    if (exportFormat !== 'ALL' && !anim.supportedExports.includes(exportFormat as any)) {
      return false;
    }
    if (!q) return true;
    const haystack = [
      anim.name,
      anim.subtitle,
      anim.category,
      anim.summary,
      anim.description,
      ...anim.tags,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });

  return [...filtered].sort((a, b) => {
    if (sortBy === 'bundleSize') {
      return a.performanceProfile.bundleSizeKb - b.performanceProfile.bundleSizeKb;
    }
    if (sortBy === 'fps') {
      return b.performanceProfile.targetFps - a.performanceProfile.targetFps;
    }
    return a.indexNumber.localeCompare(b.indexNumber);
  });
}

/**
 * Validates and clamps a partial or untrusted configuration object against the animation's schema.
 * Rejects NaN, out-of-bounds numbers, unknown enum options, and non-boolean toggles.
 */
export function validateAndClampConfig(
  animationId: AnimationId,
  rawConfig?: Record<string, unknown> | null
): AnimationConfig {
  const meta = getAnimationById(animationId);
  const validated: AnimationConfig = { ...meta.defaultConfig };

  if (!rawConfig || typeof rawConfig !== 'object') {
    return validated;
  }

  for (const field of meta.schema) {
    const incoming = rawConfig[field.key];
    if (incoming === undefined || incoming === null) continue;

    if (field.type === 'slider') {
      const num = typeof incoming === 'number' ? incoming : Number(incoming);
      if (Number.isFinite(num)) {
        const min = field.min ?? -Infinity;
        const max = field.max ?? Infinity;
        const clamped = Math.min(max, Math.max(min, num));
        // Round to step precision if step is provided
        if (field.step && field.step < 1) {
          validated[field.key] = Number(clamped.toFixed(2));
        } else if (field.step && field.step >= 1) {
          validated[field.key] = Math.round(clamped);
        } else {
          validated[field.key] = clamped;
        }
      }
    } else if (field.type === 'select') {
      const str = String(incoming);
      const validValues = field.options?.map((o) => o.value) ?? [];
      if (validValues.includes(str)) {
        validated[field.key] = str;
      }
    } else if (field.type === 'toggle') {
      if (typeof incoming === 'boolean') {
        validated[field.key] = incoming;
      } else if (incoming === 'true' || incoming === '1') {
        validated[field.key] = true;
      } else if (incoming === 'false' || incoming === '0') {
        validated[field.key] = false;
      }
    } else if (field.type === 'color') {
      const str = String(incoming);
      if (/^#[0-9a-fA-F]{3,8}$/.test(str)) {
        validated[field.key] = str;
      }
    }
  }

  return validated;
}

/**
 * Serializes an animation ID and its validated configuration to a clean query string.
 */
export function serializeConfigToQuery(
  animationId: AnimationId,
  config: AnimationConfig
): string {
  const validated = validateAndClampConfig(animationId, config);
  const params = new URLSearchParams();
  params.set('anim', animationId);
  for (const [key, value] of Object.entries(validated)) {
    params.set(key, String(value));
  }
  return params.toString();
}

/**
 * Parses a URL query string into a validated animationId and configuration object.
 */
export function parseConfigFromQuery(search: string): {
  animationId: AnimationId;
  config: AnimationConfig;
} {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const rawAnim = params.get('anim');
  const animationId: AnimationId =
    rawAnim && rawAnim in ANIMATION_REGISTRY
      ? (rawAnim as AnimationId)
      : 'paper-storm';

  const rawValues: Record<string, unknown> = {};
  params.forEach((val, key) => {
    if (key !== 'anim') {
      rawValues[key] = val;
    }
  });

  return {
    animationId,
    config: validateAndClampConfig(animationId, rawValues),
  };
}
