import React, { useState } from 'react';
import { Task, Sprint, TeamMember } from '../types/task';
import './BacklogView.css';

interface BacklogViewProps {
  tasks: Task[];
  sprints: Sprint[];
  members: TeamMember[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

const STATUS_LABEL: Record<string, string> = {
  'todo': 'Todo',
  'in-progress': 'In Progress',
  'done': 'Done',
};
const STATUS_CLASS: Record<string, string> = {
  'todo': 'bv-status--todo',
  'in-progress': 'bv-status--inprogress',
  'done': 'bv-status--done',
};
const PRIORITY_COLOR: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#d1d5db',
};
const SPRINT_STATUS_CLASS: Record<string, string> = {
  active: 'bv-sprint-badge--active',
  upcoming: 'bv-sprint-badge--upcoming',
  completed: 'bv-sprint-badge--completed',
};
const LABEL_COLOR: Record<string, { bg: string; text: string }> = {
  bug:     { bg: '#fee2e2', text: '#b91c1c' },
  feature: { bg: '#dbeafe', text: '#1d4ed8' },
  chore:   { bg: '#f3f4f6', text: '#374151' },
  docs:    { bg: '#d1fae5', text: '#065f46' },
  review:  { bg: '#ede9fe', text: '#6d28d9' },
};

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

interface SprintGroupProps {
  title: string;
  tasks: Task[];
  members: TeamMember[];
  badgeClass?: string;
  dateRange?: string;
  defaultOpen?: boolean;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

const SprintGroup: React.FC<SprintGroupProps> = ({
  title, tasks, members, badgeClass, dateRange, defaultOpen = true, onEditTask, onDeleteTask, onToggleSubtask,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const toggleTaskExpand = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      next.has(taskId) ? next.delete(taskId) : next.add(taskId);
      return next;
    });
  };

  return (
    <div className="bv-group">
      <div className="bv-group-header" onClick={() => setOpen((o) => !o)}>
        <span className="bv-chevron">{open ? '▾' : '▸'}</span>
        <span className="bv-group-title">{title}</span>
        {badgeClass && <span className={`bv-sprint-badge ${badgeClass}`}>{title.split(' ')[0] === 'Sprint' ? title.split(' ')[1] ? badgeClass.replace('bv-sprint-badge--', '') : '' : ''}</span>}
        {dateRange && <span className="bv-group-dates">{dateRange}</span>}
        <span className="bv-group-count">{tasks.length} tasks</span>
      </div>

      {open && (
        <div className="bv-task-list">
          {tasks.length === 0 ? (
            <div className="bv-empty">No tasks</div>
          ) : (
            tasks.map((task) => {
              const assignee = members.find((m) => m.id === task.assigneeId);
              const hasSubtasks = task.subtasks.length > 0;
              const subtasksExpanded = expandedTasks.has(task.id);
              const doneCount = task.subtasks.filter((s) => s.done).length;

              return (
                <React.Fragment key={task.id}>
                  <div className="bv-task-row" onClick={() => onEditTask(task)}>
                    <button
                      className={`bv-expand-btn${hasSubtasks ? '' : ' bv-expand-btn--hidden'}`}
                      onClick={(e) => hasSubtasks && toggleTaskExpand(task.id, e)}
                      aria-label={subtasksExpanded ? 'Collapse subtasks' : 'Expand subtasks'}
                      tabIndex={hasSubtasks ? 0 : -1}
                    >
                      {hasSubtasks ? (subtasksExpanded ? '▾' : '▸') : ''}
                    </button>
                    <span
                      className="bv-priority-dot"
                      style={{ background: PRIORITY_COLOR[task.priority] }}
                      title={task.priority}
                    />
                    <span className="bv-task-title">{task.title}</span>
                    {hasSubtasks && (
                      <span className="bv-subtask-count">{doneCount}/{task.subtasks.length}</span>
                    )}
                    <div className="bv-task-labels">
                      {task.labels.map((label) => (
                        <span
                          key={label}
                          className="bv-label"
                          style={{ background: LABEL_COLOR[label].bg, color: LABEL_COLOR[label].text }}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                    <span className={`bv-status ${STATUS_CLASS[task.status]}`}>
                      {STATUS_LABEL[task.status]}
                    </span>
                    {assignee ? (
                      <span className="bv-avatar" title={assignee.name}>{initials(assignee.name)}</span>
                    ) : (
                      <span className="bv-avatar bv-avatar--empty" title="Unassigned">?</span>
                    )}
                    <button
                      className="bv-delete"
                      onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }}
                      aria-label="Delete task"
                    >
                      ×
                    </button>
                  </div>

                  {hasSubtasks && subtasksExpanded && task.subtasks.map((sub) => (
                    <div key={sub.id} className="bv-subtask-row" onClick={(e) => e.stopPropagation()}>
                      <span className="bv-subtask-indent" />
                      <input
                        type="checkbox"
                        className="bv-subtask-check"
                        checked={sub.done}
                        onChange={() => onToggleSubtask(task.id, sub.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className={`bv-subtask-title${sub.done ? ' bv-subtask-title--done' : ''}`}>
                        {sub.title}
                      </span>
                    </div>
                  ))}
                </React.Fragment>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

const SPRINT_ORDER: Record<string, number> = { active: 0, upcoming: 1, completed: 2 };

export const BacklogView: React.FC<BacklogViewProps> = ({
  tasks, sprints, members, onEditTask, onDeleteTask, onToggleSubtask,
}) => {
  const sortedSprints = [...sprints].sort(
    (a, b) => SPRINT_ORDER[a.status] - SPRINT_ORDER[b.status],
  );
  const backlogTasks = tasks.filter((t) => !t.sprintId);

  return (
    <div className="bv-container">
      {sortedSprints.map((sprint) => {
        const sprintTasks = tasks.filter((t) => t.sprintId === sprint.id);
        return (
          <SprintGroup
            key={sprint.id}
            title={sprint.name}
            tasks={sprintTasks}
            members={members}
            badgeClass={SPRINT_STATUS_CLASS[sprint.status]}
            dateRange={`${sprint.startDate} → ${sprint.endDate}`}
            defaultOpen={sprint.status === 'active'}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onToggleSubtask={onToggleSubtask}
          />
        );
      })}

      <SprintGroup
        title="Backlog"
        tasks={backlogTasks}
        members={members}
        defaultOpen={true}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onToggleSubtask={onToggleSubtask}
      />
    </div>
  );
};
