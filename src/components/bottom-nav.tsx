'use client';

import React from 'react';
import { Home, Folder, Inbox } from 'lucide-react';

type Tab = 'home' | 'projects' | 'inbox';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const PRIMARY_COLOR = '#E07A3D';

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={() => onTabChange('home')}
          className="flex-1 flex flex-col items-center justify-center py-2 min-h-[56px]"
          aria-label="Home"
        >
          <Home
            size={24}
            strokeWidth={activeTab === 'home' ? 2.5 : 1.5}
            color={activeTab === 'home' ? PRIMARY_COLOR : '#9CA3AF'}
          />
          <span
            className="text-xs mt-1 font-medium"
            style={{ color: activeTab === 'home' ? PRIMARY_COLOR : '#9CA3AF' }}
          >
            Home
          </span>
        </button>

        {/* Projects */}
        <button
          onClick={() => onTabChange('projects')}
          className="flex-1 flex flex-col items-center justify-center py-2 min-h-[56px]"
          aria-label="Projects"
        >
          <Folder
            size={24}
            strokeWidth={activeTab === 'projects' ? 2.5 : 1.5}
            color={activeTab === 'projects' ? PRIMARY_COLOR : '#9CA3AF'}
          />
          <span
            className="text-xs mt-1 font-medium"
            style={{ color: activeTab === 'projects' ? PRIMARY_COLOR : '#9CA3AF' }}
          >
            Projects
          </span>
        </button>

        {/* Inbox */}
        <button
          onClick={() => onTabChange('inbox')}
          className="flex-1 flex flex-col items-center justify-center py-2 min-h-[56px]"
          aria-label="Inbox"
        >
          <Inbox
            size={24}
            strokeWidth={activeTab === 'inbox' ? 2.5 : 1.5}
            color={activeTab === 'inbox' ? PRIMARY_COLOR : '#9CA3AF'}
          />
          <span
            className="text-xs mt-1 font-medium"
            style={{ color: activeTab === 'inbox' ? PRIMARY_COLOR : '#9CA3AF' }}
          >
            Inbox
          </span>
        </button>
      </div>
    </nav>
  );
};
