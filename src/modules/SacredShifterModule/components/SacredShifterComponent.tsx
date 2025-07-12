import React, { useState, useEffect, useRef } from 'react';
import { Brain, Heart, Compass, Sparkles, Moon, Sun, Users, BarChart3, MessageCircle, Star, Zap, Eye, Infinity, BookOpen, Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { CoreValuesExplorer } from './CoreValuesExplorer';
import { PurposeClarifier } from './PurposeClarifier';
import { UnblockingPractices } from './UnblockingPractices';
import { IntuitionCultivator } from './IntuitionCultivator';
import { MindfulnessLibrary } from './MindfulnessLibrary';
import { ProgressTracker } from './ProgressTracker';
import { DailyIntegration } from './DailyIntegration';
import { DreamAnalysis } from './DreamAnalysis';
import { AffirmationGenerator } from './AffirmationGenerator';
import { InnerMentor } from './InnerMentor';
import { HermeticPrinciplesGuide } from './HermeticPrinciplesGuide';
import type { BiofeedbackData } from '../types/ssos';

const universalPrinciples = [
  {
    id: 'mentalism',
    name: 'The Principle of Mentalism',
    essence: 'The All is Mind; the Universe is Mental',
    color: 'from-violet-500 to-purple-700',
    symbol: '🧠',
    frequency: 963
  },
  {
    id: 'correspondence',
    name: 'The Principle of Correspondence', 
    essence: 'As above, so below; as below, so above',
    color: 'from-blue-500 to-indigo-700',
    symbol: '♾️',
    frequency: 852
  },
  {
    id: 'vibration',
    name: 'The Principle of Vibration',
    essence: 'Nothing rests; everything moves; everything vibrates',
    color: 'from-cyan-500 to-teal-700',
    symbol: '〰️',
    frequency: 741
  },
  {
    id: 'polarity',
    name: 'The Principle of Polarity',
    essence: 'Everything is dual; everything has poles',
    color: 'from-emerald-500 to-green-700',
    symbol: '☯️',
    frequency: 639
  },
  {
    id: 'rhythm',
    name: 'The Principle of Rhythm',
    essence: 'Everything flows, out and in; everything has its tides',
    color: 'from-amber-500 to-orange-700',
    symbol: '🌊',
    frequency: 528
  },
  {
    id: 'cause-effect',
    name: 'The Principle of Cause and Effect',
    essence: 'Every cause has its effect; every effect has its cause',
    color: 'from-red-500 to-rose-700',
    symbol: '🔄',
    frequency: 417
  },
  {
    id: 'gender',
    name: 'The Principle of Gender',
    essence: 'Gender is in everything; everything has masculine and feminine principles',
    color: 'from-pink-500 to-fuchsia-700',
    symbol: '⚊⚋',
    frequency: 396
  }
];

const chakras = [
  { name: 'Root', color: 'red', frequency: 396, symbol: '🔴' },
  { name: 'Sacral', color: 'orange', frequency: 417, symbol: '🟠' },
  { name: 'Solar Plexus', color: 'yellow', frequency: 528, symbol: '🟡' },
  { name: 'Heart', color: 'green', frequency: 639, symbol: '💚' },
  { name: 'Throat', color: 'blue', frequency: 741, symbol: '🔵' },
  { name: 'Third Eye', color: 'indigo', frequency: 852, symbol: '🟣' },
  { name: 'Crown', color: 'violet', frequency: 963, symbol: '⚪' }
];

const sections = [
  { id: 'values', name: 'Core Values', icon: Heart, color: 'text-rose-400', principle: 'polarity' },
  { id: 'purpose', name: 'Purpose & Mission', icon: Compass, color: 'text-indigo-400', principle: 'mentalism' },
  { id: 'unblocking', name: 'Unblocking Practices', icon: Sparkles, color: 'text-purple-400', principle: 'cause-effect' },
  { id: 'intuition', name: 'Inner Wisdom', icon: Brain, color: 'text-teal-400', principle: 'correspondence' },
  { id: 'mindfulness', name: 'Mindfulness', icon: Sun, color: 'text-amber-400', principle: 'rhythm' },
  { id: 'dreams', name: 'Dream Analysis', icon: Moon, color: 'text-blue-400', principle: 'vibration' },
  { id: 'affirmations', name: 'Affirmations', icon: Star, color: 'text-cyan-400', principle: 'mentalism' },
  { id: 'mentor', name: 'Inner Mentor', icon: MessageCircle, color: 'text-violet-400', principle: 'correspondence' },
  { id: 'principles', name: 'Universal Principles', icon: BookOpen, color: 'text-yellow-400', principle: 'mentalism' },
  { id: 'integration', name: 'Daily Integration', icon: Users, color: 'text-green-400', principle: 'rhythm' },
  { id: 'progress', name: 'Progress Insights', icon: BarChart3, color: 'text-orange-400', principle: 'gender' },
];

export function SacredShifterComponent() {
  const [activeSection, setActiveSection] = useState('values');
  const [activePrinciple, setActivePrinciple] = useState(universalPrinciples[2]); // Start with Vibration
  const [isInitialized, setIsInitialized] = useState(false);
  const [energyLevel, setEnergyLevel] = useState(7);
  const [consciousnessDepth, setConsciousnessDepth] = useState(3);
  
  // Biofeedback simulation state
  const [biofeedbackData, setBiofeedbackData] = useState<BiofeedbackData>({
    stressLevel: 35,
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
  const [previousBiofeedback, setPreviousBiofeedback] = useState<BiofeedbackData | null>(null);
  const [isSimulationActive, setIsSimulationActive] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const biofeedbackIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialized(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update active principle based on current section
    const currentSection = sections.find(s => s.id === activeSection);
    if (currentSection) {
      const principle = universalPrinciples.find(p => p.id === currentSection.principle);
      if (principle) {
        setActivePrinciple(principle);
      }
    }
  }, [activeSection]);

  useEffect(() => {
    // Initialize cosmic background animation
    initializeCosmicBackground();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activePrinciple]);

  // Biofeedback simulation effect
  useEffect(() => {
    if (isSimulationActive) {
      biofeedbackIntervalRef.current = setInterval(() => {
        updateBiofeedbackSimulation();
      }, 2000); // Update every 2 seconds for demo purposes
    } else {
      if (biofeedbackIntervalRef.current) {
        clearInterval(biofeedbackIntervalRef.current);
      }
    }

    return () => {
      if (biofeedbackIntervalRef.current) {
        clearInterval(biofeedbackIntervalRef.current);
      }
    };
  }, [isSimulationActive, activeSection, energyLevel]);

  const updateBiofeedbackSimulation = () => {
    setBiofeedbackData(prev => {
      setPreviousBiofeedback(prev);
      
      // Simulate natural variations with some influence from current state
      const stressInfluence = activeSection === 'unblocking' ? -5 : activeSection === 'mindfulness' ? -8 : 0;
      const heartRateInfluence = energyLevel > 7 ? 5 : energyLevel < 4 ? -3 : 0;
      
      // Add some randomness to make it feel real
      const stressVariation = (Math.random() - 0.5) * 10;
      const heartRateVariation = (Math.random() - 0.5) * 8;
      const hrvVariation = (Math.random() - 0.5) * 15;
      
      const newStressLevel = Math.max(0, Math.min(100, prev.stressLevel + stressVariation + stressInfluence));
      const newHeartRate = Math.max(50, Math.min(120, prev.heartRate + heartRateVariation + heartRateInfluence));
      const newHRV = Math.max(0, Math.min(100, prev.heartRateVariability + hrvVariation));
      
      // Determine brainwave state based on stress and current activity
      let brainwaveState: BiofeedbackData['brainwaveState'] = 'beta';
      if (activeSection === 'mindfulness' && newStressLevel < 30) {
        brainwaveState = 'alpha';
      } else if (activeSection === 'mindfulness' && newStressLevel < 20) {
        brainwaveState = 'theta';
      } else if (newStressLevel > 70) {
        brainwaveState = 'gamma';
      }
      
      // Calculate coherence score based on HRV and stress
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
          stressLevel: stressTrend,
          heartRate: heartRateTrend,
          coherence: coherenceTrend
        }
      };
    });
  };

  const initializeCosmicBackground = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      hue: number;
      alpha: number;
      frequency: number;
    }> = [];

    // Create particles based on active principle frequency
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        hue: Math.random() * 60 + (activePrinciple.frequency / 10),
        alpha: Math.random() * 0.5 + 0.2,
        frequency: activePrinciple.frequency
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Update particle position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Pulse based on frequency and energy level
        const pulse = Math.sin(Date.now() * 0.001 * particle.frequency / 100 * energyLevel / 10) * 0.3 + 0.7;
        
        // Draw particle with sacred geometry influence
        ctx.save();
        ctx.globalAlpha = particle.alpha * pulse;
        ctx.fillStyle = `hsl(${particle.hue}, 80%, 60%)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Add connection lines for sacred geometry
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              ctx.strokeStyle = `hsla(${particle.hue}, 60%, 50%, ${0.1 * (1 - distance / 100) * energyLevel / 10})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          }
        });
        
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const renderSection = () => {
    const commonProps = { biofeedbackData };
    
    switch (activeSection) {
      case 'values':
        return <CoreValuesExplorer />;
      case 'purpose':
        return <PurposeClarifier />;
      case 'unblocking':
        return <UnblockingPractices {...commonProps} />;
      case 'intuition':
        return <IntuitionCultivator />;
      case 'mindfulness':
        return <MindfulnessLibrary {...commonProps} />;
      case 'dreams':
        return <DreamAnalysis />;
      case 'affirmations':
        return <AffirmationGenerator />;
      case 'mentor':
        return <InnerMentor />;
      case 'principles':
        return <HermeticPrinciplesGuide />;
      case 'integration':
        return <DailyIntegration />;
      case 'progress':
        return <ProgressTracker />;
      default:
        return <CoreValuesExplorer />;
    }
  };

  const handleEnergyShift = (delta: number) => {
    setEnergyLevel(prev => Math.max(1, Math.min(10, prev + delta)));
  };

  const handleConsciousnessShift = (delta: number) => {
    setConsciousnessDepth(prev => Math.max(1, Math.min(7, prev + delta)));
  };

  const adjustBiofeedback = (type: 'stress' | 'heartRate', delta: number) => {
    setBiofeedbackData(prev => {
      if (type === 'stress') {
        return {
          ...prev,
          stressLevel: Math.max(0, Math.min(100, prev.stressLevel + delta)),
          timestamp: new Date()
        };
      } else {
        return {
          ...prev,
          heartRate: Math.max(50, Math.min(120, prev.heartRate + delta)),
          timestamp: new Date()
        };
      }
    });
  };

  const getBrainwaveColor = (state: BiofeedbackData['brainwaveState']) => {
    const colors = {
      gamma: 'text-red-400',
      beta: 'text-orange-400', 
      alpha: 'text-green-400',
      theta: 'text-blue-400',
      delta: 'text-purple-400'
    };
    return colors[state];
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

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cosmic Background Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full z-0"
        style={{ background: 'radial-gradient(ellipse at center, #0f0f23 0%, #000000 100%)' }}
      />
      
      {/* Sacred Geometry Overlay */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className={`absolute inset-0 bg-gradient-to-br ${activePrinciple.color} opacity-30`} />
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30l15-15v30zM30 30l-15 15h30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className={`relative z-10 transition-all duration-1000 ${isInitialized ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Header with Universal Principle Display & Biofeedback */}
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

              {/* Biofeedback & Consciousness Indicators */}
              <div className="flex items-center space-x-8">
                {/* Biofeedback Panel */}
                <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center space-x-2 mb-3">
                    <Activity className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium text-white">Real-time Biofeedback</span>
                    <button
                      onClick={() => setIsSimulationActive(!isSimulationActive)}
                      className={`text-xs px-2 py-1 rounded ${isSimulationActive ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}
                    >
                      {isSimulationActive ? 'Live' : 'Paused'}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <span className={getStressLevelColor(biofeedbackData.stressLevel)}>
                          {biofeedbackData.stressLevel}%
                        </span>
                        {React.createElement(getTrendIcon(biofeedbackData.trends.stressLevel), {
                          className: `w-3 h-3 ${getStressLevelColor(biofeedbackData.stressLevel)}`
                        })}
                      </div>
                      <div className="text-gray-300">Stress</div>
                      <div className="flex space-x-1 mt-1">
                        <button
                          onClick={() => adjustBiofeedback('stress', -10)}
                          className="px-1 py-0.5 bg-green-500/20 text-green-300 rounded text-xs hover:bg-green-500/30"
                        >
                          -
                        </button>
                        <button
                          onClick={() => adjustBiofeedback('stress', 10)}
                          className="px-1 py-0.5 bg-red-500/20 text-red-300 rounded text-xs hover:bg-red-500/30"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <span className="text-red-400">{biofeedbackData.heartRate}</span>
                        {React.createElement(getTrendIcon(biofeedbackData.trends.heartRate), {
                          className: 'w-3 h-3 text-red-400'
                        })}
                      </div>
                      <div className="text-gray-300">BPM</div>
                      <div className="flex space-x-1 mt-1">
                        <button
                          onClick={() => adjustBiofeedback('heartRate', -5)}
                          className="px-1 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30"
                        >
                          -
                        </button>
                        <button
                          onClick={() => adjustBiofeedback('heartRate', 5)}
                          className="px-1 py-0.5 bg-red-500/20 text-red-300 rounded text-xs hover:bg-red-500/30"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <span className={getCoherenceColor(biofeedbackData.coherenceScore)}>
                          {Math.round(biofeedbackData.coherenceScore * 100)}%
                        </span>
                        {React.createElement(getTrendIcon(biofeedbackData.trends.coherence), {
                          className: `w-3 h-3 ${getCoherenceColor(biofeedbackData.coherenceScore)}`
                        })}
                      </div>
                      <div className="text-gray-300">Coherence</div>
                      <div className={`text-xs mt-1 ${getBrainwaveColor(biofeedbackData.brainwaveState)} uppercase`}>
                        {biofeedbackData.brainwaveState}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Energy & Consciousness Indicators */}
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-xs text-purple-300 mb-1">Energy Level</div>
                    <div className="flex space-x-1">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-6 rounded-full transition-all ${
                            i < energyLevel ? 'bg-gradient-to-t from-yellow-400 to-orange-500' : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-xs text-purple-300 mb-1">Consciousness</div>
                    <div className="flex space-x-1">
                      {chakras.slice(0, consciousnessDepth).map((chakra, i) => (
                        <div key={i} className="text-lg" title={chakra.name}>
                          {chakra.symbol}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Universal Principle Display */}
            <div className="mt-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{activePrinciple.symbol}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{activePrinciple.name}</h3>
                    <p className="text-purple-200/80 italic">"{activePrinciple.essence}"</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-purple-300">Frequency</div>
                  <div className="text-xl font-bold text-white">{activePrinciple.frequency} Hz</div>
                </div>
              </div>
              
              {/* Consciousness & Science Balance Indicator */}
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Infinity className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-300">Ancient Wisdom</span>
                </div>
                <div className="w-32 h-2 bg-purple-900/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full w-3/4"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-300">Modern Science</span>
                  <Brain className="w-4 h-4 text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Navigation Sidebar with Spiritual Context */}
            <div className="lg:col-span-1">
              <nav className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
                <h2 className="text-lg font-semibold text-purple-200 mb-6 flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Sacred Pathways</span>
                </h2>
                
                <div className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const principle = universalPrinciples.find(p => p.id === section.principle);
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                          activeSection === section.id
                            ? `bg-gradient-to-r ${principle?.color || 'from-purple-500/30 to-indigo-500/30'} text-white border border-white/20 shadow-lg`
                            : 'text-purple-200 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${section.color} transition-transform group-hover:scale-110`} />
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium">{section.name}</div>
                          {activeSection === section.id && principle && (
                            <div className="text-xs opacity-70">{principle.symbol} {principle.name.split(' ').slice(-1)}</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Mini Universal Principles Display */}
                <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
                  <h3 className="text-sm font-semibold text-purple-200 mb-3 flex items-center space-x-2">
                    <Infinity className="w-4 h-4" />
                    <span>Universal Principles</span>
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {universalPrinciples.map((principle) => (
                      <button
                        key={principle.id}
                        onClick={() => setActivePrinciple(principle)}
                        className={`text-xl p-2 rounded-lg transition-all ${
                          activePrinciple.id === principle.id
                            ? `bg-gradient-to-br ${principle.color} shadow-lg scale-110`
                            : 'hover:bg-white/10 hover:scale-105'
                        }`}
                        title={principle.name}
                      >
                        {principle.symbol}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Energy Control Panel */}
                <div className="mt-6 space-y-4">
                  <button
                    onClick={() => handleEnergyShift(1)}
                    className="w-full flex items-center justify-center space-x-2 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 rounded-lg hover:from-yellow-500/30 hover:to-orange-500/30 transition-all"
                  >
                    <Zap className="w-4 h-4" />
                    <span className="text-sm">Elevate Energy</span>
                  </button>
                  
                  <button
                    onClick={() => handleConsciousnessShift(1)}
                    className="w-full flex items-center justify-center space-x-2 py-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 rounded-lg hover:from-purple-500/30 hover:to-indigo-500/30 transition-all"
                  >
                    <Brain className="w-4 h-4" />
                    <span className="text-sm">Expand Consciousness</span>
                  </button>
                </div>
              </nav>
            </div>

            {/* Main Content with Spiritual Enhancement */}
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