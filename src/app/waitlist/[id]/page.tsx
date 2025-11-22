'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import type { EditorState } from '@/store/editorStore';

export default function PublicWaitlistPage() {
  const params = useParams();
  const id = params.id as string;
  const [email, setEmail] = useState('');
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
          // The API returns the full waitlist object with a settings property
          if (data.settings && typeof data.settings === 'object') {
            setSettings(data.settings);
          } else {
            // Use default settings if none exist
            setSettings({
              headerText: 'Join the Waitlist',
              subText: 'Sign up to be the first to know when we launch. We are building something amazing.',
              submissionMessage: "You're on the list! We'll be in touch soon.",
              bgColor: '#ffffff',
              textColor: '#000000',
              logo: null,
              font: 'inter',
              layout: 'center',
              bgType: 'solid',
              bgGradient: 'from-blue-500 to-purple-600',
              buttonStyle: 'pill',
              buttonText: 'Join',
              buttonColor: '#000000',
              buttonTextColor: '#ffffff',
              inputColor: '#ffffff',
              inputPlaceholderColor: '#999999',
              inputPlaceholder: 'Enter your email',
            });
          }
        } else {
          toast.error('Waitlist not found');
        }
      } catch (error) {
        console.error('Failed to load waitlist:', error);
        toast.error('Failed to load waitlist');
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
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        if (data.alreadyExists) {
          toast.info('You are already on the waitlist!');
        } else {
          toast.success('Successfully joined the waitlist!');
        }
        setEmail('');
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        toast.error(data.message || 'Failed to join waitlist');
      }
    } catch (error) {
      console.error('Failed to join waitlist:', error);
      toast.error('Failed to join waitlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getBackgroundStyle = () => {
    if (!settings) return { style: { backgroundColor: '#ffffff' } };
    
    if (settings.bgType === 'gradient') {
      if (settings.bgGradient.startsWith('css:')) {
        const cssGradient = settings.bgGradient.replace('css:', '');
        return { style: { backgroundImage: cssGradient } };
      }
      return { className: `bg-gradient-to-br ${settings.bgGradient}` };
    }
    return { style: { backgroundColor: settings.bgColor } };
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

  // Dynamically load Google Fonts - must be called before any early returns
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

    return () => {
      const allFontLinks = document.querySelectorAll('[id^="google-font-"]');
      allFontLinks.forEach((oldLink) => {
        if (oldLink.id !== linkId) {
          oldLink.remove();
        }
      });
    };
  }, [settings?.font]);

  if (pageLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Waitlist not found</h1>
          <p className="text-muted-foreground">The waitlist you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const fontInfo = getFontClass(settings.font);
  const bgProps = getBackgroundStyle();

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div
        className={cn(
          "flex-1 w-full flex flex-col justify-center items-center text-center p-8 transition-all duration-500",
          fontInfo.class,
          bgProps.className
        )}
        style={{ 
          ...bgProps.style, 
          color: settings.textColor, 
          fontFamily: `'${fontInfo.family}', ${fontInfo.class.includes('serif') ? 'serif' : fontInfo.class.includes('mono') ? 'monospace' : 'sans-serif'}` 
        }}
      >
        <div className="w-full max-w-lg space-y-8 mx-auto">
          {settings.logo && (
            <div className="flex mb-8 justify-center">
              <img src={settings.logo} alt="Logo" className="h-16 w-auto object-contain drop-shadow-sm" />
            </div>
          )}

          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl transition-colors duration-300 wrap-break-word" style={{ color: settings.textColor }}>
              {settings.headerText}
            </h1>
            <p className="text-xl opacity-80 leading-relaxed max-w-lg transition-colors duration-300 wrap-break-word" style={{ color: settings.textColor }}>
              {settings.subText}
            </p>
          </div>

          <div className="mt-12 h-16">
            {submitted ? (
              <div className={cn(
                "p-4 bg-green-500/10 text-green-600 font-medium animate-in fade-in zoom-in duration-300 flex items-center gap-2 justify-center",
                settings.buttonStyle === 'rounded' && "rounded-md",
                settings.buttonStyle === 'pill' && "rounded-full",
                settings.buttonStyle === 'sharp' && "rounded-none",
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
                {settings.submissionMessage}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2 max-w-md items-center m-auto relative group">
                <style dangerouslySetInnerHTML={{
                  __html: `
                    .custom-email-input::placeholder {
                      color: ${settings.inputPlaceholderColor} !important;
                      opacity: 1;
                    }
                    .custom-email-input::-webkit-input-placeholder {
                      color: ${settings.inputPlaceholderColor} !important;
                      opacity: 1;
                    }
                    .custom-email-input::-moz-placeholder {
                      color: ${settings.inputPlaceholderColor} !important;
                      opacity: 1;
                    }
                    .custom-email-input:-ms-input-placeholder {
                      color: ${settings.inputPlaceholderColor} !important;
                      opacity: 1;
                    }
                  `
                }} />
                <Input
                  type="email"
                  placeholder={settings.inputPlaceholder}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "custom-email-input h-12 pl-4 pr-32 transition-all backdrop-blur-sm shadow-sm",
                    settings.buttonStyle === 'rounded' && "rounded-md",
                    settings.buttonStyle === 'pill' && "rounded-full",
                    settings.buttonStyle === 'sharp' && "rounded-none",
                  )}
                  style={{ 
                    backgroundColor: settings.inputColor,
                    color: settings.textColor === '#ffffff' ? '#fff' : '#000',
                  }}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "absolute right-1.5 top-1.5 bottom-1.5 px-6 transition-all hover:scale-105 active:scale-95",
                    settings.buttonStyle === 'rounded' && "rounded-sm",
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
              </form>
            )}
            <div className="mt-4 flex justify-center">
              <a href="#" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black dark:bg-white text-[10px] font-medium text-white dark:invert font-sans">
                <span>Built using</span>
                <span className="font-bold">waitlist</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

