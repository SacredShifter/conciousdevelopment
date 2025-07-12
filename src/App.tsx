import React, { useState, useEffect } from 'react';
import { SacredShifterComponent } from '@components/SacredShifterComponent';
import { ModuleManager } from '@/modules';

function App() {
  const [isModuleReady, setIsModuleReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the module is active
    const checkModuleStatus = async () => {
      try {
        const isActive = ModuleManager.isActive('sacred-shifter');
        
        if (!isActive) {
          // Try to initialize and activate again if needed
          await ModuleManager.initialize('sacred-shifter');
          await ModuleManager.activate('sacred-shifter');
        }
        
        setIsModuleReady(true);
      } catch (err) {
        console.error('Error initializing module:', err);
        setError('Failed to initialize the Sacred Shifter module. Using offline mode.');
        // Still set ready to true to show the component in offline mode
        setIsModuleReady(true);
      }
    };
    
    checkModuleStatus();
  }, []);

  if (!isModuleReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-4xl mb-4">✨</div>
          <h1 className="text-2xl font-bold text-white mb-2">Loading Sacred Shifter</h1>
          <p className="text-gray-400">Initializing consciousness development module...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {error && (
        <div className="bg-yellow-900/50 border border-yellow-700 p-3 text-yellow-200 text-sm">
          {error} Some features may be limited.
        </div>
      )}
      <SacredShifterComponent />
    </div>
  );
}

export default App;