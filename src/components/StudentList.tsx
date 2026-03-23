import React from 'react';
import { ApprovedStudent, PendingStudent } from '../types/student';
import { DataTable, ColumnDef } from './DataTable';
import './StudentList.css';

interface StudentListProps {
  pendingStudents: PendingStudent[];
  pendingLoading?: boolean;
  pendingError?: string | null;
  approvedStudents: ApprovedStudent[];
  approvedLoading?: boolean;
  approvedError?: string | null;
  onApprove?: (student: PendingStudent) => void;
  onReject?: (student: PendingStudent) => void;
}

const gradeBadge = (grade: string) => {
  const validGrades = ['A', 'B', 'C'];
  const modifier = validGrades.includes(grade) ? grade : 'default';
  return <span className={`sl-grade-badge sl-grade-badge--${modifier}`}>{grade}</span>;
};

export const StudentList: React.FC<StudentListProps> = ({
  pendingStudents,
  pendingLoading = false,
  pendingError = null,
  approvedStudents,
  approvedLoading = false,
  approvedError = null,
  onApprove,
  onReject,
}) => {
  const pendingColumns: ColumnDef<PendingStudent>[] = [
    { key: 'requestId',    header: 'Request ID',   sortable: true },
    { key: 'studentName',  header: 'Name',         sortable: true },
    { key: 'studentEmail', header: 'Email',        sortable: true },
    { key: 'grade',        header: 'Grade',        sortable: true, render: (v) => gradeBadge(String(v)) },
    { key: 'major',        header: 'Major',        sortable: true },
    { key: 'requestDate',  header: 'Request Date', sortable: true },
    { key: 'note',         header: 'Note' },
    {
      key: 'requestId',
      header: 'Actions',
      render: (_, row) => (
        <div className="sl-actions">
          {onApprove && (
            <button className="sl-btn-approve" onClick={() => onApprove(row)}>
              Approve
            </button>
          )}
          {onReject && (
            <button className="sl-btn-reject" onClick={() => onReject(row)}>
              Reject
            </button>
          )}
        </div>
      ),
    },
  ];

  const approvedColumns: ColumnDef<ApprovedStudent>[] = [
    { key: 'id',           header: 'ID',            sortable: true },
    { key: 'name',         header: 'Name',          sortable: true },
    { key: 'email',        header: 'Email',         sortable: true },
    { key: 'grade',        header: 'Grade',         sortable: true, render: (v) => gradeBadge(String(v)) },
    { key: 'major',        header: 'Major',         sortable: true },
    { key: 'requestDate',  header: 'Request Date',  sortable: true },
    { key: 'approvedDate', header: 'Approved Date', sortable: true },
  ];

  return (
    <div className="sl-container">
      {/* Pending / Request List */}
      <section id="section-requests" className="sl-section">
        <div className="sl-section-header">
          <h2 className="sl-section-title">Student Requests</h2>
          {!pendingLoading && <span className="sl-badge sl-badge--pending">{pendingStudents.length} Pending</span>}
        </div>
        {pendingLoading && <div className="sl-state">Loading requests...</div>}
        {pendingError   && <div className="sl-state sl-state--error">{pendingError}</div>}
        {!pendingLoading && !pendingError && (
          <DataTable
            data={pendingStudents}
            columns={pendingColumns}
            rowKey="requestId"
            pageSize={5}
            filterPlaceholder="Search requests..."
            filterKeys={['studentName', 'studentEmail', 'major', 'grade']}
            emptyMessage="No pending requests."
          />
        )}
      </section>

      {/* Approved Student List */}
      <section id="section-students" className="sl-section">
        <div className="sl-section-header">
          <h2 className="sl-section-title">Student List</h2>
          {!approvedLoading && <span className="sl-badge sl-badge--approved">{approvedStudents.length} Approved</span>}
        </div>
        {approvedLoading && <div className="sl-state">Loading students...</div>}
        {approvedError   && <div className="sl-state sl-state--error">{approvedError}</div>}
        {!approvedLoading && !approvedError && (
          <DataTable
            data={approvedStudents}
            columns={approvedColumns}
            rowKey="id"
            pageSize={5}
            filterPlaceholder="Search students..."
            filterKeys={['name', 'email', 'major', 'grade']}
            emptyMessage="No approved students."
          />
        )}
      </section>
    </div>
  );
};
