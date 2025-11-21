import React from 'react';
import { Button } from "@/components/ui/button";
import { Maximize2, Upload, Monitor, Smartphone } from 'lucide-react';

interface EditorLayoutProps {
  children: React.ReactNode;
  controls: React.ReactNode;
}

export function EditorLayout({ children, controls }: EditorLayoutProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'desktop' | 'mobile'>('desktop');
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
            {/* Device Toggle */}
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('desktop')}
                className="gap-2 h-8"
              >
                <Monitor className="w-4 h-4" />
                Desktop
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('mobile')}
                className="gap-2 h-8"
              >
                <Smartphone className="w-4 h-4" />
                Mobile
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleFullscreen}
              className="gap-2"
            >
              <Maximize2 className="w-4 h-4" />
              Full Screen
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
            {viewMode === 'mobile' ? (
              <div className="relative">
                {/* Phone Frame */}
                <div className="relative w-[375px] h-[812px] bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-[3.5rem] p-3 shadow-2xl ring-1 ring-zinc-700/50">
                  {/* Volume Buttons */}
                  <div className="absolute -left-[3px] top-28 w-[3px] h-8 bg-zinc-700 rounded-l-lg" />
                  <div className="absolute -left-[3px] top-40 w-[3px] h-8 bg-zinc-700 rounded-l-lg" />
                  
                  {/* Power Button */}
                  <div className="absolute -right-[3px] top-36 w-[3px] h-16 bg-zinc-700 rounded-r-lg" />
                  
                  {/* Inner bezel */}
                  <div className="relative w-full h-full bg-black rounded-[3rem] p-[2px]">
                    {/* Dynamic Island / Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-[1.5rem] z-20 shadow-lg" />
                    
                    {/* Screen */}
                    <div className="relative w-full h-full bg-white rounded-[2.8rem] overflow-hidden shadow-inner">
                      {/* Status bar overlay for realism */}
                      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/5 to-transparent pointer-events-none z-10" />
                      
                      {/* Content */}
                      <div className="w-full h-full overflow-auto">
                        {children}
                      </div>
                    </div>
                  </div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-[3.5rem] bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none" />
                </div>
                
                {/* Phone shadow */}
                <div className="absolute inset-0 -z-10 blur-2xl opacity-40">
                  <div className="w-full h-full bg-black rounded-[3.5rem] scale-95" />
                </div>
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
