'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { useProjects } from '@/hooks/use-projects';
import { BottomSheet } from '@/components/bottom-sheet';
import { AreaDot } from '@/components/area-dot';
import { Area, Project } from '@/types';

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

const ProjectForm: React.FC<{
  project?: Project;
  onSave: (data: Partial<Project>) => void;
  onCancel: () => void;
}> = ({ project, onSave, onCancel }) => {
  const [name, setName] = useState(project?.name || '');
  const [emoji, setEmoji] = useState(project?.emoji || '');
  const [area, setArea] = useState<Area | undefined>(project?.area);

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
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[44px]"
            autoFocus
            required
          />
        </div>

        {/* Emoji */}
        <div>
          <label htmlFor="emoji" className="block text-sm font-medium text-gray-700 mb-2">
            Emoji
          </label>
          <input
            id="emoji"
            type="text"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            placeholder="📁"
            maxLength={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[44px]"
          />
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
          disabled={!name.trim()}
          className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        >
          {project ? 'Update' : 'Create'} Project
        </button>
      </div>
    </form>
  );
};

export default function ProjectsPage() {
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);

  const handleAddProject = () => {
    setEditingProject(undefined);
    setIsSheetOpen(true);
  };

  const handleSaveProject = async (data: Partial<Project>) => {
    if (editingProject) {
      await updateProject(editingProject.id, data);
    } else {
      await createProject(data);
    }
    setIsSheetOpen(false);
    setEditingProject(undefined);
  };

  const handleArchive = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Archive this project?')) {
      await deleteProject(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-screen-lg mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <motion.button
            onClick={handleAddProject}
            className="p-2 text-primary hover:text-primary/80"
            whileTap={{ scale: 0.95 }}
            aria-label="Add project"
          >
            <Plus size={24} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-lg mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <p className="text-gray-500 text-lg mb-2">No projects yet</p>
            <p className="text-gray-400 text-sm">Tap the + button to create one</p>
          </div>
        ) : (
          <div className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative"
              >
                <Link
                  href={`/projects/${project.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors min-h-[44px]"
                >
                  {/* Emoji/Icon */}
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-2xl">
                    {project.emoji || '📁'}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-medium text-gray-900 truncate">
                        {project.name}
                      </h3>
                      {project.area && <AreaDot area={project.area} />}
                    </div>
                    <p className="text-sm text-gray-500">
                      {project.activeTaskCount} active {project.activeTaskCount === 1 ? 'task' : 'tasks'}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />

                  {/* Archive button (swipe left to reveal) */}
                  <button
                    onClick={(e) => handleArchive(project.id, e)}
                    className="absolute right-0 top-0 bottom-0 bg-red-500 text-white px-6 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    aria-label="Archive project"
                  >
                    Archive
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Sheet with Project Form */}
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false);
          setEditingProject(undefined);
        }}
        title={editingProject ? 'Edit Project' : 'New Project'}
      >
        <ProjectForm
          project={editingProject}
          onSave={handleSaveProject}
          onCancel={() => {
            setIsSheetOpen(false);
            setEditingProject(undefined);
          }}
        />
      </BottomSheet>
    </div>
  );
}
