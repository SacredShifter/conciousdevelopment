export interface ModuleManifest {
  name: string;
  version: string;
  capabilities: string[];
  essenceLabels: string[];
  telosAlignment: string[];
  resourceFootprintMB: number;
  integrityScore: number;
}

export interface IModule {
  manifest: ModuleManifest;
  initialize(): Promise<void>;
  activate(): Promise<void>;
  deactivate(): Promise<void>;
  destroy(): Promise<void>;
  getExposedItems(): Record<string, any>;
}

export interface CoreValue {
  id: string;
  name: string;
  description: string;
  importance: number;
  manifestations: string[];
  createdAt: Date;
  lastReflected: Date;
}

export interface PurposeReflection {
  id: string;
  prompt: string;
  response: string;
  insights: string[];
  date: Date;
  category: 'purpose' | 'mission' | 'vision' | 'legacy';
}

export interface UnblockingPractice {
  id: string;
  name: string;
  type: 'meditation' | 'breathwork' | 'affirmation' | 'visualization' | 'journaling';
  duration: number;
  description: string;
  instructions: string[];
  benefits: string[];
  blocks: string[];
}

export interface MeditationSession {
  id: string;
  type: string;
  duration: number;
  date: Date;
  mood: 'calm' | 'anxious' | 'focused' | 'scattered' | 'peaceful' | 'restless';
  insights: string;
  quality: number;
}

export interface DreamEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
  symbols: string[];
  emotions: string[];
  interpretation: string;
  themes: string[];
}

export interface DailyPractice {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  completed: boolean;
  streak: number;
  lastCompleted: Date;
}