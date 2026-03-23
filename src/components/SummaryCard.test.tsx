import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SummaryCard } from './SummaryCard';

describe('SummaryCard', () => {
  describe('Rendering', () => {
    it('renders label and count', () => {
      render(<SummaryCard label="Approved" count={12} color="#dcfce7" textColor="#16a34a" />);
      expect(screen.getByText('Approved')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });

    it('applies background color via inline style', () => {
      render(<SummaryCard label="Total" count={5} color="#e0f2fe" textColor="#0369a1" />);
      const card = screen.getByText('Total').closest('.sc-card')!;
      expect(card).toHaveStyle({ background: '#e0f2fe' });
    });

    it('applies text color to count and label', () => {
      render(<SummaryCard label="Pending" count={3} color="#fef9c3" textColor="#92400e" />);
      expect(screen.getByText('3')).toHaveStyle({ color: '#92400e' });
      expect(screen.getByText('Pending')).toHaveStyle({ color: '#92400e' });
    });
  });

  describe('Without onClick (non-clickable)', () => {
    it('does not have button role', () => {
      render(<SummaryCard label="Total" count={20} color="#e0f2fe" textColor="#0369a1" />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('does not have sc-card--clickable class', () => {
      render(<SummaryCard label="Total" count={20} color="#e0f2fe" textColor="#0369a1" />);
      const card = screen.getByText('Total').closest('.sc-card')!;
      expect(card).not.toHaveClass('sc-card--clickable');
    });

    it('does not have aria-label', () => {
      render(<SummaryCard label="Total" count={20} color="#e0f2fe" textColor="#0369a1" />);
      const card = screen.getByText('Total').closest('.sc-card')!;
      expect(card).not.toHaveAttribute('aria-label');
    });
  });

  describe('With onClick (clickable)', () => {
    it('has button role', () => {
      render(<SummaryCard label="Approved" count={12} color="#dcfce7" textColor="#16a34a" onClick={() => {}} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('has sc-card--clickable class', () => {
      render(<SummaryCard label="Approved" count={12} color="#dcfce7" textColor="#16a34a" onClick={() => {}} />);
      expect(screen.getByRole('button')).toHaveClass('sc-card--clickable');
    });

    it('has descriptive aria-label', () => {
      render(<SummaryCard label="Approved" count={12} color="#dcfce7" textColor="#16a34a" onClick={() => {}} />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Scroll to Approved section');
    });

    it('calls onClick when clicked', () => {
      const onClick = vi.fn();
      render(<SummaryCard label="Pending" count={8} color="#fef9c3" textColor="#92400e" onClick={onClick} />);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when not provided', () => {
      // Should render without error and clicking does nothing
      render(<SummaryCard label="Total" count={20} color="#e0f2fe" textColor="#0369a1" />);
      expect(() => fireEvent.click(screen.getByText('Total'))).not.toThrow();
    });
  });
});
