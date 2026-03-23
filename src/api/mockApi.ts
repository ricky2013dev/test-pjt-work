import mockApprovedStudents from '../data/mockApprovedStudents';
import mockPendingStudents from '../data/mockPendingStudents';
import { ApprovedStudent, PendingStudent } from '../types/student';

// Simulates network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface ApiResponse<T> {
  data: T;
  status: number;
}

export async function apiRequest(endpoint: 'students'): Promise<ApiResponse<ApprovedStudent[]>>;
export async function apiRequest(endpoint: 'students/requests'): Promise<ApiResponse<PendingStudent[]>>;
export async function apiRequest(
  endpoint: 'students' | 'students/requests'
): Promise<ApiResponse<ApprovedStudent[] | PendingStudent[]>> {
  await delay(400);

  switch (endpoint) {
    case 'students':
      return { data: mockApprovedStudents, status: 200 };
    case 'students/requests':
      return { data: mockPendingStudents, status: 200 };
  }
}
