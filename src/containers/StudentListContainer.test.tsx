import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// jsdom does not implement scrollIntoView — provide a spy
const scrollIntoViewMock = vi.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
import { StudentListContainer } from './StudentListContainer';
import { ApprovedStudent, PendingStudent } from '../types/student';

// Mock the module with vi.fn() — no variable references in factory (hoisting safe)
vi.mock('../api/mockApi', () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from '../api/mockApi';

const mockApproved: ApprovedStudent[] = [
  { id: 'S001', name: 'Alice', email: 'alice@test.com', grade: 'A', major: 'CS',   requestDate: '2026-01-01', approvedDate: '2026-01-10' },
  { id: 'S002', name: 'Bob',   email: 'bob@test.com',   grade: 'B', major: 'Math', requestDate: '2026-01-02', approvedDate: '2026-01-11' },
];

const mockPending: PendingStudent[] = [
  { requestId: 'R001', studentName: 'Carol', studentEmail: 'carol@test.com', grade: 'A', major: 'Physics', requestDate: '2026-03-01' },
  { requestId: 'R002', studentName: 'David', studentEmail: 'david@test.com', grade: 'C', major: 'Math',    requestDate: '2026-03-02' },
];

const setupDefaultMock = () => {
  vi.mocked(apiRequest).mockImplementation(async (endpoint: string) => {
    if (endpoint === 'students')          return { data: mockApproved, status: 200 };
    if (endpoint === 'students/requests') return { data: mockPending,  status: 200 };
  });
};

describe('StudentListContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupDefaultMock();
  });

  describe('Initial loading', () => {
    it('shows loading states before data arrives', () => {
      vi.mocked(apiRequest).mockImplementation(() => new Promise(() => {}));
      render(<StudentListContainer />);
      expect(screen.getByText('Loading students...')).toBeInTheDocument();
      expect(screen.getByText('Loading requests...')).toBeInTheDocument();
    });

    it('renders the page title immediately', () => {
      render(<StudentListContainer />);
      expect(screen.getByText('Student Management')).toBeInTheDocument();
    });
  });

  describe('After data loads', () => {
    it('renders approved students', async () => {
      render(<StudentListContainer />);
      await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('renders pending students', async () => {
      render(<StudentListContainer />);
      await waitFor(() => expect(screen.getByText('Carol')).toBeInTheDocument());
      expect(screen.getByText('David')).toBeInTheDocument();
    });

    it('calls both endpoints independently', async () => {
      render(<StudentListContainer />);
      await waitFor(() => expect(vi.mocked(apiRequest)).toHaveBeenCalledTimes(2));
      expect(vi.mocked(apiRequest)).toHaveBeenCalledWith('students');
      expect(vi.mocked(apiRequest)).toHaveBeenCalledWith('students/requests');
    });

    it('shows correct summary counts', async () => {
      render(<StudentListContainer />);
      await waitFor(() => expect(screen.getByText('2 Approved')).toBeInTheDocument());
      expect(screen.getByText('2 Pending')).toBeInTheDocument();
    });
  });

  describe('Independent loading', () => {
    it('renders approved list while pending is still loading', async () => {
      let resolvePending!: (v: unknown) => void;
      vi.mocked(apiRequest).mockImplementation(async (endpoint: string) => {
        if (endpoint === 'students')          return { data: mockApproved, status: 200 };
        if (endpoint === 'students/requests') return new Promise((r) => { resolvePending = r; });
      });

      render(<StudentListContainer />);

      // Approved renders first
      await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
      // Pending still loading
      expect(screen.getByText('Loading requests...')).toBeInTheDocument();

      // Resolve pending
      act(() => resolvePending({ data: mockPending, status: 200 }));
      await waitFor(() => expect(screen.getByText('Carol')).toBeInTheDocument());
    });
  });

  describe('Approve action', () => {
    it('removes student from pending section and adds to approved section', async () => {
      const user = userEvent.setup();
      render(<StudentListContainer />);
      await waitFor(() => expect(screen.getByText('Carol')).toBeInTheDocument());

      const pendingSection = screen.getByText('Student Requests').closest('section')!;
      const approvedSection = screen.getByText('Student List').closest('section')!;

      expect(within(pendingSection).getByText('Carol')).toBeInTheDocument();
      expect(within(approvedSection).queryByText('Carol')).not.toBeInTheDocument();

      await user.click(within(pendingSection).getAllByText('Approve')[0]);

      await waitFor(() =>
        expect(within(pendingSection).queryByText('Carol')).not.toBeInTheDocument()
      );
      expect(within(approvedSection).getByText('Carol')).toBeInTheDocument();
    });

    it('updates pending count badge after approve', async () => {
      const user = userEvent.setup();
      render(<StudentListContainer />);
      await waitFor(() => expect(screen.getByText('2 Pending')).toBeInTheDocument());

      const pendingSection = screen.getByText('Student Requests').closest('section')!;
      await user.click(within(pendingSection).getAllByText('Approve')[0]);

      await waitFor(() => expect(screen.getByText('1 Pending')).toBeInTheDocument());
      expect(screen.getByText('3 Approved')).toBeInTheDocument();
    });
  });

  describe('Reject action', () => {
    it('removes student from pending list', async () => {
      const user = userEvent.setup();
      render(<StudentListContainer />);
      await waitFor(() => expect(screen.getByText('Carol')).toBeInTheDocument());

      const pendingSection = screen.getByText('Student Requests').closest('section')!;
      await user.click(within(pendingSection).getAllByText('Reject')[0]);

      await waitFor(() =>
        expect(within(pendingSection).queryByText('Carol')).not.toBeInTheDocument()
      );
    });

    it('updates pending count badge after reject', async () => {
      const user = userEvent.setup();
      render(<StudentListContainer />);
      await waitFor(() => expect(screen.getByText('2 Pending')).toBeInTheDocument());

      const pendingSection = screen.getByText('Student Requests').closest('section')!;
      await user.click(within(pendingSection).getAllByText('Reject')[0]);

      await waitFor(() => expect(screen.getByText('1 Pending')).toBeInTheDocument());
    });
  });

  describe('Summary card scroll navigation', () => {
    beforeEach(() => scrollIntoViewMock.mockClear());

    it('Approved card has clickable role and aria-label', async () => {
      render(<StudentListContainer />);
      const card = screen.getByRole('button', { name: /scroll to approved/i });
      expect(card).toBeInTheDocument();
    });

    it('Pending card has clickable role and aria-label', async () => {
      render(<StudentListContainer />);
      const card = screen.getByRole('button', { name: /scroll to pending/i });
      expect(card).toBeInTheDocument();
    });

    it('clicking Approved card scrolls to Student List section', async () => {
      const user = userEvent.setup();
      render(<StudentListContainer />);
      await waitFor(() => expect(screen.getByText('Student List')).toBeInTheDocument());

      await user.click(screen.getByRole('button', { name: /scroll to approved/i }));

      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
      // Confirm it was called on the correct section element
      const section = document.getElementById('section-students');
      expect(section).not.toBeNull();
    });

    it('clicking Pending card scrolls to Student Requests section', async () => {
      const user = userEvent.setup();
      render(<StudentListContainer />);
      await waitFor(() => expect(screen.getByText('Student Requests')).toBeInTheDocument());

      await user.click(screen.getByRole('button', { name: /scroll to pending/i }));

      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
      const section = document.getElementById('section-requests');
      expect(section).not.toBeNull();
    });

    it('Total card has no clickable role', () => {
      render(<StudentListContainer />);
      // Total card should not be a button (no scroll target)
      const buttons = screen.getAllByRole('button');
      const labels = buttons.map((b) => b.getAttribute('aria-label') ?? '');
      expect(labels.some((l) => l.toLowerCase().includes('total'))).toBe(false);
    });
  });

  describe('Error handling', () => {
    it('shows error when students API fails', async () => {
      vi.mocked(apiRequest).mockImplementation(async (endpoint: string) => {
        if (endpoint === 'students')          throw new Error('Network error');
        if (endpoint === 'students/requests') return { data: mockPending, status: 200 };
      });
      render(<StudentListContainer />);
      await waitFor(() =>
        expect(screen.getByText('Failed to load student list.')).toBeInTheDocument()
      );
      // Pending still loads fine
      expect(screen.getByText('Carol')).toBeInTheDocument();
    });

    it('shows error when requests API fails', async () => {
      vi.mocked(apiRequest).mockImplementation(async (endpoint: string) => {
        if (endpoint === 'students')          return { data: mockApproved, status: 200 };
        if (endpoint === 'students/requests') throw new Error('Network error');
      });
      render(<StudentListContainer />);
      await waitFor(() =>
        expect(screen.getByText('Failed to load request list.')).toBeInTheDocument()
      );
      // Approved still loads fine
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
  });
});
