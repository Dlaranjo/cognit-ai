import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useWorkflows } from '../useWorkflows';
import workflowsReducer from '../../redux/workflows/workflowsReducer';
import type { WorkflowsState } from '../../redux/workflows/workflowsTypes';

import { vi } from 'vitest';

// Mock logger
vi.mock('../../shared/utils', () => ({
  logger: {
    dev: vi.fn(),
    mock: vi.fn(),
    error: vi.fn(),
  },
}));

// Create a test store
const createTestStore = (initialState?: Partial<WorkflowsState>) => {
  return configureStore({
    reducer: {
      workflows: workflowsReducer,
    },
    preloadedState: {
      workflows: {
        workflows: [],
        activeWorkflow: null,
        selectedNode: null,
        templates: [],
        executions: [],
        n8nState: {
          isConnected: false,
        },
        isLoading: false,
        isExecuting: false,
        error: null,
        filters: {},
        ...initialState,
      },
    },
  });
};

// Test wrapper component
const createWrapper = (store: ReturnType<typeof createTestStore>) => {
  const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    React.createElement(Provider, { store }, children);
  return TestWrapper;
};

describe('useWorkflows', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  it('should return initial state', () => {
    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useWorkflows(), { wrapper });

    expect(result.current.workflows).toEqual([]);
    expect(result.current.activeWorkflow).toBeNull();
    expect(result.current.selectedNode).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isExecuting).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should select a workflow', () => {
    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useWorkflows(), { wrapper });

    const mockWorkflow = {
      id: 'test-workflow',
      name: 'Test Workflow',
      description: 'Test Description',
      nodes: [],
      connections: [],
      isActive: false,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    };

    act(() => {
      result.current.selectWorkflow(mockWorkflow);
    });

    expect(result.current.activeWorkflow).toEqual(mockWorkflow);
  });

  it('should select a node', () => {
    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useWorkflows(), { wrapper });

    const mockNode = {
      id: 'test-node',
      type: 'trigger' as const,
      title: 'Test Node',
      description: 'Test Description',
      icon: 'Mail' as const,
      color: 'blue',
      position: { x: 0, y: 0 },
      connected: false,
    };

    act(() => {
      result.current.selectNode(mockNode);
    });

    expect(result.current.selectedNode).toEqual(mockNode);
  });

  it('should clear selected node when null is passed', () => {
    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useWorkflows(), { wrapper });

    // First select a node
    const mockNode = {
      id: 'test-node',
      type: 'trigger' as const,
      title: 'Test Node',
      description: 'Test Description',
      icon: 'Mail' as const,
      color: 'blue',
      position: { x: 0, y: 0 },
      connected: false,
    };

    act(() => {
      result.current.selectNode(mockNode);
    });

    expect(result.current.selectedNode).toEqual(mockNode);

    // Then clear it
    act(() => {
      result.current.selectNode(null);
    });

    expect(result.current.selectedNode).toBeNull();
  });

  it('should update filters', () => {
    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useWorkflows(), { wrapper });

    const newFilters = { category: 'test', status: 'active' };

    act(() => {
      result.current.updateFilters(newFilters);
    });

    expect(result.current.filters).toEqual(newFilters);
  });

  it('should clear error', () => {
    const storeWithError = createTestStore({ error: 'Test error' });
    const wrapper = createWrapper(storeWithError);
    const { result } = renderHook(() => useWorkflows(), { wrapper });

    expect(result.current.error).toBe('Test error');

    act(() => {
      result.current.clearWorkflowError();
    });

    expect(result.current.error).toBeNull();
  });

  it('should provide workflow validation', () => {
    const mockWorkflow = {
      id: 'test-workflow',
      name: 'Test Workflow',
      description: 'Test Description',
      nodes: [
        {
          id: 'trigger-1',
          type: 'trigger' as const,
          title: 'Email Trigger',
          description: 'Trigger description',
          icon: 'Mail' as const,
          color: 'blue',
          position: { x: 0, y: 0 },
          connected: true,
        },
      ],
      connections: [],
      isActive: false,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    };

    const storeWithWorkflow = createTestStore({ activeWorkflow: mockWorkflow });
    const wrapper = createWrapper(storeWithWorkflow);
    const { result } = renderHook(() => useWorkflows(), { wrapper });

    expect(result.current.workflowValidation.isValid).toBe(true);
    expect(result.current.workflowValidation.errors).toEqual([]);
  });

  it('should provide workflow stats', () => {
    const mockWorkflows = [
      {
        id: 'workflow-1',
        name: 'Active Workflow',
        description: 'Description',
        nodes: [],
        connections: [],
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
      {
        id: 'workflow-2',
        name: 'Inactive Workflow',
        description: 'Description',
        nodes: [],
        connections: [],
        isActive: false,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
    ];

    const storeWithWorkflows = createTestStore({ workflows: mockWorkflows });
    const wrapper = createWrapper(storeWithWorkflows);
    const { result } = renderHook(() => useWorkflows(), { wrapper });

    expect(result.current.workflowStats.totalWorkflows).toBe(2);
    expect(result.current.workflowStats.activeWorkflows).toBe(1);
    expect(result.current.workflowStats.inactiveWorkflows).toBe(1);
  });
});
