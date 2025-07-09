// Script to prepare the Sacred Shifter module for distribution

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.resolve(__dirname, '../src');
const MODULE_DIR = path.resolve(__dirname, '../src/modules/SacredShifterModule');
const DEST_DIR = path.resolve(__dirname, '../dist/modules/SacredShifterModule');

// Ensure destination directory exists
if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

console.log('Preparing Sacred Shifter Module for distribution...');

// Copy the module files to the distribution directory
copyDir(MODULE_DIR, DEST_DIR);

// Copy README.md to the distribution directory
fs.copyFileSync(
  path.resolve(MODULE_DIR, 'README.md'),
  path.resolve(DEST_DIR, 'README.md')
);

console.log('Module preparation complete!');

// Helper function to copy a directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}