'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import type { EditorState } from '@/store/editorStore';

export default function WidgetPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const isTransparent = searchParams.get('transparent') === 'true';
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [settings, setSettings] = useState<EditorState | null>(null);

  // Load waitlist settings
  useEffect(() => {
    const loadWaitlist = async () => {
      try {
        const res = await fetch(`/api/waitlist/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.settings && typeof data.settings === 'object') {
            setSettings(data.settings);
          } else {
            // Default settings fallback
            setSettings({
              headerText: 'Join the Waitlist',
              subText: 'Sign up to be the first to know when we launch.',
              submissionMessage: "You're on the list!",
              bgColor: '#ffffff',
              textColor: '#000000',
              subTextColor: '#000000',
              logo: null,
              logoSize: 64,
              logoPadding: 0,
              logoBorderWidth: 2,
              logoBorderColor: '#000000',
              logoBgColor: '#ffffff',
              font: 'inter',
              layout: 'center',
              layoutType: 'simple',
              textPosition: 'left',
              showSocialProof: false,
              nameField: false,
              bgType: 'solid',
              bgGradient: 'from-blue-500 to-purple-600',
              bgPattern: 'dots',
              bgPatternColor: '#000000',
              bgPatternOpacity: 0.1,
              bgPatternScale: 1,
              bgPatternStrokeWidth: 1,
              bgPatternRotation: 0,
              bgImage: null,
              heroImage: null,
              buttonStyle: 'pill',
              buttonText: 'Join',
              buttonColor: '#000000',
              buttonTextColor: '#ffffff',
              inputColor: '#ffffff',
              inputTextColor: '#000000',
              inputPlaceholderColor: '#999999',
              inputPlaceholder: 'Enter your email',
            });
          }
        }
      } catch (error) {
        console.error('Failed to load waitlist:', error);
      } finally {
        setPageLoading(false);
      }
    };

    if (id) {
      loadWaitlist();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`/api/waitlist/${id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          name: settings?.nameField ? (name?.trim() || null) : null,
        }),
      });

      const data = await res.json();

      if (res.status === 409 || data.alreadyExists) {
        toast.warning('Email already exists');
        return;
      }

      if (res.ok && data.success) {
        setSubmitted(true);
        toast.success('Successfully joined!');
        setEmail('');
        setName('');
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        toast.error('Failed to join');
      }
    } catch (error) {
      console.error('Failed to join waitlist:', error);
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const getFontClass = (font: string) => {
    const fontMap: Record<string, { class: string; family: string }> = {
      'inter': { class: 'font-sans', family: 'Inter' },
      'roboto': { class: 'font-sans', family: 'Roboto' },
      'poppins': { class: 'font-sans', family: 'Poppins' },
      'open-sans': { class: 'font-sans', family: 'Open Sans' },
      'lato': { class: 'font-sans', family: 'Lato' },
      'montserrat': { class: 'font-sans', family: 'Montserrat' },
      'playfair': { class: 'font-serif', family: 'Playfair Display' },
      'merriweather': { class: 'font-serif', family: 'Merriweather' },
      'lora': { class: 'font-serif', family: 'Lora' },
      'space-mono': { class: 'font-mono', family: 'Space Mono' },
      'jetbrains-mono': { class: 'font-mono', family: 'JetBrains Mono' },
      'fira-code': { class: 'font-mono', family: 'Fira Code' },
    };
    return fontMap[font] || { class: 'font-sans', family: 'Inter' };
  };

  // Dynamically load Google Fonts
  useEffect(() => {
    if (!settings) return;
    
    const fontInfo = getFontClass(settings.font);
    const fontFamily = fontInfo.family.replace(/ /g, '+');
    const linkId = `google-font-${settings.font}`;
    
    let link = document.getElementById(linkId) as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@400;500;600;700&display=swap`;
      document.head.appendChild(link);
    }
  }, [settings?.font]);

  if (pageLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="h-full w-full flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Waitlist not found</p>
        </div>
      </div>
    );
  }

  const fontInfo = getFontClass(settings.font);
  const nameField = settings.nameField ?? false;

  return (
    <div 
      className={cn(
        "w-full min-h-[100px] flex flex-col items-center justify-center p-4",
        fontInfo.class
      )}
      style={{ 
        backgroundColor: isTransparent ? 'transparent' : settings.bgColor,
        color: settings.textColor,
        fontFamily: `'${fontInfo.family}', ${fontInfo.class.includes('serif') ? 'serif' : fontInfo.class.includes('mono') ? 'monospace' : 'sans-serif'}` 
      }}
    >
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: settings.textColor }}>
            {settings.headerText}
          </h1>
          <p className="text-sm opacity-80" style={{ color: settings.subTextColor || settings.textColor }}>
            {settings.subText}
          </p>
        </div>

        {submitted ? (
          <div className={cn(
            "p-3 bg-green-500/10 text-green-600 font-medium animate-in fade-in zoom-in duration-300 flex items-center gap-2 justify-center text-sm",
            settings.buttonStyle === 'rounded' && "rounded-md",
            settings.buttonStyle === 'pill' && "rounded-full",
            settings.buttonStyle === 'sharp' && "rounded-none",
          )}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
            {settings.submissionMessage}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={cn(
            "w-full",
            nameField ? "space-y-3" : "flex gap-2 items-center relative"
          )}>
            <style dangerouslySetInnerHTML={{
              __html: `
                .custom-input::placeholder {
                  color: ${settings.inputPlaceholderColor} !important;
                  opacity: 1;
                }
              `
            }} />
            
            {nameField && (
              <Input
                type="text"
                placeholder="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(
                  "custom-input h-10 transition-all backdrop-blur-sm shadow-sm border-0",
                  settings.buttonStyle === 'rounded' && "rounded-md",
                  settings.buttonStyle === 'pill' && "rounded-full",
                  settings.buttonStyle === 'sharp' && "rounded-none",
                )}
                style={{ 
                  backgroundColor: settings.inputColor,
                  color: settings.inputTextColor || '#000000',
                }}
              />
            )}
            
            <div className={cn("relative w-full", !nameField && "flex-1")}>
              <Input
                type="email"
                placeholder={settings.inputPlaceholder}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "custom-input h-10 transition-all backdrop-blur-sm shadow-sm border-0",
                  !nameField && "pr-24",
                  settings.buttonStyle === 'rounded' && "rounded-md",
                  settings.buttonStyle === 'pill' && "rounded-full",
                  settings.buttonStyle === 'sharp' && "rounded-none",
                )}
                style={{ 
                  backgroundColor: settings.inputColor,
                  color: settings.inputTextColor || '#000000',
                }}
              />
              {!nameField && (
                <Button
                  type="submit"
                  disabled={loading}
                  size="sm"
                  className={cn(
                    "absolute right-1 top-1 bottom-1 px-4 transition-all hover:scale-105 active:scale-95",
                    settings.buttonStyle === 'rounded' && "rounded-sm",
                    settings.buttonStyle === 'pill' && "rounded-full",
                    settings.buttonStyle === 'sharp' && "rounded-none",
                  )}
                  style={{ 
                    backgroundColor: settings.buttonColor,
                    color: settings.buttonTextColor,
                  }}
                >
                  {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : settings.buttonText}
                </Button>
              )}
            </div>

            {nameField && (
              <Button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full h-10 transition-all hover:scale-105 active:scale-95",
                  settings.buttonStyle === 'rounded' && "rounded-md",
                  settings.buttonStyle === 'pill' && "rounded-full",
                  settings.buttonStyle === 'sharp' && "rounded-none",
                )}
                style={{ 
                  backgroundColor: settings.buttonColor,
                  color: settings.buttonTextColor,
                }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : settings.buttonText}
              </Button>
            )}
          </form>
        )}
        <div className="mt-4 flex justify-center">
          <a href="https://waitbridge.com/ref=badge" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black dark:bg-white text-[10px] font-medium text-white dark:invert font-sans hover:opacity-80 transition-opacity">
            <span>Built using</span>
            <span className="font-bold flex gap-1"><Loader className="w-3 h-3" /> waitbridge</span>
          </a>
        </div>
      </div>
    </div>
  );
}
