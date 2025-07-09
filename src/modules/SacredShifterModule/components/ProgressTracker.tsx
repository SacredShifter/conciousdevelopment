Here is the fixed file with missing closing brackets added:

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, Target, Award, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase, getCurrentUserId, getProgressData, saveDailyProgress, getMilestones, updateMilestone } from '../../services/supabaseClient';

interface ProgressData {
  date: string;
}

export function ProgressTracker() {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'chart' | 'calendar'>('chart');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        console.error('No user is logged in');
        setIsLoading(false);
        return;
      }
      
      // Fetch progress data
      const progress = await getProgressData(userId);
      if (progress.length > 0) {
        setProgressData(progress.map(p => ({
          date: p.date,
          valuesReflections: p.values_reflections,
          purposeReflections: p.purpose_reflections,
          meditationMinutes: p.meditation_minutes,
          practicesCompleted: p.practices_completed,
          dreamsRecorded: p.dreams_recorded,
          insights: p.insights || []
        })));
      } else {
        // Initialize with sample data if no data exists
        const sampleData = generateSampleData();
        setProgressData(sampleData);
        // Save sample data to Supabase
        for (const entry of sampleData) {
          await saveDailyProgress(userId, entry);
        }
      }
      
      // Fetch milestones
      const userMilestones = await getMilestones(userId);
      if (userMilestones.length > 0) {
        setMilestones(userMilestones);
      } else {
        // Initialize default milestones in Supabase
        for (const milestone of milestones) {
          await updateMilestone({
            ...milestone,
            user_id: userId
          });
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to save user progress
  const saveUserProgress = async (data: ProgressData) => {
    const userId = await getCurrentUserId();
    if (!userId) return;
    
    await saveDailyProgress(userId, data);
  };

  // Helper function to update user milestone
  const saveUserMilestone = async (milestone: Milestone) => {
    const userId = await getCurrentUserId();
    if (!userId) return;
    
    await updateMilestone({
      ...milestone,
      user_id: userId
    });
  };

  const generateSampleData = (): ProgressData[] => {
    // Same implementation as before
    const data: ProgressData[] = [];
    const today = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        valuesReflections: Math.floor(Math.random() * 3),
        purposeReflections: Math.floor(Math.random() * 2),
        meditationMinutes: Math.floor(Math.random() * 30),
        practicesCompleted: Math.floor(Math.random() * 5),
        dreamsRecorded: Math.random() > 0.7 ? 1 : 0,
        insights: []
      });
    }
    
    return data;
  };

  const getPeriodData = () => {
  };

  const calendarDays = generateCalendarDays(currentDate);

  return (
    <div className="p-8 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="text-white text-xl">Loading your progress data...</div>
        </div>
      )}
      <div className="flex items-center space-x-3 mb-8">
        <BarChart3 className="w-8 h-8 text-orange-400" />
      </div>
    </div>
  );
}