import React, { useState } from 'react';
import { Brain, Shuffle, Eye, Heart, Zap } from 'lucide-react';

const oracleCards = [
  { id: 1, title: 'Trust', message: 'Your inner knowing is your greatest guide. Trust what feels right in your heart.', energy: 'grounding' },
  { id: 2, title: 'Flow', message: 'Release control and allow life to unfold naturally. The river knows its way to the sea.', energy: 'flowing' },
  { id: 3, title: 'Courage', message: 'Step boldly into the unknown. Your courage creates the path as you walk.', energy: 'activating' },
  { id: 4, title: 'Wisdom', message: 'You already possess all the wisdom you need. Look within for your answers.', energy: 'illuminating' },
  { id: 5, title: 'Love', message: 'Choose love over fear in all things. Love is the highest vibration and your true nature.', energy: 'healing' },
  { id: 6, title: 'Clarity', message: 'The fog is lifting. Clear vision and understanding are coming into focus.', energy: 'revealing' },
  { id: 7, title: 'Power', message: 'Reclaim your personal power. You are more capable than you realize.', energy: 'empowering' },
  { id: 8, title: 'Balance', message: 'Find harmony between action and rest, giving and receiving, being and doing.', energy: 'harmonizing' },
  { id: 9, title: 'Transformation', message: 'Embrace the changes occurring within you. You are becoming who you\'re meant to be.', energy: 'transforming' },
  { id: 10, title: 'Connection', message: 'You are never alone. Feel your connection to all life and the universe.', energy: 'unifying' }
];

const intuitionPrompts = [
  "What does my body want me to know right now?",
  "What would I do if I trusted my intuition completely?",
  "What is my inner child trying to tell me?",
  "What energy am I carrying that no longer serves me?",
  "What would love do in this situation?",
  "What am I being called to create or express?",
  "What boundaries do I need to establish?",
  "What am I not seeing clearly in my life?",
  "What gift am I meant to share with the world?",
  "What does my soul need to feel nourished?"
];

const bodyWisdomAreas = [
  { name: 'Head/Mind', guidance: 'Mental clarity, thoughts, beliefs, wisdom' },
  { name: 'Throat', guidance: 'Communication, truth, expression, authenticity' },
  { name: 'Heart', guidance: 'Love, emotions, relationships, compassion' },
  { name: 'Solar Plexus', guidance: 'Personal power, confidence, willpower, boundaries' },
  { name: 'Sacral', guidance: 'Creativity, sexuality, emotions, passion' },
  { name: 'Root', guidance: 'Grounding, safety, survival, foundation' }
];

export function IntuitionCultivator() {
  const [activeTab, setActiveTab] = useState<'cards' | 'prompts' | 'body'>('cards');
  const [drawnCard, setDrawnCard] = useState<typeof oracleCards[0] | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [promptResponse, setPromptResponse] = useState('');
  const [bodyScanning, setBodyScanning] = useState(false);
  const [selectedBodyArea, setSelectedBodyArea] = useState<string | null>(null);
  const [bodyInsights, setBodyInsights] = useState<Record<string, string>>({});

  const drawCard = () => {
    const randomCard = oracleCards[Math.floor(Math.random() * oracleCards.length)];
    setDrawnCard(randomCard);
  };

  const getRandomPrompt = () => {
    const randomPrompt = intuitionPrompts[Math.floor(Math.random() * intuitionPrompts.length)];
    setCurrentPrompt(randomPrompt);
    setPromptResponse('');
  };

  const saveBodyInsight = () => {
    if (selectedBodyArea && bodyInsights[selectedBodyArea]) {
      // Insight saved
      setSelectedBodyArea(null);
    }
  };

  const updateBodyInsight = (area: string, insight: string) => {
    setBodyInsights(prev => ({ ...prev, [area]: insight }));
  };

  const getEnergyColor = (energy: string) => {
    const colors = {
      grounding: 'text-amber-400',
      flowing: 'text-blue-400',
      activating: 'text-red-400',
      illuminating: 'text-yellow-400',
      healing: 'text-green-400',
      revealing: 'text-purple-400',
      empowering: 'text-orange-400',
      harmonizing: 'text-teal-400',
      transforming: 'text-indigo-400',
      unifying: 'text-pink-400'
    };
    return colors[energy as keyof typeof colors] || 'text-gray-400';
  };

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-8">
        <Brain className="w-8 h-8 text-teal-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Intuition Cultivator</h2>
          <p className="text-purple-200/80">Connect with your inner wisdom and higher guidance</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('cards')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'cards'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
              : 'text-purple-200 hover:bg-white/5'
          }`}
        >
          Oracle Cards
        </button>
        <button
          onClick={() => setActiveTab('prompts')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'prompts'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
              : 'text-purple-200 hover:bg-white/5'
          }`}
        >
          Intuitive Prompts
        </button>
        <button
          onClick={() => setActiveTab('body')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'body'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
              : 'text-purple-200 hover:bg-white/5'
          }`}
        >
          Body Wisdom
        </button>
      </div>

      {activeTab === 'cards' && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-purple-200/80 mb-6">
              Take a deep breath, center yourself, and ask a question silently. 
              When you feel ready, draw a card to receive guidance.
            </p>
            <button
              onClick={drawCard}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all mx-auto"
            >
              <Shuffle className="w-5 h-5" />
              <span>Draw Card</span>
            </button>
          </div>

          {drawnCard && (
            <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 p-8 rounded-2xl border border-purple-500/30 text-center">
              <div className="mb-6">
                <div className="w-32 h-48 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">✨</div>
                    <div className="text-lg font-bold">{drawnCard.title}</div>
                  </div>
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${getEnergyColor(drawnCard.energy)}`}>
                  {drawnCard.title}
                </h3>
                <p className="text-sm text-purple-300 capitalize mb-4">{drawnCard.energy} energy</p>
              </div>
              <p className="text-lg text-white leading-relaxed">{drawnCard.message}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'prompts' && (
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-purple-200/80 mb-6">
              These prompts are designed to help you tap into your inner knowing. 
              Write freely without censoring yourself.
            </p>
            <button
              onClick={getRandomPrompt}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all mx-auto"
            >
              <Shuffle className="w-5 h-5" />
              <span>Get New Prompt</span>
            </button>
          </div>

          {currentPrompt && (
            <div className="bg-white/5 p-8 rounded-2xl border border-purple-500/20">
              <h3 className="text-xl font-semibold text-teal-400 mb-6 text-center">
                {currentPrompt}
              </h3>
              <textarea
                value={promptResponse}
                onChange={(e) => setPromptResponse(e.target.value)}
                className="w-full h-48 px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 resize-none"
                placeholder="Let your intuition guide your response... Write whatever comes to mind without judgment."
              />
              <div className="mt-4 text-center">
                <p className="text-sm text-purple-300">
                  Trust your first instincts. Your inner wisdom speaks through spontaneous insights.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'body' && (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-purple-200/80 mb-4">
              Your body holds immense wisdom. Click on different areas to explore what they want to communicate.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Eye className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300">Close your eyes, breathe deeply, and feel into each area</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bodyWisdomAreas.map((area) => (
              <div
                key={area.name}
                className={`p-6 rounded-xl border transition-all cursor-pointer ${
                  selectedBodyArea === area.name
                    ? 'bg-gradient-to-br from-teal-500/20 to-blue-500/20 border-teal-400/50'
                    : 'bg-white/5 border-purple-500/20 hover:border-purple-400/40'
                }`}
                onClick={() => setSelectedBodyArea(area.name)}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Heart className="w-6 h-6 text-teal-400" />
                  <h3 className="text-lg font-semibold text-white">{area.name}</h3>
                </div>
                <p className="text-purple-200/70 text-sm mb-4">{area.guidance}</p>
                
                {selectedBodyArea === area.name && (
                  <div className="space-y-4">
                    <textarea
                      value={bodyInsights[area.name] || ''}
                      onChange={(e) => updateBodyInsight(area.name, e.target.value)}
                      className="w-full h-24 px-3 py-2 bg-white/10 border border-teal-500/30 rounded-lg text-white placeholder-teal-300/50 focus:outline-none focus:border-teal-400 resize-none"
                      placeholder="What is this area of your body trying to tell you? What sensations, emotions, or messages do you receive?"
                    />
                    <button
                      onClick={saveBodyInsight}
                      className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Record Insight</span>
                    </button>
                  </div>
                )}
                
                {bodyInsights[area.name] && selectedBodyArea !== area.name && (
                  <div className="mt-4 p-3 bg-teal-500/10 rounded-lg border border-teal-500/20">
                    <p className="text-sm text-teal-200">{bodyInsights[area.name]}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="bg-white/5 p-6 rounded-xl border border-purple-500/20">
              <h4 className="text-lg font-semibold text-purple-200 mb-4">Body Scanning Meditation</h4>
              <p className="text-purple-200/70 mb-4">
                Take 10 minutes to slowly scan through your body from head to toe. 
                Notice any sensations, tensions, or messages each area holds.
              </p>
              <button
                onClick={() => setBodyScanning(!bodyScanning)}
                className={`px-6 py-3 rounded-lg transition-all ${
                  bodyScanning
                    ? 'bg-green-500 text-white'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
              >
                {bodyScanning ? 'Scanning...' : 'Start Body Scan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}