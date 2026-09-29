import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import VisualizerLayout from '../../src/components/VisualizerLayout';

describe('Visualizer Layout & Transport Controls', () => {
  const defaultProps = {
    title: 'Bubble Sort',
    theoryKey: 'bubbleSort',
    isRunning: false,
    speed: 3,
    setSpeed: vi.fn(),
    size: 10,
    setSize: vi.fn(),
    stepIdx: 5,
    totalSteps: 20,
    onStart: vi.fn(),
    onPause: vi.fn(),
    onReset: vi.fn(),
    onStepForward: vi.fn(),
    onStepBack: vi.fn(),
    children: <div data-testid="canvas-content">Canvas Content</div>,
  };

  it('renders canvas content and step counter', () => {
    render(
      <MemoryRouter>
        <VisualizerLayout {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('canvas-content')).toBeInTheDocument();
    expect(screen.getByText(/Step/i)).toBeInTheDocument();
  });

  it('handles Start button click', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(
      <MemoryRouter>
        <VisualizerLayout {...defaultProps} onStart={onStart} />
      </MemoryRouter>
    );

    const startBtn = screen.getByRole('button', { name: /Resume|Start/i });
    await user.click(startBtn);
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('handles Step Forward button click', async () => {
    const user = userEvent.setup();
    const onStepForward = vi.fn();
    render(
      <MemoryRouter>
        <VisualizerLayout {...defaultProps} onStepForward={onStepForward} />
      </MemoryRouter>
    );

    const stepFwdBtn = screen.getByRole('button', { name: /Next step/i });
    await user.click(stepFwdBtn);
    expect(onStepForward).toHaveBeenCalledTimes(1);
  });

  it('handles Step Back button click', async () => {
    const user = userEvent.setup();
    const onStepBack = vi.fn();
    render(
      <MemoryRouter>
        <VisualizerLayout {...defaultProps} onStepBack={onStepBack} />
      </MemoryRouter>
    );

    const stepBackBtn = screen.getByRole('button', { name: /Previous step/i });
    await user.click(stepBackBtn);
    expect(onStepBack).toHaveBeenCalledTimes(1);
  });

  it('handles Reset button click', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(
      <MemoryRouter>
        <VisualizerLayout {...defaultProps} onReset={onReset} />
      </MemoryRouter>
    );

    const resetBtn = screen.getByRole('button', { name: /Reset/i });
    await user.click(resetBtn);
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
