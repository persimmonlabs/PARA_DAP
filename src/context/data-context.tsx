'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Item, Project } from '@/types';

interface DataContextType {
  // State
  tasks: Item[];
  projects: Project[];
  loading: boolean;
  error: string | null;

  // Task mutations
  createTask: (data: Partial<Item>) => Promise<Item | null>;
  updateTask: (id: string, data: Partial<Item>) => Promise<Item | null>;
  completeTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // Project mutations
  createProject: (data: Partial<Project>) => Promise<Project | null>;
  updateProject: (id: string, data: Partial<Project>) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<void>;

  // Refresh functions
  refreshTasks: () => Promise<void>;
  refreshProjects: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Item[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks
  const refreshTasks = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/items');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    }
  }, []);

  // Fetch projects
  const refreshProjects = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      console.error('Error fetching projects:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([refreshTasks(), refreshProjects()]);
      setLoading(false);
    };
    loadData();
  }, [refreshTasks, refreshProjects]);

  // Create task with optimistic update
  const createTask = useCallback(async (data: Partial<Item>): Promise<Item | null> => {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create task');

      const newTask = await response.json();
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      console.error('Error creating task:', err);
      return null;
    }
  }, []);

  // Update task with optimistic update
  const updateTask = useCallback(async (id: string, data: Partial<Item>): Promise<Item | null> => {
    const previousTasks = tasks;

    // Optimistic update
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, ...data } : task))
    );

    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update task');

      const updatedTask = await response.json();
      setTasks(prev =>
        prev.map(task => (task.id === id ? updatedTask : task))
      );
      return updatedTask;
    } catch (err) {
      // Rollback on error
      setTasks(previousTasks);
      setError(err instanceof Error ? err.message : 'Failed to update task');
      console.error('Error updating task:', err);
      return null;
    }
  }, [tasks]);

  // Complete task (toggle)
  const completeTask = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const completedAt = task.completed_at ? undefined : new Date().toISOString();
    await updateTask(id, { completed_at: completedAt });
  }, [tasks, updateTask]);

  // Delete task with optimistic update
  const deleteTask = useCallback(async (id: string) => {
    const previousTasks = tasks;

    // Optimistic update
    setTasks(prev => prev.filter(task => task.id !== id));

    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');
    } catch (err) {
      // Rollback on error
      setTasks(previousTasks);
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      console.error('Error deleting task:', err);
    }
  }, [tasks]);

  // Create project
  const createProject = useCallback(async (data: Partial<Project>): Promise<Project | null> => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create project');

      const newProject = await response.json();
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      console.error('Error creating project:', err);
      return null;
    }
  }, []);

  // Update project with optimistic update
  const updateProject = useCallback(async (id: string, data: Partial<Project>): Promise<Project | null> => {
    const previousProjects = projects;

    // Optimistic update
    setProjects(prev =>
      prev.map(project => (project.id === id ? { ...project, ...data } : project))
    );

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update project');

      const updatedProject = await response.json();
      setProjects(prev =>
        prev.map(project => (project.id === id ? updatedProject : project))
      );
      return updatedProject;
    } catch (err) {
      // Rollback on error
      setProjects(previousProjects);
      setError(err instanceof Error ? err.message : 'Failed to update project');
      console.error('Error updating project:', err);
      return null;
    }
  }, [projects]);

  // Delete project (archive)
  const deleteProject = useCallback(async (id: string) => {
    await updateProject(id, { archived_at: new Date().toISOString() });
  }, [updateProject]);

  const value: DataContextType = {
    tasks,
    projects,
    loading,
    error,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
    createProject,
    updateProject,
    deleteProject,
    refreshTasks,
    refreshProjects,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
