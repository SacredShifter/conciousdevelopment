import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize Sacred Shifter Module
import { ModuleManager } from './modules';

// Initialize and activate the module
async function initializeApp() {
  try {
    await ModuleManager.initialize('sacred-shifter');
    await ModuleManager.activate('sacred-shifter');
    
    // Render the app once the module is ready
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize Sacred Shifter module:', error);
    
    // Render the app anyway, but with a warning
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}

initializeApp();