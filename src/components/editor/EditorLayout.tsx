import React from 'react';
import { Button } from "@/components/ui/button";
import { Maximize2, Upload } from 'lucide-react';

interface EditorLayoutProps {
  children: React.ReactNode;
  controls: React.ReactNode;
}

export function EditorLayout({ children, controls }: EditorLayoutProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const previewRef = React.useRef<HTMLDivElement>(null);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      previewRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handlePublish = () => {
    // TODO: Implement publish functionality
    alert('Publish functionality coming soon!');
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Sidebar Controls */}
      <aside className="w-[400px] flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-xl overflow-y-auto z-10 shadow-xl shadow-zinc-200/50 dark:shadow-none">
        {controls}
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 relative overflow-hidden bg-zinc-100/50 dark:bg-black flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Preview</h2>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullscreen}
              className="gap-2"
            >
              <Maximize2 className="w-4 h-4" />
              Full Screen Preview
            </Button>
            <Button
              size="sm"
              onClick={handlePublish}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              Publish
            </Button>
          </div>
        </header>

        {/* Preview Content */}
        <div ref={previewRef} className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-zinc-200/50 dark:bg-grid-zinc-800/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />
          <div className="relative w-full h-full flex items-center justify-center p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
