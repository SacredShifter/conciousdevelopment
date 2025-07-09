// Module Registry for Sacred Shifter
import { IModule } from '../types/ssos';
import { SacredShifterModule } from './SacredShifterModule';
import { GlobalEventHorizon } from './SacredShifterModule/services/GlobalEventHorizon';

// Create a shared event horizon for all modules
const sharedEventHorizon = new GlobalEventHorizon();

// Create module instances
const sacredShifterModule = new SacredShifterModule(sharedEventHorizon);

// Module registry
const modules: Record<string, IModule> = {
  'sacred-shifter': sacredShifterModule,
};

// Module Manager
export class ModuleManager {
  static async initialize(moduleId?: string): Promise<void> {
    if (moduleId) {
      // Initialize a specific module
      const module = modules[moduleId];
      if (module) {
        await module.initialize();
      } else {
        console.error(`Module ${moduleId} not found`);
      }
    } else {
      // Initialize all modules
      for (const id in modules) {
        await modules[id].initialize();
      }
    }
  }

  static async activateModule(moduleId: string): Promise<void> {
    const module = modules[moduleId];
    if (module) {
      await module.activate();
    } else {
      console.error(`Module ${moduleId} not found`);
    }
  }

  static async deactivateModule(moduleId: string): Promise<void> {
    const module = modules[moduleId];
    if (module) {
      await module.deactivate();
    } else {
      console.error(`Module ${moduleId} not found`);
    }
  }

  static getModule(moduleId: string): IModule | null {
    return modules[moduleId] || null;
  }

  static getAllModules(): Record<string, IModule> {
    return { ...modules };
  }
}

// Export individual modules
export { sacredShifterModule };