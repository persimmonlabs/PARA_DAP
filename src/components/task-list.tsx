import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { isToday, isPast, startOfDay } from 'date-fns';
import { Item, Project } from '@/types';
import { TaskItem } from './task-item';

interface TaskListProps {
  items: Item[];
  projects: Project[];
  groupBy?: 'date' | 'none';
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (item: Item) => void;
}

type GroupedItems = {
  overdue: Item[];
  today: Item[];
  upcoming: Item[];
  noDate: Item[];
};

const parseDate = (dateString: string): Date => {
  // Parse YYYY-MM-DD as local date, not UTC
  return new Date(dateString + 'T12:00:00');
};

const sortByDueDate = (items: Item[]): Item[] => {
  return [...items].sort((a, b) => {
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });
};

const groupItemsByDate = (items: Item[]): GroupedItems => {
  const grouped: GroupedItems = {
    overdue: [],
    today: [],
    upcoming: [],
    noDate: [],
  };

  const todayStart = startOfDay(new Date());

  items.forEach((item) => {
    if (!item.due_date) {
      grouped.noDate.push(item);
      return;
    }

    const dueDate = parseDate(item.due_date);
    const dueDateStart = startOfDay(dueDate);

    if (dueDateStart < todayStart) {
      grouped.overdue.push(item);
    } else if (isToday(dueDate)) {
      grouped.today.push(item);
    } else {
      grouped.upcoming.push(item);
    }
  });

  // Sort each group by due date
  grouped.overdue = sortByDueDate(grouped.overdue);
  grouped.today = sortByDueDate(grouped.today);
  grouped.upcoming = sortByDueDate(grouped.upcoming);

  return grouped;
};

const SectionHeader: React.FC<{ title: string; count: number }> = ({ title, count }) => (
  <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
    <h2 className="text-sm font-semibold text-gray-700">
      {title} <span className="text-gray-500">({count})</span>
    </h2>
  </div>
);

export const TaskList: React.FC<TaskListProps> = ({
  items,
  projects,
  groupBy = 'none',
  onComplete,
  onDelete,
  onEdit,
}) => {
  const getProjectById = (projectId?: string) => {
    if (!projectId) return undefined;
    return projects.find((p) => p.id === projectId);
  };

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <p>No tasks yet. Tap the + button to add one!</p>
      </div>
    );
  }

  if (groupBy === 'none') {
    return (
      <div className="divide-y divide-gray-200">
        <AnimatePresence>
          {items.map((item) => (
            <TaskItem
              key={item.id}
              item={item}
              project={getProjectById(item.project_id)}
              onComplete={onComplete}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  }

  const grouped = groupItemsByDate(items);

  return (
    <div>
      {grouped.overdue.length > 0 && (
        <div>
          <SectionHeader title="Overdue" count={grouped.overdue.length} />
          <div className="divide-y divide-gray-200">
            <AnimatePresence>
              {grouped.overdue.map((item) => (
                <TaskItem
                  key={item.id}
                  item={item}
                  project={getProjectById(item.project_id)}
                  onComplete={onComplete}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {grouped.today.length > 0 && (
        <div>
          <SectionHeader title="Today" count={grouped.today.length} />
          <div className="divide-y divide-gray-200">
            <AnimatePresence>
              {grouped.today.map((item) => (
                <TaskItem
                  key={item.id}
                  item={item}
                  project={getProjectById(item.project_id)}
                  onComplete={onComplete}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {grouped.upcoming.length > 0 && (
        <div>
          <SectionHeader title="Upcoming" count={grouped.upcoming.length} />
          <div className="divide-y divide-gray-200">
            <AnimatePresence>
              {grouped.upcoming.map((item) => (
                <TaskItem
                  key={item.id}
                  item={item}
                  project={getProjectById(item.project_id)}
                  onComplete={onComplete}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {grouped.noDate.length > 0 && (
        <div>
          <SectionHeader title="No Date" count={grouped.noDate.length} />
          <div className="divide-y divide-gray-200">
            <AnimatePresence>
              {grouped.noDate.map((item) => (
                <TaskItem
                  key={item.id}
                  item={item}
                  project={getProjectById(item.project_id)}
                  onComplete={onComplete}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};
