import React, { useState, useEffect, useCallback } from 'react';
import { ApprovedStudent, PendingStudent } from '../types/student';
import { apiRequest } from '../api/mockApi';
import { StudentList } from '../components/StudentList';
import './StudentListContainer.css';

export const StudentListContainer: React.FC = () => {
  const [approvedStudents, setApprovedStudents]   = useState<ApprovedStudent[]>([]);
  const [pendingStudents, setPendingStudents]     = useState<PendingStudent[]>([]);
  const [approvedLoading, setApprovedLoading]     = useState(true);
  const [pendingLoading, setPendingLoading]       = useState(true);
  const [approvedError, setApprovedError]         = useState<string | null>(null);
  const [pendingError, setPendingError]           = useState<string | null>(null);

  // Fetch approved students independently
  useEffect(() => {
    let cancelled = false;
    setApprovedLoading(true);
    setApprovedError(null);

    apiRequest('students')
      .then((res) => { if (!cancelled) setApprovedStudents(res.data as ApprovedStudent[]); })
      .catch(() => { if (!cancelled) setApprovedError('Failed to load student list.'); })
      .finally(() => { if (!cancelled) setApprovedLoading(false); });

    return () => { cancelled = true; };
  }, []);

  // Fetch pending requests independently
  useEffect(() => {
    let cancelled = false;
    setPendingLoading(true);
    setPendingError(null);

    apiRequest('students/requests')
      .then((res) => { if (!cancelled) setPendingStudents(res.data as PendingStudent[]); })
      .catch(() => { if (!cancelled) setPendingError('Failed to load request list.'); })
      .finally(() => { if (!cancelled) setPendingLoading(false); });

    return () => { cancelled = true; };
  }, []);

  const handleApprove = useCallback((target: PendingStudent) => {
    const newStudent: ApprovedStudent = {
      id: `S${Date.now()}`,
      name: target.studentName,
      email: target.studentEmail,
      grade: target.grade,
      major: target.major,
      requestDate: target.requestDate,
      approvedDate: new Date().toISOString().slice(0, 10),
    };
    setApprovedStudents((prev) => [...prev, newStudent]);
    setPendingStudents((prev) => prev.filter((s) => s.requestId !== target.requestId));
  }, []);

  const handleReject = useCallback((target: PendingStudent) => {
    setPendingStudents((prev) => prev.filter((s) => s.requestId !== target.requestId));
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="slc-page">
      <header className="slc-header">
        <h1 className="slc-title">Student Management</h1>
        <div className="slc-summary">
          <SummaryCard label="Total"    count={approvedStudents.length + pendingStudents.length} color="#e0f2fe" textColor="#0369a1" />
          <SummaryCard label="Approved" count={approvedStudents.length}                          color="#dcfce7" textColor="#16a34a" onClick={() => scrollToSection('section-students')} />
          <SummaryCard label="Pending"  count={pendingStudents.length}                           color="#fef9c3" textColor="#92400e" onClick={() => scrollToSection('section-requests')} />
        </div>
      </header>

      <StudentList
        pendingStudents={pendingStudents}
        pendingLoading={pendingLoading}
        pendingError={pendingError}
        approvedStudents={approvedStudents}
        approvedLoading={approvedLoading}
        approvedError={approvedError}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

interface SummaryCardProps {
  label: string;
  count: number;
  color: string;
  textColor: string;
  onClick?: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, count, color, textColor, onClick }) => (
  <div
    className={`slc-summary-card${onClick ? ' slc-summary-card--clickable' : ''}`}
    style={{ background: color }}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    aria-label={onClick ? `Scroll to ${label} section` : undefined}
  >
    <span className="slc-summary-count" style={{ color: textColor }}>{count}</span>
    <span className="slc-summary-label" style={{ color: textColor }}>{label}</span>
  </div>
);
