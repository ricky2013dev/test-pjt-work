export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskLabel = 'bug' | 'feature' | 'chore' | 'docs' | 'review';
export type SprintStatus = 'upcoming' | 'active' | 'completed';

export interface TeamMember {
  id: string;
  name: string;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
}

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  labels: TaskLabel[];
  sprintId: string;
  subtasks: Subtask[];
  createdAt: string;
}
