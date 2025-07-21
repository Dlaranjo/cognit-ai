import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('should render with required props', () => {
    render(
      <Button variant="primary" size="md">
        Test Button
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary', 'text-white'); // primary variant
    expect(button).toHaveClass('px-4', 'py-2'); // md size
  });

  it('should render all variants correctly', () => {
    const { rerender } = render(
      <Button variant="primary" size="md">
        Primary
      </Button>
    );
    expect(screen.getByRole('button')).toHaveClass('bg-primary', 'text-white');

    rerender(
      <Button variant="secondary" size="md">
        Secondary
      </Button>
    );
    expect(screen.getByRole('button')).toHaveClass(
      'bg-secondary',
      'text-white'
    );

    rerender(
      <Button variant="outline" size="md">
        Outline
      </Button>
    );
    expect(screen.getByRole('button')).toHaveClass(
      'border',
      'border-neutral-300',
      'text-neutral-700'
    );

    rerender(
      <Button variant="ghost" size="md">
        Ghost
      </Button>
    );
    expect(screen.getByRole('button')).toHaveClass('text-neutral-700');
  });

  it('should render all sizes correctly', () => {
    const { rerender } = render(
      <Button variant="primary" size="sm">
        Small
      </Button>
    );
    expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5', 'text-sm');

    rerender(
      <Button variant="primary" size="md">
        Medium
      </Button>
    );
    expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2', 'text-base');

    rerender(
      <Button variant="primary" size="lg">
        Large
      </Button>
    );
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(
      <Button variant="primary" size="md" onClick={handleClick}>
        Click me
      </Button>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    const handleClick = vi.fn();
    render(
      <Button variant="primary" size="md" disabled onClick={handleClick}>
        Disabled
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass(
      'disabled:opacity-50',
      'disabled:pointer-events-none'
    );

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should show loading state', () => {
    render(
      <Button variant="primary" size="md" loading>
        Loading
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass(
      'disabled:opacity-50',
      'disabled:pointer-events-none'
    );

    // Should show spinner
    const spinner = button.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <Button variant="primary" size="md" className="custom-class">
        Custom
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should maintain focus styles', () => {
    render(
      <Button variant="primary" size="md">
        Focus Test
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('focus:outline-none', 'focus:ring-2');
  });

  it('should support icon-only buttons', () => {
    render(
      <Button variant="primary" size="md" aria-label="Close">
        <span>×</span>
      </Button>
    );

    const button = screen.getByRole('button', { name: '×' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('×');
  });
});
