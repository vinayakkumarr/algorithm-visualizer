import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import TheorySection from '../../src/components/TheorySection';
import { THEORY_DATA } from '../../src/data/theoryData';

describe('TheorySection & Pseudocode Tabbed Component', () => {
  it('renders single-algorithm pseudocode for Bubble Sort', () => {
    const bubbleTheory = THEORY_DATA.bubbleSort;
    render(
      <MemoryRouter>
        <TheorySection data={bubbleTheory} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Pseudocode & Algorithmic Specification/i)).toBeInTheDocument();
    expect(screen.getByText(/procedure bubbleSort/i)).toBeInTheDocument();
  });

  it('renders multi-operation tabs for Singly Linked List and switches operations on click', async () => {
    const user = userEvent.setup();
    const singlyTheory = THEORY_DATA.singlyInsertDelete;
    render(
      <MemoryRouter>
        <TheorySection data={singlyTheory} />
      </MemoryRouter>
    );

    expect(screen.getByRole('tab', { name: 'Insert at Head' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Insert at Tail' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Delete by Value' })).toBeInTheDocument();

    expect(screen.getByText(/procedure insertHead/i)).toBeInTheDocument();

    const deleteValTab = screen.getByRole('tab', { name: 'Delete by Value' });
    await user.click(deleteValTab);

    expect(screen.getByText(/procedure deleteValue/i)).toBeInTheDocument();
  });

  it('triggers copy to clipboard when Copy button is clicked', async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });

    const bubbleTheory = THEORY_DATA.bubbleSort;
    render(
      <MemoryRouter>
        <TheorySection data={bubbleTheory} />
      </MemoryRouter>
    );

    const copyBtn = screen.getByRole('button', { name: /Copy/i });
    await user.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalled();
    expect(screen.getByText(/Copied/i)).toBeInTheDocument();
  });
});
