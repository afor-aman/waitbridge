'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import type { EditorState } from '@/store/editorStore';

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
              bgImage: null,
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
        body: JSON.stringify({ 
          email,
          name: settings?.nameField ? name : undefined,
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
      
      // Convert hex color to rgba with opacity
      const hexToRgba = (hex: string, opacity: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      };
      const patternColor = hexToRgba(bgPatternColor, bgPatternOpacity);
      const encodedColor = encodeURIComponent(bgPatternColor);
      
      const patterns: Record<string, { image: string; size: string; position?: string }> = {
        dots: { image: `radial-gradient(${patternColor} 1px, transparent 1px)`, size: '20px 20px' },
        grid: { image: `linear-gradient(${patternColor} 1px, transparent 1px), linear-gradient(90deg, ${patternColor} 1px, transparent 1px)`, size: '20px 20px' },
        lines: { image: `repeating-linear-gradient(0deg, ${patternColor}, ${patternColor} 1px, transparent 1px, transparent 10px)`, size: '10px 10px' },
        diagonal: { image: `repeating-linear-gradient(45deg, ${patternColor}, ${patternColor} 1px, transparent 1px, transparent 10px)`, size: '10px 10px' },
        waves: { image: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='${encodedColor}' fill-opacity='${bgPatternOpacity}' fill-rule='evenodd'/%3E%3C/svg%3E")`, size: '100px 20px' },
        circles: { image: `radial-gradient(circle, ${patternColor} 1px, transparent 1px), radial-gradient(circle, ${patternColor} 1px, transparent 1px)`, size: '30px 30px, 30px 30px', position: '0 0, 15px 15px' },
        hexagons: { image: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0l43.3 25v50L50 100 6.7 75V25z' fill='none' stroke='${encodedColor}' stroke-width='1' stroke-opacity='${bgPatternOpacity}'/%3E%3C/svg%3E")`, size: '50px 50px' },
        crosses: { image: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodedColor}' fill-opacity='${bgPatternOpacity}'%3E%3Cpath d='M0 38h40v2H0zM0 0h40v2H0zM38 0v40h2V0zM0 0v40h2V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '40px 40px' },
        zigzag: { image: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10l10-10 10 10 10-10 10 10 10-10 10 10 10-10 10 10 10-10v10H0z' fill='${encodedColor}' fill-opacity='${bgPatternOpacity}'/%3E%3C/svg%3E")`, size: '100px 20px' },
        diamonds: { image: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodedColor}' fill-opacity='${bgPatternOpacity}'%3E%3Cpath d='M20 0l20 20-20 20L0 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '40px 40px' },
        stars: { image: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodedColor}' fill-opacity='${bgPatternOpacity}'%3E%3Cpath d='M20 0l4.9 15.1L40 20l-15.1 4.9L20 40l-4.9-15.1L0 20l15.1-4.9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '40px 40px' },
        plus: { image: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodedColor}' fill-opacity='${bgPatternOpacity}'%3E%3Cpath d='M18 0h4v18h18v4H22v18h-4V22H0v-4h18z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '40px 40px' },
        squares: { image: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodedColor}' fill-opacity='${bgPatternOpacity}'%3E%3Cpath d='M0 0h20v20H0zM20 20h20v20H20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '40px 40px' },
        triangles: { image: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodedColor}' fill-opacity='${bgPatternOpacity}'%3E%3Cpath d='M20 0l20 20H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '40px 40px' },
        crosshatch: { image: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='${encodedColor}' stroke-opacity='${bgPatternOpacity}' stroke-width='1'%3E%3Cpath d='M0 0l40 40M40 0L0 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '40px 40px' },
        bricks: { image: `url("data:image/svg+xml,%3Csvg width='100' height='40' viewBox='0 0 100 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodedColor}' fill-opacity='${bgPatternOpacity}'%3E%3Cpath d='M0 0h50v20H0zM50 20h50v20H50z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '100px 40px' },
      };
      
      const pattern = patterns[bgPattern] || patterns.dots;
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

  // Social proof component
  const SocialProof = () => showSocialProof ? (
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

  // Form component
  const EmailForm = () => (
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
                "custom-input h-12 pl-4 transition-all backdrop-blur-sm shadow-sm",
                settings.buttonStyle === 'rounded' && "rounded-md",
                settings.buttonStyle === 'pill' && "rounded-full",
                settings.buttonStyle === 'sharp' && "rounded-none",
              )}
              style={{ 
                backgroundColor: settings.inputColor,
                color: settings.textColor === '#ffffff' ? '#fff' : '#000',
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
                "custom-input h-12 pl-4 transition-all backdrop-blur-sm shadow-sm",
                !nameField && "pr-32",
                settings.buttonStyle === 'rounded' && "rounded-md",
                settings.buttonStyle === 'pill' && "rounded-full",
                settings.buttonStyle === 'sharp' && "rounded-none",
              )}
              style={{ 
                backgroundColor: settings.inputColor,
                color: settings.textColor === '#ffffff' ? '#fff' : '#000',
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
                  <img src={settings.logo} alt="Logo" className="h-16 w-auto object-contain drop-shadow-sm" />
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

              <SocialProof />

              <div className="mt-8">
                <EmailForm />
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
                    <img src={settings.logo} alt="Logo" className="h-12 w-auto object-contain drop-shadow-sm" />
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

                <SocialProof />

                <div className="pt-4">
                  <EmailForm />
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
              <img 
                src="/building.png" 
                alt="Product preview" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

