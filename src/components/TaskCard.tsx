import React from 'react';
import { Task, TeamMember } from '../types/task';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  members: TeamMember[];
  onClick: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const PRIORITY_COLOR: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#6b7280',
};

const LABEL_COLOR: Record<string, string> = {
  bug: '#fee2e2',
  feature: '#dbeafe',
  chore: '#f3f4f6',
  docs: '#d1fae5',
  review: '#ede9fe',
};

const LABEL_TEXT: Record<string, string> = {
  bug: '#b91c1c',
  feature: '#1d4ed8',
  chore: '#374151',
  docs: '#065f46',
  review: '#6d28d9',
};

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, members, onClick, onDelete }) => {
  const assignee = members.find((m) => m.id === task.assigneeId);

  return (
    <div className="tc-card" onClick={() => onClick(task)}>
      <div className="tc-header">
        <span
          className="tc-priority"
          style={{ background: PRIORITY_COLOR[task.priority] }}
          title={task.priority}
        />
        <button
          className="tc-delete"
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          aria-label="Delete task"
        >
          ×
        </button>
      </div>

      <p className="tc-title">{task.title}</p>

      {task.description && (
        <p className="tc-desc">{task.description}</p>
      )}

      <div className="tc-labels">
        {task.labels.map((label) => (
          <span
            key={label}
            className="tc-label"
            style={{ background: LABEL_COLOR[label], color: LABEL_TEXT[label] }}
          >
            {label}
          </span>
        ))}
      </div>

      {task.subtasks.length > 0 && (() => {
        const done = task.subtasks.filter((s) => s.done).length;
        const total = task.subtasks.length;
        const pct = Math.round((done / total) * 100);
        return (
          <div className="tc-subtasks">
            <div className="tc-subtask-bar">
              <div className="tc-subtask-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="tc-subtask-count">{done}/{total}</span>
          </div>
        );
      })()}

      <div className="tc-footer">
        <span className="tc-date">{task.createdAt}</span>
        {assignee ? (
          <span className="tc-avatar" title={assignee.name}>
            {initials(assignee.name)}
          </span>
        ) : (
          <span className="tc-avatar tc-avatar--empty" title="Unassigned">?</span>
        )}
      </div>
    </div>
  );
};
