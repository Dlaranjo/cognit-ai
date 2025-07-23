import { lazy } from 'react';

// Lazy load pages for code splitting
export const AuthPage = lazy(() => import('./AuthPage').then(module => ({ default: module.AuthPage })));
export const StudioPage = lazy(() => import('./StudioPage').then(module => ({ default: module.StudioPage })));
export const AgentsPage = lazy(() => import('./AgentsPage').then(module => ({ default: module.AgentsPage })));