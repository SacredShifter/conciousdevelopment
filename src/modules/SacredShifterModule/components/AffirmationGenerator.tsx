@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { Sparkles, Heart, Brain, Target, Shuffle, Copy, Save, Star } from 'lucide-react';
+import { supabase, getCurrentUserId } from '../../services/supabaseClient';
 
 interface PersonalizedAffirmation {
@@ .. @@
   const [customInput, setCustomInput] = useState('');

   useEffect(() => {
-    // Load user data from other modules
-    loadUserProfile();
-    
-    // Load saved affirmations
-    const saved = localStorage.getItem('personalizedAffirmations');
-    if (saved) {
-      setAffirmations(JSON.parse(saved).map((a: any) => ({
-        ...a,
-        createdAt: new Date(a.createdAt)
-      })));
-    }
+    loadUserData();
   }, []);
 
-  useEffect(() => {
-    localStorage.setItem('personalizedAffirmations', JSON.stringify(affirmations));
-  }, [affirmations]);
+  const loadUserData = async () => {
+    try {
+      // Load user data
+      await loadUserProfile();
+      
+      // Load saved affirmations
+      const userId = await getCurrentUserId();
+      if (!userId) return;
+      
+      const { data, error } = await supabase
+        .from('user_intentions')
+        .select('*')
+        .eq('user_id', userId)
+        .order('created_at', { ascending: false });
+        
+      if (error) {
+        console.error('Error loading affirmations:', error);
+        return;
+      }
+      
+      if (data && data.length > 0) {
+        setAffirmations(data.map((a: any) => ({
+          id: a.id,
+          text: a.intention,
+          category: a.category || 'general',
+          personalizedFor: a.tags || [],
+          createdAt: new Date(a.created_at),
+          favorited: a.is_favorite || false,
+          usageCount: a.usage_count || 0
+        })));
+      }
+    } catch (error) {
+      console.error('Error loading data:', error);
+    }
+  };
+  
+  const saveAffirmationToDatabase = async (affirmation: PersonalizedAffirmation) => {
+    try {
+      const userId = await getCurrentUserId();
+      if (!userId) return;
+      
+      const { error } = await supabase
+        .from('user_intentions')
+        .upsert({
+          id: affirmation.id,
+          user_id: userId,
+          title: affirmation.category.charAt(0).toUpperCase() + affirmation.category.slice(1),
+          intention: affirmation.text,
+          category: affirmation.category,
+          tags: affirmation.personalizedFor,
+          is_favorite: affirmation.favorited,
+          usage_count: affirmation.usageCount,
+          created_at: affirmation.createdAt.toISOString(),
+          updated_at: new Date().toISOString()
+        });
+      
+      if (error) {
+        console.error('Error saving affirmation:', error);
+      }
+    } catch (error) {
+      console.error('Error:', error);
+    }
+  };
 
-  const loadUserProfile = () => {
-    // Extract user data from localStorage of other modules
-    const coreValues = localStorage.getItem('coreValues');
-    const purposeReflections = localStorage.getItem('purposeReflections');
-    const dreamData = localStorage.getItem('dreams');
-    
-    if (coreValues) {
-      const values = JSON.parse(coreValues);
-      setUserValues(values.map((v: any) => v.name));
-    }
-    
-    if (purposeReflections) {
-      const reflections = JSON.parse(purposeReflections);
-      const purposes = reflections
-        .filter((r: any) => r.category === 'purpose')
-        .map((r: any) => r.response)
-        .slice(0, 3);
-      setUserPurpose(purposes);
+  const loadUserProfile = async () => {
+    try {
+      const userId = await getCurrentUserId();
+      if (!userId) return;
+      
+      // Get core values
+      const { data: valuesData, error: valuesError } = await supabase
+        .from('sacred_blueprints')
+        .select('*')
+        .eq('user_id', userId);
+      
+      if (valuesError) {
+        console.error('Error fetching values:', valuesError);
+      } else if (valuesData && valuesData.length > 0) {
+        // Extract values from blueprint
+        const values = valuesData[0]?.chakra_signature || {};
+        setUserValues(Object.keys(values));
+      }
+      
+      // Get purpose reflections
+      const { data: purposeData, error: purposeError } = await supabase
+        .from('insight_reflections')
+        .select('*')
+        .eq('user_id', userId)
+        .order('created_at', { ascending: false })
+        .limit(10);
+      
+      if (purposeError) {
+        console.error('Error fetching purpose reflections:', purposeError);
+      } else if (purposeData && purposeData.length > 0) {
+        const purposes = purposeData
+          .filter((r: any) => r.journey_slug === 'purpose')
+          .map((r: any) => r.content)
+          .slice(0, 3);
+        setUserPurpose(purposes);
+      }
+      
+      // Common blocks from unblocking practices
+      setUserBlocks(['fear', 'self-doubt', 'perfectionism', 'overwhelm']);
+    } catch (error) {
+      console.error('Error in loadUserProfile:', error);
     }
-
-    // Common blocks from unblocking practices
-    setUserBlocks(['fear', 'self-doubt', 'perfectionism', 'overwhelm']);
   };

   const generatePersonalizedAffirmation = () => {
@@ .. @@
 
   const saveAffirmation = (affirmation: PersonalizedAffirmation) => {
     const exists = affirmations.find(a => a.text === affirmation.text);
-    if (!exists) {
-      setAffirmations([affirmation, ...affirmations]);
+    if (exists) return;
+    
+    // Add to state
+    const newAffirmations = [affirmation, ...affirmations];
+    setAffirmations(newAffirmations);
+    
+    // Save to database
+    saveAffirmationToDatabase(affirmation);
+  };
+
+  const toggleFavorite = async (id: string) => {
+    const updatedAffirmations = affirmations.map(a => 
+      a.id === id ? { ...a, favorited: !a.favorited } : a
+    );
+    
+    setAffirmations(updatedAffirmations);
+    
+    // Update in database
+    const affirmation = updatedAffirmations.find(a => a.id === id);
+    if (affirmation) {
+      saveAffirmationToDatabase(affirmation);
     }
   };
 
-  const toggleFavorite = (id: string) => {
-    setAffirmations(affirmations.map(a => 
-      a.id === id ? { ...a, favorited: !a.favorited } : a
-    ));
-  };
-
-  const incrementUsage = (id: string) => {
-    setAffirmations(affirmations.map(a => 
-      a.id === id ? { ...a, usageCount: a.usageCount + 1 } : a
-    ));
+  const incrementUsage = async (id: string) => {
+    const updatedAffirmations = affirmations.map(a => 
+      a.id === id ? { ...a, usageCount: a.usageCount + 1 } : a
+    );
+    
+    setAffirmations(updatedAffirmations);
+    
+    // Update in database
+    const affirmation = updatedAffirmations.find(a => a.id === id);
+    if (affirmation) {
+      saveAffirmationToDatabase(affirmation);
+    }
   };
 
   const copyToClipboard = (text: string) => {