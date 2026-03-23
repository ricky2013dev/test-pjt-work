import { useState, useEffect, useCallback } from 'react';
import { ApprovedStudent, PendingStudent } from '../types/student';
import { apiRequest } from '../api/mockApi';

export interface StudentManagementState {
  approvedStudents: ApprovedStudent[];
  pendingStudents:  PendingStudent[];
  approvedLoading:  boolean;
  pendingLoading:   boolean;
  approvedError:    string | null;
  pendingError:     string | null;
  handleApprove:    (target: PendingStudent) => void;
  handleReject:     (target: PendingStudent) => void;
}

export function useStudentManagement(): StudentManagementState {
  const [approvedStudents, setApprovedStudents] = useState<ApprovedStudent[]>([]);
  const [pendingStudents,  setPendingStudents]  = useState<PendingStudent[]>([]);
  const [approvedLoading,  setApprovedLoading]  = useState(true);
  const [pendingLoading,   setPendingLoading]   = useState(true);
  const [approvedError,    setApprovedError]    = useState<string | null>(null);
  const [pendingError,     setPendingError]     = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setApprovedLoading(true);
    setApprovedError(null);

    apiRequest('students')
      .then((res) => { if (!cancelled) setApprovedStudents(res.data as ApprovedStudent[]); })
      .catch(()  => { if (!cancelled) setApprovedError('Failed to load student list.'); })
      .finally(() => { if (!cancelled) setApprovedLoading(false); });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setPendingLoading(true);
    setPendingError(null);

    apiRequest('students/requests')
      .then((res) => { if (!cancelled) setPendingStudents(res.data as PendingStudent[]); })
      .catch(()  => { if (!cancelled) setPendingError('Failed to load request list.'); })
      .finally(() => { if (!cancelled) setPendingLoading(false); });

    return () => { cancelled = true; };
  }, []);

  const handleApprove = useCallback((target: PendingStudent) => {
    const newStudent: ApprovedStudent = {
      id:           `S${Date.now()}`,
      name:         target.studentName,
      email:        target.studentEmail,
      grade:        target.grade,
      major:        target.major,
      requestDate:  target.requestDate,
      approvedDate: new Date().toISOString().slice(0, 10),
    };
    setApprovedStudents((prev) => [...prev, newStudent]);
    setPendingStudents( (prev) => prev.filter((s) => s.requestId !== target.requestId));
  }, []);

  const handleReject = useCallback((target: PendingStudent) => {
    setPendingStudents((prev) => prev.filter((s) => s.requestId !== target.requestId));
  }, []);

  return {
    approvedStudents,
    pendingStudents,
    approvedLoading,
    pendingLoading,
    approvedError,
    pendingError,
    handleApprove,
    handleReject,
  };
}
