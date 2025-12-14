'use client';

import React, { useState, use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/hooks/use-tasks';
import { useProjects } from '@/hooks/use-projects';
import { useData } from '@/context/data-context';
import { TaskList } from '@/components/task-list';
import { BottomSheet } from '@/components/bottom-sheet';
import { TaskForm } from '@/components/task-form';
import { FloatingAddButton } from '@/components/floating-add-button';
import { AreaDot } from '@/components/area-dot';
import { Item, Project, Area } from '@/types';

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

const ProjectEditForm: React.FC<{
  project: Project;
  onSave: (data: Partial<Project>) => void;
  onCancel: () => void;
}> = ({ project, onSave, onCancel }) => {
  const [name, setName] = useState(project.name);
  const [emoji, setEmoji] = useState(project.emoji || '');
  const [area, setArea] = useState<Area | undefined>(project.area);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      emoji: emoji.trim() || undefined,
      area,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[44px]"
            autoFocus
            required
          />
        </div>

        <div>
          <label htmlFor="emoji" className="block text-sm font-medium text-gray-700 mb-2">
            Emoji
          </label>
          <input
            id="emoji"
            type="text"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            maxLength={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[44px]"
          />
        </div>

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
      </div>

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
          disabled={!name.trim()}
          className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        >
          Update Project
        </button>
      </div>
    </form>
  );
};

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const router = useRouter();
  const { tasks, completeTask, deleteTask } = useTasks({ projectId, completed: false });
  const { projects, updateProject } = useProjects();
  const { createTask, updateTask } = useData();

  const project = projects.find(p => p.id === projectId);

  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false);
  const [isProjectSheetOpen, setIsProjectSheetOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Item | undefined>(undefined);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Project not found</p>
          <button
            onClick={() => router.push('/projects')}
            className="text-primary hover:text-primary/80"
          >
            Go back to projects
          </button>
        </div>
      </div>
    );
  }

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsTaskSheetOpen(true);
  };

  const handleEditTask = (task: Item) => {
    setEditingTask(task);
    setIsTaskSheetOpen(true);
  };

  const handleSaveTask = async (data: Partial<Item>) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask({ ...data, project_id: projectId });
    }
    setIsTaskSheetOpen(false);
    setEditingTask(undefined);
  };

  const handleSaveProject = async (data: Partial<Project>) => {
    await updateProject(projectId, data);
    setIsProjectSheetOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-screen-lg mx-auto px-6 py-4">
          <div className="flex items-center gap-3 mb-2">
            <motion.button
              onClick={() => router.push('/projects')}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
              whileTap={{ scale: 0.95 }}
              aria-label="Go back"
            >
              <ArrowLeft size={24} />
            </motion.button>
            <div className="flex-1 flex items-center gap-3">
              <span className="text-3xl">{project.emoji || '📁'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold text-gray-900 truncate">
                    {project.name}
                  </h1>
                  {project.area && <AreaDot area={project.area} />}
                </div>
              </div>
            </div>
            <motion.button
              onClick={() => setIsProjectSheetOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900"
              whileTap={{ scale: 0.95 }}
              aria-label="Edit project"
            >
              <Settings size={20} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-lg mx-auto">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <p className="text-gray-500 text-lg mb-2">No tasks in this project</p>
            <p className="text-gray-400 text-sm">Tap the + button to add one</p>
          </div>
        ) : (
          <TaskList
            items={tasks}
            projects={projects}
            groupBy="none"
            onComplete={completeTask}
            onDelete={deleteTask}
            onEdit={handleEditTask}
          />
        )}
      </div>

      {/* Floating Add Button */}
      <FloatingAddButton onClick={handleAddTask} />

      {/* Task Bottom Sheet */}
      <BottomSheet
        isOpen={isTaskSheetOpen}
        onClose={() => {
          setIsTaskSheetOpen(false);
          setEditingTask(undefined);
        }}
        title={editingTask ? 'Edit Task' : 'New Task'}
      >
        <TaskForm
          item={editingTask}
          projects={projects}
          onSave={handleSaveTask}
          onCancel={() => {
            setIsTaskSheetOpen(false);
            setEditingTask(undefined);
          }}
        />
      </BottomSheet>

      {/* Project Edit Bottom Sheet */}
      <BottomSheet
        isOpen={isProjectSheetOpen}
        onClose={() => setIsProjectSheetOpen(false)}
        title="Edit Project"
      >
        <ProjectEditForm
          project={project}
          onSave={handleSaveProject}
          onCancel={() => setIsProjectSheetOpen(false)}
        />
      </BottomSheet>
    </div>
  );
}
