import { SacredShifterModule } from './SacredShifterModule';
import { manifest } from './manifest';

// Create and export an instance with the manifest
export default new SacredShifterModule(manifest);

// Export components and other utilities for direct access
export * from './components';
export * from './services';
export * from './types';

// Export the module class for manual instantiation if needed
export { SacredShifterModule };
export { manifest as sacredShifterManifest };