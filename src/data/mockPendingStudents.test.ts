import { describe, it, expect } from 'vitest';
import mockPendingStudents from './mockPendingStudents';

describe('mockPendingStudents', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(mockPendingStudents)).toBe(true);
    expect(mockPendingStudents.length).toBeGreaterThan(0);
  });

  it('every record has required fields', () => {
    for (const s of mockPendingStudents) {
      expect(s.requestId).toBeTruthy();
      expect(s.studentName).toBeTruthy();
      expect(s.studentEmail).toBeTruthy();
      expect(s.grade).toBeTruthy();
      expect(s.major).toBeTruthy();
      expect(s.requestDate).toBeTruthy();
    }
  });

  it('all requestIds are unique', () => {
    const ids = mockPendingStudents.map((s) => s.requestId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('note field is optional (string or undefined)', () => {
    for (const s of mockPendingStudents) {
      expect(s.note === undefined || typeof s.note === 'string').toBe(true);
    }
  });

  it('requestDates are in YYYY-MM-DD format', () => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    for (const s of mockPendingStudents) {
      expect(s.requestDate).toMatch(datePattern);
    }
  });

  it('does not contain an approvedDate field', () => {
    for (const s of mockPendingStudents) {
      expect(s).not.toHaveProperty('approvedDate');
    }
  });
});
