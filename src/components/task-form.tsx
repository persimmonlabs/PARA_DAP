import React, { useState } from 'react';
import { addDays, addWeeks, format } from 'date-fns';
import { Item, Project, Area } from '@/types';

interface TaskFormProps {
  item?: Item;
  projects: Project[];
  onSave: (data: Partial<Item>) => void;
  onCancel: () => void;
}

const areaColors: Record<Area, string> = {
  tennis: '#86A873',
  rose: '#D4A5A5',
  professional: '#7BA3C9',
  personal: '#A89BC9',
};

const areaLabels: Record<Area, string> = {
  tennis: 'Tennis',
  rose: 'Rose',
  professional: 'Professional',
  personal: 'Personal',
};

export const TaskForm: React.FC<TaskFormProps> = ({
  item,
  projects,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(item?.title || '');
  const [notes, setNotes] = useState(item?.notes || '');
  const [projectId, setProjectId] = useState(item?.project_id || '');
  const [area, setArea] = useState<Area | undefined>(item?.area);
  const [dueDate, setDueDate] = useState(item?.due_date || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      notes: notes.trim() || undefined,
      project_id: projectId || undefined,
      area,
      due_date: dueDate || undefined,
    });
  };

  const setQuickDate = (date: Date | null) => {
    setDueDate(date ? format(date, 'yyyy-MM-dd') : '');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[44px]"
            autoFocus
            required
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add details..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {/* Project Picker */}
        <div>
          <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
            Project
          </label>
          <select
            id="project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[44px]"
          >
            <option value="">No project</option>
            {projects
              .filter((p) => !p.archived_at)
              .map((project) => (
                <option key={project.id} value={project.id}>
                  {project.emoji ? `${project.emoji} ` : ''}
                  {project.name}
                </option>
              ))}
          </select>
        </div>

        {/* Area Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Area
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(areaColors) as Area[]).map((areaKey) => (
              <button
                key={areaKey}
                type="button"
                onClick={() => setArea(area === areaKey ? undefined : areaKey)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all min-h-[44px] ${
                  area === areaKey
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full mb-1"
                  style={{ backgroundColor: areaColors[areaKey] }}
                />
                <span className="text-xs text-gray-700">{areaLabels[areaKey]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="due-date" className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>

          {/* Quick Date Buttons */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            <button
              type="button"
              onClick={() => setQuickDate(new Date())}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium min-h-[44px]"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setQuickDate(addDays(new Date(), 1))}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium min-h-[44px]"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => setQuickDate(addWeeks(new Date(), 1))}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium min-h-[44px]"
            >
              Next Week
            </button>
            <button
              type="button"
              onClick={() => setQuickDate(null)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium min-h-[44px]"
            >
              Clear
            </button>
          </div>

          {/* Date Input */}
          <input
            id="due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[44px]"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-white">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors min-h-[44px]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        >
          {item ? 'Update' : 'Add'} Task
        </button>
      </div>
    </form>
  );
};
