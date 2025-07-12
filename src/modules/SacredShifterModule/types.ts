// Re-export the existing types from the main app
export interface ModuleManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  long_description?: string;
  remoteEntryUrl: string;
  capabilities: string[];
  exposedItems: Record<string, string>;
  telosAlignment: Record<string, number | string>;
  integrityScore: number;
  resourceFootprintMB: number;
  essenceLabels: string[];
  category: string;
  is_featured: boolean;
  is_verified: boolean;
  status: string;
  screenshots: string[];
  demo_url: string;
  dependencies?: {
    required: string[];
    optional: string[];
  };
  universalPrinciples?: string[];
}

export interface IModule {
  getManifest(): ModuleManifest;
  initialize(): Promise<void>;
  activate(): Promise<void>;
  deactivate(): Promise<void>;
  destroy(): Promise<void>;
  ping(): boolean;
  getExposedItems(): Record<string, any>;
}

export interface GESemanticEvent {
  type: string;
  data: any;
  essenceLabels: string[];
  timestamp?: Date;
  sourceModule?: string;
}

// Re-export all the types used by the module components
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
  manifestContent?: string;
  latentContent?: string;
  associations?: Record<string, string[]>;
  dreamWorkMechanisms?: {
    condensation?: string[];
    displacement?: string[];
    symbolization?: string[];
    secondaryRevision?: string;
  };
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

export interface PersonalizedAffirmation {
  id: string;
  text: string;
  category: 'values' | 'purpose' | 'blocks' | 'general';
  personalizedFor: string[];
  createdAt: Date;
  favorited: boolean;
  usageCount: number;
}

export interface BiofeedbackData {
  stressLevel: number;
  heartRate: number;
  heartRateVariability: number;
  brainwaveState: 'gamma' | 'beta' | 'alpha' | 'theta' | 'delta';
  coherenceScore: number;
  timestamp: Date;
  trends: {
    stressLevel: 'rising' | 'falling' | 'stable';
    heartRate: 'rising' | 'falling' | 'stable';
    coherence: 'improving' | 'declining' | 'stable';
  };
}