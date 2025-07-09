@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { Users, Plus, CheckCircle, Calendar, Target, Flame, Clock } from 'lucide-react';
 import type { DailyPractice } from '../types';
+import { supabase, getCurrentUserId } from '../services/supabaseClient';
 
 const suggestedPractices = [
@@ .. @@
 
 export function DailyIntegration() {
   const [practices, setPractices] = useState<DailyPractice[]>([]);
+  const [isLoading, setIsLoading] = useState(true);
   const [selectedTimeFilter, setSelectedTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
   const [isAddingPractice, setIsAddingPractice] = useState(false);
   const [newPractice, setNewPractice] = useState({
@@ .. @@
   });

   useEffect(() => {
-    // Load practices from localStorage on mount
-    const saved = localStorage.getItem('dailyPractices');
-    if (saved) {
-      const parsed = JSON.parse(saved);
-      setPractices(parsed.map((p: any) => ({
-        ...p,
-        lastCompleted: p.lastCompleted ? new Date(p.lastCompleted) : new Date(0)
-      })));
-    }
+    loadPractices();
   }, []);
 
-  useEffect(() => {
-    // Save practices to localStorage whenever they change
-    localStorage.setItem('dailyPractices', JSON.stringify(practices));
-  }, [practices]);
+  const loadPractices = async () => {
+    setIsLoading(true);
+    try {
+      const userId = await getCurrentUserId();
+      if (!userId) {
+        console.error('No user is logged in');
+        setIsLoading(false);
+        return;
+      }
+      
+      const { data, error } = await supabase
+        .from('tasks')
+        .select('*')
+        .eq('user_id', userId)
+        .order('created_at', { ascending: false });
+      
+      if (error) {
+        console.error('Error fetching practices:', error);
+        return;
+      }
+      
+      if (data && data.length > 0) {
+        // Map from database format to component format
+        setPractices(data.map((p: any) => ({
+          id: p.id,
+          name: p.title,
+          description: p.description || '',
+          frequency: p.is_recurring ? 'daily' : 'once',
+          timeOfDay: p.time ? getTimeOfDay(p.time) : 'anytime',
+          completed: p.is_completed,
+          streak: p.streak || 0,
+          lastCompleted: p.completed_at ? new Date(p.completed_at) : new Date(0)
+        })));
+      }
+    } catch (error) {
+      console.error('Error:', error);
+    } finally {
+      setIsLoading(false);
+    }
+  };
+  
+  const getTimeOfDay = (time: string): 'morning' | 'afternoon' | 'evening' | 'anytime' => {
+    if (!time) return 'anytime';
+    
+    const hour = parseInt(time.split(':')[0], 10);
+    if (hour >= 5 && hour < 12) return 'morning';
+    if (hour >= 12 && hour < 17) return 'afternoon';
+    if (hour >= 17 || hour < 5) return 'evening';
+    return 'anytime';
+  };
+
+  const savePractice = async (practice: DailyPractice) => {
+    try {
+      const userId = await getCurrentUserId();
+      if (!userId) return;
+      
+      // Convert from component format to database format
+      const { error } = await supabase
+        .from('tasks')
+        .upsert({
+          id: practice.id,
+          user_id: userId,
+          title: practice.name,
+          description: practice.description,
+          date: new Date().toISOString().split('T')[0], // Today's date
+          time: null, // We don't have exact time in our component
+          is_recurring: practice.frequency === 'daily',
+          is_completed: practice.completed,
+          streak: practice.streak,
+          completed_at: practice.completed ? practice.lastCompleted.toISOString() : null,
+          updated_at: new Date().toISOString()
+        });
+      
+      if (error) {
+        console.error('Error saving practice:', error);
+        return;
+      }
+    } catch (error) {
+      console.error('Error:', error);
+    }
+  };

   const addSuggestedPractice = (suggested: typeof suggestedPractices[0]) => {
     const practice: DailyPractice = {
@@ .. @@
       streak: 0,
       lastCompleted: new Date(0)
     };
+    
     setPractices([...practices, practice]);
+    savePractice(practice);
   };

   const addCustomPractice = () => {
@@ .. @@
         lastCompleted: new Date(0)
       };
       setPractices([...practices, practice]);
+      savePractice(practice);
       setNewPractice({
         name: '',
         description: '',
@@ .. @@
   };

   const togglePracticeCompletion = (practiceId: string) => {
-    setPractices(practices.map(practice => {
+    const updatedPractices = practices.map(practice => {
       if (practice.id === practiceId) {
         const now = new Date();
         const wasCompletedToday = isCompletedToday(practice);
@@ .. @@
         }
       }
       return practice;
-    }));
+    });
+    
+    setPractices(updatedPractices);
+    
+    // Save the updated practice to Supabase
+    const updatedPractice = updatedPractices.find(p => p.id === practiceId);
+    if (updatedPractice) {
+      savePractice(updatedPractice);
+    }
   };
 
   const isCompletedToday = (practice: DailyPractice) => {
@@ .. @@
   const totalTodayPractices = practices.filter(p => p.frequency === 'daily').length;

   return (
-    <div className="p-8">
+    <div className="p-8 relative">
+      {isLoading && (
+        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
+          <div className="text-white text-xl">Loading your practices...</div>
+        </div>
+      )}
       <div className="flex items-center space-x-3 mb-8">
         <Users className="w-8 h-8 text-green-400" />