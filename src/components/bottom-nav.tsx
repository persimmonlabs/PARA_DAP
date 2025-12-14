import React from 'react';
import { Home, Folder, Inbox } from 'lucide-react';

type Tab = 'home' | 'projects' | 'inbox';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className="flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[44px] transition-colors"
    aria-label={label}
    aria-current={isActive ? 'page' : undefined}
  >
    <div className={isActive ? 'text-primary' : 'text-gray-500'}>
      {icon}
    </div>
    <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-gray-500'}`}>
      {label}
    </span>
  </button>
);

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-30">
      <div className="flex items-center justify-around max-w-screen-lg mx-auto">
        <NavItem
          icon={<Home size={24} strokeWidth={2} />}
          label="Home"
          isActive={activeTab === 'home'}
          onClick={() => onTabChange('home')}
        />
        <NavItem
          icon={<Folder size={24} strokeWidth={2} />}
          label="Projects"
          isActive={activeTab === 'projects'}
          onClick={() => onTabChange('projects')}
        />
        <NavItem
          icon={<Inbox size={24} strokeWidth={2} />}
          label="Inbox"
          isActive={activeTab === 'inbox'}
          onClick={() => onTabChange('inbox')}
        />
      </div>
    </nav>
  );
};
