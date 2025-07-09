import React, { useState, useEffect } from 'react';
import { Users, Plus, CheckCircle, Calendar, Target, Flame, Clock } from 'lucide-react';
import type { DailyPractice } from '../types/ssos';

const suggestedPractices = [
  {
    name: 'Morning Values Check-in',
    description: 'Start your day by connecting with your core values',
    timeOfDay: 'morning' as const,
    frequency: 'daily' as const
  },
  {
    name: 'Gratitude Reflection',
    description: '3 things you\'re grateful for today',
    timeOfDay: 'evening' as const,
    frequency: 'daily' as const
  },
  {
    name: 'Mindful Breathing',
    description: '5 minutes of conscious breathing',
    timeOfDay: 'anytime' as const,
    frequency: 'daily' as const
  },
  {
    name: 'Purpose Alignment',
    description: 'Ask: "How did I live my purpose today?"',
    timeOfDay: 'evening' as const,
    frequency: 'daily' as const
  },
  {
    name: 'Intuition Practice',
    description: 'Check in with your inner wisdom',
    timeOfDay: 'morning' as const,
    frequency: 'daily' as const
  },
  {
    name: 'Dream Journaling',
    description: 'Record and reflect on your dreams',
    timeOfDay: 'morning' as const,
    frequency: 'daily' as const
  },
  {
    name: 'Weekly Values Review',
    description: 'Deep reflection on living your values',
    timeOfDay: 'anytime' as const,
    frequency: 'weekly' as const
  },
  {
    name: 'Monthly Purpose Assessment',
    description: 'Evaluate alignment with life purpose',
    timeOfDay: 'anytime' as const,
    frequency: 'monthly' as const
  }
];

export function DailyIntegration() {
  const [practices, setPractices] = useState<DailyPractice[]>([]);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [isAddingPractice, setIsAddingPractice] = useState(false);
  const [newPractice, setNewPractice] = useState({
    name: '',
    description: '',
    frequency: 'daily' as const,
    timeOfDay: 'anytime' as const
  });

  useEffect(() => {
    // Load practices from localStorage on mount
    const saved = localStorage.getItem('dailyPractices');
    if (saved) {
      const parsed = JSON.parse(saved);
      setPractices(parsed.map((p: any) => ({
        ...p,
        lastCompleted: p.lastCompleted ? new Date(p.lastCompleted) : new Date(0)
      })));
    }
  }, []);

  useEffect(() => {
    // Save practices to localStorage whenever they change
    localStorage.setItem('dailyPractices', JSON.stringify(practices));
  }, [practices]);

  const addSuggestedPractice = (suggested: typeof suggestedPractices[0]) => {
    const practice: DailyPractice = {
      id: Date.now().toString(),
      name: suggested.name,
      description: suggested.description,
      frequency: suggested.frequency,
      timeOfDay: suggested.timeOfDay,
      completed: false,
      streak: 0,
      lastCompleted: new Date(0)
    };
    setPractices([...practices, practice]);
  };

  const addCustomPractice = () => {
    if (newPractice.name.trim()) {
      const practice: DailyPractice = {
        id: Date.now().toString(),
        name: newPractice.name,
        description: newPractice.description,
        frequency: newPractice.frequency,
        timeOfDay: newPractice.timeOfDay,
        completed: false,
        streak: 0,
        lastCompleted: new Date(0)
      };
      setPractices([...practices, practice]);
      setNewPractice({
        name: '',
        description: '',
        frequency: 'daily',
        timeOfDay: 'anytime'
      });
      setIsAddingPractice(false);
    }
  };

  const togglePracticeCompletion = (practiceId: string) => {
    setPractices(practices.map(practice => {
      if (practice.id === practiceId) {
        const now = new Date();
        const wasCompletedToday = isCompletedToday(practice);
        
        if (!wasCompletedToday) {
          // Mark as completed
          const newStreak = isConsecutiveDay(practice) ? practice.streak + 1 : 1;
          return {
            ...practice,
            completed: true,
            lastCompleted: now,
            streak: newStreak
          };
        } else {
          // Unmark completion
          return {
            ...practice,
            completed: false,
            streak: Math.max(0, practice.streak - 1)
          };
        }
      }
      return practice;
    }));
  };

  const isCompletedToday = (practice: DailyPractice) => {
    const today = new Date();
    const lastCompleted = new Date(practice.lastCompleted);
    return today.toDateString() === lastCompleted.toDateString();
  };

  const isConsecutiveDay = (practice: DailyPractice) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const lastCompleted = new Date(practice.lastCompleted);
    return yesterday.toDateString() === lastCompleted.toDateString();
  };

  const getTimeOfDayEmoji = (timeOfDay: string) => {
    switch (timeOfDay) {
      case 'morning': return '🌅';
      case 'afternoon': return '☀️';
      case 'evening': return '🌙';
      default: return '⏰';
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'text-green-400';
      case 'weekly': return 'text-blue-400';
      case 'monthly': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  // Fixed filtering logic
  const filteredPractices = practices.filter(practice => {
    if (selectedTimeFilter === 'all') return true;
    return practice.timeOfDay === selectedTimeFilter;
  });

  const todayCompletionCount = practices.filter(isCompletedToday).length;
  const totalTodayPractices = practices.filter(p => p.frequency === 'daily').length;

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-8">
        <Users className="w-8 h-8 text-green-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Daily Integration</h2>
          <p className="text-purple-200/80">Weave consciousness practices into your daily life</p>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 rounded-xl border border-green-500/30">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-300 text-sm font-medium">Today's Progress</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {todayCompletionCount}/{totalTodayPractices}
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 p-4 rounded-xl border border-orange-500/30">
          <div className="flex items-center space-x-2 mb-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-orange-300 text-sm font-medium">Best Streak</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {Math.max(...practices.map(p => p.streak), 0)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-4 rounded-xl border border-blue-500/30">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Active Practices</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {practices.length}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 p-4 rounded-xl border border-purple-500/30">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">This Week</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {practices.filter(p => p.streak >= 3).length}
          </div>
        </div>
      </div>

      {/* Time Filter - Fixed */}
      <div className="flex items-center space-x-4 mb-6">
        <span className="text-purple-200 text-sm font-medium">Filter by time:</span>
        {[
          { value: 'all', label: 'All', emoji: '🔄' },
          { value: 'morning', label: 'Morning', emoji: '🌅' },
          { value: 'afternoon', label: 'Afternoon', emoji: '☀️' },
          { value: 'evening', label: 'Evening', emoji: '🌙' }
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setSelectedTimeFilter(filter.value as any)}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm transition-all ${
              selectedTimeFilter === filter.value
                ? 'bg-purple-500/30 text-white border border-purple-400/30'
                : 'text-purple-200 hover:bg-white/5'
            }`}
          >
            <span>{filter.emoji}</span>
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Add Practice Section */}
      <div className="mb-8">
        {!isAddingPractice ? (
          <div>
            <button
              onClick={() => setIsAddingPractice(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all mb-4"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Practice</span>
            </button>

            <div>
              <h3 className="text-lg font-semibold text-purple-200 mb-4">Suggested Practices</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedPractices
                  .filter(suggested => !practices.some(p => p.name === suggested.name))
                  .map((suggested, index) => (
                  <button
                    key={index}
                    onClick={() => addSuggestedPractice(suggested)}
                    className="text-left p-3 bg-white/5 rounded-lg border border-purple-500/20 hover:bg-white/10 hover:border-purple-400/40 transition-all"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span>{getTimeOfDayEmoji(suggested.timeOfDay)}</span>
                      <span className="font-medium text-white text-sm">{suggested.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getFrequencyColor(suggested.frequency)} bg-current/10`}>
                        {suggested.frequency}
                      </span>
                    </div>
                    <p className="text-xs text-purple-200/70">{suggested.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 p-6 rounded-xl border border-purple-500/20">
            <h3 className="text-lg font-semibold text-white mb-4">Create Custom Practice</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Practice Name</label>
                <input
                  type="text"
                  value={newPractice.name}
                  onChange={(e) => setNewPractice({ ...newPractice, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
                  placeholder="Enter practice name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Description</label>
                <textarea
                  value={newPractice.description}
                  onChange={(e) => setNewPractice({ ...newPractice, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 h-20"
                  placeholder="Describe your practice..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Frequency</label>
                  <select
                    value={newPractice.frequency}
                    onChange={(e) => setNewPractice({ ...newPractice, frequency: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Time of Day</label>
                  <select
                    value={newPractice.timeOfDay}
                    onChange={(e) => setNewPractice({ ...newPractice, timeOfDay: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="anytime">Anytime</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={addCustomPractice}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                >
                  Add Practice
                </button>
                <button
                  onClick={() => setIsAddingPractice(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Practices List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-purple-200">
          {selectedTimeFilter === 'all' 
            ? `All Practices (${filteredPractices.length})` 
            : `${selectedTimeFilter.charAt(0).toUpperCase() + selectedTimeFilter.slice(1)} Practices (${filteredPractices.length})`
          }
        </h3>
        
        {filteredPractices.map((practice) => (
          <div
            key={practice.id}
            className={`p-4 rounded-xl border transition-all ${
              isCompletedToday(practice)
                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30'
                : 'bg-white/5 border-purple-500/20 hover:border-purple-400/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => togglePracticeCompletion(practice.id)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    isCompletedToday(practice)
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-purple-400 text-purple-400 hover:border-green-400 hover:text-green-400'
                  }`}
                >
                  {isCompletedToday(practice) && <CheckCircle className="w-5 h-5" />}
                </button>

                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span>{getTimeOfDayEmoji(practice.timeOfDay)}</span>
                    <h3 className="font-semibold text-white">{practice.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getFrequencyColor(practice.frequency)} bg-current/10`}>
                      {practice.frequency}
                    </span>
                  </div>
                  <p className="text-sm text-purple-200/70">{practice.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {practice.streak > 0 && (
                  <div className="flex items-center space-x-1 text-orange-400">
                    <Flame className="w-4 h-4" />
                    <span className="text-sm font-medium">{practice.streak}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1 text-purple-300">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs">
                    {practice.lastCompleted.getTime() > 0 
                      ? practice.lastCompleted.toLocaleDateString()
                      : 'Never'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPractices.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-green-400/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-200 mb-2">
            {selectedTimeFilter === 'all' 
              ? 'Start Your Integration Journey'
              : `No ${selectedTimeFilter} practices yet`
            }
          </h3>
          <p className="text-green-200/60 mb-6">
            {selectedTimeFilter === 'all'
              ? 'Add practices to weave consciousness development into your daily life'
              : `Add some ${selectedTimeFilter} practices to get started`
            }
          </p>
        </div>
      )}
    </div>
  );
}