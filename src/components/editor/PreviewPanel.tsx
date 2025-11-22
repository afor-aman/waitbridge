'use client'

import React from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";

import { useEditorStore } from '@/store/editorStore';

export function PreviewPanel() {
    const state = useEditorStore((state) => state);
    const [email, setEmail] = React.useState('');
    const [submitted, setSubmitted] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setEmail('');
            }, 3000);
        }, 1000);
    };

    const getBackgroundStyle = () => {
        if (state.bgType === 'gradient') {
            // Check if it's a custom CSS gradient
            if (state.bgGradient.startsWith('css:')) {
                const cssGradient = state.bgGradient.replace('css:', '');
                return { style: { backgroundImage: cssGradient } };
            }
            // Otherwise use Tailwind classes for preset gradients
            return { className: `bg-gradient-to-br ${state.bgGradient}` };
        }
        return { style: { backgroundColor: state.bgColor } };
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

    const fontInfo = getFontClass(state.font);

    // Dynamically load Google Fonts
    React.useEffect(() => {
        const fontFamily = fontInfo.family.replace(/ /g, '+');
        const linkId = `google-font-${state.font}`;
        
        // Check if font link already exists
        let link = document.getElementById(linkId) as HTMLLinkElement;
        
        if (!link) {
            link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@400;500;600;700&display=swap`;
            document.head.appendChild(link);
        }

        // Cleanup function to remove old font links
        return () => {
            const allFontLinks = document.querySelectorAll('[id^="google-font-"]');
            allFontLinks.forEach((oldLink) => {
                if (oldLink.id !== linkId) {
                    oldLink.remove();
                }
            });
        };
    }, [state.font, fontInfo.family]);

    const bgProps = getBackgroundStyle();

    return (
        <div className="relative w-full h-full rounded-xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all duration-500 ease-in-out flex flex-col">
            {/* Browser Bar Mockup */}
            <div className="shrink-0 h-8 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 gap-2 z-10">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
                <div className="ml-4 flex-1 max-w-sm h-5 bg-zinc-200 dark:bg-zinc-800 rounded-md opacity-50" />
            </div>

            {/* Content Area */}
            <div
                className={cn(
                    "flex-1 w-full flex flex-col justify-center items-center text-center p-8 transition-all duration-500 overflow-y-auto",
                    fontInfo.class,
                    bgProps.className
                )}
                style={{ ...bgProps.style, color: state.textColor, fontFamily: `'${fontInfo.family}', ${fontInfo.class.includes('serif') ? 'serif' : fontInfo.class.includes('mono') ? 'monospace' : 'sans-serif'}` }}
            >
                <div className="w-full max-w-lg space-y-8 mx-auto">
                    {state.logo && (
                        <div className="flex mb-8 justify-center">
                            <img src={state.logo} alt="Logo" className="h-16 w-auto object-contain drop-shadow-sm" />
                        </div>
                    )}

                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl transition-colors duration-300 wrap-break-word" style={{ color: state.textColor }}>
                            {state.headerText}
                        </h1>
                        <p className="text-xl opacity-80 leading-relaxed max-w-lg transition-colors duration-300 wrap-break-word" style={{ color: state.subTextColor || state.textColor }}>
                            {state.subText}
                        </p>
                    </div>

                    <div className="mt-12 h-16">
                        {submitted ? (
                            <div className={cn(
                                "p-4 bg-green-500/10 text-green-600 font-medium animate-in fade-in zoom-in duration-300 flex items-center gap-2 justify-center",
                                state.buttonStyle === 'rounded' && "rounded-md",
                                state.buttonStyle === 'pill' && "rounded-full",
                                state.buttonStyle === 'sharp' && "rounded-none",
                            )}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
                                {state.submissionMessage}
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md items-center m-auto relative group">
                                <style dangerouslySetInnerHTML={{
                                    __html: `
                                        .custom-email-input::placeholder {
                                            color: ${state.inputPlaceholderColor} !important;
                                            opacity: 1;
                                        }
                                        .custom-email-input::-webkit-input-placeholder {
                                            color: ${state.inputPlaceholderColor} !important;
                                            opacity: 1;
                                        }
                                        .custom-email-input::-moz-placeholder {
                                            color: ${state.inputPlaceholderColor} !important;
                                            opacity: 1;
                                        }
                                        .custom-email-input:-ms-input-placeholder {
                                            color: ${state.inputPlaceholderColor} !important;
                                            opacity: 1;
                                        }
                                    `
                                }} />
                                <Input
                                    type="email"
                                    placeholder={state.inputPlaceholder}
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={cn(
                                        "custom-email-input h-12 pl-4 pr-32 transition-all backdrop-blur-sm shadow-sm",
                                        state.buttonStyle === 'rounded' && "rounded-md",
                                        state.buttonStyle === 'pill' && "rounded-full",
                                        state.buttonStyle === 'sharp' && "rounded-none",
                                    )}
                                    style={{ 
                                        backgroundColor: state.inputColor,
                                        color: state.textColor === '#ffffff' ? '#fff' : '#000',
                                    }}
                                />
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className={cn(
                                        "absolute right-1.5 top-1.5 bottom-1.5 px-6 transition-all hover:scale-105 active:scale-95",
                                        state.buttonStyle === 'rounded' && "rounded-sm",
                                        state.buttonStyle === 'pill' && "rounded-full",
                                        state.buttonStyle === 'sharp' && "rounded-none",
                                    )}
                                    style={{ 
                                        backgroundColor: state.buttonColor,
                                        color: state.buttonTextColor,
                                    }}
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : state.buttonText}
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
