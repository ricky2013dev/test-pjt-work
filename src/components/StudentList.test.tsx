import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StudentList } from './StudentList';
import { ApprovedStudent, PendingStudent } from '../types/student';

const approvedStudents: ApprovedStudent[] = [
  { id: 'S001', name: 'Alice',  email: 'alice@test.com',  grade: 'A', major: 'CS',   requestDate: '2026-01-01', approvedDate: '2026-01-10' },
  { id: 'S002', name: 'Bob',    email: 'bob@test.com',    grade: 'B', major: 'Math', requestDate: '2026-01-02', approvedDate: '2026-01-11' },
];

const pendingStudents: PendingStudent[] = [
  { requestId: 'R001', studentName: 'Carol', studentEmail: 'carol@test.com', grade: 'A', major: 'Physics', requestDate: '2026-03-01' },
  { requestId: 'R002', studentName: 'David', studentEmail: 'david@test.com', grade: 'C', major: 'Math',    requestDate: '2026-03-02', note: 'Late' },
];

describe('StudentList', () => {
  describe('Loading states', () => {
    it('shows pending loading message', () => {
      render(
        <StudentList
          pendingStudents={[]} pendingLoading
          approvedStudents={[]}
        />
      );
      expect(screen.getByText('Loading requests...')).toBeInTheDocument();
    });

    it('shows approved loading message', () => {
      render(
        <StudentList
          pendingStudents={[]}
          approvedStudents={[]} approvedLoading
        />
      );
      expect(screen.getByText('Loading students...')).toBeInTheDocument();
    });

    it('can show both loading at the same time', () => {
      render(
        <StudentList
          pendingStudents={[]} pendingLoading
          approvedStudents={[]} approvedLoading
        />
      );
      expect(screen.getByText('Loading requests...')).toBeInTheDocument();
      expect(screen.getByText('Loading students...')).toBeInTheDocument();
    });
  });

  describe('Error states', () => {
    it('shows pending error message', () => {
      render(
        <StudentList
          pendingStudents={[]} pendingError="Failed to load requests."
          approvedStudents={[]}
        />
      );
      expect(screen.getByText('Failed to load requests.')).toBeInTheDocument();
    });

    it('shows approved error message', () => {
      render(
        <StudentList
          pendingStudents={[]}
          approvedStudents={[]} approvedError="Failed to load students."
        />
      );
      expect(screen.getByText('Failed to load students.')).toBeInTheDocument();
    });
  });

  describe('Data rendering', () => {
    it('renders section titles', () => {
      render(<StudentList pendingStudents={[]} approvedStudents={[]} />);
      expect(screen.getByText('Student Requests')).toBeInTheDocument();
      expect(screen.getByText('Student List')).toBeInTheDocument();
    });

    it('renders pending student rows', () => {
      render(<StudentList pendingStudents={pendingStudents} approvedStudents={[]} />);
      expect(screen.getByText('Carol')).toBeInTheDocument();
      expect(screen.getByText('David')).toBeInTheDocument();
    });

    it('renders approved student rows', () => {
      render(<StudentList pendingStudents={[]} approvedStudents={approvedStudents} />);
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('shows pending count badge', () => {
      render(<StudentList pendingStudents={pendingStudents} approvedStudents={[]} />);
      expect(screen.getByText('2 Pending')).toBeInTheDocument();
    });

    it('shows approved count badge', () => {
      render(<StudentList pendingStudents={[]} approvedStudents={approvedStudents} />);
      expect(screen.getByText('2 Approved')).toBeInTheDocument();
    });

    it('renders note column when present', () => {
      render(<StudentList pendingStudents={pendingStudents} approvedStudents={[]} />);
      expect(screen.getByText('Late')).toBeInTheDocument();
    });

    it('renders grade badges', () => {
      render(<StudentList pendingStudents={pendingStudents} approvedStudents={[]} />);
      const badges = document.querySelectorAll('.sl-grade-badge');
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  describe('Actions', () => {
    it('calls onApprove with the correct student when Approve clicked', () => {
      const onApprove = vi.fn();
      render(
        <StudentList
          pendingStudents={pendingStudents}
          approvedStudents={[]}
          onApprove={onApprove}
        />
      );
      fireEvent.click(screen.getAllByText('Approve')[0]);
      expect(onApprove).toHaveBeenCalledWith(pendingStudents[0]);
    });

    it('calls onReject with the correct student when Reject clicked', () => {
      const onReject = vi.fn();
      render(
        <StudentList
          pendingStudents={pendingStudents}
          approvedStudents={[]}
          onReject={onReject}
        />
      );
      fireEvent.click(screen.getAllByText('Reject')[0]);
      expect(onReject).toHaveBeenCalledWith(pendingStudents[0]);
    });

    it('does not render Approve/Reject when handlers not provided', () => {
      render(<StudentList pendingStudents={pendingStudents} approvedStudents={[]} />);
      expect(screen.queryByText('Approve')).not.toBeInTheDocument();
      expect(screen.queryByText('Reject')).not.toBeInTheDocument();
    });
  });
});
