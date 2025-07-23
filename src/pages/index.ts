import { lazy } from 'react';

// Lazy load pages for code splitting
export const AuthPage = lazy(() => import('./AuthPage').then(module => ({ default: module.AuthPage })));
export const StudioPage = lazy(() => import('./StudioPage').then(module => ({ default: module.StudioPage })));
export const WorkflowsPage = lazy(() => import('./WorkflowsPage').then(module => ({ default: module.WorkflowsPage })));