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
  frequency: 'daily' | 'weekly' | 'monthly' | 'once';
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

export interface Milestone {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  category: string;
  completed: boolean;
  completedAt?: Date;
}

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  data?: ProgressData;
}

export interface ProgressData {
  date: string;
  valuesReflections: number;
  purposeReflections: number;
  meditationMinutes: number;
  practicesCompleted: number;
  dreamsRecorded: number;
  insights: string[];
}