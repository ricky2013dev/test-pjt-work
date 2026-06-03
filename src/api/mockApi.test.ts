import { apiRequest } from './mockApi';
import mockApprovedStudents from '../data/mockApprovedStudents';
import mockPendingStudents from '../data/mockPendingStudents';

// Skip the 400ms delay in tests
jest.mock('./mockApi', () => {
  const mockApproved = require('../data/mockApprovedStudents').default;
  const mockPending = require('../data/mockPendingStudents').default;
  return {
    ...jest.requireActual('./mockApi'),
    apiRequest: jest.fn(async (endpoint: string) => {
      if (endpoint === 'students')          return { data: mockApproved, status: 200 };
      if (endpoint === 'students/requests') return { data: mockPending,  status: 200 };
    }),
  };
});

describe('apiRequest', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GET students', () => {
    it('returns status 200', async () => {
      const res = await apiRequest('students');
      expect(res.status).toBe(200);
    });

    it('returns an array', async () => {
      const res = await apiRequest('students');
      expect(Array.isArray(res.data)).toBe(true);
    });

    it('returns approved student records with correct shape', async () => {
      const res = await apiRequest('students');
      const first = res.data[0] as (typeof mockApprovedStudents)[0];
      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('name');
      expect(first).toHaveProperty('approvedDate');
      expect(first).not.toHaveProperty('requestId');
    });

    it('returns all mock approved students', async () => {
      const res = await apiRequest('students');
      expect(res.data).toHaveLength(mockApprovedStudents.length);
    });
  });

  describe('GET students/requests', () => {
    it('returns status 200', async () => {
      const res = await apiRequest('students/requests');
      expect(res.status).toBe(200);
    });

    it('returns an array', async () => {
      const res = await apiRequest('students/requests');
      expect(Array.isArray(res.data)).toBe(true);
    });

    it('returns pending request records with correct shape', async () => {
      const res = await apiRequest('students/requests');
      const first = res.data[0] as (typeof mockPendingStudents)[0];
      expect(first).toHaveProperty('requestId');
      expect(first).toHaveProperty('studentName');
      expect(first).not.toHaveProperty('approvedDate');
    });

    it('returns all mock pending students', async () => {
      const res = await apiRequest('students/requests');
      expect(res.data).toHaveLength(mockPendingStudents.length);
    });
  });
});
