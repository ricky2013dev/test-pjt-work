import { describe, it, expect } from 'vitest';
import mockApprovedStudents from './mockApprovedStudents';

describe('mockApprovedStudents', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(mockApprovedStudents)).toBe(true);
    expect(mockApprovedStudents.length).toBeGreaterThan(0);
  });

  it('every record has required fields', () => {
    for (const s of mockApprovedStudents) {
      expect(s.id).toBeTruthy();
      expect(s.name).toBeTruthy();
      expect(s.email).toBeTruthy();
      expect(s.grade).toBeTruthy();
      expect(s.major).toBeTruthy();
      expect(s.requestDate).toBeTruthy();
      expect(s.approvedDate).toBeTruthy();
    }
  });

  it('all ids are unique', () => {
    const ids = mockApprovedStudents.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('grades are valid values', () => {
    const valid = new Set(['A', 'B', 'C']);
    for (const s of mockApprovedStudents) {
      expect(valid.has(s.grade)).toBe(true);
    }
  });

  it('dates are in YYYY-MM-DD format', () => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    for (const s of mockApprovedStudents) {
      expect(s.requestDate).toMatch(datePattern);
      expect(s.approvedDate).toMatch(datePattern);
    }
  });

  it('approvedDate is on or after requestDate', () => {
    for (const s of mockApprovedStudents) {
      expect(s.approvedDate >= s.requestDate).toBe(true);
    }
  });
});
