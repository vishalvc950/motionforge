# Contributing to MotionForge

Thank you for contributing to MotionForge! Our architecture is designed so contributors can register new animations without modifying the Parameter Editor or Code Exporter UI.

## How to Register a New Animation

1. **Define Schema & Metadata (`src/registry/animations.ts`)**:
   - Add your animation ID to `AnimationId` in `src/registry/types.ts`.
   - Define its `schema` (sliders, select palettes, and `reducedMotion` toggle), `defaultConfig`, `presets`, `dependencies`, `performanceProfile`, `accessibilityNotes`, and `limitations` in `ANIMATION_REGISTRY`.

2. **Create the Interactive Stage (`src/components/animations/`)**:
   - Implement your stage component accepting `StageProps` (`config`, `isPlaying`, `explodeTrigger`, `resetTrigger`, `scrubProgress`).
   - Ensure all `requestAnimationFrame` loops and DOM listeners are cleaned up inside the `useEffect` return function.
   - Honor `prefers-reduced-motion: reduce` and `config.reducedMotion`.

3. **Add Standalone Code Exporters (`src/registry/exporters.ts`)**:
   - Add a builder function that interpolates the validated configuration values into a self-contained React component and Vanilla JS module.

4. **Verify with Unit Tests**:
   ```bash
   npx --yes tsx --test src/registry/registry.test.ts
   npm run build
   ```
