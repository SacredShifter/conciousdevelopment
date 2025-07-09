import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, Target, Award, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProgressData {
  date: string;
  valuesReflections: number;
  purposeReflections: number;
  meditationMinutes: number;
  practicesCompleted: number;
  dreamsRecorded: number;
  insights: string[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  category: string;
  completed: boolean;
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
  const [selectedView, setSelectedView] = useState<'chart' | 'calendar'>('chart');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: '1',
      title: 'Values Explorer',
      description: 'Identify and articulate 10 core values',
      target: 10,
      current: 0,
      category: 'values',
      completed: false
    },
    {
      id: '2',
      title: 'Purpose Seeker',
      description: 'Complete 20 purpose reflection prompts',
      target: 20,
      current: 0,
      category: 'purpose',
      completed: false
    },
    {
      id: '3',
      title: 'Meditation Master',
      description: 'Accumulate 300 minutes of meditation',
      target: 300,
      current: 0,
      category: 'mindfulness',
      completed: false
    },
    {
      id: '4',
      title: 'Dream Walker',
      description: 'Record and analyze 15 dreams',
      target: 15,
      current: 0,
      category: 'dreams',
      completed: false
    },
    {
      id: '5',
      title: 'Consistent Practitioner',
      description: 'Complete daily practices for 30 days',
      target: 30,
      current: 0,
      category: 'integration',
      completed: false
    }
  ]);

  useEffect(() => {
    // Load progress data from localStorage
    const savedProgress = localStorage.getItem('progressData');
    if (savedProgress) {
      setProgressData(JSON.parse(savedProgress));
    } else {
      // Initialize with some sample data for the past week
      const sampleData = generateSampleData();
      setProgressData(sampleData);
      localStorage.setItem('progressData', JSON.stringify(sampleData));
    }

    // Update milestones based on actual data
    updateMilestonesFromData();
  }, []);

  const generateSampleData = (): ProgressData[] => {
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

  const updateMilestonesFromData = () => {
    // This would typically pull from actual app data
    // For now, we'll simulate progress based on localStorage or random values
    const savedMilestones = localStorage.getItem('milestones');
    if (savedMilestones) {
      setMilestones(JSON.parse(savedMilestones));
    }
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

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

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
    valuesReflections: periodData.reduce((sum, day) => sum + day.valuesReflections, 0),
    purposeReflections: periodData.reduce((sum, day) => sum + day.purposeReflections, 0),
    meditationMinutes: periodData.reduce((sum, day) => sum + day.meditationMinutes, 0),
    practicesCompleted: periodData.reduce((sum, day) => sum + day.practicesCompleted, 0),
    dreamsRecorded: periodData.reduce((sum, day) => sum + day.dreamsRecorded, 0)
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

  const calendarDays = generateCalendarDays(currentDate);

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-8">
        <BarChart3 className="w-8 h-8 text-orange-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Progress Insights</h2>
          <p className="text-purple-200/80">Track your consciousness development journey</p>
        </div>
      </div>

      {/* View and Period Selectors */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <span className="text-purple-200 text-sm font-medium">View:</span>
          {[
            { id: 'chart', label: 'Chart' },
            { id: 'calendar', label: 'Calendar' }
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setSelectedView(view.id as any)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedView === view.id
                  ? 'bg-gradient-to-r from-orange-500/30 to-red-500/30 text-white border border-orange-400/30'
                  : 'text-purple-200 hover:bg-white/5'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        {selectedView === 'chart' && (
          <div className="flex items-center space-x-4">
            <span className="text-purple-200 text-sm font-medium">Period:</span>
            {(['week', 'month', 'quarter'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedPeriod === period
                    ? 'bg-gradient-to-r from-purple-500/30 to-indigo-500/30 text-white border border-purple-400/30'
                    : 'text-purple-200 hover:bg-white/5'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-rose-500/20 to-pink-500/20 p-4 rounded-xl border border-rose-500/30">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-rose-400" />
            <span className="text-rose-300 text-sm font-medium">Values Work</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{totalStats.valuesReflections}</div>
          <div className="text-xs text-rose-200/70">Avg: {averageStats.valuesReflections}/day</div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-4 rounded-xl border border-indigo-500/30">
          <div className="flex items-center space-x-2 mb-2">
            <Lightbulb className="w-5 h-5 text-indigo-400" />
            <span className="text-indigo-300 text-sm font-medium">Purpose</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{totalStats.purposeReflections}</div>
          <div className="text-xs text-indigo-200/70">Avg: {averageStats.purposeReflections}/day</div>
        </div>

        <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-4 rounded-xl border border-amber-500/30">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <span className="text-amber-300 text-sm font-medium">Meditation</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{totalStats.meditationMinutes}m</div>
          <div className="text-xs text-amber-200/70">Avg: {averageStats.meditationMinutes}m/day</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 rounded-xl border border-green-500/30">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-5 h-5 text-green-400" />
            <span className="text-green-300 text-sm font-medium">Practices</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{totalStats.practicesCompleted}</div>
          <div className="text-xs text-green-200/70">Avg: {averageStats.practicesCompleted}/day</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-4 rounded-xl border border-blue-500/30">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Dreams</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{totalStats.dreamsRecorded}</div>
          <div className="text-xs text-blue-200/70">Avg: {averageStats.dreamsRecorded}/day</div>
        </div>
      </div>

      {/* Main Content - Chart or Calendar */}
      {selectedView === 'chart' ? (
        <div className="bg-white/5 p-6 rounded-xl border border-purple-500/20 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Daily Activity Chart</h3>
          <div className="space-y-4">
            {periodData.slice(-14).map((day, index) => {
              const date = new Date(day.date);
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
              const dayDate = date.getDate();
              
              return (
                <div key={day.date} className="flex items-center space-x-4">
                  <div className="w-16 text-center">
                    <div className="text-white font-medium">{dayName}</div>
                    <div className="text-purple-300 text-sm">{dayDate}</div>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-5 gap-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full bg-rose-400`}></div>
                      <div className="text-sm text-white">{day.valuesReflections}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full bg-indigo-400`}></div>
                      <div className="text-sm text-white">{day.purposeReflections}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full bg-amber-400`}></div>
                      <div className="text-sm text-white">{day.meditationMinutes}m</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full bg-green-400`}></div>
                      <div className="text-sm text-white">{day.practicesCompleted}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full bg-blue-400`}></div>
                      <div className="text-sm text-white">{day.dreamsRecorded}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-center space-x-6 mt-6 pt-4 border-t border-purple-500/20">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-rose-400"></div>
              <span className="text-sm text-purple-200">Values</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
              <span className="text-sm text-purple-200">Purpose</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span className="text-sm text-purple-200">Meditation</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-sm text-purple-200">Practices</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span className="text-sm text-purple-200">Dreams</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 p-6 rounded-xl border border-purple-500/20 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-purple-300" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm bg-purple-500/20 text-purple-200 rounded-lg hover:bg-purple-500/30 transition-all"
              >
                Today
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <ChevronRight className="w-5 h-5 text-purple-300" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-purple-300">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((day, index) => {
              const activityLevel = getDayActivityLevel(day);
              return (
                <div
                  key={index}
                  className={`aspect-square p-1 text-center text-sm border border-purple-500/10 relative ${
                    day.isCurrentMonth ? 'text-white' : 'text-gray-500'
                  } ${day.isToday ? 'ring-2 ring-purple-400' : ''}`}
                >
                  <div className="absolute inset-1 rounded flex flex-col items-center justify-center">
                    <div className="text-xs mb-1">{day.dayNumber}</div>
                    <div className={`w-2 h-2 rounded-full ${getActivityColor(activityLevel)}`}></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Activity legend */}
          <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-purple-500/20">
            <span className="text-sm text-purple-300">Activity:</span>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-700"></div>
              <span className="text-xs text-purple-200">None</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-800"></div>
              <span className="text-xs text-purple-200">Low</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <span className="text-xs text-purple-200">Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-xs text-purple-200">High</span>
            </div>
          </div>
        </div>
      )}

      {/* Milestones */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-6">Milestones & Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {milestones.map((milestone) => {
            const progress = Math.min((milestone.current / milestone.target) * 100, 100);
            
            return (
              <div
                key={milestone.id}
                className={`p-4 rounded-xl border bg-gradient-to-br ${getCategoryBg(milestone.category)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Award className={`w-5 h-5 ${getCategoryColor(milestone.category)}`} />
                    <h4 className="font-semibold text-white">{milestone.title}</h4>
                  </div>
                  {milestone.completed && (
                    <div className="text-2xl">🏆</div>
                  )}
                </div>
                
                <p className="text-sm text-purple-200/70 mb-3">{milestone.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-200">Progress</span>
                    <span className="text-white font-medium">
                      {milestone.current} / {milestone.target}
                    </span>
                  </div>
                  
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        milestone.completed 
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                          : `bg-gradient-to-r ${milestone.category === 'values' ? 'from-rose-400 to-pink-500' :
                              milestone.category === 'purpose' ? 'from-indigo-400 to-purple-500' :
                              milestone.category === 'mindfulness' ? 'from-amber-400 to-orange-500' :
                              milestone.category === 'dreams' ? 'from-blue-400 to-indigo-500' :
                              'from-green-400 to-emerald-500'}`
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-xs text-purple-300">
                    {progress.toFixed(1)}% complete
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {milestones.filter(m => m.completed).length === 0 && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-orange-400/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-orange-200 mb-2">Your Journey Begins</h3>
          <p className="text-orange-200/60 mb-6">Start exploring to unlock achievements and track your growth</p>
        </div>
      )}
    </div>
  );
}