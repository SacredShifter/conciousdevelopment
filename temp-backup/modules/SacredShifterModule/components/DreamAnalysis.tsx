import React, { useState, useEffect } from 'react';
import { Moon, BookOpen, Search, Tag, Brain, Shuffle, Save, ArrowRight, BarChart } from 'lucide-react';
import type { DreamEntry } from '../types/ssos';
import { supabase, getCurrentUserId } from '../../services/supabaseClient';

const commonSymbols = [
  { name: 'Water', meaning: 'Emotions, unconscious mind, flow of life', categories: ['element', 'nature'] },
  { name: 'Flying', meaning: 'Freedom, transcendence, escape from limitations', categories: ['action', 'movement'] },
  { name: 'Falling', meaning: 'Loss of control, fear, letting go', categories: ['action', 'movement'] },
  { name: 'House', meaning: 'Self, mind, different aspects of personality', categories: ['structure', 'home'] },
  { name: 'Death', meaning: 'Transformation, end of a phase, rebirth', categories: ['transition', 'ending'] },
  { name: 'Teeth', meaning: 'Anxiety, self-image, communication', categories: ['body', 'appearance'] },
  { name: 'Snake', meaning: 'Transformation, healing, hidden threat, sexuality', categories: ['animal', 'reptile'] },
  { name: 'Forest', meaning: 'Unconscious, unknown territory, mystery', categories: ['nature', 'environment'] }
];

export function DreamAnalysis() {
  const [dreams, setDreams] = useState<DreamEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newDream, setNewDream] = useState<Partial<DreamEntry>>({
    title: '',
    content: '',
    symbols: [],
    emotions: [],
    interpretation: '',
    themes: []
  });
  const [isAddingDream, setIsAddingDream] = useState(false);
  const [activeDream, setActiveDream] = useState<DreamEntry | null>(null);
  const [symbolInput, setSymbolInput] = useState('');
  const [emotionInput, setEmotionInput] = useState('');

  useEffect(() => {
    loadDreams();
  }, []);

  const loadDreams = async () => {
    setIsLoading(true);
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        console.error('No user is logged in');
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('dream_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching dreams:', error);
        return;
      }
      
      if (data) {
        setDreams(data.map((dream: any) => ({
          id: dream.id,
          date: new Date(dream.dream_date),
          title: dream.title,
          content: dream.content,
          symbols: dream.symbols || [],
          emotions: dream.emotion_tags || [],
          interpretation: dream.interpretation || '',
          themes: Array.isArray(dream.themes) ? dream.themes : [],
        })));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveDream = async () => {
    if (!newDream.title || !newDream.content) return;
    
    try {
      const userId = await getCurrentUserId();
      if (!userId) return;
      
      const dreamToSave = {
        user_id: userId,
        dream_date: new Date().toISOString(),
        title: newDream.title,
        content: newDream.content,
        symbols: newDream.symbols,
        emotion_tags: newDream.emotions,
        interpretation: newDream.interpretation || '',
        is_lucid: false,
        is_recurring: false,
        visibility: 'private',
      };
      
      const { data, error } = await supabase
        .from('dream_logs')
        .insert([dreamToSave])
        .select();
      
      if (error) {
        console.error('Error saving dream:', error);
        return;
      }
      
      if (data && data[0]) {
        const savedDream: DreamEntry = {
          id: data[0].id,
          date: new Date(data[0].dream_date),
          title: data[0].title,
          content: data[0].content,
          symbols: data[0].symbols || [],
          emotions: data[0].emotion_tags || [],
          interpretation: data[0].interpretation || '',
          themes: []
        };
        
        setDreams([savedDream, ...dreams]);
        setNewDream({
          title: '',
          content: '',
          symbols: [],
          emotions: [],
          interpretation: '',
          themes: []
        });
        setIsAddingDream(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const updateDreamInterpretation = async (id: string, interpretation: string) => {
    try {
      const { error } = await supabase
        .from('dream_logs')
        .update({ interpretation })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating dream interpretation:', error);
        return;
      }
      
      setDreams(dreams.map(dream => 
        dream.id === id ? { ...dream, interpretation } : dream
      ));
      
      if (activeDream && activeDream.id === id) {
        setActiveDream({ ...activeDream, interpretation });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const addSymbol = () => {
    if (!symbolInput.trim()) return;
    
    const symbols = [...(newDream.symbols || [])];
    symbols.push(symbolInput);
    setNewDream({ ...newDream, symbols });
    setSymbolInput('');
  };
  
  const addEmotion = () => {
    if (!emotionInput.trim()) return;
    
    const emotions = [...(newDream.emotions || [])];
    emotions.push(emotionInput);
    setNewDream({ ...newDream, emotions });
    setEmotionInput('');
  };
  
  const getRandomInterpretationPrompt = () => {
    const prompts = [
      "What might this dream be telling you about your current life situation?",
      "How do the symbols in this dream relate to your waking life?",
      "What emotions came up in the dream and what might they represent?",
      "If this dream were a message from your unconscious, what would it be saying?",
      "How might this dream be showing you something you're not fully conscious of?"
    ];
    
    return prompts[Math.floor(Math.random() * prompts.length)];
  };
  
  // Very simplified Freudian analysis (for demonstration)
  const generateFreudianAnalysis = (dream: DreamEntry) => {
    if (!dream) return "Select a dream to analyze";
    
    // This is a simplified model for demonstration purposes
    let manifestContent = "Manifest content (what you remember):\n";
    manifestContent += dream.content;
    
    let latentContent = "Possible latent content (hidden meaning):\n";
    
    // Very basic pattern matching
    if (dream.content.toLowerCase().includes("fall")) {
      latentContent += "- Falling may represent anxiety about losing control or fear of failure\n";
    }
    
    if (dream.content.toLowerCase().includes("water") || dream.content.toLowerCase().includes("ocean")) {
      latentContent += "- Water often symbolizes the unconscious mind or repressed emotions\n";
    }
    
    if (dream.content.toLowerCase().includes("parent") || dream.content.toLowerCase().includes("mother") || dream.content.toLowerCase().includes("father")) {
      latentContent += "- Parental figures may represent authority, super-ego influences, or unresolved Oedipal/Electra dynamics\n";
    }
    
    // Add some general Freudian concepts if we don't have specific matches
    if (!latentContent.includes("-")) {
      latentContent += "- Dreams often disguise forbidden wishes through symbolism and displacement\n";
      latentContent += "- Consider how objects in the dream might represent other things through condensation\n";
      latentContent += "- The dream may be fulfilling a wish that your conscious mind represses\n";
    }
    
    return manifestContent + "\n\n" + latentContent;
  };
  
  // Get dates formatted nicely
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-8">
        <Moon className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Dream Analysis</h2>
          <p className="text-purple-200/80">Explore your dream world and decode your unconscious mind</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="text-white">Loading your dream journal...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Dream List */}
          <div className="lg:col-span-1">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-200">Dream Journal</h3>
              <button
                onClick={() => setIsAddingDream(!isAddingDream)}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm"
              >
                {isAddingDream ? 'Cancel' : '+ New Dream'}
              </button>
            </div>
            
            {isAddingDream ? (
              <div className="bg-white/5 p-4 rounded-lg border border-blue-500/20 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Title</label>
                    <input
                      type="text"
                      value={newDream.title || ''}
                      onChange={(e) => setNewDream({ ...newDream, title: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
                      placeholder="Give your dream a title..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Dream Description</label>
                    <textarea
                      value={newDream.content || ''}
                      onChange={(e) => setNewDream({ ...newDream, content: e.target.value })}
                      className="w-full h-32 px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400 resize-none"
                      placeholder="Describe your dream in detail..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Key Symbols</label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={symbolInput}
                        onChange={(e) => setSymbolInput(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
                        placeholder="Add dream symbols..."
                      />
                      <button
                        onClick={addSymbol}
                        className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
                      >
                        Add
                      </button>
                    </div>
                    {newDream.symbols && newDream.symbols.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newDream.symbols.map((symbol, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-500/20 text-purple-200 text-xs rounded-full"
                          >
                            {symbol}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Emotions</label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={emotionInput}
                        onChange={(e) => setEmotionInput(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
                        placeholder="Add emotions..."
                      />
                      <button
                        onClick={addEmotion}
                        className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
                      >
                        Add
                      </button>
                    </div>
                    {newDream.emotions && newDream.emotions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newDream.emotions.map((emotion, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-500/20 text-blue-200 text-xs rounded-full"
                          >
                            {emotion}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={saveDream}
                    disabled={!newDream.title || !newDream.content}
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Dream
                  </button>
                </div>
              </div>
            ) : (
              dreams.length === 0 && (
                <div className="text-center py-8 bg-white/5 rounded-xl border border-purple-500/20">
                  <Moon className="w-16 h-16 text-blue-400/50 mx-auto mb-3" />
                  <p className="text-blue-200/60 text-sm">
                    Your dream journal is empty. Record your dreams to begin exploring your unconscious mind.
                  </p>
                </div>
              )
            )}
            
            <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
              {dreams.map((dream) => (
                <button
                  key={dream.id}
                  onClick={() => setActiveDream(dream)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    activeDream?.id === dream.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/40'
                      : 'bg-white/5 border-purple-500/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium text-white">{dream.title}</h4>
                    <span className="text-xs text-blue-300">{formatDate(dream.date)}</span>
                  </div>
                  <p className="text-sm text-purple-200/70 line-clamp-2 mb-2">
                    {dream.content}
                  </p>
                  {dream.symbols.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dream.symbols.slice(0, 3).map((symbol, index) => (
                        <span
                          key={index}
                          className="px-1.5 py-0.5 bg-purple-500/20 text-purple-200 text-xs rounded-full"
                        >
                          {symbol}
                        </span>
                      ))}
                      {dream.symbols.length > 3 && (
                        <span className="text-xs text-purple-300">
                          +{dream.symbols.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Dream Analysis */}
          <div className="lg:col-span-2">
            {activeDream ? (
              <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-blue-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">{activeDream.title}</h3>
                    <span className="text-blue-300">{formatDate(activeDream.date)}</span>
                  </div>
                  <p className="text-purple-200 mb-4 whitespace-pre-wrap">{activeDream.content}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-purple-300 mb-2 flex items-center">
                        <Tag className="w-4 h-4 mr-1" /> Symbols
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {activeDream.symbols.length > 0 ? (
                          activeDream.symbols.map((symbol, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-500/20 text-purple-200 text-xs rounded-full"
                            >
                              {symbol}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-purple-200/60">No symbols recorded</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-purple-300 mb-2 flex items-center">
                        <Heart className="w-4 h-4 mr-1" /> Emotions
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {activeDream.emotions.length > 0 ? (
                          activeDream.emotions.map((emotion, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-500/20 text-blue-200 text-xs rounded-full"
                            >
                              {emotion}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-purple-200/60">No emotions recorded</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Interpretation Section */}
                <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 rounded-2xl border border-indigo-500/20">
                  <h3 className="text-lg font-semibold text-indigo-200 mb-4 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-indigo-400" />
                    Dream Interpretation
                  </h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-indigo-300 mb-2">
                      {getRandomInterpretationPrompt()}
                    </label>
                    <textarea
                      value={activeDream.interpretation}
                      onChange={(e) => updateDreamInterpretation(activeDream.id, e.target.value)}
                      className="w-full h-32 px-4 py-3 bg-white/10 border border-indigo-500/30 rounded-lg text-white placeholder-indigo-300/50 focus:outline-none focus:border-indigo-400 resize-none"
                      placeholder="Write your interpretation here..."
                    />
                  </div>
                  
                  {/* Freudian Analysis */}
                  <div className="bg-white/5 p-4 rounded-xl border border-indigo-500/20">
                    <h4 className="text-md font-medium text-indigo-200 mb-2 flex items-center">
                      <BookOpen className="w-4 h-4 mr-1.5 text-indigo-400" />
                      Freudian Analysis
                    </h4>
                    <pre className="text-sm text-indigo-200/80 whitespace-pre-wrap">
                      {generateFreudianAnalysis(activeDream)}
                    </pre>
                  </div>
                </div>
                
                {/* Symbol Dictionary */}
                <div className="bg-white/5 p-6 rounded-2xl border border-purple-500/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Symbol Dictionary</h3>
                  <div className="max-h-60 overflow-y-auto space-y-3">
                    {commonSymbols.filter(symbol => 
                      !activeDream.symbols.length || 
                      activeDream.symbols.some(s => 
                        symbol.name.toLowerCase().includes(s.toLowerCase()) || 
                        s.toLowerCase().includes(symbol.name.toLowerCase())
                      )
                    ).map((symbol, index) => (
                      <div key={index} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-white">{symbol.name}</span>
                          <div className="flex space-x-1">
                            {symbol.categories.map((cat, i) => (
                              <span key={i} className="text-xs text-purple-300 px-1.5 py-0.5 bg-purple-500/10 rounded">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-purple-200/80">{symbol.meaning}</p>
                      </div>
                    ))}
                    
                    {activeDream.symbols.length > 0 && 
                      !commonSymbols.some(symbol => 
                        activeDream.symbols.some(s => 
                          symbol.name.toLowerCase().includes(s.toLowerCase()) || 
                          s.toLowerCase().includes(symbol.name.toLowerCase())
                        )
                      ) && (
                      <div className="text-center py-3">
                        <p className="text-sm text-purple-200/60">
                          No matching symbols found in our dictionary. Your symbols may have personal meaning.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 p-8 rounded-2xl border border-purple-500/20 text-center">
                <Moon className="w-20 h-20 text-blue-400/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Dream Analysis Awaits</h3>
                <p className="text-purple-200/80 mb-6 max-w-md mx-auto">
                  Select a dream from your journal or add a new one to begin exploring your unconscious mind through advanced analysis.
                </p>
                <button
                  onClick={() => setIsAddingDream(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
                >
                  Record New Dream
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}