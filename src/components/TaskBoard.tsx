import React from 'react';
import { Task, TaskStatus, TeamMember } from '../types/task';
import { TaskCard } from './TaskCard';
import './TaskBoard.css';

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'todo',        label: 'Todo',        color: '#6b7280' },
  { status: 'in-progress', label: 'In Progress',  color: '#f59e0b' },
  { status: 'done',        label: 'Done',         color: '#22c55e' },
];

interface TaskBoardProps {
  tasks: Task[];
  members: TeamMember[];
  filterAssigneeId: string;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (status: TaskStatus) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks, members, filterAssigneeId, onEditTask, onDeleteTask, onAddTask,
}) => {
  const filtered = filterAssigneeId
    ? tasks.filter((t) => t.assigneeId === filterAssigneeId)
    : tasks;

  return (
    <div className="tb-board">
      {COLUMNS.map(({ status, label, color }) => {
        const columnTasks = filtered.filter((t) => t.status === status);
        return (
          <div key={status} className="tb-column">
            <div className="tb-col-header">
              <div className="tb-col-title">
                <span className="tb-col-dot" style={{ background: color }} />
                <span>{label}</span>
                <span className="tb-col-count">{columnTasks.length}</span>
              </div>
              <button
                className="tb-add-btn"
                onClick={() => onAddTask(status)}
                aria-label={`Add task to ${label}`}
              >
                +
              </button>
            </div>

            <div className="tb-cards">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  members={members}
                  onClick={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))}
              {columnTasks.length === 0 && (
                <div className="tb-empty">No tasks</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
