import React, { useState } from 'react';
import { Sparkles, Play, Pause, RotateCcw, Clock, Target, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import type { UnblockingPractice } from '../types/ssos';
import type { BiofeedbackData } from '../types/ssos';

interface UnblockingPracticesProps {
  biofeedbackData?: BiofeedbackData;
}

const practices: (UnblockingPractice & { 
  stressTargets: number[];
  adaptiveInstructions?: Record<string, string[]>;
})[] = [
  {
    id: '1',
    name: 'Stress-Release Breathing',
    type: 'breathwork',
    duration: 8,
    description: 'Adaptive breathing technique that adjusts to your current stress level',
    stressTargets: [50, 60, 70, 80],
    instructions: [
      'Find a comfortable seated position and close your eyes',
      'Place one hand on your chest, one on your belly',
      'Begin with natural breathing to establish baseline',
      'Adapt your breathing pattern based on current stress level',
      'Continue for the full duration, adjusting as needed',
      'End with three deep cleansing breaths'
    ],
    adaptiveInstructions: {
      'low': [
        'Breathe naturally with gentle 4-4-4 pattern (inhale-hold-exhale)',
        'Focus on expanding your belly on the inhale',
        'Allow exhale to be slightly longer than inhale'
      ],
      'moderate': [
        'Use 4-7-8 breathing pattern (inhale 4, hold 7, exhale 8)',
        'Breathe through your nose for inhale, mouth for exhale',
        'Make exhale sound like "ahhhh" to release tension'
      ],
      'high': [
        'Begin with rapid stress-relief breathing (6-2-6 pattern)',
        'Breathe in for 6, pause for 2, exhale for 6',
        'After 2 minutes, extend to 4-7-8 pattern for deeper calm'
      ]
    },
    benefits: ['Reduces cortisol', 'Calms nervous system', 'Improves HRV'],
    blocks: ['anxiety', 'overwhelm', 'panic']
  },
  {
    id: '2',
    name: 'Adaptive Fear Transformation',
    type: 'visualization',
    duration: 12,
    description: 'Transforms fear into empowerment with biofeedback-guided intensity',
    stressTargets: [40, 60, 80],
    instructions: [
      'Sit comfortably and take three centering breaths',
      'Identify the fear or anxiety you\'re experiencing',
      'Visualize this fear as an object or energy in front of you',
      'Follow the adaptive transformation process',
      'Integrate the transformed energy back into your being',
      'Seal the practice with an empowering affirmation'
    ],
    adaptiveInstructions: {
      'low': [
        'Visualize fear as a gray cloud, gently dissolve it with golden light',
        'Transform slowly and mindfully, feeling each shift',
        'See the energy becoming wisdom and inner strength'
      ],
      'moderate': [
        'Visualize fear as a storm, use your breath as wind to redirect it',
        'Transform the storm energy into a powerful river of courage',
        'Feel this courage flowing through your entire being'
      ],
      'high': [
        'Visualize fear as fire, acknowledge its intensity without judgment',
        'Use cooling blue light to contain and transform the fire',
        'Channel the fire\'s energy into passionate determination'
      ]
    },
    benefits: ['Transforms limiting beliefs', 'Builds courage', 'Increases self-confidence'],
    blocks: ['fear', 'anxiety', 'self-doubt', 'phobias']
  },
  {
    id: '3',
    name: 'Heart Coherence Builder',
    type: 'meditation',
    duration: 10,
    description: 'Builds heart-brain coherence with real-time biofeedback optimization',
    stressTargets: [30, 50, 70],
    instructions: [
      'Place your hand over your heart and feel the rhythm',
      'Begin breathing slowly and rhythmically',
      'Focus your attention in the area of your heart',
      'Activate a positive feeling like appreciation or compassion',
      'Breathe this feeling through your heart area',
      'Maintain this coherent state throughout the practice'
    ],
    adaptiveInstructions: {
      'low': [
        'Use 5-5 breathing pattern (inhale 5, exhale 5)',
        'Focus on feelings of appreciation and gratitude',
        'Maintain gentle, smooth breathing rhythm'
      ],
      'moderate': [
        'Use 6-6 breathing pattern for deeper coherence',
        'Cultivate feelings of compassion and love',
        'Imagine breathing through your heart center'
      ],
      'high': [
        'Start with 4-4 pattern to establish rhythm quickly',
        'Focus on self-compassion and forgiveness',
        'Gradually extend to 5-5 pattern as you stabilize'
      ]
    },
    benefits: ['Improves HRV', 'Balances emotions', 'Enhances intuition'],
    blocks: ['emotional reactivity', 'stress', 'decision fatigue']
  },
  {
    id: '4',
    name: 'Confidence Activation Protocol',
    type: 'affirmation',
    duration: 6,
    description: 'Builds unshakeable confidence with stress-adapted affirmations',
    stressTargets: [20, 40, 60],
    instructions: [
      'Stand tall with shoulders back and head high',
      'Take three power breaths to center yourself',
      'Speak each affirmation with conviction and authority',
      'Feel the truth of each statement in your body',
      'Adapt intensity based on your current state',
      'End with a personal power statement'
    ],
    adaptiveInstructions: {
      'low': [
        'Use gentle, nurturing affirmations',
        'Speak in a calm, reassuring tone',
        'Focus on self-acceptance: "I am enough as I am"'
      ],
      'moderate': [
        'Use empowering, activating affirmations',
        'Speak with strong, clear voice',
        'Focus on capability: "I have everything I need within me"'
      ],
      'high': [
        'Use powerful, protective affirmations',
        'Speak with fierce determination',
        'Focus on strength: "I am powerful beyond any challenge"'
      ]
    },
    benefits: ['Builds self-esteem', 'Increases assertiveness', 'Enhances presence'],
    blocks: ['self-doubt', 'insecurity', 'imposter syndrome']
  }
];

export function UnblockingPractices({ biofeedbackData }: UnblockingPracticesProps) {
  const [selectedPractice, setSelectedPractice] = useState<typeof practices[0] | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [adaptiveLevel, setAdaptiveLevel] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [biofeedbackRecommendations, setBiofeedbackRecommendations] = useState<string[]>([]);

  React.useEffect(() => {
    if (biofeedbackData) {
      generateAdaptiveRecommendations();
      determineAdaptiveLevel();
    }
  }, [biofeedbackData]);

  const generateAdaptiveRecommendations = () => {
    if (!biofeedbackData) return;

    const recommendations: string[] = [];
    
    if (biofeedbackData.stressLevel > 70) {
      recommendations.push('🚨 High stress detected - Stress-Release Breathing recommended');
    } else if (biofeedbackData.stressLevel > 50) {
      recommendations.push('⚠️ Moderate stress - Fear Transformation or Breathing work suggested');
    }

    if (biofeedbackData.coherenceScore < 0.4) {
      recommendations.push('❤️ Low coherence - Heart Coherence Builder strongly recommended');
    }

    if (biofeedbackData.heartRate > 90) {
      recommendations.push('💓 Elevated heart rate - Breathwork practices will help regulation');
    }

    if (biofeedbackData.trends.stressLevel === 'rising') {
      recommendations.push('📈 Stress trend rising - Early intervention recommended');
    }

    setBiofeedbackRecommendations(recommendations);
  };

  const determineAdaptiveLevel = () => {
    if (!biofeedbackData) return;

    if (biofeedbackData.stressLevel > 65) {
      setAdaptiveLevel('high');
    } else if (biofeedbackData.stressLevel > 35) {
      setAdaptiveLevel('moderate');
    } else {
      setAdaptiveLevel('low');
    }
  };

  const getRecommendedPractices = () => {
    if (!biofeedbackData) return [];

    return practices
      .map(practice => {
        let score = 0;
        let reasons: string[] = [];

        // Stress level matching
        const stressMatch = practice.stressTargets.find(target => 
          Math.abs(target - biofeedbackData.stressLevel) < 20
        );
        if (stressMatch) {
          score += 3;
          reasons.push('Stress level match');
        }

        // Block type matching
        if (biofeedbackData.stressLevel > 60 && practice.blocks.includes('anxiety')) {
          score += 2;
          reasons.push('Anxiety relief');
        }

        if (biofeedbackData.coherenceScore < 0.5 && practice.name.includes('Coherence')) {
          score += 3;
          reasons.push('Coherence improvement');
        }

        if (biofeedbackData.heartRate > 85 && practice.type === 'breathwork') {
          score += 2;
          reasons.push('Heart rate regulation');
        }

        return { practice, score, reasons };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);
  };

  const startPractice = (practice: typeof practices[0]) => {
    setSelectedPractice(practice);
    setCurrentStep(0);
    setTimeRemaining(practice.duration * 60);
    setIsActive(true);
    
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimer(interval);
  };

  const pausePractice = () => {
    setIsActive(false);
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  const resumePractice = () => {
    if (timeRemaining > 0) {
      setIsActive(true);
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimer(interval);
    }
  };

  const resetPractice = () => {
    setIsActive(false);
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setCurrentStep(0);
    setTimeRemaining(selectedPractice ? selectedPractice.duration * 60 : 0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      meditation: 'text-blue-400',
      breathwork: 'text-green-400',
      affirmation: 'text-yellow-400',
      visualization: 'text-purple-400',
      journaling: 'text-orange-400'
    };
    return colors[type as keyof typeof colors] || 'text-gray-400';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meditation': return '🧘';
      case 'breathwork': return '🫁';
      case 'affirmation': return '💫';
      case 'visualization': return '✨';
      case 'journaling': return '📝';
      default: return '🔮';
    }
  };

  const getAdaptiveLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'moderate': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const recommendedPractices = getRecommendedPractices();

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-8">
        <Sparkles className="w-8 h-8 text-purple-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Adaptive Unblocking Practices</h2>
          <p className="text-purple-200/80">Transform limitations with biofeedback-guided practices</p>
        </div>
      </div>

      {/* Biofeedback Status & Recommendations */}
      {biofeedbackData && (
        <div className="mb-8 space-y-4">
          <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 p-4 rounded-xl border border-purple-500/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Current Biofeedback Status</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-purple-300">Adaptive Level:</span>
                <span className={`text-sm font-medium ${getAdaptiveLevelColor(adaptiveLevel)} capitalize`}>
                  {adaptiveLevel}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-300">{biofeedbackData.stressLevel}%</div>
                <div className="text-purple-200">Stress Level</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-300">{biofeedbackData.heartRate}</div>
                <div className="text-purple-200">Heart Rate</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-300">{Math.round(biofeedbackData.coherenceScore * 100)}%</div>
                <div className="text-purple-200">Coherence</div>
              </div>
            </div>

            {biofeedbackRecommendations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-purple-500/20">
                <div className="space-y-2">
                  {biofeedbackRecommendations.map((rec, index) => (
                    <p key={index} className="text-purple-200 text-sm">{rec}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recommended Practices */}
          {recommendedPractices.length > 0 && (
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 rounded-xl border border-green-500/30">
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Recommended for You Right Now</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recommendedPractices.slice(0, 4).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => startPractice(item.practice)}
                    className="p-3 rounded-lg border border-green-400/30 bg-green-500/10 text-left transition-all hover:bg-green-500/20"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">{getTypeIcon(item.practice.type)}</span>
                      <span className="font-medium text-white text-sm">{item.practice.name}</span>
                    </div>
                    <div className="text-xs text-green-300 mb-1">
                      Score: {item.score} • {item.reasons.join(', ')}
                    </div>
                    <div className="text-xs text-green-200/70">
                      {item.practice.duration} min • Adapted for {adaptiveLevel} intensity
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!selectedPractice ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {practices.map((practice) => (
            <div key={practice.id} className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 p-6 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTypeIcon(practice.type)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{practice.name}</h3>
                    <p className={`text-sm capitalize ${getTypeColor(practice.type)}`}>
                      {practice.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-purple-300">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{practice.duration}min</span>
                </div>
              </div>

              <p className="text-purple-200/80 mb-4">{practice.description}</p>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-purple-300 mb-2">Helps with:</h4>
                <div className="flex flex-wrap gap-2">
                  {practice.blocks.map((block, index) => (
                    <span key={index} className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full">
                      {block}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-purple-300 mb-2">Benefits:</h4>
                <ul className="text-sm text-purple-200/70 space-y-1">
                  {practice.benefits.map((benefit, index) => (
                    <li key={index}>• {benefit}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => startPractice(practice)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all"
              >
                <Play className="w-4 h-4" />
                <span>Start Practice</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 p-8 rounded-2xl border border-purple-500/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">{selectedPractice.name}</h3>
              <p className="text-purple-200/80 mb-2">{selectedPractice.description}</p>
              <div className={`text-sm ${getAdaptiveLevelColor(adaptiveLevel)} font-medium`}>
                Adapted for {adaptiveLevel} intensity level
              </div>
            </div>

            <div className="flex items-center justify-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-sm text-purple-300">Time Remaining</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-400 mb-2">
                  {currentStep + 1}/{selectedPractice.instructions.length}
                </div>
                <div className="text-sm text-indigo-300">Current Step</div>
              </div>

              {biofeedbackData && (
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    {biofeedbackData.stressLevel}%
                  </div>
                  <div className="text-sm text-green-300">Live Stress</div>
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-4 mb-8">
              {!isActive ? (
                <button
                  onClick={resumePractice}
                  disabled={timeRemaining === 0}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all disabled:opacity-50"
                >
                  <Play className="w-5 h-5" />
                  <span>Resume</span>
                </button>
              ) : (
                <button
                  onClick={pausePractice}
                  className="flex items-center space-x-2 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
                >
                  <Pause className="w-5 h-5" />
                  <span>Pause</span>
                </button>
              )}
              
              <button
                onClick={resetPractice}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset</span>
              </button>
              
              <button
                onClick={() => setSelectedPractice(null)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
              >
                Choose Different Practice
              </button>
            </div>

            {/* Instructions with Adaptive Content */}
            <div className="bg-white/5 p-6 rounded-xl border border-purple-500/20">
              <h4 className="text-lg font-semibold text-white mb-4">Instructions</h4>
              
              {/* Standard Instructions */}
              <div className="space-y-4 mb-6">
                {selectedPractice.instructions.map((instruction, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border transition-all ${
                      index === currentStep
                        ? 'bg-purple-500/20 border-purple-400/50 text-white'
                        : index < currentStep
                        ? 'bg-green-500/10 border-green-500/30 text-green-200'
                        : 'bg-white/5 border-purple-500/20 text-purple-200/60'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        index === currentStep
                          ? 'bg-purple-500 text-white'
                          : index < currentStep
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-600 text-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      <p className="flex-1">{instruction}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Adaptive Instructions */}
              {selectedPractice.adaptiveInstructions && (
                <div className="border-t border-purple-500/20 pt-6">
                  <h5 className="text-md font-semibold text-white mb-3 flex items-center space-x-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    <span>Adaptive Guidance for {adaptiveLevel.charAt(0).toUpperCase() + adaptiveLevel.slice(1)} Intensity</span>
                  </h5>
                  <div className="space-y-2">
                    {selectedPractice.adaptiveInstructions[adaptiveLevel]?.map((instruction, index) => (
                      <div key={index} className="p-3 bg-purple-500/10 rounded-lg border border-purple-400/20">
                        <p className="text-purple-200 text-sm">• {instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all disabled:opacity-50"
                >
                  Previous Step
                </button>
                <button
                  onClick={() => setCurrentStep(Math.min(selectedPractice.instructions.length - 1, currentStep + 1))}
                  disabled={currentStep === selectedPractice.instructions.length - 1}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50"
                >
                  Next Step
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}