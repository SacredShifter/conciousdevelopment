import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Brain, Target, Shuffle, Copy, Save, Star } from 'lucide-react';

interface PersonalizedAffirmation {
  id: string;
  text: string;
  category: 'values' | 'purpose' | 'blocks' | 'general';
  personalizedFor: string[];
  createdAt: Date;
  favorited: boolean;
  usageCount: number;
}

const affirmationTemplates = {
  values: [
    "I honor my value of {value} in every decision I make",
    "My commitment to {value} guides me toward authentic living", 
    "I embody {value} with grace and consistency",
    "Through {value}, I create positive impact in the world",
    "I am aligned with my core value of {value}",
    "My life reflects the beauty of {value} in all its forms"
  ],
  purpose: [
    "I am fulfilling my purpose by {purpose}",
    "My unique gifts of {gift} serve the highest good",
    "I trust in my calling to {purpose}",
    "Every day I move closer to manifesting {purpose}",
    "My purpose of {purpose} flows through me effortlessly",
    "I am exactly where I need to be on my path to {purpose}"
  ],
  blocks: [
    "I release the limiting belief that {block} defines me",
    "I transform my {block} into wisdom and strength",
    "I am greater than my {block} and choose love over fear",
    "Where once I felt {block}, I now cultivate {opposite}",
    "I lovingly heal the part of me that experiences {block}",
    "My {block} is dissolving as I step into my true power"
  ],
  general: [
    "I am worthy of all the love and abundance life offers",
    "I trust my inner wisdom to guide me perfectly",
    "I am safe to be my authentic self in all situations",
    "I choose thoughts that empower and uplift me",
    "I am grateful for my journey and excited for what's coming",
    "I radiate love, peace, and positive energy wherever I go"
  ]
};

const blockToOpposite = {
  'fear': 'courage',
  'anxiety': 'peace',
  'doubt': 'trust',
  'anger': 'compassion',
  'sadness': 'joy',
  'overwhelm': 'clarity',
  'procrastination': 'action',
  'perfectionism': 'acceptance',
  'unworthiness': 'self-love',
  'scarcity': 'abundance',
  'insecurity': 'confidence',
  'judgment': 'acceptance'
};

export function AffirmationGenerator() {
  const [affirmations, setAffirmations] = useState<PersonalizedAffirmation[]>([]);
  const [userValues, setUserValues] = useState<string[]>([]);
  const [userBlocks, setUserBlocks] = useState<string[]>([]);
  const [userPurpose, setUserPurpose] = useState<string[]>([]);
  const [currentAffirmation, setCurrentAffirmation] = useState<PersonalizedAffirmation | null>(null);
  const [generationMode, setGenerationMode] = useState<'auto' | 'custom'>('auto');
  const [customInput, setCustomInput] = useState('');

  useEffect(() => {
    // Load user data from other modules
    loadUserProfile();
    
    // Load saved affirmations
    const saved = localStorage.getItem('personalizedAffirmations');
    if (saved) {
      setAffirmations(JSON.parse(saved).map((a: any) => ({
        ...a,
        createdAt: new Date(a.createdAt)
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('personalizedAffirmations', JSON.stringify(affirmations));
  }, [affirmations]);

  const loadUserProfile = () => {
    // Extract user data from localStorage of other modules
    const coreValues = localStorage.getItem('coreValues');
    const purposeReflections = localStorage.getItem('purposeReflections');
    const dreamData = localStorage.getItem('dreams');
    
    if (coreValues) {
      const values = JSON.parse(coreValues);
      setUserValues(values.map((v: any) => v.name));
    }
    
    if (purposeReflections) {
      const reflections = JSON.parse(purposeReflections);
      const purposes = reflections
        .filter((r: any) => r.category === 'purpose')
        .map((r: any) => r.response)
        .slice(0, 3);
      setUserPurpose(purposes);
    }

    // Common blocks from unblocking practices
    setUserBlocks(['fear', 'self-doubt', 'perfectionism', 'overwhelm']);
  };

  const generatePersonalizedAffirmation = () => {
    let template: string;
    let category: PersonalizedAffirmation['category'];
    let personalizedFor: string[] = [];

    // Choose category based on user data availability
    const categories = [];
    if (userValues.length > 0) categories.push('values');
    if (userPurpose.length > 0) categories.push('purpose');
    if (userBlocks.length > 0) categories.push('blocks');
    categories.push('general');

    category = categories[Math.floor(Math.random() * categories.length)] as PersonalizedAffirmation['category'];
    
    switch (category) {
      case 'values':
        template = affirmationTemplates.values[Math.floor(Math.random() * affirmationTemplates.values.length)];
        const value = userValues[Math.floor(Math.random() * userValues.length)];
        template = template.replace('{value}', value.toLowerCase());
        personalizedFor = [value];
        break;
        
      case 'purpose':
        template = affirmationTemplates.purpose[Math.floor(Math.random() * affirmationTemplates.purpose.length)];
        if (userPurpose.length > 0) {
          const purpose = userPurpose[Math.floor(Math.random() * userPurpose.length)];
          template = template.replace('{purpose}', purpose.toLowerCase());
          template = template.replace('{gift}', 'wisdom and compassion');
          personalizedFor = ['purpose'];
        }
        break;
        
      case 'blocks':
        template = affirmationTemplates.blocks[Math.floor(Math.random() * affirmationTemplates.blocks.length)];
        const block = userBlocks[Math.floor(Math.random() * userBlocks.length)];
        const opposite = blockToOpposite[block as keyof typeof blockToOpposite] || 'strength';
        template = template.replace('{block}', block);
        template = template.replace('{opposite}', opposite);
        personalizedFor = [block];
        break;
        
      default:
        template = affirmationTemplates.general[Math.floor(Math.random() * affirmationTemplates.general.length)];
        category = 'general';
        break;
    }

    const newAffirmation: PersonalizedAffirmation = {
      id: Date.now().toString(),
      text: template,
      category,
      personalizedFor,
      createdAt: new Date(),
      favorited: false,
      usageCount: 0
    };

    setCurrentAffirmation(newAffirmation);
  };

  const generateCustomAffirmation = () => {
    if (!customInput.trim()) return;
    
    const customAffirmation: PersonalizedAffirmation = {
      id: Date.now().toString(),
      text: customInput,
      category: 'general',
      personalizedFor: ['custom'],
      createdAt: new Date(),
      favorited: false,
      usageCount: 0
    };

    setCurrentAffirmation(customAffirmation);
    setCustomInput('');
  };

  const saveAffirmation = (affirmation: PersonalizedAffirmation) => {
    const exists = affirmations.find(a => a.text === affirmation.text);
    if (!exists) {
      setAffirmations([affirmation, ...affirmations]);
    }
  };

  const toggleFavorite = (id: string) => {
    setAffirmations(affirmations.map(a => 
      a.id === id ? { ...a, favorited: !a.favorited } : a
    ));
  };

  const incrementUsage = (id: string) => {
    setAffirmations(affirmations.map(a => 
      a.id === id ? { ...a, usageCount: a.usageCount + 1 } : a
    ));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      values: 'text-rose-400',
      purpose: 'text-indigo-400', 
      blocks: 'text-purple-400',
      general: 'text-teal-400'
    };
    return colors[category as keyof typeof colors] || 'text-gray-400';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'values': return Heart;
      case 'purpose': return Target;
      case 'blocks': return Brain;
      default: return Sparkles;
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-8">
        <Sparkles className="w-8 h-8 text-teal-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Affirmation Generator</h2>
          <p className="text-purple-200/80">Personalized mantras for your consciousness journey</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Generator Section */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 p-8 rounded-2xl border border-purple-500/20 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Generate Affirmation</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setGenerationMode('auto')}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    generationMode === 'auto'
                      ? 'bg-teal-500/30 text-teal-200 border border-teal-400/30'
                      : 'text-purple-200 hover:bg-white/5'
                  }`}
                >
                  Personalized
                </button>
                <button
                  onClick={() => setGenerationMode('custom')}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    generationMode === 'custom'
                      ? 'bg-teal-500/30 text-teal-200 border border-teal-400/30'
                      : 'text-purple-200 hover:bg-white/5'
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>

            {generationMode === 'auto' ? (
              <div className="text-center">
                <p className="text-purple-200/70 mb-6">
                  Generate affirmations based on your values, purpose, and growth areas
                </p>
                <button
                  onClick={generatePersonalizedAffirmation}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all mx-auto"
                >
                  <Shuffle className="w-5 h-5" />
                  <span>Generate Affirmation</span>
                </button>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Create Your Own Affirmation
                </label>
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-full h-20 px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 resize-none"
                  placeholder="Write your personal affirmation or mantra..."
                />
                <button
                  onClick={generateCustomAffirmation}
                  disabled={!customInput.trim()}
                  className="mt-4 flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Create Affirmation</span>
                </button>
              </div>
            )}
          </div>

          {/* Current Affirmation Display */}
          {currentAffirmation && (
            <div className="bg-gradient-to-br from-teal-500/20 to-blue-500/20 p-8 rounded-2xl border border-teal-500/30 text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                {React.createElement(getCategoryIcon(currentAffirmation.category), {
                  className: `w-6 h-6 ${getCategoryColor(currentAffirmation.category)}`
                })}
                <span className={`text-sm font-medium capitalize ${getCategoryColor(currentAffirmation.category)}`}>
                  {currentAffirmation.category}
                </span>
              </div>
              
              <p className="text-2xl font-medium text-white leading-relaxed mb-6">
                "{currentAffirmation.text}"
              </p>

              {currentAffirmation.personalizedFor.length > 0 && currentAffirmation.personalizedFor[0] !== 'custom' && (
                <div className="mb-6">
                  <p className="text-sm text-teal-300 mb-2">Personalized for:</p>
                  <div className="flex justify-center flex-wrap gap-2">
                    {currentAffirmation.personalizedFor.map((item, index) => (
                      <span key={index} className="px-3 py-1 bg-teal-500/20 text-teal-200 text-sm rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => copyToClipboard(currentAffirmation.text)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={() => saveAffirmation(currentAffirmation)}
                  className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Saved Affirmations */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-purple-200 mb-4">Your Affirmations</h3>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {affirmations
              .sort((a, b) => (b.favorited ? 1 : 0) - (a.favorited ? 1 : 0))
              .map((affirmation) => {
                const Icon = getCategoryIcon(affirmation.category);
                return (
                  <div key={affirmation.id} className="bg-white/5 p-4 rounded-lg border border-purple-500/20">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon className={`w-4 h-4 ${getCategoryColor(affirmation.category)}`} />
                        <span className={`text-xs capitalize ${getCategoryColor(affirmation.category)}`}>
                          {affirmation.category}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleFavorite(affirmation.id)}
                        className={`${affirmation.favorited ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'} transition-colors`}
                      >
                        <Star className={`w-4 h-4 ${affirmation.favorited ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    
                    <p className="text-sm text-white mb-3 leading-relaxed">
                      "{affirmation.text}"
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-purple-300">
                      <span>Used {affirmation.usageCount} times</span>
                      <button
                        onClick={() => {
                          setCurrentAffirmation(affirmation);
                          incrementUsage(affirmation.id);
                        }}
                        className="text-teal-400 hover:text-teal-300"
                      >
                        Use Again
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {affirmations.length === 0 && (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 text-teal-400/50 mx-auto mb-3" />
              <p className="text-teal-200/60 text-sm">
                Your saved affirmations will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}