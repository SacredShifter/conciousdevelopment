# Sacred Shifter Module Migration Guide

This document provides step-by-step instructions for migrating your Sacred Shifter application to a modular structure that can be imported into the Sacred Shifter OS.

## Components Migration

### Step 1: Update Import Paths
All component files need to have their import paths updated to reflect the new module structure:

```typescript
// Before
import { Component } from '../other-component';
import type { SomeType } from '../types';

// After
import { Component } from './other-component';
import type { SomeType } from '../types';
```

### Step 2: Update Type Imports
Ensure all types are imported from the module's types.ts file:

```typescript
// Before
import type { CoreValue } from '../types';

// After
import type { CoreValue } from '../types';
```

## Services Migration

### GlobalEventHorizon Service

Update the GlobalEventHorizon service to work with the module system:

```typescript
// Before
export class GlobalEventHorizon {
  // ... existing code
}

// After
export class GlobalEventHorizon {
  private static instance: GlobalEventHorizon;
  
  // Add singleton pattern
  public static getInstance(): GlobalEventHorizon {
    if (!GlobalEventHorizon.instance) {
      GlobalEventHorizon.instance = new GlobalEventHorizon();
    }
    return GlobalEventHorizon.instance;
  }
  
  // ... existing code
}
```

## Database Integration

If you need to integrate with Supabase or any other database:

1. Create new migration files in the appropriate format
2. Update any database service to use environment variables from the OS
3. Document the required database tables and schemas

## Dependency Management

Ensure all required dependencies are:
1. Listed in the module's README.md
2. Compatible with the Sacred Shifter OS versions
3. Properly imported in the module files

## Testing the Module

Before final integration:
1. Test the module in isolation to ensure it works correctly
2. Test the module within a minimal Sacred Shifter OS setup
3. Verify all components render and function as expected
4. Check that all event emissions and subscriptions work properly

## Final Steps

1. Update the module's README.md with accurate integration instructions
2. Ensure all file paths in the module manifest are correct
3. Document any specific requirements or limitations