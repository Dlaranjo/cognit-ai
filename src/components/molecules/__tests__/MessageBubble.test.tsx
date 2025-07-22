import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MessageBubble } from '../MessageBubble';

describe('MessageBubble', () => {
  const defaultProps = {
    content: 'Test message content',
    role: 'user' as const,
    timestamp: new Date('2025-01-01T12:00:00Z'),
  };

  it('should render user message correctly', () => {
    render(<MessageBubble {...defaultProps} />);

    expect(screen.getByText('Test message content')).toBeInTheDocument();
    expect(screen.getByText('Você')).toBeInTheDocument();

    // Check that timestamp is rendered (format may vary by timezone)
    const timeElement = screen.getByText(/\d{2}:\d{2}/);
    expect(timeElement).toBeInTheDocument();
  });

  it('should render assistant message correctly', () => {
    render(
      <MessageBubble {...defaultProps} role="assistant" model="gpt-4-turbo" />
    );

    expect(screen.getByText('Test message content')).toBeInTheDocument();
    expect(screen.getAllByText('gpt-4-turbo')).toHaveLength(2); // Name and Badge
  });

  it('should show actions for assistant messages', () => {
    render(
      <MessageBubble
        {...defaultProps}
        role="assistant"
        onCopy={vi.fn()}
        onLike={vi.fn()}
        onDislike={vi.fn()}
        onRegenerate={vi.fn()}
      />
    );

    // Should have action buttons (copy, like, dislike, regenerate)
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });

  it('should not show actions for user messages', () => {
    render(
      <MessageBubble
        {...defaultProps}
        role="user"
        onCopy={vi.fn()}
        onLike={vi.fn()}
        onDislike={vi.fn()}
        onRegenerate={vi.fn()}
      />
    );

    // Should not have action buttons for user messages
    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  });

  it('should call onCopy when copy button is clicked', () => {
    const onCopy = vi.fn();

    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });

    render(
      <MessageBubble {...defaultProps} role="assistant" onCopy={onCopy} />
    );

    const copyButton = screen.getAllByRole('button')[0]; // First button is copy
    fireEvent.click(copyButton);

    expect(onCopy).toHaveBeenCalledTimes(1);
  });

  it('should call onLike when like button is clicked', () => {
    const onLike = vi.fn();
    render(
      <MessageBubble {...defaultProps} role="assistant" onLike={onLike} />
    );

    const likeButton = screen.getAllByRole('button')[1]; // Second button is like
    fireEvent.click(likeButton);

    expect(onLike).toHaveBeenCalledTimes(1);
  });

  it('should call onDislike when dislike button is clicked', () => {
    const onDislike = vi.fn();
    render(
      <MessageBubble {...defaultProps} role="assistant" onDislike={onDislike} />
    );

    const dislikeButton = screen.getAllByRole('button')[2]; // Third button is dislike
    fireEvent.click(dislikeButton);

    expect(onDislike).toHaveBeenCalledTimes(1);
  });

  it('should call onRegenerate when regenerate button is clicked', () => {
    const onRegenerate = vi.fn();
    render(
      <MessageBubble
        {...defaultProps}
        role="assistant"
        onRegenerate={onRegenerate}
      />
    );

    const regenerateButton = screen.getAllByRole('button')[3]; // Fourth button is regenerate
    fireEvent.click(regenerateButton);

    expect(onRegenerate).toHaveBeenCalledTimes(1);
  });

  it('should show streaming indicator when isStreaming is true', () => {
    render(
      <MessageBubble {...defaultProps} role="assistant" isStreaming={true} />
    );

    // Check for streaming cursor (animated span)
    const streamingIndicator = document.querySelector('.animate-bounce');
    expect(streamingIndicator).toBeInTheDocument();
  });

  it('should not show actions when streaming', () => {
    render(
      <MessageBubble
        {...defaultProps}
        role="assistant"
        isStreaming={true}
        onCopy={vi.fn()}
        onLike={vi.fn()}
        onDislike={vi.fn()}
        onRegenerate={vi.fn()}
      />
    );

    // Should not have action buttons when streaming
    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  });

  it('should apply custom className', () => {
    const { container } = render(
      <MessageBubble {...defaultProps} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should handle custom user name', () => {
    render(<MessageBubble {...defaultProps} userName="John Doe" />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should copy content to clipboard when copy action is triggered', async () => {
    // Mock clipboard API
    const mockWriteText = vi.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    const onCopy = vi.fn();
    render(
      <MessageBubble
        {...defaultProps}
        role="assistant"
        content="Content to copy"
        onCopy={onCopy}
      />
    );

    const copyButton = screen.getAllByRole('button')[0];
    fireEvent.click(copyButton);

    expect(mockWriteText).toHaveBeenCalledWith('Content to copy');
    expect(onCopy).toHaveBeenCalledTimes(1);
  });
});
