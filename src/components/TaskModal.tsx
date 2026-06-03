import React, { useState, useEffect, useRef } from 'react';
import { Task, TaskStatus, TaskPriority, TaskLabel, TeamMember, Sprint, Subtask } from '../types/task';
import './TaskModal.css';

const ALL_LABELS: TaskLabel[] = ['bug', 'feature', 'chore', 'docs', 'review'];

interface TaskModalProps {
  task: Task | null; // null = create mode
  members: TeamMember[];
  sprints: Sprint[];
  onSave: (task: Task) => void;
  onClose: () => void;
}

function emptyForm(): Omit<Task, 'id' | 'createdAt'> {
  return { title: '', description: '', status: 'todo', priority: 'medium', assigneeId: '', labels: [], sprintId: '', subtasks: [] };
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, members, sprints, onSave, onClose }) => {
  const [form, setForm] = useState(emptyForm);
  const [subtaskInput, setSubtaskInput] = useState('');
  const subtaskInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (task) {
      const { id: _id, createdAt: _c, ...rest } = task;
      setForm(rest);
    } else {
      setForm(emptyForm());
    }
    setSubtaskInput('');
  }, [task]);

  const set = <K extends keyof typeof form>(key: K, value: typeof form[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleLabel = (label: TaskLabel) =>
    set('labels', form.labels.includes(label)
      ? form.labels.filter((l) => l !== label)
      : [...form.labels, label]
    );

  const addSubtask = () => {
    const title = subtaskInput.trim();
    if (!title) return;
    const newSub: Subtask = { id: `st${Date.now()}`, title, done: false };
    set('subtasks', [...form.subtasks, newSub]);
    setSubtaskInput('');
    subtaskInputRef.current?.focus();
  };

  const toggleSubtask = (id: string) =>
    set('subtasks', form.subtasks.map((s) => s.id === id ? { ...s, done: !s.done } : s));

  const deleteSubtask = (id: string) =>
    set('subtasks', form.subtasks.filter((s) => s.id !== id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({
      ...form,
      id: task?.id ?? `t${Date.now()}`,
      createdAt: task?.createdAt ?? new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <div className="tm-overlay" onClick={onClose}>
      <div className="tm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tm-modal-header">
          <h2 className="tm-modal-title">{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="tm-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="tm-form">
          <label className="tm-label">
            Title <span className="tm-required">*</span>
            <input
              className="tm-input"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Task title"
              autoFocus
            />
          </label>

          <label className="tm-label">
            Description
            <textarea
              className="tm-textarea"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Optional description"
              rows={3}
            />
          </label>

          <div className="tm-row">
            <label className="tm-label">
              Status
              <select className="tm-select" value={form.status} onChange={(e) => set('status', e.target.value as TaskStatus)}>
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </label>

            <label className="tm-label">
              Priority
              <select className="tm-select" value={form.priority} onChange={(e) => set('priority', e.target.value as TaskPriority)}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </label>
          </div>

          <div className="tm-row">
            <label className="tm-label">
              Assignee
              <select className="tm-select" value={form.assigneeId} onChange={(e) => set('assigneeId', e.target.value)}>
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </label>

            <label className="tm-label">
              Sprint
              <select className="tm-select" value={form.sprintId} onChange={(e) => set('sprintId', e.target.value)}>
                <option value="">Backlog</option>
                {sprints.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="tm-label">
            Labels
            <div className="tm-labels">
              {ALL_LABELS.map((label) => (
                <button
                  key={label}
                  type="button"
                  className={`tm-label-btn${form.labels.includes(label) ? ' tm-label-btn--active' : ''}`}
                  onClick={() => toggleLabel(label)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="tm-label">
            Subtasks
            {form.subtasks.length > 0 && (
              <ul className="tm-subtask-list">
                {form.subtasks.map((sub) => (
                  <li key={sub.id} className="tm-subtask-item">
                    <input
                      type="checkbox"
                      className="tm-subtask-check"
                      checked={sub.done}
                      onChange={() => toggleSubtask(sub.id)}
                    />
                    <span className={`tm-subtask-title${sub.done ? ' tm-subtask-title--done' : ''}`}>
                      {sub.title}
                    </span>
                    <button
                      type="button"
                      className="tm-subtask-del"
                      onClick={() => deleteSubtask(sub.id)}
                      aria-label="Remove subtask"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="tm-subtask-add">
              <input
                ref={subtaskInputRef}
                className="tm-input"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSubtask(); } }}
                placeholder="Add a subtask..."
              />
              <button type="button" className="tm-subtask-add-btn" onClick={addSubtask}>
                Add
              </button>
            </div>
          </div>

          <div className="tm-actions">
            <button type="button" className="tm-btn tm-btn--cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="tm-btn tm-btn--save">
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
