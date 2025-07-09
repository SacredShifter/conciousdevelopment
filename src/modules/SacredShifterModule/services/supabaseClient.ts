import { supabase, getCurrentUserId, getProgressData, saveDailyProgress, getMilestones, updateMilestone, getUserSettings, updateUserSettings } from '../../../services/supabaseClient';

// Re-export everything from the main supabaseClient
export { 
  supabase, 
  getCurrentUserId, 
  getProgressData, 
  saveDailyProgress, 
  getMilestones, 
  updateMilestone,
  getUserSettings,
  updateUserSettings
};