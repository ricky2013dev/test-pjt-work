import React from 'react';
import { useStudentManagement } from '../hooks/useStudentManagement';
import { StudentList } from '../components/StudentList';
import { SummaryCard } from '../components/SummaryCard';
import './StudentListContainer.css';

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export const StudentListContainer: React.FC = () => {
  const {
    approvedStudents,
    pendingStudents,
    approvedLoading,
    pendingLoading,
    approvedError,
    pendingError,
    handleApprove,
    handleReject,
  } = useStudentManagement();

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
