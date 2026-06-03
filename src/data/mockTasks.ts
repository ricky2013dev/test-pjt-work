import { Task, TeamMember, Sprint, Subtask } from '../types/task';

function sub(id: string, title: string, done = false): Subtask {
  return { id, title, done };
}

export const TEAM_MEMBERS: TeamMember[] = [
  { id: 'm1', name: 'Alice Kim' },
  { id: 'm2', name: 'Bob Lee' },
  { id: 'm3', name: 'Carol Park' },
  { id: 'm4', name: 'David Cho' },
  { id: 'm5', name: 'Eva Jung' },
];

export const SPRINTS: Sprint[] = [
  { id: 's1', name: 'Sprint 1', startDate: '2026-03-15', endDate: '2026-03-28', status: 'completed' },
  { id: 's2', name: 'Sprint 2', startDate: '2026-04-01', endDate: '2026-04-14', status: 'active' },
  { id: 's3', name: 'Sprint 3', startDate: '2026-04-15', endDate: '2026-04-28', status: 'upcoming' },
];

const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment.',
    status: 'done',
    priority: 'high',
    assigneeId: 'm1',
    labels: ['chore'],
    sprintId: 's1',
    subtasks: [
      sub('st1-1', 'Create GitHub Actions workflow file', true),
      sub('st1-2', 'Add test step', true),
      sub('st1-3', 'Add deploy step', true),
    ],
    createdAt: '2026-03-16',
  },
  {
    id: 't2',
    title: 'Design login page',
    description: 'Create wireframes and implement the login UI.',
    status: 'done',
    priority: 'medium',
    assigneeId: 'm3',
    labels: ['feature'],
    sprintId: 's1',
    subtasks: [
      sub('st2-1', 'Create wireframe', true),
      sub('st2-2', 'Implement HTML/CSS', true),
    ],
    createdAt: '2026-03-18',
  },
  {
    id: 't3',
    title: 'Fix navigation bug',
    description: 'The sidebar collapses unexpectedly on mobile.',
    status: 'in-progress',
    priority: 'high',
    assigneeId: 'm2',
    labels: ['bug'],
    sprintId: 's2',
    subtasks: [
      sub('st3-1', 'Reproduce on iOS Safari', true),
      sub('st3-2', 'Reproduce on Android Chrome', true),
      sub('st3-3', 'Fix CSS media query', false),
      sub('st3-4', 'Write regression test', false),
    ],
    createdAt: '2026-04-02',
  },
  {
    id: 't4',
    title: 'Write API documentation',
    description: 'Document all REST endpoints using OpenAPI spec.',
    status: 'in-progress',
    priority: 'low',
    assigneeId: 'm5',
    labels: ['docs'],
    sprintId: 's2',
    subtasks: [
      sub('st4-1', 'Document /auth endpoints', true),
      sub('st4-2', 'Document /tasks endpoints', false),
      sub('st4-3', 'Document /users endpoints', false),
    ],
    createdAt: '2026-04-03',
  },
  {
    id: 't5',
    title: 'Implement search feature',
    description: 'Add full-text search across task titles and descriptions.',
    status: 'todo',
    priority: 'medium',
    assigneeId: 'm4',
    labels: ['feature'],
    sprintId: 's2',
    subtasks: [
      sub('st5-1', 'Design search index schema', false),
      sub('st5-2', 'Implement search API', false),
      sub('st5-3', 'Build search UI component', false),
    ],
    createdAt: '2026-04-04',
  },
  {
    id: 't6',
    title: 'Code review: auth module',
    description: 'Review PRs for the authentication module.',
    status: 'todo',
    priority: 'high',
    assigneeId: 'm1',
    labels: ['review'],
    sprintId: 's3',
    subtasks: [],
    createdAt: '2026-04-15',
  },
  {
    id: 't7',
    title: 'Refactor data fetching',
    description: 'Move all API calls into custom hooks.',
    status: 'todo',
    priority: 'low',
    assigneeId: '',
    labels: ['chore'],
    sprintId: '',
    subtasks: [],
    createdAt: '2026-04-07',
  },
  {
    id: 't8',
    title: 'Add dark mode support',
    description: 'Implement theme toggle with CSS variables.',
    status: 'todo',
    priority: 'medium',
    assigneeId: 'm3',
    labels: ['feature'],
    sprintId: '',
    subtasks: [
      sub('st8-1', 'Define CSS color tokens', false),
      sub('st8-2', 'Add toggle button to header', false),
    ],
    createdAt: '2026-04-07',
  },
];

export default mockTasks;
