export interface ModuleManifest {
  name: string;
  version: string;
  capabilities: string[];
  essenceLabels: string[];
  telosAlignment: string[];
  resourceFootprintMB: number;
  integrityScore: number;
  dependencies?: string[];
  universalPrinciples?: string[];
}

export interface IModule {
  manifest: ModuleManifest;
  initialize(): Promise<void>;
  activate(): Promise<void>;
  deactivate(): Promise<void>;
  destroy(): Promise<void>;
  getExposedItems(): Record<string, any>;
}

export interface GESemanticEvent {
  type: string;
  data: any;
  essenceLabels: string[];
  timestamp?: Date;
  sourceModule?: string;
}

export interface GlobalEventHorizon {
  emit(event: GESemanticEvent): void;
  subscribe(eventType: string, handler: (event: GESemanticEvent) => void): void;
  unsubscribe(eventType: string, handler: (event: GESemanticEvent) => void): void;
}

export interface BiofeedbackData {
  stressLevel: number; // 0-100, where 0 is completely calm and 100 is maximum stress
  heartRate: number; // BPM, typically 60-100 for resting adult
  heartRateVariability: number; // 0-100, higher = better coherence
  brainwaveState: 'gamma' | 'beta' | 'alpha' | 'theta' | 'delta';
  coherenceScore: number; // 0-1, overall harmony between heart, mind, emotions
  timestamp: Date;
  trends: {
    stressLevel: 'rising' | 'falling' | 'stable';
    heartRate: 'rising' | 'falling' | 'stable';
    coherence: 'improving' | 'declining' | 'stable';
  };
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

export interface SpiritualState {
  currentPrinciple: string;
  energyLevel: number;
  chakraAlignment: string;
  meditationDepth: number;
  consciousnessLevel: string;
}