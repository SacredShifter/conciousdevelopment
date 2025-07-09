import React, { useState, useEffect } from 'react';
import { Moon, Plus, Search, Tag, Calendar, BookOpen, TrendingUp, Brain, Eye, AlertTriangle, Lightbulb, Microscope, Zap, Heart, Clock } from 'lucide-react';
import type { DreamEntry } from '../types/ssos';

const dreamSymbols = {
  water: 'Emotions, subconscious, purification, flow of life',
  flying: 'Freedom, transcendence, rising above limitations',
  animals: 'Instincts, natural wisdom, aspects of personality',
  death: 'Transformation, endings leading to new beginnings',
  house: 'Self, psyche, different aspects of personality',
  car: 'Life direction, personal drive, control over destiny',
  fire: 'Passion, transformation, destruction and renewal',
  snake: 'Healing, transformation, hidden knowledge',
  baby: 'New beginnings, innocence, potential, creativity',
  darkness: 'Unknown, unconscious, fear, mystery',
  light: 'Consciousness, enlightenment, divine guidance',
  mirror: 'Self-reflection, truth, inner vision',
  bridge: 'Transition, connection, overcoming obstacles',
  tree: 'Growth, strength, connection to nature',
  ocean: 'Vast unconscious, deep emotions, life source'
};

const neuroscienceInsights = {
  memoryConsolidation: {
    title: "Memory Consolidation During REM Sleep",
    description: "Modern neuroscience shows that dreams play a crucial role in transferring memories from hippocampus to neocortex, strengthening important memories while discarding irrelevant information.",
    implications: "Recurring dream themes may reflect significant life experiences your brain is working to integrate and understand."
  },
  emotionalProcessing: {
    title: "Emotional Regulation Through Dreams",
    description: "The amygdala is highly active during REM sleep, helping process emotional experiences and reducing their emotional intensity through dream scenarios.",
    implications: "Intense or anxiety-provoking dreams often indicate your brain is working through emotional challenges and stress."
  },
  problemSolving: {
    title: "Creative Problem-Solving",
    description: "The prefrontal cortex's reduced activity during dreams allows for novel connections between disparate memories and concepts.",
    implications: "Dreams featuring creative solutions or unexpected scenarios may offer genuine insights into waking life challenges."
  },
  neuroplasticity: {
    title: "Brain Plasticity and Learning",
    description: "Dreams help reorganize neural pathways and strengthen synaptic connections related to recent learning and experiences.",
    implications: "Dreams involving skill practice or learning scenarios reflect your brain's ongoing optimization and integration processes."
  }
};

const repressionMemoryContext = {
  modernPerspective: {
    title: "Contemporary Understanding of Repressed Memories",
    points: [
      "Modern research suggests most traumatic memories are actually hyperremembered, not forgotten",
      "True 'repressed' memories are rare and controversial in current psychological literature",
      "Memory is reconstructive - we don't store exact replicas but rebuild memories each time we recall them",
      "Suggestion and expectation can create false memories that feel completely real to the individual"
    ]
  },
  cautions: [
    "Be skeptical of 'recovered memories' that emerge only through specific techniques",
    "Symbolic dream interpretation should complement, not replace, evidence-based therapy",
    "Consider multiple perspectives when exploring potentially traumatic dream content",
    "Seek professional help for persistent disturbing dreams or suspected trauma"
  ],
  balancedApproach: "Dreams can offer valuable insights into our emotional lives and unconscious processing without necessarily revealing literal repressed memories. Focus on emotional truth and personal meaning rather than historical accuracy."
};

const dreamWorkMechanisms = {
  condensation: {
    title: "Condensation",
    description: "Multiple ideas, people, or experiences combined into single dream elements",
    example: "A dream figure who looks like your mother but acts like your teacher - representing authority figures in your life",
    modernView: "This aligns with how the sleeping brain makes loose associations between related concepts"
  },
  displacement: {
    title: "Displacement", 
    description: "Emotional significance transferred from important to seemingly trivial elements",
    example: "Feeling intense anxiety about losing your keys when the real fear is about losing control in life",
    modernView: "May reflect the brain's emotional regulation systems working to process feelings indirectly"
  },
  symbolization: {
    title: "Symbolization",
    description: "Abstract concepts represented through concrete symbols and metaphors",
    example: "Climbing a mountain representing your career ambitions or personal growth journey",
    modernView: "Corresponds to how the brain uses metaphorical thinking to process complex concepts"
  },
  secondaryRevision: {
    title: "Secondary Revision",
    description: "The mind's attempt to create coherent narrative from disconnected dream elements",
    example: "Adding logical connections between random dream scenes upon waking",
    modernView: "Reflects the brain's natural pattern-seeking and story-making tendencies"
  }
};

const freeFassociationPrompts = [
  "What was the first thing that came to mind when you saw [dream element]?",
  "What does [symbol] remind you of from your childhood?",
  "If [dream character] could speak, what would they say?",
  "What feelings arise when you think about [dream situation]?",
  "What in your current life connects to [dream theme]?",
  "What would you say to [dream element] if you met it again?",
  "How does [dream emotion] show up in your waking life?"
];

const dreamThemes = [
  'Transformation', 'Relationships', 'Career', 'Family', 'Healing', 
  'Spiritual', 'Adventure', 'Fear', 'Love', 'Growth', 'Past', 'Future'
];

const emotions = [
  'Joy', 'Fear', 'Anger', 'Sadness', 'Excitement', 'Anxiety', 
  'Peace', 'Confusion', 'Love', 'Wonder', 'Frustration', 'Calm'
];

const interpretationPrompts = [
  "What emotions did you feel most strongly in this dream?",
  "How do the people in your dream reflect aspects of yourself?",
  "What in your waking life might this dream be addressing?",
  "If this dream was a message from your unconscious, what would it be saying?",
  "What patterns or themes do you notice recurring in your dreams?",
  "How might this dream be guiding you toward growth or healing?",
  "What would change if you took this dream's message seriously?"
];

interface PersonalSymbol {
  symbol: string;
  personalMeaning: string;
  userDefinedMeaning?: string;
  culturalContext?: string;
  frequency: number;
  lastSeen: Date;
  emotionalAssociation: string;
  evolutionHistory: Array<{
    date: Date;
    context: string;
    emotion: string;
    interpretation: string;
  }>;
  neuralPatterns?: {
    coOccurringSymbols: string[];
    emotionalIntensity: number;
    memoryConsolidationScore: number;
  };
}

interface DreamPattern {
  id: string;
  pattern: string;
  occurrences: string[];
  firstSeen: Date;
  lastSeen: Date;
  insight: string;
  neuroscienceContext?: string;
  evolutionTrack: Array<{
    date: Date;
    variation: string;
    emotionalContext: string;
  }>;
}

interface NeuroscienceInsight {
  dreamId: string;
  type: 'memory-consolidation' | 'emotional-processing' | 'problem-solving' | 'neuroplasticity';
  confidence: number;
  explanation: string;
  suggestedReflection: string;
}

export function DreamAnalysis() {
  const [dreams, setDreams] = useState<DreamEntry[]>([]);
  const [personalSymbols, setPersonalSymbols] = useState<PersonalSymbol[]>([]);
  const [dreamPatterns, setDreamPatterns] = useState<DreamPattern[]>([]);
  const [neuroscienceInsightsState, setNeuroscienceInsightsState] = useState<NeuroscienceInsight[]>([]);
  const [isAddingDream, setIsAddingDream] = useState(false);
  const [selectedDream, setSelectedDream] = useState<DreamEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'dreams' | 'patterns' | 'symbols' | 'neuroscience' | 'freudian'>('dreams');
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
  const [showMemoryWarning, setShowMemoryWarning] = useState(false);
  const [freeAssociations, setFreeAssociations] = useState<Record<string, string>>({});
  const [isEditingSymbol, setIsEditingSymbol] = useState<string | null>(null);
  const [customSymbolMeaning, setCustomSymbolMeaning] = useState('');
  const [newDream, setNewDream] = useState({
    title: '',
    content: '',
    manifestContent: '',
    latentContent: '',
    symbols: [] as string[],
    emotions: [] as string[],
    interpretation: '',
    themes: [] as string[],
    associations: {} as Record<string, string[]>,
    dreamWorkMechanisms: {
      condensation: [] as string[],
      displacement: [] as string[],
      symbolization: [] as string[],
      secondaryRevision: ''
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (dreams.length > 0) {
      analyzePatterns();
      updatePersonalSymbols();
      generateNeuroscienceInsights();
    }
  }, [dreams]);

  const loadData = () => {
    const saved = localStorage.getItem('dreams');
    const savedSymbols = localStorage.getItem('personalSymbols');
    const savedPatterns = localStorage.getItem('dreamPatterns');
    const savedInsights = localStorage.getItem('neuroscienceInsights');
    
    if (saved) {
      const parsed = JSON.parse(saved);
      setDreams(parsed.map((d: any) => ({ ...d, date: new Date(d.date) })));
    }
    
    if (savedSymbols) {
      setPersonalSymbols(JSON.parse(savedSymbols).map((s: any) => ({
        ...s,
        lastSeen: new Date(s.lastSeen),
        evolutionHistory: s.evolutionHistory?.map((h: any) => ({
          ...h,
          date: new Date(h.date)
        })) || []
      })));
    }
    
    if (savedPatterns) {
      setDreamPatterns(JSON.parse(savedPatterns).map((p: any) => ({
        ...p,
        firstSeen: new Date(p.firstSeen),
        lastSeen: new Date(p.lastSeen),
        evolutionTrack: p.evolutionTrack?.map((t: any) => ({
          ...t,
          date: new Date(t.date)
        })) || []
      })));
    }

    if (savedInsights) {
      setNeuroscienceInsightsState(JSON.parse(savedInsights));
    }
  };

  const generateNeuroscienceInsights = () => {
    const insights: NeuroscienceInsight[] = [];
    
    dreams.forEach(dream => {
      // Memory consolidation analysis
      if (dream.symbols.some(s => ['house', 'school', 'work', 'family'].includes(s))) {
        insights.push({
          dreamId: dream.id,
          type: 'memory-consolidation',
          confidence: 0.75,
          explanation: "This dream contains symbols related to significant life areas, suggesting your brain is consolidating memories and experiences from these domains.",
          suggestedReflection: "Consider what recent experiences in these areas might need processing or integration."
        });
      }

      // Emotional processing analysis
      if (dream.emotions.some(e => ['fear', 'anxiety', 'anger', 'sadness'].includes(e))) {
        insights.push({
          dreamId: dream.id,
          type: 'emotional-processing',
          confidence: 0.85,
          explanation: "The presence of intense emotions suggests your amygdala is actively processing and regulating emotional experiences.",
          suggestedReflection: "What emotional challenges are you currently working through? This dream may be helping you process them."
        });
      }

      // Problem-solving analysis
      if (dream.content.includes('solution') || dream.content.includes('answer') || dream.symbols.includes('bridge')) {
        insights.push({
          dreamId: dream.id,
          type: 'problem-solving',
          confidence: 0.65,
          explanation: "This dream shows characteristics of creative problem-solving processes that occur when the prefrontal cortex is less constrained.",
          suggestedReflection: "Are there challenges in your life where this dream might offer creative perspectives or solutions?"
        });
      }
    });

    setNeuroscienceInsightsState(insights);
    localStorage.setItem('neuroscienceInsights', JSON.stringify(insights));
  };

  const analyzePatterns = () => {
    if (dreams.length < 2) return;

    const patterns: { [key: string]: {
      occurrences: string[];
      evolutionTrack: Array<{ date: Date; variation: string; emotionalContext: string; }>;
    } } = {};
    
    dreams.forEach(dream => {
      // Enhanced pattern analysis with evolution tracking
      dream.symbols.forEach(symbol => {
        const patternKey = `symbol:${symbol}`;
        if (!patterns[patternKey]) {
          patterns[patternKey] = { occurrences: [], evolutionTrack: [] };
        }
        patterns[patternKey].occurrences.push(dream.id);
        patterns[patternKey].evolutionTrack.push({
          date: dream.date,
          variation: symbol,
          emotionalContext: dream.emotions.join(', ')
        });
      });

      // Analyze emotional evolution
      dream.emotions.forEach(emotion => {
        const patternKey = `emotion:${emotion}`;
        if (!patterns[patternKey]) {
          patterns[patternKey] = { occurrences: [], evolutionTrack: [] };
        }
        patterns[patternKey].occurrences.push(dream.id);
        patterns[patternKey].evolutionTrack.push({
          date: dream.date,
          variation: emotion,
          emotionalContext: dream.themes.join(', ')
        });
      });
    });

    const newPatterns: DreamPattern[] = [];
    Object.entries(patterns).forEach(([pattern, data]) => {
      if (data.occurrences.length >= 2) {
        const patternDreams = dreams.filter(d => data.occurrences.includes(d.id));
        const firstSeen = new Date(Math.min(...patternDreams.map(d => d.date.getTime())));
        const lastSeen = new Date(Math.max(...patternDreams.map(d => d.date.getTime())));
        
        const existingPattern = dreamPatterns.find(p => p.pattern === pattern);
        if (!existingPattern) {
          newPatterns.push({
            id: Date.now().toString() + Math.random(),
            pattern,
            occurrences: data.occurrences,
            firstSeen,
            lastSeen,
            insight: generateEnhancedPatternInsight(pattern, data.occurrences.length),
            neuroscienceContext: generateNeuroscienceContext(pattern),
            evolutionTrack: data.evolutionTrack
          });
        }
      }
    });

    if (newPatterns.length > 0) {
      setDreamPatterns([...dreamPatterns, ...newPatterns]);
      localStorage.setItem('dreamPatterns', JSON.stringify([...dreamPatterns, ...newPatterns]));
    }
  };

  const generateEnhancedPatternInsight = (pattern: string, frequency: number): string => {
    const [type, element] = pattern.split(':');
    
    switch (type) {
      case 'symbol':
        return `The symbol "${element}" appears ${frequency} times, suggesting significant unconscious processing. From a neuroscience perspective, this may indicate memory consolidation or emotional regulation around themes associated with this symbol.`;
      case 'emotion':
        return `The emotion "${element}" recurs ${frequency} times in your dreams. This pattern may reflect your brain's attempt to process and regulate this emotional state through REM sleep mechanisms.`;
      default:
        return `This pattern (${frequency} occurrences) suggests active neural processing and potential significance for your psychological development.`;
    }
  };

  const generateNeuroscienceContext = (pattern: string): string => {
    const [type, element] = pattern.split(':');
    
    if (type === 'symbol') {
      if (['water', 'ocean', 'rain'].includes(element)) {
        return "Water symbols often correlate with emotional processing centers (amygdala) being highly active during REM sleep.";
      }
      if (['house', 'home'].includes(element)) {
        return "Home-related symbols may indicate hippocampal memory consolidation of personal identity and safety-related experiences.";
      }
    }
    
    return "This pattern suggests active neural network engagement during sleep, potentially indicating important psychological processing.";
  };

  const updatePersonalSymbols = () => {
    const symbolFrequency: { [key: string]: {
      count: number;
      emotions: string[];
      lastSeen: Date;
      contexts: Array<{ date: Date; context: string; emotion: string; interpretation: string; }>;
    } } = {};
    
    dreams.forEach(dream => {
      dream.symbols.forEach(symbol => {
        if (!symbolFrequency[symbol]) {
          symbolFrequency[symbol] = { count: 0, emotions: [], lastSeen: dream.date, contexts: [] };
        }
        symbolFrequency[symbol].count++;
        symbolFrequency[symbol].emotions.push(...dream.emotions);
        if (dream.date > symbolFrequency[symbol].lastSeen) {
          symbolFrequency[symbol].lastSeen = dream.date;
        }
        symbolFrequency[symbol].contexts.push({
          date: dream.date,
          context: dream.content.substring(0, 100),
          emotion: dream.emotions[0] || 'neutral',
          interpretation: dream.interpretation || 'none provided'
        });
      });
    });

    const updatedSymbols: PersonalSymbol[] = [];
    Object.entries(symbolFrequency).forEach(([symbol, data]) => {
      const existingSymbol = personalSymbols.find(s => s.symbol === symbol);
      const mostCommonEmotion = getMostFrequent(data.emotions);
      
      updatedSymbols.push({
        symbol,
        personalMeaning: existingSymbol?.personalMeaning || dreamSymbols[symbol as keyof typeof dreamSymbols] || 'Personal significance to explore',
        userDefinedMeaning: existingSymbol?.userDefinedMeaning,
        culturalContext: existingSymbol?.culturalContext,
        frequency: data.count,
        lastSeen: data.lastSeen,
        emotionalAssociation: mostCommonEmotion || 'neutral',
        evolutionHistory: data.contexts,
        neuralPatterns: {
          coOccurringSymbols: calculateCoOccurrence(symbol),
          emotionalIntensity: calculateEmotionalIntensity(data.emotions),
          memoryConsolidationScore: data.count > 3 ? 0.8 : 0.4
        }
      });
    });

    setPersonalSymbols(updatedSymbols);
    localStorage.setItem('personalSymbols', JSON.stringify(updatedSymbols));
  };

  const calculateCoOccurrence = (targetSymbol: string): string[] => {
    const coOccurring: { [key: string]: number } = {};
    
    dreams.forEach(dream => {
      if (dream.symbols.includes(targetSymbol)) {
        dream.symbols.forEach(symbol => {
          if (symbol !== targetSymbol) {
            coOccurring[symbol] = (coOccurring[symbol] || 0) + 1;
          }
        });
      }
    });

    return Object.entries(coOccurring)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([symbol]) => symbol);
  };

  const calculateEmotionalIntensity = (emotions: string[]): number => {
    const intensityMap: { [key: string]: number } = {
      'fear': 0.9, 'terror': 1.0, 'anxiety': 0.8, 'anger': 0.8,
      'joy': 0.7, 'love': 0.8, 'peace': 0.5, 'calm': 0.3,
      'confusion': 0.6, 'excitement': 0.7, 'sadness': 0.7
    };

    const totalIntensity = emotions.reduce((sum, emotion) => {
      return sum + (intensityMap[emotion.toLowerCase()] || 0.5);
    }, 0);

    return emotions.length > 0 ? totalIntensity / emotions.length : 0.5;
  };

  const getMostFrequent = (arr: string[]): string => {
    const frequency: { [key: string]: number } = {};
    arr.forEach(item => {
      frequency[item] = (frequency[item] || 0) + 1;
    });
    return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b, '');
  };

  const handleAddDream = () => {
    if (newDream.title.trim() && newDream.content.trim()) {
      const dream: DreamEntry = {
        id: Date.now().toString(),
        date: new Date(),
        title: newDream.title,
        content: newDream.content,
        manifestContent: newDream.manifestContent,
        latentContent: newDream.latentContent,
        symbols: newDream.symbols,
        emotions: newDream.emotions,
        interpretation: newDream.interpretation,
        themes: newDream.themes,
        associations: newDream.associations,
        dreamWorkMechanisms: newDream.dreamWorkMechanisms
      };
      setDreams([dream, ...dreams]);
      setNewDream({
        title: '',
        content: '',
        manifestContent: '',
        latentContent: '',
        symbols: [],
        emotions: [],
        interpretation: '',
        themes: [],
        associations: {},
        dreamWorkMechanisms: {
          condensation: [],
          displacement: [],
          symbolization: [],
          secondaryRevision: ''
        }
      });
      setIsAddingDream(false);
    }
  };

  const saveCustomSymbolMeaning = (symbol: string) => {
    setPersonalSymbols(personalSymbols.map(s => 
      s.symbol === symbol 
        ? { ...s, userDefinedMeaning: customSymbolMeaning }
        : s
    ));
    setIsEditingSymbol(null);
    setCustomSymbolMeaning('');
  };

  const generateFreeAssociationPrompt = (dreamElement: string) => {
    const randomPrompt = freeFassociationPrompts[Math.floor(Math.random() * freeFassociationPrompts.length)];
    return randomPrompt.replace('[dream element]', dreamElement)
                     .replace('[symbol]', dreamElement)
                     .replace('[dream character]', dreamElement)
                     .replace('[dream situation]', dreamElement)
                     .replace('[dream theme]', dreamElement)
                     .replace('[dream emotion]', dreamElement);
  };

  const toggleSymbol = (symbol: string) => {
    setNewDream(prev => ({
      ...prev,
      symbols: prev.symbols.includes(symbol)
        ? prev.symbols.filter(s => s !== symbol)
        : [...prev.symbols, symbol]
    }));
  };

  const toggleEmotion = (emotion: string) => {
    setNewDream(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...prev.emotions, emotion]
    }));
  };

  const toggleTheme = (theme: string) => {
    setNewDream(prev => ({
      ...prev,
      themes: prev.themes.includes(theme)
        ? prev.themes.filter(t => t !== theme)
        : [...prev.themes, theme]
    }));
  };

  const addInterpretationPrompt = (prompt: string) => {
    if (!selectedPrompts.includes(prompt)) {
      setSelectedPrompts([...selectedPrompts, prompt]);
    }
  };

  const filteredDreams = dreams.filter(dream =>
    dream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dream.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dream.symbols.some(symbol => symbol.toLowerCase().includes(searchTerm.toLowerCase())) ||
    dream.themes.some(theme => theme.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-8">
        <Moon className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Advanced Dream Analysis</h2>
          <p className="text-purple-200/80">Explore the deeper wisdom of your unconscious mind</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        {[
          { id: 'dreams', label: 'Dream Journal', icon: BookOpen },
          { id: 'patterns', label: 'Pattern Recognition', icon: TrendingUp },
          { id: 'symbols', label: 'Personal Symbols', icon: Eye },
          { id: 'neuroscience', label: 'Neuroscience Insights', icon: Brain },
          { id: 'freudian', label: 'Freudian Analysis', icon: Lightbulb }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                  : 'text-purple-200 hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'dreams' && (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-purple-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
                  placeholder="Search dreams..."
                />
              </div>
              <span className="text-purple-300 text-sm">{dreams.length} dreams recorded</span>
            </div>
            
            <button
              onClick={() => setIsAddingDream(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Record Dream</span>
            </button>
          </div>

          {isAddingDream && (
            <div className="bg-white/5 p-8 rounded-2xl border border-purple-500/20 mb-8">
              <h3 className="text-xl font-semibold text-white mb-6">Record Your Dream</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Dream Title</label>
                  <input
                    type="text"
                    value={newDream.title}
                    onChange={(e) => setNewDream({ ...newDream, title: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
                    placeholder="Give your dream a memorable title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Dream Content</label>
                  <textarea
                    value={newDream.content}
                    onChange={(e) => setNewDream({ ...newDream, content: e.target.value })}
                    className="w-full h-32 px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 resize-none"
                    placeholder="Describe your dream in as much detail as you can remember..."
                  />
                </div>

                {/* Enhanced Symbol Selection */}
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Symbols Present</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Object.keys(dreamSymbols).map((symbol) => {
                      const personalSymbol = personalSymbols.find(s => s.symbol === symbol);
                      return (
                        <button
                          key={symbol}
                          onClick={() => toggleSymbol(symbol)}
                          className={`px-3 py-1 rounded-full text-sm transition-all relative ${
                            newDream.symbols.includes(symbol)
                              ? 'bg-blue-500/30 text-blue-200 border border-blue-400/30'
                              : 'bg-white/10 text-purple-200 hover:bg-white/20'
                          }`}
                        >
                          {symbol}
                          {personalSymbol && personalSymbol.frequency > 1 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                              {personalSymbol.frequency}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Emotions Felt</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {emotions.map((emotion) => (
                      <button
                        key={emotion}
                        onClick={() => toggleEmotion(emotion)}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${
                          newDream.emotions.includes(emotion)
                            ? 'bg-purple-500/30 text-purple-200 border border-purple-400/30'
                            : 'bg-white/10 text-purple-200 hover:bg-white/20'
                        }`}
                      >
                        {emotion}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Themes</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dreamThemes.map((theme) => (
                      <button
                        key={theme}
                        onClick={() => toggleTheme(theme)}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${
                          newDream.themes.includes(theme)
                            ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/30'
                            : 'bg-white/10 text-purple-200 hover:bg-white/20'
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guided Interpretation Prompts */}
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Interpretation Prompts
                    <span className="text-xs text-purple-300 ml-2">Click prompts to add them to your reflection</span>
                  </label>
                  <div className="bg-white/5 p-4 rounded-lg border border-purple-500/20 mb-4">
                    <div className="space-y-2">
                      {interpretationPrompts.map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => addInterpretationPrompt(prompt)}
                          className={`w-full text-left p-2 rounded text-sm transition-all ${
                            selectedPrompts.includes(prompt)
                              ? 'bg-green-500/20 text-green-200 border border-green-400/30'
                              : 'hover:bg-white/5 text-purple-200'
                          }`}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Your Interpretation</label>
                  {selectedPrompts.length > 0 && (
                    <div className="mb-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <p className="text-sm text-green-300 mb-2">Consider these questions:</p>
                      <ul className="text-xs text-green-200 space-y-1">
                        {selectedPrompts.map((prompt, index) => (
                          <li key={index}>• {prompt}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <textarea
                    value={newDream.interpretation}
                    onChange={(e) => setNewDream({ ...newDream, interpretation: e.target.value })}
                    className="w-full h-32 px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 resize-none"
                    placeholder="What do you think this dream means? What messages might it hold? Use the prompts above to guide your reflection..."
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddDream}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
                  >
                    Save Dream
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingDream(false);
                      setSelectedPrompts([]);
                    }}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dreams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDreams.map((dream) => (
              <div
                key={dream.id}
                className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-6 rounded-xl border border-blue-500/20 hover:border-blue-400/40 transition-all cursor-pointer"
                onClick={() => setSelectedDream(dream)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{dream.title}</h3>
                  <div className="flex items-center space-x-1 text-blue-300">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{dream.date.toLocaleDateString()}</span>
                  </div>
                </div>

                <p className="text-purple-200/80 text-sm mb-4 line-clamp-3">
                  {dream.content}
                </p>

                {dream.symbols.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-blue-300">Symbols</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {dream.symbols.slice(0, 3).map((symbol, index) => {
                        const personalSymbol = personalSymbols.find(s => s.symbol === symbol);
                        return (
                          <span 
                            key={index} 
                            className={`px-2 py-1 text-xs rounded-full relative ${
                              personalSymbol?.frequency > 1
                                ? 'bg-orange-500/20 text-orange-300 border border-orange-400/30'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {symbol}
                            {personalSymbol?.frequency > 1 && (
                              <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center text-[10px]">
                                {personalSymbol.frequency}
                              </span>
                            )}
                          </span>
                        );
                      })}
                      {dream.symbols.length > 3 && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                          +{dream.symbols.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {dream.themes.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Tag className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm text-indigo-300">Themes</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {dream.themes.slice(0, 2).map((theme, index) => (
                        <span key={index} className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full">
                          {theme}
                        </span>
                      ))}
                      {dream.themes.length > 2 && (
                        <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full">
                          +{dream.themes.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {dreams.length === 0 && !isAddingDream && (
            <div className="text-center py-16">
              <Moon className="w-16 h-16 text-blue-400/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-blue-200 mb-2">Your Dream Journal Awaits</h3>
              <p className="text-blue-200/60 mb-6">Start recording your dreams to unlock the wisdom of your unconscious mind</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'patterns' && (
        <div>
          <h3 className="text-lg font-semibold text-purple-200 mb-6">Recurring Patterns & Insights</h3>
          
          {dreamPatterns.length > 0 ? (
            <div className="space-y-6">
              {dreamPatterns.map((pattern) => {
                const [type, element] = pattern.pattern.split(':');
                return (
                  <div key={pattern.id} className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 rounded-xl border border-orange-500/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-6 h-6 text-orange-400" />
                        <div>
                          <h4 className="text-lg font-semibold text-white capitalize">
                            {type}: {element}
                          </h4>
                          <p className="text-sm text-orange-300">
                            Appeared {pattern.occurrences.length} times
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-orange-300">
                        {pattern.firstSeen.toLocaleDateString()} - {pattern.lastSeen.toLocaleDateString()}
                      </div>
                    </div>
                    
                    <p className="text-purple-200/80 mb-4">{pattern.insight}</p>
                    
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-orange-400" />
                      <span className="text-sm text-orange-300">
                        Consider: What life themes might this pattern be reflecting?
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <TrendingUp className="w-16 h-16 text-orange-400/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-orange-200 mb-2">Patterns Will Emerge</h3>
              <p className="text-orange-200/60 mb-6">Record more dreams to discover recurring themes and symbols</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'symbols' && (
        <div>
          <h3 className="text-lg font-semibold text-purple-200 mb-6">Your Personal Symbol Library</h3>
          
          {personalSymbols.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {personalSymbols
                .sort((a, b) => b.frequency - a.frequency)
                .map((symbol) => (
                <div key={symbol.symbol} className="bg-gradient-to-br from-teal-500/10 to-blue-500/10 p-6 rounded-xl border border-teal-500/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Eye className="w-6 h-6 text-teal-400" />
                      <div>
                        <h4 className="text-lg font-semibold text-white capitalize">{symbol.symbol}</h4>
                        <p className="text-sm text-teal-300">
                          Appeared {symbol.frequency} times
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-teal-300">
                      <div>Last seen:</div>
                      <div>{symbol.lastSeen.toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium text-teal-200 mb-1">General Meaning</h5>
                      <p className="text-sm text-purple-200/80">
                        {dreamSymbols[symbol.symbol as keyof typeof dreamSymbols] || 'Personal significance to explore'}
                      </p>
                    </div>
                    
                    {symbol.userDefinedMeaning && (
                      <div>
                        <h5 className="text-sm font-medium text-teal-200 mb-1">Your Personal Association</h5>
                        <p className="text-sm text-purple-200/80">{symbol.userDefinedMeaning}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2 border-t border-teal-500/20">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-teal-300">Most associated with:</span>
                        <span className="px-2 py-1 bg-teal-500/20 text-teal-200 text-xs rounded-full">
                          {symbol.emotionalAssociation}
                        </span>
                      </div>
                      {symbol.frequency >= 3 && (
                        <div className="text-xs text-yellow-400 flex items-center space-x-1">
                          <span>⭐</span>
                          <span>High Significance</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Eye className="w-16 h-16 text-teal-400/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-teal-200 mb-2">Your Symbol Library Will Grow</h3>
              <p className="text-teal-200/60 mb-6">As you record dreams, we'll track your personal symbols and their meanings</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'neuroscience' && (
        <div>
          <h3 className="text-lg font-semibold text-purple-200 mb-6">Neuroscience-Based Dream Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {Object.entries(neuroscienceInsights).map(([key, insight]) => (
              <div key={key} className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 rounded-xl border border-green-500/20">
                <div className="flex items-center space-x-3 mb-4">
                  <Microscope className="w-6 h-6 text-green-400" />
                  <h4 className="text-lg font-semibold text-white">{insight.title}</h4>
                </div>
                <p className="text-sm text-green-100 mb-3">{insight.description}</p>
                <p className="text-xs text-green-300 italic">{insight.implications}</p>
              </div>
            ))}
          </div>

          {neuroscienceInsightsState.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-purple-200 mb-4">Your Dream Analysis</h4>
              <div className="space-y-4">
                {neuroscienceInsightsState.map((insight, index) => {
                  const dream = dreams.find(d => d.id === insight.dreamId);
                  return (
                    <div key={index} className="bg-white/5 p-4 rounded-lg border border-purple-500/20">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h5 className="font-medium text-white">{dream?.title}</h5>
                          <span className="text-xs text-purple-300 capitalize">{insight.type.replace('-', ' ')}</span>
                        </div>
                        <span className="text-xs text-green-400">{Math.round(insight.confidence * 100)}% confidence</span>
                      </div>
                      <p className="text-sm text-purple-200 mb-2">{insight.explanation}</p>
                      <p className="text-xs text-blue-300 italic">{insight.suggestedReflection}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'freudian' && (
        <div>
          <h3 className="text-lg font-semibold text-purple-200 mb-6">Freudian Dream Analysis</h3>
          
          {/* Memory Repression Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-yellow-300 mb-2">{repressionMemoryContext.modernPerspective.title}</h4>
                <ul className="text-sm text-yellow-200 space-y-1 mb-4">
                  {repressionMemoryContext.modernPerspective.points.map((point, index) => (
                    <li key={index}>• {point}</li>
                  ))}
                </ul>
                <p className="text-sm text-yellow-200 italic">{repressionMemoryContext.balancedApproach}</p>
              </div>
            </div>
          </div>

          {/* Dream Work Mechanisms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {Object.entries(dreamWorkMechanisms).map(([key, mechanism]) => (
              <div key={key} className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 p-6 rounded-xl border border-purple-500/20">
                <h4 className="text-lg font-semibold text-white mb-3">{mechanism.title}</h4>
                <p className="text-sm text-purple-200 mb-3">{mechanism.description}</p>
                <div className="bg-white/5 p-3 rounded-lg mb-3">
                  <p className="text-xs text-purple-300 mb-1">Example:</p>
                  <p className="text-sm text-purple-100">{mechanism.example}</p>
                </div>
                <p className="text-xs text-blue-300 italic">{mechanism.modernView}</p>
              </div>
            ))}
          </div>

          {/* Free Association Tool */}
          <div className="bg-white/5 p-6 rounded-xl border border-purple-500/20">
            <h4 className="text-lg font-semibold text-white mb-4">Free Association Exercise</h4>
            <p className="text-sm text-purple-200 mb-4">
              Select any element from your dreams and explore what comes to mind without censoring yourself.
            </p>
            
            {dreams.length > 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Choose a dream element</label>
                  <select className="w-full px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white">
                    <option value="">Select an element...</option>
                    {dreams.slice(0, 5).map(dream => 
                      dream.symbols.map(symbol => (
                        <option key={`${dream.id}-${symbol}`} value={symbol}>
                          {symbol} (from "{dream.title}")
                        </option>
                      ))
                    )}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {freeFassociationPrompts.slice(0, 4).map((prompt, index) => (
                    <button
                      key={index}
                      className="p-3 text-left bg-purple-500/10 rounded-lg border border-purple-500/20 hover:bg-purple-500/20 transition-all"
                    >
                      <p className="text-sm text-purple-200">{prompt.replace(/\[.*?\]/g, '[selected element]')}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dream Detail Modal - Enhanced */}
      {selectedDream && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 p-8 rounded-2xl border border-blue-500/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedDream.title}</h2>
                <p className="text-blue-300">{selectedDream.date.toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => setSelectedDream(null)}
                className="text-purple-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-blue-200 mb-3">Dream Content</h3>
                <p className="text-purple-100 leading-relaxed">{selectedDream.content}</p>
              </div>

              {selectedDream.symbols.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-blue-200 mb-3">Symbol Analysis</h3>
                  <div className="space-y-3">
                    {selectedDream.symbols.map((symbol, index) => {
                      const personalSymbol = personalSymbols.find(s => s.symbol === symbol);
                      return (
                        <div key={index} className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-blue-300 font-medium capitalize flex items-center space-x-2">
                              <span>{symbol}</span>
                              {personalSymbol?.frequency > 1 && (
                                <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">
                                  Recurring ({personalSymbol.frequency}x)
                                </span>
                              )}
                            </h4>
                          </div>
                          <p className="text-purple-200 text-sm mb-2">
                            {dreamSymbols[symbol as keyof typeof dreamSymbols] || 'Personal significance to explore'}
                          </p>
                          {personalSymbol?.userDefinedMeaning && (
                            <p className="text-teal-200 text-sm italic">
                              Your association: {personalSymbol.userDefinedMeaning}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedDream.interpretation && (
                <div>
                  <h3 className="text-lg font-semibold text-blue-200 mb-3">Your Interpretation</h3>
                  <p className="text-purple-100 leading-relaxed">{selectedDream.interpretation}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                {selectedDream.emotions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-purple-300 mb-2">Emotions</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDream.emotions.map((emotion, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">
                          {emotion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDream.themes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-indigo-300 mb-2">Themes</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDream.themes.map((theme, index) => (
                        <span key={index} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-sm rounded-full">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Pattern Connections */}
              {dreamPatterns.filter(p => p.occurrences.includes(selectedDream.id)).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-orange-200 mb-3">Connected Patterns</h3>
                  <div className="space-y-2">
                    {dreamPatterns
                      .filter(p => p.occurrences.includes(selectedDream.id))
                      .map((pattern) => (
                        <div key={pattern.id} className="bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">
                          <p className="text-orange-300 text-sm">{pattern.insight}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}