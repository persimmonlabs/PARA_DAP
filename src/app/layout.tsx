'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from 'next/navigation';
import { DataProvider } from '@/context/data-context';
import { BottomNav } from '@/components/bottom-nav';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/projects')) return 'projects';
    if (pathname === '/inbox') return 'inbox';
    return 'home';
  };

  const handleTabChange = (tab: 'home' | 'projects' | 'inbox') => {
    if (typeof window !== 'undefined') {
      const routes = {
        home: '/',
        projects: '/projects',
        inbox: '/inbox',
      };
      window.location.href = routes[tab];
    }
  };

  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PARA" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#E07A3D" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <title>PARA - Personal Task Dashboard</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DataProvider>
          <div className="pb-20">
            {children}
          </div>
          <BottomNav activeTab={getActiveTab()} onTabChange={handleTabChange} />
        </DataProvider>
      </body>
    </html>
  );
}
