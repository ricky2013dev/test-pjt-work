// Approved student — full record from the students table
export interface ApprovedStudent {
  id: string;
  name: string;
  email: string;
  grade: string;
  major: string;
  requestDate: string;
  approvedDate: string;
}

// Pending request — lighter record from the requests table
export interface PendingStudent {
  requestId: string;
  studentName: string;
  studentEmail: string;
  grade: string;
  major: string;
  requestDate: string;
  note?: string;
}
