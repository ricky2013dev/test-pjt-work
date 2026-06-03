import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// jsdom does not implement scrollIntoView — provide a spy
const scrollIntoViewMock = jest.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

import { StudentListContainer } from './StudentListContainer';

describe('StudentListContainer', () => {
  describe('Initial render', () => {
    it('renders the page title', () => {
      render(<StudentListContainer />);
      expect(screen.getByText('Student Management')).toBeInTheDocument();
    });

    it('renders approved students from mock data', () => {
      render(<StudentListContainer />);
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Bob Kim')).toBeInTheDocument();
    });

    it('renders pending students from mock data', () => {
      render(<StudentListContainer />);
      expect(screen.getByText('Mia Seo')).toBeInTheDocument();
      expect(screen.getByText('Noah Bae')).toBeInTheDocument();
    });

    it('shows correct summary counts', () => {
      render(<StudentListContainer />);
      expect(screen.getByText('12 Approved')).toBeInTheDocument();
      expect(screen.getByText('8 Pending')).toBeInTheDocument();
    });
  });

  describe('Approve action', () => {
    it('removes student from pending section and updates approved count', async () => {
      const user = userEvent.setup();
      render(<StudentListContainer />);

      const pendingSection = screen.getByText('Student Requests').closest('section')!;

      expect(within(pendingSection).getByText('Mia Seo')).toBeInTheDocument();
      expect(screen.getByText('12 Approved')).toBeInTheDocument();

      await user.click(within(pendingSection).getAllByText('Approve')[0]);

      expect(within(pendingSection).queryByText('Mia Seo')).not.toBeInTheDocument();
      expect(screen.getByText('13 Approved')).toBeInTheDocument();
    });

    it('updates count badges after approve', async () => {
      const user = userEvent.setup();
      render(<StudentListContainer />);

      expect(screen.getByText('8 Pending')).toBeInTheDocument();
      expect(screen.getByText('12 Approved')).toBeInTheDocument();

      const pendingSection = screen.getByText('Student Requests').closest('section')!;
      await user.click(within(pendingSection).getAllByText('Approve')[0]);

      expect(screen.getByText('7 Pending')).toBeInTheDocument();
      expect(screen.getByText('13 Approved')).toBeInTheDocument();
    });
  });

  describe('Reject action', () => {
    it('removes student from pending list', async () => {
      const user = userEvent.setup();
      render(<StudentListContainer />);

      const pendingSection = screen.getByText('Student Requests').closest('section')!;
      expect(within(pendingSection).getByText('Mia Seo')).toBeInTheDocument();

      await user.click(within(pendingSection).getAllByText('Reject')[0]);

      expect(within(pendingSection).queryByText('Mia Seo')).not.toBeInTheDocument();
    });

    it('updates pending count badge after reject', async () => {
      const user = userEvent.setup();
      render(<StudentListContainer />);

      expect(screen.getByText('8 Pending')).toBeInTheDocument();

      const pendingSection = screen.getByText('Student Requests').closest('section')!;
      await user.click(within(pendingSection).getAllByText('Reject')[0]);

      expect(screen.getByText('7 Pending')).toBeInTheDocument();
    });
  });

  describe('Summary card scroll navigation', () => {
    beforeEach(() => scrollIntoViewMock.mockClear());

    it('Approved card has clickable role and aria-label', () => {
      render(<StudentListContainer />);
      expect(screen.getByRole('button', { name: /scroll to approved/i })).toBeInTheDocument();
    });

    it('Pending card has clickable role and aria-label', () => {
      render(<StudentListContainer />);
      expect(screen.getByRole('button', { name: /scroll to pending/i })).toBeInTheDocument();
    });

    it('clicking Approved card scrolls to Student List section', async () => {
      const user = userEvent.setup();
      render(<StudentListContainer />);

      await user.click(screen.getByRole('button', { name: /scroll to approved/i }));

      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
      expect(document.getElementById('section-students')).not.toBeNull();
    });

    it('clicking Pending card scrolls to Student Requests section', async () => {
      const user = userEvent.setup();
      render(<StudentListContainer />);

      await user.click(screen.getByRole('button', { name: /scroll to pending/i }));

      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
      expect(document.getElementById('section-requests')).not.toBeNull();
    });

    it('Total card has no clickable role', () => {
      render(<StudentListContainer />);
      const buttons = screen.getAllByRole('button');
      const labels  = buttons.map((b) => b.getAttribute('aria-label') ?? '');
      expect(labels.some((l) => l.toLowerCase().includes('total'))).toBe(false);
    });
  });
});
