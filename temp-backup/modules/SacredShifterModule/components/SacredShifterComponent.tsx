import React, { useState, useEffect, useRef } from 'react';
import { Brain, Heart, Compass, Sparkles, Moon, Sun, Users, BarChart3, MessageCircle, Star, Zap, Eye, Infinity, BookOpen, Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { supabase, getCurrentUserId, getUserSettings, updateUserSettings } from '../../services/supabaseClient';
import { CoreValuesExplorer } from './CoreValuesExplorer';
import { PurposeClarifier } from './PurposeClarifier';
import type { BiofeedbackData } from '../../types/ssos';

const universalPrinciples = [
  {
    id: 'mentalism',
    name: 'The Principle of Mentalism',
    essence: 'The All is Mind; the Universe is Mental',
    color: 'from-violet-500 to-purple-700',
    icon: '🧠',
    frequency: 963
  },
  {
    id: 'correspondence',
    name: 'The Principle of Correspondence', 
    essence: 'As above, so below; as below, so above',
    color: 'from-blue-500 to-indigo-700',
    icon: '♾️',
    frequency: 852
  },
  {
    id: 'vibration',
    name: 'The Principle of Vibration',
    essence: 'Nothing rests; everything moves; everything vibrates',
    color: 'from-cyan-500 to-teal-700',
    icon: '〰️',
    frequency: 741
  },
  {
    id: 'polarity',
    name: 'The Principle of Polarity',
    essence: 'Everything is dual; everything has poles',
    color: 'from-emerald-500 to-green-700',
    icon: '☯️',
    frequency: 639
  },
  {
    id: 'rhythm',
    name: 'The Principle of Rhythm',
    essence: 'Everything flows, out and in; everything has its tides',
    color: 'from-amber-500 to-orange-700',
    icon: '🌊',
    frequency: 528
  },
  {
    id: 'cause-effect',
    name: 'The Principle of Cause and Effect',
    essence: 'Every cause has its effect; every effect has its cause',
    color: 'from-red-500 to-rose-700',
    icon: '🔄',
    frequency: 417
  },
  {
    id: 'gender',
    name: 'The Principle of Gender',
    essence: 'Gender is in everything; everything has masculine and feminine principles',
    color: 'from-pink-500 to-fuchsia-700',
    icon: '⚊⚋',
    frequency: 396
  }
];

const sections = [
  { id: 'values', name: 'Core Values', icon: Heart, color: 'text-rose-400', principle: universalPrinciples[0] },
  { id: 'purpose', name: 'Purpose & Mission', icon: Compass, color: 'text-indigo-400', principle: universalPrinciples[1] },
  { id: 'unblocking', name: 'Unblocking Practices', icon: Sparkles, color: 'text-purple-400', principle: universalPrinciples[5] },
  { id: 'intuition', name: 'Inner Wisdom', icon: Brain, color: 'text-teal-400', principle: universalPrinciples[1] },
  { id: 'mindfulness', name: 'Mindfulness', icon: Sun, color: 'text-amber-400', principle: universalPrinciples[4] },
  { id: 'dreams', name: 'Dream Analysis', icon: Moon, color: 'text-blue-400', principle: universalPrinciples[2] },
  { id: 'affirmations', name: 'Affirmations', icon: Star, color: 'text-cyan-400', principle: universalPrinciples[0] },
  { id: 'mentor', name: 'Inner Mentor', icon: MessageCircle, color: 'text-violet-400', principle: universalPrinciples[1] },
  { id: 'principles', name: 'Universal Principles', icon: BookOpen, color: 'text-yellow-400', principle: universalPrinciples[0] },
  { id: 'integration', name: 'Daily Integration', icon: Users, color: 'text-green-400', principle: universalPrinciples[4] },
  { id: 'progress', name: 'Progress Insights', icon: BarChart3, color: 'text-orange-400', principle: universalPrinciples[6] }
];

export function SacredShifterComponent() {
  const [activeSection, setActiveSection] = useState('values');
  const [activePrinciple, setActivePrinciple] = useState(universalPrinciples[2]); // Start with Vibration
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [energyLevel, setEnergyLevel] = useState<number>(7);
  const [consciousnessDepth, setConsciousnessDepth] = useState<number>(3);
  
  // Biofeedback simulation state
  const [biofeedbackData, setBiofeedbackData] = useState<BiofeedbackData>({
    stressLevel: 50,
    heartRate: 72,
    heartRateVariability: 65,
    brainwaveState: 'beta',
    coherenceScore: 0.7,
    timestamp: new Date(),
    trends: {
      stressLevel: 'stable',
      heartRate: 'stable',
      coherence: 'stable'
    }
  });
  const [isSimulationActive, setIsSimulationActive] = useState(true);

  const biofeedbackIntervalRef = useRef<NodeJS.Timeout>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadUserSettings();
    const timer = setTimeout(() => {
      setIsInitialized(true);
      setIsLoading(false);
    }, 800);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const loadUserSettings = async () => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return;
      
      const settings = await getUserSettings(userId);
      
      if (settings) {
        // Update state with user settings
        setEnergyLevel(settings.energy_level || 7);
        setConsciousnessDepth(settings.consciousness_level === 'awakening' ? 3 : 
          settings.consciousness_level === 'enlightened' ? 5 : 
          settings.consciousness_level === 'transcendent' ? 7 : 3);
        
        // Set active principle based on user settings
        if (settings.active_principle) {
          const principle = universalPrinciples.find(p => p.id === settings.active_principle);
          if (principle) {
            setActivePrinciple(principle);
          }
        }
      } else {
        // Create default settings if none exist
        await updateUserSettings(userId, {
          theme: 'cosmic',
          energy_level: energyLevel,
          consciousness_level: 'awakening',
          active_principle: activePrinciple.id,
          chakra_alignment: 'heart'
        });
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
    }
  };

  useEffect(() => {
    // Update active principle based on current section
    const currentSection = sections.find(s => s.id === activeSection);
    if (currentSection && currentSection.principle) {
      setActivePrinciple(currentSection.principle);
    }
  }, [activeSection]);

  useEffect(() => {    
    if (!isSimulationActive) return;
    
    biofeedbackIntervalRef.current = setInterval(() => {
      updateBiofeedbackSimulation();
    }, 2000); // Update every 2 seconds
    
    return () => {
      if (biofeedbackIntervalRef.current) {
        clearInterval(biofeedbackIntervalRef.current);
      }
    };
  }, [isSimulationActive, activeSection, energyLevel]);
  
  const updateBiofeedbackSimulation = () => {
    setBiofeedbackData(prev => {
      const stressInfluence = activeSection === 'unblocking' ? -5 : activeSection === 'mindfulness' ? -8 : 0;
      const heartRateInfluence = energyLevel > 7 ? 5 : energyLevel < 4 ? -3 : 0;
      
      // Add randomness
      const stressVariation = (Math.random() - 0.5) * 10;
      const heartRateVariation = (Math.random() - 0.5) * 8;
      const hrvVariation = (Math.random() - 0.5) * 15;
      
      const newStressLevel = Math.max(0, Math.min(100, prev.stressLevel + stressVariation + stressInfluence));
      const newHeartRate = Math.max(50, Math.min(120, prev.heartRate + heartRateVariation + heartRateInfluence));
      const newHRV = Math.max(0, Math.min(100, (prev.heartRateVariability || 65) + hrvVariation));
      
      // Determine brainwave state
      let brainwaveState = prev.brainwaveState;
      if (activeSection === 'mindfulness' && newStressLevel < 30) {
        brainwaveState = 'alpha';
      } else if (activeSection === 'mindfulness' && newStressLevel < 20) {
        brainwaveState = 'theta';
      } else if (newStressLevel > 70) {
        brainwaveState = 'gamma';
      } else {
        brainwaveState = 'beta';
      }
      
      // Calculate coherence score
      const coherenceScore = Math.max(0, Math.min(1, (newHRV / 100) * (1 - newStressLevel / 100)));
      
      // Determine trends
      const stressTrend = newStressLevel > prev.stressLevel + 2 ? 'rising' : 
                         newStressLevel < prev.stressLevel - 2 ? 'falling' : 'stable';
      const heartRateTrend = newHeartRate > prev.heartRate + 2 ? 'rising' :
                            newHeartRate < prev.heartRate - 2 ? 'falling' : 'stable';
      const coherenceTrend = coherenceScore > prev.coherenceScore + 0.05 ? 'improving' :
                           coherenceScore < prev.coherenceScore - 0.05 ? 'declining' : 'stable';

      return {
        stressLevel: Math.round(newStressLevel),
        heartRate: Math.round(newHeartRate),
        heartRateVariability: Math.round(newHRV),
        brainwaveState,
        coherenceScore: Math.round(coherenceScore * 100) / 100,
        timestamp: new Date(),
        trends: {
          stressLevel: stressTrend as 'rising' | 'falling' | 'stable',
          heartRate: heartRateTrend as 'rising' | 'falling' | 'stable',
          coherence: coherenceTrend as 'improving' | 'declining' | 'stable'
        }
      };
    });
  };

  const handleEnergyShift = async (delta: number) => {
    setEnergyLevel(prev => Math.max(1, Math.min(10, prev + delta)));
    
    // Save to database
    try {
      const userId = await getCurrentUserId();
      if (!userId) return;
      
      await updateUserSettings(userId, {
        energy_level: Math.max(1, Math.min(10, energyLevel + delta))
      });
    } catch (error) {
      console.error('Error saving energy level:', error);
    }
  };

  const handlePrincipleChange = async (principle: any) => {
    setActivePrinciple(principle);
    
    // Save to database
    try {
      const userId = await getCurrentUserId();
      if (!userId) return;
      
      await updateUserSettings(userId, {
        active_principle: principle.id
      });
    } catch (error) {
      console.error('Error saving active principle:', error);
    }
  };

  const handleConsciousnessShift = async (delta: number) => {
    setConsciousnessDepth(prev => Math.max(1, Math.min(7, prev + delta)));
    
    // Save to database
    try {
      const userId = await getCurrentUserId();
      if (!userId) return;
      
      const level = Math.max(1, Math.min(7, consciousnessDepth + delta));
      const consciousnessLevel = level <= 2 ? 'awakening' : 
        level <= 4 ? 'enlightened' : 'transcendent';
      
      await updateUserSettings(userId, {
        consciousness_level: consciousnessLevel
      });
    } catch (error) {
      console.error('Error saving consciousness level:', error);
    }
  };

  const adjustBiofeedback = (type: 'stress' | 'heartRate', delta: number) => {
    setBiofeedbackData(prev => ({
      ...prev,
      [type]: type === 'stress' 
        ? Math.max(0, Math.min(100, prev.stressLevel + delta))
        : Math.max(40, Math.min(180, prev.heartRate + delta))
    }));
  };
  
  const getBrainwaveColor = (state: string) => {
    const colors = {
      gamma: 'text-red-400',
      beta: 'text-orange-400', 
      alpha: 'text-green-400',
      theta: 'text-blue-400',
      delta: 'text-purple-400'
    };
    return colors[state as keyof typeof colors] || 'text-gray-400';
  };

  const getTrendIcon = (trend: 'rising' | 'falling' | 'stable') => {
    switch (trend) {
      case 'rising': return TrendingUp;
      case 'falling': return TrendingDown;
      case 'stable': return Minus;
    }
  };

  const getStressLevelColor = (level: number) => {
    if (level < 30) return 'text-green-400';
    if (level < 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getCoherenceColor = (score: number) => {
    if (score > 0.7) return 'text-emerald-400';
    if (score > 0.4) return 'text-blue-400';
    return 'text-orange-400';
  };
  
  const renderSection = () => {
    switch (activeSection) {
      case 'values':
        return <CoreValuesExplorer />;
      case 'purpose':
        return <PurposeClarifier />;
      // Add more sections as needed
      default:
        return <CoreValuesExplorer />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="text-center">
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl text-white mb-2">Initializing Sacred Shifter</h2>
            <p className="text-purple-200">Connecting to your consciousness data...</p>
          </div>
        </div>
      )}
      {/* Cosmic Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'radial-gradient(ellipse at center, #0f0f23 0%, #000000 100%)' }}
      />
      <div className={`relative z-10 transition-all duration-1000 ${isInitialized ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <header className="bg-black/30 backdrop-blur-md border-b border-white/10 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 bg-gradient-to-r ${activePrinciple.color} rounded-xl shadow-lg`}>
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                    Sacred Shifter
                  </h1>
                  <p className="text-purple-200/80 text-sm">Advanced Consciousness Development Module v3.0</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Navigation Sidebar */}
            <div className="lg:col-span-1">
              <nav className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
                <h2 className="text-lg font-semibold text-purple-200 mb-6 flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Sacred Pathways</span>
                </h2>
                
                <div className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                          activeSection === section.id
                            ? `bg-gradient-to-r ${section.principle.color} text-white border border-white/20 shadow-lg`
                            : 'text-purple-200 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${section.color} transition-transform group-hover:scale-110`} />
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium">{section.name}</div>
                          {activeSection === section.id && section.principle && (
                            <div className="text-xs opacity-70">{section.principle.icon} {section.principle.name.split(' ').slice(-1)}</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <div className={`h-1 bg-gradient-to-r ${activePrinciple.color}`} />
                {renderSection()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}