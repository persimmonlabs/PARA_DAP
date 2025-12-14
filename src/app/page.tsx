'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useTasks } from '@/hooks/use-tasks';
import { useData } from '@/context/data-context';
import { TaskList } from '@/components/task-list';
import { BottomSheet } from '@/components/bottom-sheet';
import { TaskForm } from '@/components/task-form';
import { FloatingAddButton } from '@/components/floating-add-button';
import { Item } from '@/types';

export default function HomePage() {
  const { tasks, loading, completeTask, deleteTask, refreshTasks } = useTasks({ completed: false });
  const { projects, createTask, updateTask } = useData();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Item | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsSheetOpen(true);
  };

  const handleEditTask = (task: Item) => {
    setEditingTask(task);
    setIsSheetOpen(true);
  };

  const handleSaveTask = async (data: Partial<Item>) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data);
    }
    setIsSheetOpen(false);
    setEditingTask(undefined);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshTasks();
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-screen-lg mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
          <motion.button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            whileTap={{ scale: 0.95 }}
            aria-label="Refresh tasks"
          >
            <RefreshCw
              size={20}
              className={isRefreshing ? 'animate-spin' : ''}
            />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-lg mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <p className="text-gray-500 text-lg mb-2">No tasks yet</p>
            <p className="text-gray-400 text-sm">Tap the + button to add one</p>
          </div>
        ) : (
          <TaskList
            items={tasks}
            projects={projects}
            groupBy="date"
            onComplete={completeTask}
            onDelete={deleteTask}
            onEdit={handleEditTask}
          />
        )}
      </div>

      {/* Floating Add Button */}
      <FloatingAddButton onClick={handleAddTask} />

      {/* Bottom Sheet with Task Form */}
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false);
          setEditingTask(undefined);
        }}
        title={editingTask ? 'Edit Task' : 'New Task'}
      >
        <TaskForm
          item={editingTask}
          projects={projects}
          onSave={handleSaveTask}
          onCancel={() => {
            setIsSheetOpen(false);
            setEditingTask(undefined);
          }}
        />
      </BottomSheet>
    </div>
  );
}
