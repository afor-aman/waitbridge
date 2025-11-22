'use client';

import React, { useState } from 'react';
import { PreviewPanel } from '@/components/editor/PreviewPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Monitor, Smartphone, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Edit() {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="h-full w-full p-6 bg-muted/20">
      <Tabs defaultValue="edit" className="h-full w-full flex flex-col">
        <div className="flex justify-center mb-6">
          <TabsList className="grid w-[400px] grid-cols-3">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="edit" className="flex-1 mt-0 h-full overflow-hidden flex flex-col">
          {/* Preview Container */}
          <div className={cn(
            "flex-1 flex items-center justify-center transition-all duration-300",
            isFullscreen && "fixed inset-0 z-50 bg-muted/20 p-6"
          )}>
            <div className={cn(
              "transition-all duration-300",
              viewMode === 'desktop' ? "w-full h-full" : "w-[375px] h-[667px]"
            )}>
              <PreviewPanel />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="flex-1 mt-0 h-full flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium">Analytics</h3>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        </TabsContent>
        
        <TabsContent value="share" className="flex-1 mt-0 h-full flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium">Share</h3>
            <p className="text-muted-foreground">Share options coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
