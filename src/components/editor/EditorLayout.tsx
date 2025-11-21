import React from 'react';

interface EditorLayoutProps {
  children: React.ReactNode;
  controls: React.ReactNode;
}

export function EditorLayout({ children, controls }: EditorLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Sidebar Controls */}
      <aside className="w-[400px] flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-xl overflow-y-auto z-10 shadow-xl shadow-zinc-200/50 dark:shadow-none">
        {controls}
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 relative overflow-hidden bg-zinc-100/50 dark:bg-black flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-grid-zinc-200/50 dark:bg-grid-zinc-800/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />
        <div className="relative w-full h-full flex items-center justify-center">
          {children}
        </div>
      </main>
    </div>
  );
}
