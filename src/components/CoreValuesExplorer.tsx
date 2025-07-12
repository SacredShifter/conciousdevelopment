import React, { useState } from 'react';
import { Heart, Plus, Star, Edit3, Save, X } from 'lucide-react';
import type { CoreValue } from '../types';

const suggestedValues = [
  'Authenticity', 'Compassion', 'Courage', 'Creativity', 'Excellence', 'Freedom',
  'Growth', 'Harmony', 'Honesty', 'Justice', 'Love', 'Peace', 'Respect',
  'Responsibility', 'Service', 'Wisdom', 'Adventure', 'Balance', 'Connection',
  'Gratitude', 'Humility', 'Integrity', 'Joy', 'Mindfulness', 'Purpose'
];

export function CoreValuesExplorer() {
  const [values, setValues] = useState<CoreValue[]>([]);
  const [isAddingValue, setIsAddingValue] = useState(false);
  const [editingValue, setEditingValue] = useState<string | null>(null);
  const [newValue, setNewValue] = useState({
    name: '',
    description: '',
    importance: 5,
    manifestations: ['']
  });

  const handleAddValue = () => {
    if (newValue.name.trim()) {
      const value: CoreValue = {
        id: Date.now().toString(),
        name: newValue.name,
        description: newValue.description,
        importance: newValue.importance,
        manifestations: newValue.manifestations.filter(m => m.trim()),
        createdAt: new Date(),
        lastReflected: new Date()
      };
      setValues([...values, value]);
      setNewValue({ name: '', description: '', importance: 5, manifestations: [''] });
      setIsAddingValue(false);
    }
  };

  const handleQuickAdd = (valueName: string) => {
    const value: CoreValue = {
      id: Date.now().toString(),
      name: valueName,
      description: '',
      importance: 5,
      manifestations: [],
      createdAt: new Date(),
      lastReflected: new Date()
    };
    setValues([...values, value]);
  };

  const addManifestation = () => {
    setNewValue({
      ...newValue,
      manifestations: [...newValue.manifestations, '']
    });
  };

  const updateManifestation = (index: number, value: string) => {
    const updated = [...newValue.manifestations];
    updated[index] = value;
    setNewValue({ ...newValue, manifestations: updated });
  };

  const removeManifestation = (index: number) => {
    const updated = newValue.manifestations.filter((_, i) => i !== index);
    setNewValue({ ...newValue, manifestations: updated });
  };

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-8">
        <Heart className="w-8 h-8 text-rose-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Core Values Explorer</h2>
          <p className="text-purple-200/80">Discover and articulate what matters most to you</p>
        </div>
      </div>

      {/* Quick Add Suggestions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-purple-200 mb-4">Quick Add Values</h3>
        <div className="flex flex-wrap gap-2">
          {suggestedValues.map((value) => (
            <button
              key={value}
              onClick={() => handleQuickAdd(value)}
              disabled={values.some(v => v.name === value)}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                values.some(v => v.name === value)
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 hover:text-white'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Add Custom Value */}
      <div className="mb-8">
        {!isAddingValue ? (
          <button
            onClick={() => setIsAddingValue(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Value</span>
          </button>
        ) : (
          <div className="bg-white/5 p-6 rounded-xl border border-purple-500/20">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Value Name</label>
                <input
                  type="text"
                  value={newValue.name}
                  onChange={(e) => setNewValue({ ...newValue, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
                  placeholder="Enter your core value..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Description</label>
                <textarea
                  value={newValue.description}
                  onChange={(e) => setNewValue({ ...newValue, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 h-20"
                  placeholder="What does this value mean to you?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Importance (1-10): {newValue.importance}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newValue.importance}
                  onChange={(e) => setNewValue({ ...newValue, importance: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">How This Shows Up in Your Life</label>
                {newValue.manifestations.map((manifestation, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={manifestation}
                      onChange={(e) => updateManifestation(index, e.target.value)}
                      className="flex-1 px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
                      placeholder="Example: How I practice this value..."
                    />
                    {newValue.manifestations.length > 1 && (
                      <button
                        onClick={() => removeManifestation(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addManifestation}
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  + Add another manifestation
                </button>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleAddValue}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Value</span>
                </button>
                <button
                  onClick={() => setIsAddingValue(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {values.map((value) => (
          <div key={value.id} className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 p-6 rounded-xl border border-purple-500/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-rose-400" />
                <h3 className="text-lg font-semibold text-white">{value.name}</h3>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(value.importance)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            
            {value.description && (
              <p className="text-purple-200/80 mb-4">{value.description}</p>
            )}
            
            {value.manifestations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-purple-300 mb-2">Manifestations:</h4>
                <ul className="space-y-1">
                  {value.manifestations.map((manifestation, index) => (
                    <li key={index} className="text-sm text-purple-200/70">
                      • {manifestation}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {values.length === 0 && (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-purple-200 mb-2">Your Values Journey Begins</h3>
          <p className="text-purple-200/60 mb-6">Start by adding values that resonate with your authentic self</p>
        </div>
      )}
    </div>
  );
}