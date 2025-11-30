'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import type { EditorState } from '@/store/editorStore';
import { getPatternStyle } from '@/lib/patterns';
import Image from 'next/image';

export default function PublicWaitlistPage() {
  const params = useParams();
  const id = params.id as string;
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
              showSocialProof: true,
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
        body: JSON.stringify({ 
          email,
          name: settings?.nameField ? (name?.trim() || null) : null,
        }),
      });

      const data = await res.json();

      // Handle duplicate email (409 Conflict)
      if (res.status === 409 || data.alreadyExists) {
        toast.warning('Email already exists', {
          description: data.message || 'This email is already on the waitlist. Please use a different email address.',
        });
        // Don't clear email, let user see what they entered
        return;
      }

      // Handle successful submission
      if (res.ok && data.success) {
        setSubmitted(true);
        toast.success('Successfully joined!', {
          description: data.message || 'We\'ll notify you when we launch.',
        });
        setEmail('');
        setName('');
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        // Handle other errors
        toast.error('Failed to join', {
          description: data.message || 'Please try again later or contact support if the problem persists.',
        });
      }
    } catch (error) {
      console.error('Failed to join waitlist:', error);
      toast.error('Connection error', {
        description: 'Please check your connection and try again.',
      });
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
    if (settings.bgType === 'pattern') {
      const bgPattern = settings.bgPattern || 'dots';
      const bgPatternColor = settings.bgPatternColor || '#000000';
      const bgPatternOpacity = settings.bgPatternOpacity ?? 0.1;
      const bgPatternScale = settings.bgPatternScale ?? 1;
      const bgPatternStrokeWidth = settings.bgPatternStrokeWidth ?? 1;
      const bgPatternRotation = settings.bgPatternRotation ?? 0;
      
      const pattern = getPatternStyle(
        bgPattern,
        bgPatternColor,
        bgPatternOpacity,
        bgPatternScale,
        bgPatternStrokeWidth,
        bgPatternRotation
      );
      
      return { 
        style: { 
          backgroundColor: settings.bgColor,
          backgroundImage: pattern.image,
          backgroundSize: pattern.size,
          backgroundPosition: pattern.position || '0 0',
        }
      };
    }
    if (settings.bgType === 'image' && settings.bgImage) {
      return { 
        style: { 
          backgroundImage: `url(${settings.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      };
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

  // Merge with defaults to handle missing fields from old waitlists
  const layoutType = settings.layoutType || 'simple';
  const textPosition = settings.textPosition || 'left';
  const showSocialProof = settings.showSocialProof ?? true;
  const nameField = settings.nameField ?? false;

  // Social proof JSX
  const socialProofContent = showSocialProof ? (
    <div className="flex items-center justify-center gap-2">
      <div className="flex -space-x-2">
        {[
          'bg-gradient-to-br from-pink-400 to-rose-500',
          'bg-gradient-to-br from-blue-400 to-indigo-500',
          'bg-gradient-to-br from-green-400 to-emerald-500',
          'bg-gradient-to-br from-amber-400 to-orange-500',
        ].map((gradient, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 ${gradient}`}
          />
        ))}
      </div>
      <p className="text-sm opacity-70" style={{ color: settings.subTextColor || settings.textColor }}>
        <span className="font-semibold">500+</span> people joined
      </p>
    </div>
  ) : null;

  // Form JSX - inlined to prevent re-creation on state change
  const formContent = (
    <>
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
        <form onSubmit={handleSubmit} className={cn(
          "max-w-md mx-auto",
          nameField ? "space-y-3" : "flex gap-2 items-center relative group"
        )}>
          <style dangerouslySetInnerHTML={{
            __html: `
              .custom-input::placeholder {
                color: ${settings.inputPlaceholderColor} !important;
                opacity: 1;
              }
              .custom-input::-webkit-input-placeholder {
                color: ${settings.inputPlaceholderColor} !important;
                opacity: 1;
              }
              .custom-input::-moz-placeholder {
                color: ${settings.inputPlaceholderColor} !important;
                opacity: 1;
              }
              .custom-input:-ms-input-placeholder {
                color: ${settings.inputPlaceholderColor} !important;
                opacity: 1;
              }
            `
          }} />
          {nameField && (
            <Input
              type="text"
              placeholder="Enter your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(
                "custom-input h-12 pl-4 transition-all backdrop-blur-sm shadow-sm border-0",
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
          <div className={cn("relative", !nameField && "flex-1")}>
            <Input
              type="email"
              id='email-input'
              placeholder={settings.inputPlaceholder}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "custom-input h-12 pl-4 transition-all backdrop-blur-sm shadow-sm border-0",
                !nameField && "pr-32",
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
                id='join-button'
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
            )}
          </div>
          {nameField && (
            <Button
              type="submit"
              id='join-button'
              disabled={loading}
              className={cn(
                "w-full h-12 transition-all hover:scale-105 active:scale-95",
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
        <a href="https://waitbridge.com/ref=badge" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black dark:bg-white text-[10px] font-medium text-white dark:invert font-sans">
          <span>Built using</span>
          <span className="font-bold flex gap-1"><Loader className="w-4 h-4" /> waitbridge</span>
        </a>
      </div>
    </>
  );

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div
        className={cn(
          "flex-1 w-full transition-all duration-500",
          fontInfo.class,
          bgProps.className
        )}
        style={{ 
          ...bgProps.style, 
          color: settings.textColor, 
          fontFamily: `'${fontInfo.family}', ${fontInfo.class.includes('serif') ? 'serif' : fontInfo.class.includes('mono') ? 'monospace' : 'sans-serif'}` 
        }}
      >
        {layoutType === 'simple' ? (
          // Simple centered layout
          <div className="min-h-screen flex flex-col justify-center items-center text-center p-8">
            <div className="w-full max-w-lg space-y-8 mx-auto">
              {settings.logo && (
                <div className="flex mb-8 justify-center">
                  <div 
                    className="rounded-full overflow-hidden shadow-sm flex items-center justify-center"
                    style={{ 
                      width: `${settings.logoSize || 64}px`, 
                      height: `${settings.logoSize || 64}px`,
                      padding: `${settings.logoPadding || 0}px`,
                      borderWidth: `${settings.logoBorderWidth ?? 2}px`,
                      borderStyle: 'solid',
                      borderColor: settings.logoBorderColor || '#000000',
                      backgroundColor: settings.logoBgColor || '#ffffff'
                    }}
                  >
                    <Image 
                      src={settings.logo} 
                      alt="Logo" 
                      className="w-full h-full object-cover" 
                      width={settings.logoSize || 64}
                      height={settings.logoSize || 64}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h1 className="text-5xl font-bold tracking-tight sm:text-6xl transition-colors duration-300 wrap-break-word" style={{ color: settings.textColor }}>
                  {settings.headerText}
                </h1>
                <p className="text-xl opacity-80 leading-relaxed max-w-lg transition-colors duration-300 wrap-break-word" style={{ color: settings.subTextColor || settings.textColor }}>
                  {settings.subText}
                </p>
              </div>

              {socialProofContent}

              <div className="mt-8">
                {formContent}
              </div>
            </div>
          </div>
        ) : (
          // Split layout
          <div className={cn(
            "min-h-screen grid grid-cols-1",
            textPosition === 'top' 
              ? "md:grid-cols-1 md:grid-rows-2" 
              : "md:grid-cols-2"
          )}>
            {/* Text Content Section */}
            <div className={cn(
              "flex flex-col justify-center items-center text-center p-8",
              "order-1",
              textPosition === 'right' && "md:order-2",
              textPosition === 'left' && "md:order-1",
              textPosition === 'top' && "md:order-1"
            )}>
              <div className="w-full max-w-lg space-y-6 mx-auto">
                {settings.logo && (
                  <div className="flex mb-6 justify-center">
                    <div 
                      className="rounded-full overflow-hidden shadow-sm flex items-center justify-center"
                      style={{ 
                        width: `${settings.logoSize || 64}px`, 
                        height: `${settings.logoSize || 64}px`,
                        padding: `${settings.logoPadding || 0}px`,
                        borderWidth: `${settings.logoBorderWidth ?? 2}px`,
                        borderStyle: 'solid',
                        borderColor: settings.logoBorderColor || '#000000',
                        backgroundColor: settings.logoBgColor || '#ffffff'
                      }}
                    >
                      <Image 
                        src={settings.logo} 
                        alt="Logo" 
                        className="w-full h-full object-cover" 
                        width={settings.logoSize || 64}
                        height={settings.logoSize || 64}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight md:text-5xl transition-colors duration-300 wrap-break-word" style={{ color: settings.textColor }}>
                    {settings.headerText}
                  </h1>
                  <p className="text-lg opacity-80 leading-relaxed transition-colors duration-300 wrap-break-word" style={{ color: settings.subTextColor || settings.textColor }}>
                    {settings.subText}
                  </p>
                </div>

                {socialProofContent}

                <div className="pt-4">
                  {formContent}
                </div>
              </div>
            </div>

            {/* Image/Content Area Section */}
            <div className={cn(
              "relative overflow-hidden min-h-[250px]",
              "order-2",
              textPosition === 'right' && "md:order-1",
              textPosition === 'left' && "md:order-2",
              textPosition === 'top' && "md:order-2"
            )}>
              {settings.heroImage ? (
                <Image 
                  src={settings.heroImage} 
                  alt="Hero image" 
                  className="absolute inset-0 w-full h-full object-cover"
                  width={1200}
                  height={800}
                />
              ) : (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                  <div className="text-center p-8">
                    <svg className="w-16 h-16 mx-auto mb-4 text-zinc-400 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Add Hero Image</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500">Recommended: 1200×800px</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

