import { useMemo } from 'react';
import { useData } from '@/context/data-context';
import { Area } from '@/types';

interface UseProjectsOptions {
  area?: Area;
  includeArchived?: boolean;
}

export const useProjects = (options?: UseProjectsOptions) => {
  const { projects, tasks, loading, error, createProject, updateProject, deleteProject, refreshProjects } = useData();

  const filteredProjects = useMemo(() => {
    let filtered = projects;

    if (!options?.includeArchived) {
      filtered = filtered.filter(project => !project.archived_at);
    }

    if (options?.area) {
      filtered = filtered.filter(project => project.area === options.area);
    }

    return filtered;
  }, [projects, options]);

  const projectsWithCounts = useMemo(() => {
    return filteredProjects.map(project => {
      const activeTasks = tasks.filter(
        task => task.project_id === project.id && !task.completed_at && !task.archived_at
      );
      return {
        ...project,
        activeTaskCount: activeTasks.length,
      };
    });
  }, [filteredProjects, tasks]);

  return {
    projects: projectsWithCounts,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects,
  };
};
