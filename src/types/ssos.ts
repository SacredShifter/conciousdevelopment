@@ .. @@
 export interface BiofeedbackData {
   stressLevel: number; // 0-100, where 0 is completely calm and 100 is maximum stress
   heartRate: number; // BPM, typically 60-100 for resting adult
-  heartRateVariability: number; // 0-100, higher = better coherence
+  heartRateVariability?: number; // 0-100, higher = better coherence
   brainwaveState: 'gamma' | 'beta' | 'alpha' | 'theta' | 'delta';
   coherenceScore: number; // 0-1, overall harmony between heart, mind, emotions
   timestamp: Date;
@@ .. @@
   date: Date;
   category: 'purpose' | 'mission' | 'vision' | 'legacy';
 }
+
+export interface Milestone {
+  id: string;
+  title: string;
+  description: string;
+  target: number;
+  current: number;
+  category: string;
+  completed: boolean;
+}