import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { isToday, isTomorrow, isPast, format, isThisWeek } from 'date-fns';
import { Item, Project } from '@/types';
import { AreaDot } from './area-dot';
import { ProjectPill } from './project-pill';

interface TaskItemProps {
  item: Item;
  project?: Project;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (item: Item) => void;
}

const formatDueDate = (dateString: string): string => {
  const date = new Date(dateString + 'T12:00:00'); // Avoid timezone issues

  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isThisWeek(date)) return format(date, 'EEEE'); // "Monday", "Tuesday", etc.

  return format(date, 'MMM d'); // "Dec 15"
};

const TaskItemComponent: React.FC<TaskItemProps> = ({
  item,
  project,
  onComplete,
  onDelete,
  onEdit,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const dueDate = item.due_date ? new Date(item.due_date + 'T12:00:00') : null;
  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onComplete(item.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      drag="x"
      dragConstraints={{ left: -100, right: 0 }}
      dragElastic={0.2}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        if (info.offset.x < -80) {
          onDelete(item.id);
        }
      }}
      className="relative bg-white border-b border-gray-200"
    >
      {isDragging && (
        <div className="absolute inset-y-0 right-0 flex items-center justify-center w-20 bg-red-500">
          <span className="text-white text-sm font-medium">Delete</span>
        </div>
      )}

      <motion.div
        className="flex items-center gap-3 p-4 cursor-pointer min-h-[44px]"
        onClick={() => onEdit(item)}
        whileTap={{ scale: isDragging ? 1 : 0.98 }}
      >
        {/* Checkbox */}
        <motion.button
          onClick={handleCheckboxClick}
          className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center min-w-[44px] min-h-[44px] -m-2"
          whileTap={{ scale: 1.2 }}
          aria-label="Complete task"
        >
          {item.completed_at && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-4 h-4 rounded-full bg-primary"
            />
          )}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-base font-medium ${item.completed_at ? 'line-through text-gray-400' : 'text-gray-900'}`}>
              {item.title}
            </h3>
            {item.area && <AreaDot area={item.area} />}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {project && <ProjectPill project={project} />}
            {item.due_date && (
              <span className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                {formatDueDate(item.due_date)}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const TaskItem = memo(TaskItemComponent);
