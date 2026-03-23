import { PendingStudent } from '../types/student';

const mockPendingStudents: PendingStudent[] = [
  { requestId: 'R001', studentName: 'Mia Seo',      studentEmail: 'mia@school.edu',    grade: 'B', major: 'Mathematics',      requestDate: '2026-03-10', note: 'Transfer student' },
  { requestId: 'R002', studentName: 'Noah Bae',     studentEmail: 'noah@school.edu',   grade: 'A', major: 'Computer Science', requestDate: '2026-03-11' },
  { requestId: 'R003', studentName: 'Olivia Song',  studentEmail: 'olivia@school.edu', grade: 'B', major: 'Physics',          requestDate: '2026-03-12', note: 'Exchange program' },
  { requestId: 'R004', studentName: 'Peter Jang',   studentEmail: 'peter@school.edu',  grade: 'C', major: 'Engineering',      requestDate: '2026-03-13' },
  { requestId: 'R005', studentName: 'Quinn Moon',   studentEmail: 'quinn@school.edu',  grade: 'A', major: 'Biology',          requestDate: '2026-03-14', note: 'Scholarship applicant' },
  { requestId: 'R006', studentName: 'Rachel Ahn',   studentEmail: 'rachel@school.edu', grade: 'B', major: 'Chemistry',        requestDate: '2026-03-15' },
  { requestId: 'R007', studentName: 'Samuel Hong',  studentEmail: 'samuel@school.edu', grade: 'A', major: 'Mathematics',      requestDate: '2026-03-16' },
  { requestId: 'R008', studentName: 'Tina Cho',     studentEmail: 'tina@school.edu',   grade: 'C', major: 'Computer Science', requestDate: '2026-03-17', note: 'Late application' },
];

export default mockPendingStudents;
