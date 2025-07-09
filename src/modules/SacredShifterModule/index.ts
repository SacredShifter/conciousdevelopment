// Re-export module components and services for easier imports
export { SacredShifterModule } from './SacredShifterModule';
export { SacredShifterComponent } from './components/SacredShifterComponent';
export * from './components';
export * from './services';
export * from './types/ssos';

// Default export of the module
import { SacredShifterModule } from '../SacredShifterModule';
export default new SacredShifterModule();