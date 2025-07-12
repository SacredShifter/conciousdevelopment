import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client with error handling
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true
    }
  }
);

// Helper function to get current user ID
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting user session:', error);
      return null;
    }
    
    if (!data.session) {
      // For development/testing, use a mock user ID when not logged in
      if (process.env.NODE_ENV === 'development') {
        return 'mock-user-id-for-development';
      }
      return null;
    }
    
    return data.session.user.id;
  } catch (error) {
    console.error('Error in getCurrentUserId:', error);
    return null;
  }
};

// Helper functions for user settings
export const getUserSettings = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('sacred_shifter_user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is fine
      console.error('Error fetching user settings:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getUserSettings:', error);
    return null;
  }
};

export const updateUserSettings = async (userId: string, settings: any) => {
  try {
    const { error } = await supabase
      .from('sacred_shifter_user_settings')
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error updating user settings:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateUserSettings:', error);
    return false;
  }
};

// Helper functions for progress data
export const getProgressData = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('sacred_shifter_progress_data')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching progress data:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getProgressData:', error);
    return [];
  }
};

export const saveDailyProgress = async (userId: string, progressData: any) => {
  try {
    const { error } = await supabase
      .from('sacred_shifter_progress_data')
      .upsert({
        user_id: userId,
        date: progressData.date,
        values_reflections: progressData.valuesReflections,
        purpose_reflections: progressData.purposeReflections,
        meditation_minutes: progressData.meditationMinutes,
        practices_completed: progressData.practicesCompleted,
        dreams_recorded: progressData.dreamsRecorded,
        insights: progressData.insights || []
      });
    
    if (error) {
      console.error('Error saving progress data:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveDailyProgress:', error);
    return false;
  }
};

// Milestone helpers
export const getMilestones = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('sacred_shifter_milestones')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching milestones:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getMilestones:', error);
    return [];
  }
};

export const updateMilestone = async (milestone: any) => {
  try {
    const { error } = await supabase
      .from('sacred_shifter_milestones')
      .upsert(milestone);
    
    if (error) {
      console.error('Error updating milestone:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateMilestone:', error);
    return false;
  }
};