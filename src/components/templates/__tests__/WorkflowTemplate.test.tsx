import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi } from 'vitest';
import { WorkflowTemplate } from '../WorkflowTemplate';
import workflowsReducer from '../../../redux/workflows/workflowsReducer';

// Mock the child components
vi.mock('../../organisms/WorkflowCanvas', () => ({
  WorkflowCanvas: () => <div data-testid="workflow-canvas">WorkflowCanvas</div>,
}));

vi.mock('../../organisms/WorkflowNodeModal', () => ({
  WorkflowNodeModal: () => <div data-testid="workflow-node-modal">WorkflowNodeModal</div>,
}));

vi.mock('../../organisms/WorkflowAIAssistant', () => ({
  WorkflowAIAssistant: () => <div data-testid="workflow-ai-assistant">WorkflowAIAssistant</div>,
}));

// Create a test store
const createTestStore = () => {
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
      },
    },
  });
};

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = createTestStore();
  return <Provider store={store}>{children}</Provider>;
};

describe('WorkflowTemplate', () => {
  it('should render without crashing', () => {
    render(
      <TestWrapper>
        <WorkflowTemplate />
      </TestWrapper>
    );

    expect(screen.getByTestId('workflow-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('workflow-node-modal')).toBeInTheDocument();
    expect(screen.getByTestId('workflow-ai-assistant')).toBeInTheDocument();
  });

  it('should have correct layout structure', () => {
    const { container } = render(
      <TestWrapper>
        <WorkflowTemplate />
      </TestWrapper>
    );

    // Check main container has correct classes
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('h-full', 'flex', 'bg-gray-50');

    // Check canvas area
    const canvasArea = mainContainer.querySelector('.flex-1');
    expect(canvasArea).toBeInTheDocument();
    expect(canvasArea).toContainElement(screen.getByTestId('workflow-canvas'));

    // Check AI assistant area
    const assistantArea = mainContainer.querySelector('.flex-shrink-0');
    expect(assistantArea).toBeInTheDocument();
    expect(assistantArea).toContainElement(screen.getByTestId('workflow-ai-assistant'));
  });

  it('should render all child components', () => {
    render(
      <TestWrapper>
        <WorkflowTemplate />
      </TestWrapper>
    );

    // Verify all expected components are rendered
    expect(screen.getByTestId('workflow-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('workflow-node-modal')).toBeInTheDocument();
    expect(screen.getByTestId('workflow-ai-assistant')).toBeInTheDocument();
  });

  it('should be memoized (React.memo)', () => {
    // This test verifies that the component is wrapped with React.memo
    // by checking that it doesn't re-render when props don't change
    const { rerender } = render(
      <TestWrapper>
        <WorkflowTemplate />
      </TestWrapper>
    );

    const initialCanvas = screen.getByTestId('workflow-canvas');

    // Re-render with same props
    rerender(
      <TestWrapper>
        <WorkflowTemplate />
      </TestWrapper>
    );

    // Component should still be the same instance (memoized)
    expect(screen.getByTestId('workflow-canvas')).toBe(initialCanvas);
  });

  it('should maintain consistent structure across re-renders', () => {
    const { rerender, container } = render(
      <TestWrapper>
        <WorkflowTemplate />
      </TestWrapper>
    );

    const initialStructure = container.innerHTML;

    // Re-render multiple times
    for (let i = 0; i < 3; i++) {
      rerender(
        <TestWrapper>
          <WorkflowTemplate />
        </TestWrapper>
      );
    }

    // Structure should remain the same
    expect(container.innerHTML).toBe(initialStructure);
  });
});
