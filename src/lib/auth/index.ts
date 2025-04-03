/**
 * Auth module exports
 * This file provides a convenient way to import auth functionality
 */

// Export permission system
export * from './permissions';

// Export types
export * from './types';

// Export context and hooks for client components
export { AuthProvider, useAuth } from './context';
export * from './hooks';

// Re-export the config functions for middleware
export { extractParams, getRouteConfig } from './config';
