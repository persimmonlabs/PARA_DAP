'use client';

import { usePathname, useRouter } from 'next/navigation';
import { DataProvider } from '@/context/data-context';
import { BottomNav } from '@/components/bottom-nav';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const getActiveTab = (): 'home' | 'projects' | 'inbox' => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/projects')) return 'projects';
    if (pathname === '/inbox') return 'inbox';
    return 'home';
  };

  const handleTabChange = (tab: 'home' | 'projects' | 'inbox') => {
    const routes = {
      home: '/',
      projects: '/projects',
      inbox: '/inbox',
    };
    router.push(routes[tab]);
  };

  return (
    <DataProvider>
      <main className="pb-20 min-h-screen">
        {children}
      </main>
      <BottomNav activeTab={getActiveTab()} onTabChange={handleTabChange} />
    </DataProvider>
  );
}
