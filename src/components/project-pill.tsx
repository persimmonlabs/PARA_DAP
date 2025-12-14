import React from 'react';
import { Project } from '@/types';

interface ProjectPillProps {
  project: Project;
}

export const ProjectPill: React.FC<ProjectPillProps> = ({ project }) => {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
      {project.emoji && <span>{project.emoji}</span>}
      <span>{project.name}</span>
    </div>
  );
};
