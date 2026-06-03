import React, { useState, useCallback } from 'react';
import { ApprovedStudent, PendingStudent } from '../types/student';
import mockApprovedStudents from '../data/mockApprovedStudents';
import mockPendingStudents from '../data/mockPendingStudents';
import { StudentList } from '../components/StudentList';
import { SummaryCard } from '../components/SummaryCard';
import './StudentListContainer.css';

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export const StudentListContainer: React.FC = () => {
  const [approvedStudents, setApprovedStudents] = useState<ApprovedStudent[]>(mockApprovedStudents);
  const [pendingStudents,  setPendingStudents]  = useState<PendingStudent[]>(mockPendingStudents);

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
        pendingLoading={false}
        pendingError={null}
        approvedStudents={approvedStudents}
        approvedLoading={false}
        approvedError={null}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};
