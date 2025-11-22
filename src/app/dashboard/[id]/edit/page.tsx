'use client';

import React, { useState, useEffect } from 'react';
import { PreviewPanel } from '@/components/editor/PreviewPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Save, Loader2, Copy, Check } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEditorStore } from '@/store/editorStore';
import { toast } from 'sonner';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function Edit() {
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const { setFullState, getState } = useEditorStore();
  
  const shareableLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/waitlist/${id}`
    : '';

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch(`/api/waitlist/${id}/settings`);
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setFullState(data.settings);
          }
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [id, setFullState]);

  // Save settings
  const handleSave = async () => {
    setSaving(true);
    try {
      const currentState = getState();
      const res = await fetch(`/api/waitlist/${id}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentState),
      });

      if (res.ok) {
        toast.success('Settings saved successfully!');
      } else {
        const err = await res.text();
        toast.error(`Failed to save: ${err}`);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full w-full p-6 bg-muted/20">
      <Tabs defaultValue="edit" className="h-full w-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid w-[400px] grid-cols-3">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="flex justify-end">

          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
            </TabsContent>
        </div>
        
        <TabsContent value="edit" className="flex-1 mt-0 h-full overflow-hidden flex flex-col">
          {/* Preview Container */}
          <div className={cn(
            "flex-1 flex items-center justify-center transition-all duration-300",
          )}>
            <div className={cn(
              "transition-all duration-300",
              "w-full h-full"
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
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Share Your Waitlist</CardTitle>
              <CardDescription>
                Share this link with your customers so they can join your waitlist.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Waitlist Link</label>
                <div className="flex gap-2">
                  <Input
                    value={shareableLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(shareableLink);
                        setCopied(true);
                        toast.success('Link copied to clipboard!');
                        setTimeout(() => setCopied(false), 2000);
                      } catch (error) {
                        toast.error('Failed to copy link');
                      }
                    }}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Anyone with this link can join your waitlist. The page will automatically use the settings you've configured.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
