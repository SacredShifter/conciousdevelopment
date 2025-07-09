import React, { useState, useEffect } from 'react';
import { Sun, Play, Pause, RotateCcw, Clock, Volume2, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import type { BiofeedbackData } from '../types/ssos';

interface MindfulnessLibraryProps {
  biofeedbackData?: BiofeedbackData;
}

const meditationTypes = [
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    description: 'Present moment awareness and breath focus',
    stressReduction: 'high',
    sessions: [
      { duration: 5, title: 'Quick Centering', description: 'Brief mindfulness reset', stressTarget: 'any' },
      { duration: 10, title: 'Basic Mindfulness', description: 'Fundamental awareness practice', stressTarget: 'moderate' },
      { duration: 20, title: 'Deep Mindfulness', description: 'Extended present moment awareness', stressTarget: 'high' }
    ]
  },
  {
    id: 'loving-kindness',
    name: 'Loving Kindness',
    description: 'Cultivate compassion for self and others',
    stressReduction: 'moderate',
    sessions: [
      { duration: 10, title: 'Self-Compassion', description: 'Direct love and kindness toward yourself', stressTarget: 'low' },
      { duration: 15, title: 'Expanding Circle', description: 'Extend kindness to loved ones and beyond', stressTarget: 'moderate' },
      { duration: 25, title: 'Universal Love', description: 'Radiate love to all beings', stressTarget: 'any' }
    ]
  },
  {
    id: 'body-scan',
    name: 'Body Scan',
    description: 'Progressive relaxation and body awareness',
    stressReduction: 'high',
    sessions: [
      { duration: 8, title: 'Quick Body Check', description: 'Brief body awareness scan', stressTarget: 'any' },
      { duration: 15, title: 'Full Body Scan', description: 'Complete head-to-toe relaxation', stressTarget: 'moderate' },
      { duration: 30, title: 'Deep Body Journey', description: 'Intensive somatic awareness', stressTarget: 'high' }
    ]
  },
  {
    id: 'breathwork',
    name: 'Breathwork',
    description: 'Various breathing techniques for different states',
    stressReduction: 'very-high',
    sessions: [
      { duration: 5, title: '4-7-8 Breathing', description: 'Calming breathwork for anxiety', stressTarget: 'high' },
      { duration: 10, title: 'Box Breathing', description: 'Balanced breathing for focus', stressTarget: 'moderate' },
      { duration: 15, title: 'Coherent Breathing', description: 'Heart-brain coherence optimization', stressTarget: 'any' }
    ]
  }
];

const ambientSounds = [
  { id: 'rain', name: 'Rain', emoji: '🌧️' },
  { id: 'ocean', name: 'Ocean Waves', emoji: '🌊' },
  { id: 'forest', name: 'Forest', emoji: '🌲' },
  { id: 'birds', name: 'Birds', emoji: '🐦' },
  { id: 'wind', name: 'Wind', emoji: '💨' },
  { id: 'silence', name: 'Silence', emoji: '🤫' }
];

export function MindfulnessLibrary({ biofeedbackData }: MindfulnessLibraryProps) {
  const [selectedType, setSelectedType] = useState(meditationTypes[0]);
  const [selectedSession, setSelectedSession] = useState(selectedType.sessions[0]);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [selectedSound, setSelectedSound] = useState('silence');
  const [phase, setPhase] = useState<'prepare' | 'meditate' | 'complete'>('prepare');
  const [biofeedbackRecommendations, setBiofeedbackRecommendations] = useState<string[]>([]);

  useEffect(() => {
    setSelectedSession(selectedType.sessions[0]);
  }, [selectedType]);

  useEffect(() => {
    if (biofeedbackData) {
      generateBiofeedbackRecommendations();
    }
  }, [biofeedbackData]);

  const generateBiofeedbackRecommendations = () => {
    if (!biofeedbackData) return;

    const recommendations: string[] = [];
    
    // Stress level recommendations
    if (biofeedbackData.stressLevel > 70) {
      recommendations.push('🚨 High stress detected - Consider 4-7-8 breathing or body scan');
    } else if (biofeedbackData.stressLevel > 50) {
      recommendations.push('⚠️ Moderate stress - Mindfulness or breathwork recommended');
    } else if (biofeedbackData.stressLevel < 30) {
      recommendations.push('✅ Low stress - Perfect for loving-kindness or longer sessions');
    }

    // Heart rate recommendations
    if (biofeedbackData.heartRate > 85) {
      recommendations.push('❤️ Elevated heart rate - Focus on coherent breathing');
    } else if (biofeedbackData.heartRate < 65) {
      recommendations.push('💙 Calm heart rate - Good state for mindfulness practice');
    }

    // Coherence recommendations
    if (biofeedbackData.coherenceScore < 0.4) {
      recommendations.push('🔄 Low coherence - Try heart-focused breathing techniques');
    } else if (biofeedbackData.coherenceScore > 0.7) {
      recommendations.push('✨ High coherence - Excellent state for advanced practices');
    }

    // Brainwave recommendations
    if (biofeedbackData.brainwaveState === 'gamma') {
      recommendations.push('🧠 Gamma waves - Consider calming practices to reduce mental activity');
    } else if (biofeedbackData.brainwaveState === 'alpha') {
      recommendations.push('🌊 Alpha waves - Perfect state for mindfulness meditation');
    } else if (biofeedbackData.brainwaveState === 'theta') {
      recommendations.push('🎭 Theta waves - Ideal for visualization and deeper practices');
    }

    setBiofeedbackRecommendations(recommendations);
  };

  const getRecommendedPractices = () => {
    if (!biofeedbackData) return [];

    const recommendations: Array<{
      type: typeof meditationTypes[0];
      session: typeof meditationTypes[0]['sessions'][0];
      reason: string;
      priority: 'high' | 'medium' | 'low';
    }> = [];

    meditationTypes.forEach(type => {
      type.sessions.forEach(session => {
        let priority: 'high' | 'medium' | 'low' = 'low';
        let reason = '';

        // High stress prioritization
        if (biofeedbackData.stressLevel > 60 && type.stressReduction === 'very-high') {
          priority = 'high';
          reason = 'High stress relief potential';
        } else if (biofeedbackData.stressLevel > 40 && type.stressReduction === 'high') {
          priority = 'medium';
          reason = 'Good stress management';
        }

        // Heart rate optimization
        if (biofeedbackData.heartRate > 85 && type.id === 'breathwork') {
          priority = priority === 'high' ? 'high' : 'medium';
          reason = reason ? `${reason} + heart rate regulation` : 'Heart rate regulation';
        }

        // Coherence improvement
        if (biofeedbackData.coherenceScore < 0.5 && session.title.includes('Coherent')) {
          priority = 'high';
          reason = 'Coherence optimization';
        }

        if (priority !== 'low') {
          recommendations.push({ type, session, reason, priority });
        }
      });
    });

    return recommendations.sort((a, b) => 
      a.priority === 'high' ? -1 : b.priority === 'high' ? 1 : 0
    );
  };

  const startMeditation = () => {
    setTimeRemaining(selectedSession.duration * 60);
    setIsActive(true);
    setPhase('meditate');
    
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          setPhase('complete');
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimer(interval);
  };

  const pauseMeditation = () => {
    setIsActive(false);
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  const resumeMeditation = () => {
    if (timeRemaining > 0) {
      setIsActive(true);
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setPhase('complete');
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimer(interval);
    }
  };

  const resetMeditation = () => {
    setIsActive(false);
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setTimeRemaining(0);
    setPhase('prepare');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseInstructions = () => {
    switch (selectedType.id) {
      case 'mindfulness':
        return {
          prepare: "Find a comfortable seated position. Close your eyes and take three deep breaths.",
          meditate: "Focus on your breath. When your mind wanders, gently return attention to breathing.",
          complete: "Take a moment to notice how you feel. Slowly open your eyes when ready."
        };
      case 'loving-kindness':
        return {
          prepare: "Sit comfortably and close your eyes. Place one hand on your heart.",
          meditate: "Begin with yourself: 'May I be happy, may I be peaceful, may I be free from suffering.'",
          complete: "Feel the warmth of loving-kindness in your heart. Carry this feeling with you."
        };
      case 'body-scan':
        return {
          prepare: "Lie down comfortably or sit with your back supported. Close your eyes.",
          meditate: "Starting from the top of your head, slowly scan down through your entire body.",
          complete: "Notice the relaxation and peace in your body. Rest here for a moment."
        };
      case 'breathwork':
        return {
          prepare: "Sit with your spine straight. Place one hand on chest, one on belly.",
          meditate: "Follow the specific breathing pattern. Keep your attention on the breath.",
          complete: "Return to natural breathing. Notice the shift in your energy and awareness."
        };
      default:
        return {
          prepare: "Prepare your space and settle into a comfortable position.",
          meditate: "Focus on your chosen meditation technique.",
          complete: "Take time to integrate your meditation experience."
        };
    }
  };

  const instructions = getPhaseInstructions();
  const recommendedPractices = getRecommendedPractices();

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-8">
        <Sun className="w-8 h-8 text-amber-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Mindfulness Library</h2>
          <p className="text-purple-200/80">Guided meditation and mindfulness practices</p>
        </div>
      </div>

      {/* Biofeedback Recommendations */}
      {biofeedbackData && (
        <div className="mb-8 space-y-4">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-xl border border-blue-500/30">
            <div className="flex items-center space-x-2 mb-3">
              <Activity className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Personalized Recommendations</h3>
            </div>
            <div className="space-y-2">
              {biofeedbackRecommendations.map((rec, index) => (
                <p key={index} className="text-blue-200 text-sm">{rec}</p>
              ))}
            </div>
          </div>

          {recommendedPractices.length > 0 && (
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 rounded-xl border border-green-500/30">
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Adaptive Practice Suggestions</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recommendedPractices.slice(0, 4).map((rec, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedType(rec.type);
                      setSelectedSession(rec.session);
                    }}
                    className={`p-3 rounded-lg border text-left transition-all hover:bg-white/10 ${
                      rec.priority === 'high' 
                        ? 'border-green-400/50 bg-green-500/10' 
                        : 'border-emerald-400/30 bg-emerald-500/5'
                    }`}
                  >
                    <div className="font-medium text-white text-sm">{rec.session.title}</div>
                    <div className="text-xs text-green-300 mt-1">{rec.reason}</div>
                    <div className="text-xs text-green-200/70 mt-1">{rec.session.duration} min • {rec.type.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Meditation Types */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-purple-200 mb-4">Practice Types</h3>
          <div className="space-y-3">
            {meditationTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type)}
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  selectedType.id === type.id
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 text-white'
                    : 'bg-white/5 border border-purple-500/20 text-purple-200 hover:bg-white/10'
                }`}
              >
                <h4 className="font-medium mb-1">{type.name}</h4>
                <p className="text-sm opacity-80">{type.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    type.stressReduction === 'very-high' ? 'bg-red-500/20 text-red-300' :
                    type.stressReduction === 'high' ? 'bg-orange-500/20 text-orange-300' :
                    'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {type.stressReduction} stress relief
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Ambient Sounds */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-purple-200 mb-4">Ambient Sounds</h3>
            <div className="grid grid-cols-2 gap-2">
              {ambientSounds.map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => setSelectedSound(sound.id)}
                  className={`p-3 rounded-lg text-center transition-all ${
                    selectedSound === sound.id
                      ? 'bg-purple-500/30 text-white border border-purple-400/30'
                      : 'bg-white/5 text-purple-200 hover:bg-white/10'
                  }`}
                >
                  <div className="text-xl mb-1">{sound.emoji}</div>
                  <div className="text-xs">{sound.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {phase === 'prepare' && (
            <div className="bg-white/5 p-8 rounded-2xl border border-purple-500/20">
              <h3 className="text-2xl font-bold text-white mb-4">{selectedType.name}</h3>
              <p className="text-purple-200/80 mb-6">{selectedType.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {selectedType.sessions.map((session) => (
                  <button
                    key={session.duration}
                    onClick={() => setSelectedSession(session)}
                    className={`p-4 rounded-lg text-left transition-all ${
                      selectedSession.duration === session.duration
                        ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/30 text-white'
                        : 'bg-white/5 border border-purple-500/20 text-purple-200 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{session.duration} min</span>
                    </div>
                    <h4 className="font-medium mb-1">{session.title}</h4>
                    <p className="text-sm opacity-80">{session.description}</p>
                  </button>
                ))}
              </div>

              <div className="text-center">
                <p className="text-purple-200/70 mb-6">{instructions.prepare}</p>
                <button
                  onClick={startMeditation}
                  className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all mx-auto"
                >
                  <Play className="w-5 h-5" />
                  <span>Begin Meditation</span>
                </button>
              </div>
            </div>
          )}

          {phase === 'meditate' && (
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-8 rounded-2xl border border-purple-500/20 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">{selectedSession.title}</h3>
              
              <div className="text-6xl font-bold text-amber-400 mb-6">
                {formatTime(timeRemaining)}
              </div>

              <div className="flex items-center justify-center space-x-2 mb-8">
                <Volume2 className="w-5 h-5 text-purple-300" />
                <span className="text-purple-200">
                  {ambientSounds.find(s => s.id === selectedSound)?.name}
                </span>
              </div>

              <p className="text-lg text-purple-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                {instructions.meditate}
              </p>

              {/* Real-time biofeedback display during meditation */}
              {biofeedbackData && (
                <div className="mb-8 p-4 bg-black/30 rounded-lg border border-white/10">
                  <div className="text-sm text-purple-300 mb-2">Live Biofeedback</div>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{biofeedbackData.stressLevel}%</div>
                      <div className="text-gray-300">Stress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-400">{biofeedbackData.heartRate}</div>
                      <div className="text-gray-300">BPM</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{Math.round(biofeedbackData.coherenceScore * 100)}%</div>
                      <div className="text-gray-300">Coherence</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                {!isActive ? (
                  <button
                    onClick={resumeMeditation}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    <span>Resume</span>
                  </button>
                ) : (
                  <button
                    onClick={pauseMeditation}
                    className="flex items-center space-x-2 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
                  >
                    <Pause className="w-5 h-5" />
                    <span>Pause</span>
                  </button>
                )}
                
                <button
                  onClick={resetMeditation}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>End Session</span>
                </button>
              </div>
            </div>
          )}

          {phase === 'complete' && (
            <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 p-8 rounded-2xl border border-green-500/20 text-center">
              <div className="text-6xl mb-6">🙏</div>
              <h3 className="text-2xl font-bold text-white mb-4">Session Complete</h3>
              <p className="text-lg text-green-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                {instructions.complete}
              </p>
              
              <div className="bg-white/5 p-6 rounded-xl border border-green-500/20 mb-8">
                <h4 className="text-lg font-semibold text-green-300 mb-4">How was your session?</h4>
                <div className="flex justify-center space-x-4">
                  {['😌', '😊', '😍', '🤗', '✨'].map((emoji, index) => (
                    <button
                      key={index}
                      className="text-3xl hover:scale-110 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={resetMeditation}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all"
              >
                Start New Session
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}