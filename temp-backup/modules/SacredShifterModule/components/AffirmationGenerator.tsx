import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Brain, Target, Shuffle, Copy, Save, Star } from 'lucide-react';
import { supabase, getCurrentUserId } from '../../services/supabaseClient';

interface PersonalizedAffirmation {
  id: string;
  text: string;
  category: string;
  personalizedFor: string[];
  createdAt: Date;
  favorited: boolean;
  usageCount: number;
}

export const AffirmationGenerator: React.FC = () => {
  const [currentAffirmation, setCurrentAffirmation] = useState<PersonalizedAffirmation | null>(null);
  const [affirmations, setAffirmations] = useState<PersonalizedAffirmation[]>([]);
  const [userValues, setUserValues] = useState<string[]>([]);
  const [userPurpose, setUserPurpose] = useState<string[]>([]);
  const [userBlocks, setUserBlocks] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customInput, setCustomInput] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Load user data
      await loadUserProfile();
      
      // Load saved affirmations
      const userId = await getCurrentUserId();
      if (!userId) return;
      
      const { data, error } = await supabase
        .from('user_intentions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error loading affirmations:', error);
        return;
      }
      
      if (data && data.length > 0) {
        setAffirmations(data.map((a: any) => ({
          id: a.id,
          text: a.intention,
          category: a.category || 'general',
          personalizedFor: a.tags || [],
          createdAt: new Date(a.created_at),
          favorited: a.is_favorite || false,
          usageCount: a.usage_count || 0
        })));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };
  
  const saveAffirmationToDatabase = async (affirmation: PersonalizedAffirmation) => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return;
      
      const { error } = await supabase
        .from('user_intentions')
        .upsert({
          id: affirmation.id,
          user_id: userId,
          title: affirmation.category.charAt(0).toUpperCase() + affirmation.category.slice(1),
          intention: affirmation.text,
          category: affirmation.category,
          tags: affirmation.personalizedFor,
          is_favorite: affirmation.favorited,
          usage_count: affirmation.usageCount,
          created_at: affirmation.createdAt.toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error saving affirmation:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return;
      
      // Get core values
      const { data: valuesData, error: valuesError } = await supabase
        .from('sacred_blueprints')
        .select('*')
        .eq('user_id', userId);
      
      if (valuesError) {
        console.error('Error fetching values:', valuesError);
      } else if (valuesData && valuesData.length > 0) {
        // Extract values from blueprint
        const values = valuesData[0]?.chakra_signature || {};
        setUserValues(Object.keys(values));
      }
      
      // Get purpose reflections
      const { data: purposeData, error: purposeError } = await supabase
        .from('insight_reflections')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (purposeError) {
        console.error('Error fetching purpose reflections:', purposeError);
      } else if (purposeData && purposeData.length > 0) {
        const purposes = purposeData
          .filter((r: any) => r.journey_slug === 'purpose')
          .map((r: any) => r.content)
          .slice(0, 3);
        setUserPurpose(purposes);
      }
      
      // Common blocks from unblocking practices
      setUserBlocks(['fear', 'self-doubt', 'perfectionism', 'overwhelm']);
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    }
  };

  const generatePersonalizedAffirmation = () => {
    const templates = {
      values: [
        "I embody {value} in all my actions",
        "My commitment to {value} guides my path",
        "I am aligned with my core value of {value}",
        "Through {value}, I create positive change"
      ],
      purpose: [
        "I am walking my path of {purpose} with confidence",
        "My purpose to {purpose} unfolds perfectly",
        "I trust the process of {purpose} in my life",
        "Every step brings me closer to {purpose}"
      ],
      blocks: [
        "I release {block} and embrace my power",
        "I transform {block} into wisdom and strength",
        "I am stronger than {block} that once held me back",
        "I choose growth over {block}"
      ],
      general: [
        "I am exactly where I need to be",
        "I trust in my journey and my timing",
        "I am open to receiving all the good life offers",
        "My potential is limitless",
        "I choose peace and presence in this moment"
      ]
    };

    let affirmation = '';
    let category = 'general';
    let personalizedFor: string[] = [];

    if (userValues.length > 0 && Math.random() > 0.5) {
      const value = userValues[Math.floor(Math.random() * userValues.length)];
      const template = templates.values[Math.floor(Math.random() * templates.values.length)];
      affirmation = template.replace('{value}', value.toLowerCase());
      category = 'values';
      personalizedFor = [value];
    } else if (userPurpose.length > 0 && Math.random() > 0.5) {
      const purpose = userPurpose[Math.floor(Math.random() * userPurpose.length)];
      const template = templates.purpose[Math.floor(Math.random() * templates.purpose.length)];
      affirmation = template.replace('{purpose}', purpose.toLowerCase());
      category = 'purpose';
      personalizedFor = [purpose];
    } else if (userBlocks.length > 0 && Math.random() > 0.3) {
      const block = userBlocks[Math.floor(Math.random() * userBlocks.length)];
      const template = templates.blocks[Math.floor(Math.random() * templates.blocks.length)];
      affirmation = template.replace('{block}', block);
      category = 'unblocking';
      personalizedFor = [block];
    } else {
      affirmation = templates.general[Math.floor(Math.random() * templates.general.length)];
    }

    const newAffirmation: PersonalizedAffirmation = {
      id: Date.now().toString(),
      text: affirmation,
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
      text: customInput.trim(),
      category: 'custom',
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
    if (exists) return;
    
    // Add to state
    const newAffirmations = [affirmation, ...affirmations];
    setAffirmations(newAffirmations);
    
    // Save to database
    saveAffirmationToDatabase(affirmation);
  };

  const toggleFavorite = async (id: string) => {
    const updatedAffirmations = affirmations.map(a => 
      a.id === id ? { ...a, favorited: !a.favorited } : a
    );
    
    setAffirmations(updatedAffirmations);
    
    // Update in database
    const affirmation = updatedAffirmations.find(a => a.id === id);
    if (affirmation) {
      saveAffirmationToDatabase(affirmation);
    }
  };

  const incrementUsage = async (id: string) => {
    const updatedAffirmations = affirmations.map(a => 
      a.id === id ? { ...a, usageCount: a.usageCount + 1 } : a
    );
    
    setAffirmations(updatedAffirmations);
    
    // Update in database
    const affirmation = updatedAffirmations.find(a => a.id === id);
    if (affirmation) {
      saveAffirmationToDatabase(affirmation);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const filteredAffirmations = selectedCategory === 'all' 
    ? affirmations 
    : affirmations.filter(a => a.category === selectedCategory);

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'values', label: 'Values' },
    { value: 'purpose', label: 'Purpose' },
    { value: 'unblocking', label: 'Unblocking' },
    { value: 'custom', label: 'Custom' },
    { value: 'general', label: 'General' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">Affirmation Generator</h1>
            <Heart className="w-8 h-8 text-pink-400" />
          </div>
          <p className="text-xl text-blue-200">
            Personalized affirmations based on your values, purpose, and growth journey
          </p>
        </div>

        {/* Current Affirmation Display */}
        {currentAffirmation && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 text-center border border-white/20">
            <div className="text-2xl md:text-3xl font-semibold text-white mb-6 leading-relaxed">
              "{currentAffirmation.text}"
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm">
                {currentAffirmation.category}
              </span>
              {currentAffirmation.personalizedFor.map((item, index) => (
                <span key={index} className="px-3 py-1 bg-blue-500/30 text-blue-200 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => copyToClipboard(currentAffirmation.text)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Copy className="w-5 h-5" />
                Copy
              </button>
              <button
                onClick={() => saveAffirmation(currentAffirmation)}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-5 h-5" />
                Save
              </button>
            </div>
          </div>
        )}

        {/* Generation Controls */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6 text-blue-400" />
                Generate Personalized
              </h3>
              <button
                onClick={generatePersonalizedAffirmation}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all transform hover:scale-105"
              >
                <Shuffle className="w-5 h-5" />
                Generate Affirmation
              </button>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-green-400" />
                Create Custom
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Write your custom affirmation..."
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && generateCustomAffirmation()}
                />
                <button
                  onClick={generateCustomAffirmation}
                  className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Affirmations */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-white">Your Affirmations</h3>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value} className="bg-gray-800">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredAffirmations.map(affirmation => (
              <div key={affirmation.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-white text-lg mb-2">"{affirmation.text}"</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2 py-1 bg-purple-500/30 text-purple-200 rounded text-xs">
                        {affirmation.category}
                      </span>
                      {affirmation.personalizedFor.map((item, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-500/30 text-blue-200 rounded text-xs">
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="text-gray-400 text-sm">
                      Used {affirmation.usageCount} times • {affirmation.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFavorite(affirmation.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        affirmation.favorited 
                          ? 'bg-yellow-600 text-yellow-200' 
                          : 'bg-white/10 text-gray-400 hover:text-yellow-400'
                      }`}
                    >
                      <Star className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(affirmation.text)}
                      className="p-2 bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => incrementUsage(affirmation.id)}
                      className="p-2 bg-white/10 text-gray-400 hover:text-green-400 rounded-lg transition-colors"
                    >
                      <Target className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAffirmations.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No affirmations saved yet. Generate some to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AffirmationGenerator;