import { lazy } from 'react';

// Lazy load pages for code splitting
export const AuthPage = lazy(() => import('./AuthPage').then(module => ({ default: module.AuthPage })));
export const StudioPage = lazy(() => import('./StudioPage').then(module => ({ default: module.StudioPage })));
export const WorkspacesPage = lazy(() => import('./WorkspacesPage').then(module => ({ default: module.WorkspacesPage })));
export const ProjectsPage = lazy(() => import('./ProjectsPage').then(module => ({ default: module.ProjectsPage })));
export const DocumentsPage = lazy(() => import('./DocumentsPage').then(module => ({ default: module.DocumentsPage })));
export const SearchPage = lazy(() => import('./SearchPage').then(module => ({ default: module.SearchPage })));
export const AgentsPage = lazy(() => import('./AgentsPage').then(module => ({ default: module.AgentsPage })));