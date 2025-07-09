import React, { useState, useEffect, useRef } from 'react';
import { Brain, Heart, Compass, Sparkles, Moon, Sun, Users, BarChart3, MessageCircle, Star, Zap, Eye, Infinity, BookOpen, Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { supabase, getCurrentUserId, getUserSettings, updateUserSettings } from '../../services/supabaseClient';
import { CoreValuesExplorer } from './CoreValuesExplorer';
import { PurposeClarifier } from './PurposeClarifier';

export function SacredShifterComponent() {
  const [activeSection, setActiveSection] = useState('values');
  const [activePrinciple, setActivePrinciple] = useState(universalPrinciples[2]); // Start with Vibration
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [energyLevel, setEnergyLevel] = useState<number>(7);
  const [consciousnessDepth, setConsciousnessDepth] = useState<number>(3);
  
  // Biofeedback simulation state
  const [biofeedbackData, setBiofeedbackData] = useState<BiofeedbackData>({
    heartRate: 72,
    stressLevel: 50,
    coherence: 85,
    presence: 90
  });

  const biofeedbackIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    loadUserSettings();
    const timer = setTimeout(() => {
      setIsInitialized(true);
      setIsLoading(false);
    }, 800);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const loadUserSettings = async () => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return;
      
      const settings = await getUserSettings(userId);
      
      if (settings) {
        // Update state with user settings
        setEnergyLevel(settings.energy_level || 7);
        setConsciousnessDepth(settings.consciousness_level === 'awakening' ? 3 : 
          settings.consciousness_level === 'enlightened' ? 5 : 
          settings.consciousness_level === 'transcendent' ? 7 : 3);
        
        // Set active principle based on user settings
        if (settings.active_principle) {
          const principle = universalPrinciples.find(p => p.id === settings.active_principle);
          if (principle) {
            setActivePrinciple(principle);
          }
        }
      } else {
        // Create default settings if none exist
        await updateUserSettings(userId, {
          theme: 'cosmic',
          energy_level: energyLevel,
          consciousness_level: 'awakening',
          active_principle: activePrinciple.id,
          chakra_alignment: 'heart'
        });
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
    }
  };

  useEffect(() => {
    // Update active principle based on current section
    const currentSection = sections.find(s => s.id === activeSection);
    if (currentSection && currentSection.principle) {
      setActivePrinciple(currentSection.principle);
    }
  }, [activeSection]);

  useEffect(() => {
    if (!isSimulationActive) {
      if (biofeedbackIntervalRef.current) {
        clearInterval(biofeedbackIntervalRef.current);
      }
      return;
    }

    biofeedbackIntervalRef.current = setInterval(() => {
      setBiofeedbackData(prev => ({
        heartRate: prev.heartRate + (Math.random() * 2 - 1),
        stressLevel: Math.max(0, Math.min(100, prev.stressLevel + (Math.random() * 4 - 2))),
        coherence: Math.max(0, Math.min(100, prev.coherence + (Math.random() * 4 - 2))),
        presence: Math.max(0, Math.min(100, prev.presence + (Math.random() * 4 - 2)))
      }));
    }, 2000);

    return () => {
      if (biofeedbackIntervalRef.current) {
        clearInterval(biofeedbackIntervalRef.current);
      }
    };
  }, [isSimulationActive, activeSection, energyLevel]);

  const handleEnergyShift = async (delta: number) => {
    setEnergyLevel(prev => Math.max(1, Math.min(10, prev + delta)));
    
    // Save to database
    try {
      const userId = await getCurrentUserId();
      if (!userId) return;
      
      await updateUserSettings(userId, {
        energy_level: Math.max(1, Math.min(10, energyLevel + delta))
      });
    } catch (error) {
      console.error('Error saving energy level:', error);
    }
  };

  const handlePrincipleChange = async (principle: any) => {
    setActivePrinciple(principle);
    
    // Save to database
    try {
      const userId = await getCurrentUserId();
      if (!userId) return;
      
      await updateUserSettings(userId, {
        active_principle: principle.id
      });
    } catch (error) {
      console.error('Error saving active principle:', error);
    }
  };

  const handleConsciousnessShift = async (delta: number) => {
    setConsciousnessDepth(prev => Math.max(1, Math.min(7, prev + delta)));
    
    // Save to database
    try {
      const userId = await getCurrentUserId();
      if (!userId) return;
      
      const level = Math.max(1, Math.min(7, consciousnessDepth + delta));
      const consciousnessLevel = level <= 2 ? 'awakening' : 
        level <= 4 ? 'enlightened' : 'transcendent';
      
      await updateUserSettings(userId, {
        consciousness_level: consciousnessLevel
      });
    } catch (error) {
      console.error('Error saving consciousness level:', error);
    }
  };

  const adjustBiofeedback = (type: 'stress' | 'heartRate', delta: number) => {
    setBiofeedbackData(prev => ({
      ...prev,
      [type]: type === 'stress' 
        ? Math.max(0, Math.min(100, prev.stressLevel + delta))
        : Math.max(40, Math.min(180, prev.heartRate + delta))
    }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="text-center">
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl text-white mb-2">Initializing Sacred Shifter</h2>
            <p className="text-purple-200">Connecting to your consciousness data...</p>
          </div>
        </div>
      )}
      {/* Cosmic Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <div className="relative z-10">
        <div className="grid grid-cols-4 gap-2">
          {universalPrinciples.map((principle) => (
            <button
              key={principle.id}
              onClick={() => handlePrincipleChange(principle)}
              className={`text-xl p-2 rounded-lg transition-all ${
                activePrinciple.id === principle.id
                  ? `bg-gradient-to-br ${principle.color} shadow-lg scale-110`
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              {principle.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}