import React, { useState } from 'react';
import { Compass, BookOpen, Lightbulb, Target, ArrowRight } from 'lucide-react';
import type { PurposeReflection } from '../types';

const purposePrompts = {
  purpose: [
    "What activities make you lose track of time because you're so engaged?",
    "What problems in the world do you feel called to help solve?",
    "What would you do if you knew you couldn't fail?",
    "What do people consistently come to you for help with?",
    "What experiences have shaped you the most?"
  ],
  mission: [
    "How do you want to impact the lives of others?",
    "What legacy do you want to leave behind?",
    "What would your ideal day look like 10 years from now?",
    "What unique gifts do you bring to the world?",
    "What would you regret not trying or doing?"
  ],
  vision: [
    "What does your ideal future look like?",
    "What kind of person do you want to become?",
    "What would success mean to you in 20 years?",
    "How do you want to be remembered?",
    "What impact do you want to have on your community?"
  ],
  legacy: [
    "What values do you want to pass on to future generations?",
    "What would you want people to say about you at your funeral?",
    "What change do you want to see in the world because you existed?",
    "What knowledge or wisdom do you want to share?",
    "What would make your life feel complete and meaningful?"
  ]
};

export function PurposeClarifier() {
  const [activeCategory, setActiveCategory] = useState<keyof typeof purposePrompts>('purpose');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [reflections, setReflections] = useState<PurposeReflection[]>([]);
  const [insights, setInsights] = useState<string[]>(['']);

  const currentPrompts = purposePrompts[activeCategory];
  const currentPrompt = currentPrompts[currentPromptIndex];

  const handleSaveReflection = () => {
    if (response.trim()) {
      const reflection: PurposeReflection = {
        id: Date.now().toString(),
        prompt: currentPrompt,
        response: response.trim(),
        insights: insights.filter(i => i.trim()),
        date: new Date(),
        category: activeCategory
      };
      setReflections([...reflections, reflection]);
      setResponse('');
      setInsights(['']);
      
      // Move to next prompt
      if (currentPromptIndex < currentPrompts.length - 1) {
        setCurrentPromptIndex(currentPromptIndex + 1);
      }
    }
  };

  const handleNextPrompt = () => {
    if (currentPromptIndex < currentPrompts.length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1);
    }
  };

  const handlePrevPrompt = () => {
    if (currentPromptIndex > 0) {
      setCurrentPromptIndex(currentPromptIndex - 1);
    }
  };

  const addInsight = () => {
    setInsights([...insights, '']);
  };

  const updateInsight = (index: number, value: string) => {
    const updated = [...insights];
    updated[index] = value;
    setInsights(updated);
  };

  const removeInsight = (index: number) => {
    const updated = insights.filter((_, i) => i !== index);
    setInsights(updated);
  };

  const categoryColors = {
    purpose: 'text-indigo-400',
    mission: 'text-purple-400',
    vision: 'text-teal-400',
    legacy: 'text-amber-400'
  };

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-8">
        <Compass className="w-8 h-8 text-indigo-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Purpose & Mission Clarifier</h2>
          <p className="text-purple-200/80">Uncover your life's purpose through guided reflection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Categories */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-purple-200 mb-4">Exploration Areas</h3>
          <div className="space-y-2">
            {Object.keys(purposePrompts).map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category as keyof typeof purposePrompts);
                  setCurrentPromptIndex(0);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-purple-500/30 to-indigo-500/30 text-white border border-purple-400/30'
                    : 'text-purple-200 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {category === 'purpose' && <Target className="w-5 h-5 text-indigo-400" />}
                  {category === 'mission' && <ArrowRight className="w-5 h-5 text-purple-400" />}
                  {category === 'vision' && <Lightbulb className="w-5 h-5 text-teal-400" />}
                  {category === 'legacy' && <BookOpen className="w-5 h-5 text-amber-400" />}
                  <span className="capitalize font-medium">{category}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Progress */}
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-purple-500/20">
            <h4 className="text-sm font-medium text-purple-200 mb-2">Progress</h4>
            <div className="space-y-2">
              {Object.entries(purposePrompts).map(([cat, prompts]) => {
                const completed = reflections.filter(r => r.category === cat).length;
                return (
                  <div key={cat} className="flex items-center justify-between text-sm">
                    <span className="text-purple-300 capitalize">{cat}</span>
                    <span className="text-purple-200">{completed}/{prompts.length}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 p-6 rounded-xl border border-purple-500/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${categoryColors[activeCategory]} capitalize`}>
                {activeCategory} Exploration
              </h3>
              <span className="text-sm text-purple-300">
                {currentPromptIndex + 1} of {currentPrompts.length}
              </span>
            </div>

            <div className="mb-6">
              <h4 className="text-xl font-medium text-white mb-4">{currentPrompt}</h4>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="w-full h-32 px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 resize-none"
                placeholder="Take your time to reflect deeply... There are no wrong answers."
              />
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-purple-200 mb-3">Key Insights (Optional)</h4>
              {insights.map((insight, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={insight}
                    onChange={(e) => updateInsight(index, e.target.value)}
                    className="flex-1 px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
                    placeholder="What insights emerged from this reflection?"
                  />
                  {insights.length > 1 && (
                    <button
                      onClick={() => removeInsight(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addInsight}
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                + Add insight
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-3">
                <button
                  onClick={handlePrevPrompt}
                  disabled={currentPromptIndex === 0}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPrompt}
                  disabled={currentPromptIndex === currentPrompts.length - 1}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Prompt
                </button>
              </div>
              <button
                onClick={handleSaveReflection}
                disabled={!response.trim()}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Reflection
              </button>
            </div>
          </div>

          {/* Recent Reflections */}
          {reflections.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-purple-200 mb-4">Recent Reflections</h3>
              <div className="space-y-4">
                {reflections.slice(-3).reverse().map((reflection) => (
                  <div key={reflection.id} className="bg-white/5 p-4 rounded-lg border border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${categoryColors[reflection.category]} capitalize`}>
                        {reflection.category}
                      </span>
                      <span className="text-xs text-purple-300">
                        {reflection.date.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-purple-200 mb-2 italic">"{reflection.prompt}"</p>
                    <p className="text-white text-sm">{reflection.response}</p>
                    {reflection.insights.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-purple-300 mb-1">Insights:</p>
                        <ul className="text-xs text-purple-200 space-y-1">
                          {reflection.insights.map((insight, index) => (
                            <li key={index}>• {insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}