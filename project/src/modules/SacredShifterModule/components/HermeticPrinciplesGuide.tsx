import React, { useState } from 'react';
import { Infinity, Brain, Eye, Zap, Waves, RotateCcw, Ambulance as Balance } from 'lucide-react';

const principles = [
  {
    id: 'mentalism',
    name: 'The Principle of Mentalism',
    essence: 'The All is Mind; the Universe is Mental',
    icon: Brain,
    color: 'from-violet-500 to-purple-700',
    frequency: 963,
    dailyManifestations: [
      'Your thoughts directly influence your emotional state and physical responses',
      'What you focus on mentally tends to expand in your experience',
      'Mental rehearsal can improve actual performance in skills and activities',
      'Your beliefs and expectations shape how you interpret events',
      'Visualization and mental imagery can create real physiological changes'
    ],
    practicalExercises: [
      'Practice mindful awareness of your thought patterns for 10 minutes daily',
      'Use mental rehearsal before important events or conversations',
      'Notice how different thoughts affect your body posture and energy',
      'Experiment with changing negative thought patterns through conscious redirection',
      'Keep a thought-emotion-outcome journal to track mental influences'
    ],
    scientificCorrelation: 'Supported by neuroscience research on neuroplasticity, the placebo effect, and cognitive behavioral therapy principles.',
    dreamApplication: 'Dreams reflect your mental state and can be used to understand subconscious thought patterns and beliefs.'
  },
  {
    id: 'correspondence',
    name: 'The Principle of Correspondence',
    essence: 'As above, so below; as below, so above',
    icon: Eye,
    color: 'from-blue-500 to-indigo-700',
    frequency: 852,
    dailyManifestations: [
      'Your outer circumstances reflect your inner state and vice versa',
      'Patterns in your personal relationships mirror patterns in your relationship with yourself',
      'How you treat others often reflects how you treat yourself internally',
      'Your physical environment tends to reflect your mental and emotional state',
      'Small changes in daily habits can create larger life transformations'
    ],
    practicalExercises: [
      'Examine your living space - what does its organization say about your inner state?',
      'Notice repeating patterns in your relationships and trace them to internal beliefs',
      'Practice treating yourself with the same kindness you show others',
      'Look for fractal patterns in nature and reflect on similar patterns in your life',
      'Use your body as a mirror - what physical tension reveals emotional holding'
    ],
    scientificCorrelation: 'Reflected in systems theory, holographic principle, and research on embodied cognition.',
    dreamApplication: 'Dream symbols often correspond to waking life situations, with inner conflicts manifesting as dream scenarios.'
  },
  {
    id: 'vibration',
    name: 'The Principle of Vibration',
    essence: 'Nothing rests; everything moves; everything vibrates',
    icon: Waves,
    color: 'from-cyan-500 to-teal-700',
    frequency: 741,
    dailyManifestations: [
      'Your emotional state has a vibrational quality that others can sense',
      'Music, sounds, and frequencies can directly affect your mood and energy',
      'Different places and people have distinct "vibes" or energetic signatures',
      'Your voice tone and speaking patterns reflect and influence your internal state',
      'Physical movement and exercise change your energetic vibration'
    ],
    practicalExercises: [
      'Notice how different music affects your energy and emotional state',
      'Practice matching your voice tone to the energy you want to cultivate',
      'Experiment with movement or dance to shift your vibrational state',
      'Pay attention to the energetic feeling of different environments',
      'Use breathing techniques to consciously alter your internal rhythm'
    ],
    scientificCorrelation: 'Supported by wave physics, cymatics, bioacoustics, and research on frequency medicine.',
    dreamApplication: 'Dreams often have emotional "frequencies" that can be decoded through feeling-tones and energetic signatures.'
  },
  {
    id: 'polarity',
    name: 'The Principle of Polarity',
    essence: 'Everything is dual; everything has poles; everything has its pair of opposites',
    icon: Balance,
    color: 'from-emerald-500 to-green-700',
    frequency: 639,
    dailyManifestations: [
      'Every challenge contains the seed of an opportunity',
      'Your greatest strengths, when overused, can become weaknesses',
      'Difficult emotions contain valuable information and energy',
      'Conflicts often reveal hidden desires or unmet needs',
      'What you resist or judge in others may reflect something within yourself'
    ],
    practicalExercises: [
      'When experiencing a negative emotion, ask "What is the gift in this feeling?"',
      'Practice finding the opposite quality within yourself during conflicts',
      'Identify how your strengths might sometimes work against you',
      'Look for the hidden opportunity within current challenges',
      'Use the "both/and" perspective instead of "either/or" thinking'
    ],
    scientificCorrelation: 'Reflected in quantum complementarity, dialectical thinking, and polyvagal theory.',
    dreamApplication: 'Dream polarities (light/dark, up/down, known/unknown) often represent internal conflicts seeking integration.'
  },
  {
    id: 'rhythm',
    name: 'The Principle of Rhythm',
    essence: 'Everything flows, out and in; everything has its tides',
    icon: RotateCcw,
    color: 'from-amber-500 to-orange-700',
    frequency: 528,
    dailyManifestations: [
      'Your energy naturally fluctuates throughout the day in predictable patterns',
      'Relationships have natural cycles of closeness and distance',
      'Creative inspiration comes in waves that can be honored and worked with',
      'Emotional states are temporary and will naturally shift if allowed to flow',
      'Seasonal changes affect your mood, motivation, and biological rhythms'
    ],
    practicalExercises: [
      'Track your energy patterns and schedule important tasks during peak times',
      'Practice allowing emotions to flow through you without resistance',
      'Honor natural rhythms by taking breaks and rest when needed',
      'Notice seasonal influences on your mood and adjust activities accordingly',
      'Use breathing rhythms to regulate your nervous system'
    ],
    scientificCorrelation: 'Validated by circadian rhythm research, ultradian cycles, and chronobiology.',
    dreamApplication: 'Dreams follow natural REM cycles and can be tracked for patterns related to life rhythms and cycles.'
  },
  {
    id: 'cause-effect',
    name: 'The Principle of Cause and Effect',
    essence: 'Every cause has its effect; every effect has its cause',
    icon: Zap,
    color: 'from-red-500 to-rose-700',
    frequency: 417,
    dailyManifestations: [
      'Your current circumstances are largely the result of past choices and actions',
      'Small, consistent actions compound into significant life changes over time',
      'Your responses to events create more influence than the events themselves',
      'Unconscious patterns and habits create predictable outcomes',
      'Taking responsibility increases your power to create desired changes'
    ],
    practicalExercises: [
      'Trace current challenges back to their contributing causes without self-blame',
      'Identify one small daily action that could improve your desired outcome',
      'Notice the gap between stimulus and response - expand your choice point',
      'Track how your attitudes and responses influence others\' behavior toward you',
      'Practice conscious intention-setting before important interactions'
    ],
    scientificCorrelation: 'Supported by behavioral psychology, chaos theory, and research on habit formation.',
    dreamApplication: 'Dream scenarios often reveal unconscious patterns and their consequences, providing insight into cause-effect chains.'
  },
  {
    id: 'gender',
    name: 'The Principle of Gender',
    essence: 'Gender is in everything; everything has its masculine and feminine principles',
    icon: Infinity,
    color: 'from-pink-500 to-fuchsia-700',
    frequency: 396,
    dailyManifestations: [
      'Creativity requires both receptive inspiration and focused action',
      'Healthy relationships involve both giving/providing and receiving/allowing',
      'Problem-solving benefits from both analytical thinking and intuitive insight',
      'Personal growth involves both structured discipline and flexible adaptation',
      'Leadership requires both assertive direction and empathetic receptivity'
    ],
    practicalExercises: [
      'Balance planning and preparation with openness to spontaneous opportunities',
      'Practice both speaking your truth and deeply listening to others',
      'Alternate between focused work sessions and receptive reflection time',
      'Notice whether you tend to over-give or over-receive, and practice the opposite',
      'Integrate logical analysis with gut feelings in decision-making'
    ],
    scientificCorrelation: 'Reflected in neuroscience research on brain hemisphere specialization and systems thinking.',
    dreamApplication: 'Dreams often feature masculine and feminine archetypal figures representing different aspects of psyche seeking integration.'
  }
];

export function HermeticPrinciplesGuide() {
  const [selectedPrinciple, setSelectedPrinciple] = useState(principles[0]);
  const [activeSection, setActiveSection] = useState<'overview' | 'daily' | 'exercises' | 'dreams'>('overview');

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-8">
        <Infinity className="w-8 h-8 text-purple-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Universal Principles Guide</h2>
          <p className="text-purple-200/80">Ancient wisdom made practical for daily life</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Principle Selection */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-purple-200 mb-4">Seven Hermetic Principles</h3>
          <div className="space-y-2">
            {principles.map((principle) => {
              const Icon = principle.icon;
              return (
                <button
                  key={principle.id}
                  onClick={() => setSelectedPrinciple(principle)}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    selectedPrinciple.id === principle.id
                      ? `bg-gradient-to-r ${principle.color} text-white shadow-lg`
                      : 'bg-white/5 text-purple-200 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{principle.name.split(' ').slice(-1)[0]}</span>
                  </div>
                  <div className="text-xs opacity-80">{principle.frequency} Hz</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className={`bg-gradient-to-br ${selectedPrinciple.color} p-8 rounded-2xl border border-white/20 mb-8`}>
            <div className="flex items-center space-x-4 mb-4">
              {React.createElement(selectedPrinciple.icon, { className: "w-8 h-8 text-white" })}
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedPrinciple.name}</h3>
                <p className="text-white/80 italic">"{selectedPrinciple.essence}"</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/70">Resonant Frequency</div>
              <div className="text-xl font-bold text-white">{selectedPrinciple.frequency} Hz</div>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex space-x-4 mb-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'daily', label: 'Daily Life' },
              { id: 'exercises', label: 'Exercises' },
              { id: 'dreams', label: 'Dream Work' }
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeSection === section.id
                    ? 'bg-white/20 text-white'
                    : 'text-purple-200 hover:bg-white/5'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Content Sections */}
          {activeSection === 'overview' && (
            <div className="bg-white/5 p-6 rounded-xl border border-purple-500/20">
              <h4 className="text-lg font-semibold text-white mb-4">Understanding {selectedPrinciple.name}</h4>
              <p className="text-purple-200/80 mb-4 leading-relaxed">{selectedPrinciple.essence}</p>
              
              <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                <h5 className="font-medium text-blue-300 mb-2">Scientific Correlation</h5>
                <p className="text-sm text-blue-200">{selectedPrinciple.scientificCorrelation}</p>
              </div>
            </div>
          )}

          {activeSection === 'daily' && (
            <div className="bg-white/5 p-6 rounded-xl border border-purple-500/20">
              <h4 className="text-lg font-semibold text-white mb-4">How This Shows Up in Daily Life</h4>
              <div className="space-y-4">
                {selectedPrinciple.dailyManifestations.map((manifestation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-purple-200">{index + 1}</span>
                    </div>
                    <p className="text-purple-200">{manifestation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'exercises' && (
            <div className="bg-white/5 p-6 rounded-xl border border-purple-500/20">
              <h4 className="text-lg font-semibold text-white mb-4">Practical Exercises</h4>
              <div className="space-y-4">
                {selectedPrinciple.practicalExercises.map((exercise, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-green-200">{index + 1}</span>
                      </div>
                      <p className="text-green-100">{exercise}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'dreams' && (
            <div className="bg-white/5 p-6 rounded-xl border border-purple-500/20">
              <h4 className="text-lg font-semibold text-white mb-4">Dream Work Application</h4>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-purple-200">{selectedPrinciple.dreamApplication}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-lg border border-purple-500/20">
                    <h5 className="font-medium text-purple-300 mb-2">Look For in Dreams:</h5>
                    <ul className="text-sm text-purple-200/80 space-y-1">
                      {selectedPrinciple.id === 'mentalism' && (
                        <>
                          <li>• Thoughts becoming reality in dream</li>
                          <li>• Mental powers or telepathy</li>
                          <li>• Changing scenes through intention</li>
                        </>
                      )}
                      {selectedPrinciple.id === 'correspondence' && (
                        <>
                          <li>• Mirrors, reflections, echoes</li>
                          <li>• Above/below, inside/outside patterns</li>
                          <li>• Fractal or repeating patterns</li>
                        </>
                      )}
                      {selectedPrinciple.id === 'vibration' && (
                        <>
                          <li>• Music, sounds, frequencies</li>
                          <li>• Movement, dancing, flowing</li>
                          <li>• Energy fields or auras</li>
                        </>
                      )}
                      {selectedPrinciple.id === 'polarity' && (
                        <>
                          <li>• Opposing forces or characters</li>
                          <li>• Light/dark contrasts</li>
                          <li>• Conflict resolution scenarios</li>
                        </>
                      )}
                      {selectedPrinciple.id === 'rhythm' && (
                        <>
                          <li>• Cycles, seasons, tides</li>
                          <li>• Breathing, heartbeat rhythms</li>
                          <li>• Coming and going patterns</li>
                        </>
                      )}
                      {selectedPrinciple.id === 'cause-effect' && (
                        <>
                          <li>• Action-consequence sequences</li>
                          <li>• Past events affecting present</li>
                          <li>• Chain reactions or dominoes</li>
                        </>
                      )}
                      {selectedPrinciple.id === 'gender' && (
                        <>
                          <li>• Masculine/feminine figures</li>
                          <li>• Creating/receiving dynamics</li>
                          <li>• Balance of opposites</li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-lg border border-purple-500/20">
                    <h5 className="font-medium text-purple-300 mb-2">Reflection Questions:</h5>
                    <ul className="text-sm text-purple-200/80 space-y-1">
                      <li>• How does this principle appear in the dream?</li>
                      <li>• What is the dream teaching about this principle?</li>
                      <li>• How can I apply this principle in waking life?</li>
                      <li>• What aspect needs more balance or attention?</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}