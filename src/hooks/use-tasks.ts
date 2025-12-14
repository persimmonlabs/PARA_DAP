import { useMemo } from 'react';
import { useData } from '@/context/data-context';
import { Item, Area } from '@/types';

interface UseTasksOptions {
  projectId?: string;
  area?: Area;
  inbox?: boolean;
  completed?: boolean;
}

export const useTasks = (options?: UseTasksOptions) => {
  const { tasks, loading, error, createTask, updateTask, completeTask, deleteTask, refreshTasks } = useData();

  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter(task => !task.archived_at);

    if (options?.completed !== undefined) {
      filtered = filtered.filter(task =>
        options.completed ? !!task.completed_at : !task.completed_at
      );
    }

    if (options?.projectId) {
      filtered = filtered.filter(task => task.project_id === options.projectId);
    }

    if (options?.area) {
      filtered = filtered.filter(task => task.area === options.area);
    }

    if (options?.inbox) {
      filtered = filtered.filter(task => !task.project_id && !task.area);
    }

    return filtered;
  }, [tasks, options]);

  return {
    tasks: filteredTasks,
    loading,
    error,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
    refreshTasks,
  };
};
