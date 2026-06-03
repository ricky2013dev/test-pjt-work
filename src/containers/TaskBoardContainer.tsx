import React, { useState, useCallback } from 'react';
import { Task, TaskStatus } from '../types/task';
import mockTasks, { TEAM_MEMBERS, SPRINTS } from '../data/mockTasks';
import { TaskBoard } from '../components/TaskBoard';
import { BacklogView } from '../components/BacklogView';
import { TaskModal } from '../components/TaskModal';
import './TaskBoardContainer.css';

type ViewMode = 'board' | 'backlog';

export const TaskBoardContainer: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [editingTask, setEditingTask] = useState<Task | null | undefined>(undefined);
  const [newStatus, setNewStatus] = useState<TaskStatus>('todo');
  const [filterAssigneeId, setFilterAssigneeId] = useState('');
  const [view, setView] = useState<ViewMode>('board');

  const openCreate = useCallback((status: TaskStatus) => {
    setNewStatus(status);
    setEditingTask(null);
  }, []);

  const openEdit = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  const closeModal = useCallback(() => {
    setEditingTask(undefined);
  }, []);

  const handleSave = useCallback((saved: Task) => {
    setTasks((prev) => {
      const exists = prev.find((t) => t.id === saved.id);
      return exists
        ? prev.map((t) => (t.id === saved.id ? saved : t))
        : [...prev, { ...saved, status: newStatus }];
    });
    closeModal();
  }, [newStatus, closeModal]);

  const handleDelete = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const handleToggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) => prev.map((t) =>
      t.id !== taskId ? t : {
        ...t,
        subtasks: t.subtasks.map((s) => s.id === subtaskId ? { ...s, done: !s.done } : s),
      }
    ));
  }, []);

  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;

  const filteredTasks = filterAssigneeId
    ? tasks.filter((t) => t.assigneeId === filterAssigneeId)
    : tasks;

  return (
    <div className="tbc-page">
      <header className="tbc-header">
        <div className="tbc-title-row">
          <div className="tbc-view-toggle">
            <button
              className={`tbc-view-btn${view === 'board' ? ' tbc-view-btn--active' : ''}`}
              onClick={() => setView('board')}
            >
              Board
            </button>
            <button
              className={`tbc-view-btn${view === 'backlog' ? ' tbc-view-btn--active' : ''}`}
              onClick={() => setView('backlog')}
            >
              Backlog
            </button>
          </div>
          <button className="tbc-new-btn" onClick={() => openCreate('todo')}>
            + New Task
          </button>
        </div>

        <div className="tbc-meta">
          <div className="tbc-stats">
            <span className="tbc-stat tbc-stat--todo">{todoCount} Todo</span>
            <span className="tbc-stat tbc-stat--inprogress">{inProgressCount} In Progress</span>
            <span className="tbc-stat tbc-stat--done">{doneCount} Done</span>
          </div>

          <select
            className="tbc-filter"
            value={filterAssigneeId}
            onChange={(e) => setFilterAssigneeId(e.target.value)}
            aria-label="Filter by assignee"
          >
            <option value="">All members</option>
            {TEAM_MEMBERS.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      </header>

      {view === 'board' ? (
        <TaskBoard
          tasks={filteredTasks}
          members={TEAM_MEMBERS}
          filterAssigneeId=""
          onEditTask={openEdit}
          onDeleteTask={handleDelete}
          onAddTask={openCreate}
        />
      ) : (
        <BacklogView
          tasks={filteredTasks}
          sprints={SPRINTS}
          members={TEAM_MEMBERS}
          onEditTask={openEdit}
          onDeleteTask={handleDelete}
          onToggleSubtask={handleToggleSubtask}
        />
      )}

      {editingTask !== undefined && (
        <TaskModal
          task={editingTask}
          members={TEAM_MEMBERS}
          sprints={SPRINTS}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
};
