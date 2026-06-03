export interface ActionItem {
  severity: 'critical' | 'warning' | 'info';
  patient: string;
  time: string;
  title: string;
  note: string;
  due: string;
  file: string;
}

export interface Patient {
  id: string;
  name: string;
  initials: string;
  color: string;
  time: string;
  procedure: string;
  category: string;
  insurance: string;
  cost: string;
  status: string;
  preAuth: string;
  statusClass: string;
  alert: 'critical' | 'warning' | 'info' | null;
  alerts: string[];
  file: string;
  group: 'today' | 'week' | 'month' | 'past';
}

export type BriefingMode = 'daily' | 'weekly' | 'monthly';

export type TabId = 'patients' | 'ai';
