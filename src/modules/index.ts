import { IModule } from '../types/ssos';
import { SacredShifterModule } from './SacredShifterModule';
import { GlobalEventHorizon } from './SacredShifterModule/services/GlobalEventHorizon';

// Create shared event horizon
const sharedEventHorizon = new GlobalEventHorizon();

// Create module instances with the shared event horizon
const sacredShifterModule = new SacredShifterModule(sharedEventHorizon);

// Module registry for easy access
const modules: Record<string, IModule> = {
  'sacred-shifter': sacredShifterModule,
};

// Export ModuleManager for SSOS integration
export class ModuleManager {
  // Get a module by name
  static getModule(id: string): IModule | null {
    return modules[id] || null;
  }

  // Initialize all modules or a specific one
  static async initialize(moduleId?: string): Promise<void> {
    if (moduleId) {
      const module = modules[moduleId];
      if (module) {
        await module.initialize();
      } else {
        console.error(`Module ${moduleId} not found`);
      }
    } else {
      // Initialize all modules in parallel
      await Promise.all(Object.values(modules).map(module => module.initialize()));
    }
  }

  // Activate a specific module
  static async activate(moduleId: string): Promise<void> {
    const module = modules[moduleId];
    if (module) {
      await module.activate();
    } else {
      console.error(`Module ${moduleId} not found`);
    }
  }

  // Deactivate a specific module
  static async deactivate(moduleId: string): Promise<void> {
    const module = modules[moduleId];
    if (module) {
      await module.deactivate();
    } else {
      console.error(`Module ${moduleId} not found`);
    }
  }

  // Get all modules
  static getAllModules(): Record<string, IModule> {
    return { ...modules };
  }

  // Register a new module
  static register(moduleId: string, module: IModule): void {
    modules[moduleId] = module;
  }

  // Check if a module is active using its ping method
  static isActive(moduleId: string): boolean {
    const module = modules[moduleId];
    return module ? module.ping?.() ?? false : false;
  }
}

// Export the instances for direct access
export { sacredShifterModule };
export { sharedEventHorizon };