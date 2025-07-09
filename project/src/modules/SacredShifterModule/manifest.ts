import { ModuleManifest } from './types';

export const manifest: ModuleManifest = {
  id: "com.metaphysical-os.modules.sacred-shifter",
  name: "Sacred Shifter",
  version: "3.0.0",
  description: "Advanced Consciousness Development Module with Universal Principles Integration",
  long_description: `Sacred Shifter is a comprehensive consciousness development module designed for the Metaphysical OS ecosystem. It provides advanced tools for spiritual growth, consciousness expansion, and personal transformation through the integration of universal principles and sacred wisdom.

Key features include:
- Core Values Explorer
- Purpose & Mission Clarifier
- Unblocking Practices
- Inner Wisdom Cultivator
- Advanced Dream Analysis
- Affirmation Generator
- Universal Principles Guide
- Daily Integration Tools
- Progress Tracking`,
  remoteEntryUrl: "", // Not used for direct import
  capabilities: [
    "consciousness-expansion",
    "spiritual-development", 
    "universal-principles",
    "energy-harmonization",
    "sacred-geometry",
    "dream-analysis",
    "freudian-analysis",
    "affirmation-generation",
    "meditation-guidance",
    "intuition-cultivation",
    "progress-tracking",
    "chakra-alignment",
    "vibrational-healing"
  ],
  exposedItems: {
    "SacredShifterComponent": "./components/SacredShifterComponent",
    "CoreValuesExplorer": "./components/CoreValuesExplorer",
    "PurposeClarifier": "./components/PurposeClarifier",
    "UnblockingPractices": "./components/UnblockingPractices",
    "IntuitionCultivator": "./components/IntuitionCultivator",
    "MindfulnessLibrary": "./components/MindfulnessLibrary",
    "DreamAnalysis": "./components/DreamAnalysis",
    "AffirmationGenerator": "./components/AffirmationGenerator",
    "InnerMentor": "./components/InnerMentor",
    "HermeticPrinciplesGuide": "./components/HermeticPrinciplesGuide",
    "DailyIntegration": "./components/DailyIntegration",
    "ProgressTracker": "./components/ProgressTracker",
    "GlobalEventHorizon": "./services/GlobalEventHorizon"
  },
  telosAlignment: {
    "consciousness:expansion": "primary",
    "spiritual:development": "primary",
    "personal:growth": 0.9,
    "universal:wisdom": 0.8,
    "inner:peace": 0.7,
    "authentic:living": 0.9,
    "unity:consciousness": 0.8
  },
  integrityScore: 0.98,
  resourceFootprintMB: 12.3,
  essenceLabels: [
    "spiritual:development",
    "consciousness:evolution",
    "divine:connection",
    "universal:wisdom",
    "energy:healing",
    "sacred:practice",
    "mystical:experience",
    "enlightenment:pathway"
  ],
  category: "spiritual-development",
  is_featured: true,
  is_verified: true,
  status: "published",
  screenshots: [
    "https://example.com/screenshots/sacred-shifter-1.jpg",
    "https://example.com/screenshots/sacred-shifter-2.jpg"
  ],
  demo_url: "",
  dependencies: {
    required: ["EventHorizon", "LabelProcessor"],
    optional: ["AkashicRecord", "QuantumField"]
  },
  universalPrinciples: [
    "mentalism",
    "correspondence", 
    "vibration",
    "polarity",
    "rhythm",
    "cause-effect",
    "gender"
  ]
};