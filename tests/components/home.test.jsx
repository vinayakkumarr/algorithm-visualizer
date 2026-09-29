import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../src/pages/Home';

describe('Home Component & Algorithm Catalog', () => {
  it('renders catalog header and categories', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getAllByText('Algorithm').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Visualizer').length).toBeGreaterThan(0);
    expect(screen.getByText('Bubble Sort')).toBeInTheDocument();
    expect(screen.getByText('Binary Search')).toBeInTheDocument();
  });

  it('filters algorithms dynamically when typing in search input', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search for algorithms/i);
    await user.type(searchInput, 'Dijkstra');

    expect(screen.getAllByText(/Dijkstra/i).length).toBeGreaterThan(0);
    expect(screen.queryByText('Bubble Sort')).not.toBeInTheDocument();
  });

  it('displays Coming Soon badges on unreleased feature cards', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const soonBadges = screen.getAllByText('SOON');
    expect(soonBadges.length).toBe(9);
  });
});
