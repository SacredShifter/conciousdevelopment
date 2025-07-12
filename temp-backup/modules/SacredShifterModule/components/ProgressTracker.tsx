Here is the fixed file with missing closing brackets added:

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, Target, Award, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase, getCurrentUserId, getProgressData, saveDailyProgress, getMilestones, updateMilestone } from '../../services/supabaseClient';
import type { Milestone } from '../../types/ssos';

interface ProgressData {
  date: string;
  valuesReflections: number;
  purposeReflections: number;
  meditationMinutes: number;
  practicesCompleted: number;
  dreamsRecorded: number;
  insights: string[];
}

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  data?: ProgressData;
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
      } else if (milestones.length > 0) {
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
    const now = new Date();
    let startDate = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'quarter':
        startDate.setDate(now.getDate() - 90);
        break;
    }
    
    return progressData.filter(data => new Date(data.date) >= startDate);
  };

  const generateCalendarDays = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    // First day of the calendar grid (might be from previous month)
    const calendarStart = new Date(firstDay);
    calendarStart.setDate(firstDay.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(calendarStart);
      currentDate.setDate(calendarStart.getDate() + i);
      
      const dayData = progressData.find(d => d.date === currentDate.toISOString().split('T')[0]);
      
      days.push({
        date: new Date(currentDate),
        dayNumber: currentDate.getDate(),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: currentDate.toDateString() === today.toDateString(),
        data: dayData
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays(currentDate);

  const getDayActivityLevel = (day: CalendarDay) => {
    if (!day.data) return 'none';
    
    const total = day.data.valuesReflections + day.data.purposeReflections + 
                  day.data.practicesCompleted + day.data.dreamsRecorded +
                  Math.floor(day.data.meditationMinutes / 10);
    
    if (total === 0) return 'none';
    if (total <= 2) return 'low';
    if (total <= 5) return 'medium';
    return 'high';
  };
  
  const getActivityColor = (level: string) => {
    switch (level) {
      case 'none': return 'bg-gray-700';
      case 'low': return 'bg-green-800';
      case 'medium': return 'bg-green-600';
      case 'high': return 'bg-green-400';
      default: return 'bg-gray-700';
    }
  };
  
  const periodData = getPeriodData();
  
  const totalStats = {
    valuesReflections: periodData.reduce((sum, day) => sum + (day.valuesReflections || 0), 0),
    purposeReflections: periodData.reduce((sum, day) => sum + (day.purposeReflections || 0), 0),
    meditationMinutes: periodData.reduce((sum, day) => sum + (day.meditationMinutes || 0), 0),
    practicesCompleted: periodData.reduce((sum, day) => sum + (day.practicesCompleted || 0), 0),
    dreamsRecorded: periodData.reduce((sum, day) => sum + (day.dreamsRecorded || 0), 0)
  };
  
  const averageStats = {
    valuesReflections: (totalStats.valuesReflections / Math.max(periodData.length, 1)).toFixed(1),
    purposeReflections: (totalStats.purposeReflections / Math.max(periodData.length, 1)).toFixed(1),
    meditationMinutes: (totalStats.meditationMinutes / Math.max(periodData.length, 1)).toFixed(1),
    practicesCompleted: (totalStats.practicesCompleted / Math.max(periodData.length, 1)).toFixed(1),
    dreamsRecorded: (totalStats.dreamsRecorded / Math.max(periodData.length, 1)).toFixed(1)
  };
  
  const getCategoryColor = (category: string) => {
    const colors = {
      values: 'text-rose-400',
      purpose: 'text-indigo-400',
      mindfulness: 'text-amber-400',
      dreams: 'text-blue-400',
      integration: 'text-green-400'
    };
    return colors[category as keyof typeof colors] || 'text-gray-400';
  };
  
  const getCategoryBg = (category: string) => {
    const colors = {
      values: 'from-rose-500/20 to-pink-500/20 border-rose-500/30',
      purpose: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30',
      mindfulness: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
      dreams: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
      integration: 'from-green-500/20 to-emerald-500/20 border-green-500/30'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500/20 to-gray-500/20 border-gray-500/30';
  };

  return (
    <div className="p-8 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="text-white text-xl">Loading your progress data...</div>
        </div>
      )}
      <div className="flex items-center space-x-3 mb-8">
        <BarChart3 className="w-8 h-8 text-orange-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Progress Insights</h2>
          <p className="text-purple-200/80">Track your consciousness development journey</p>
        </div>
      </div>
    </div>
  );
}