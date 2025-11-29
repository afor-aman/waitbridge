'use client'

import React from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader, Loader2 } from 'lucide-react';
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
        if (state.bgType === 'pattern') {
            // Convert hex color to rgba with opacity
            const hexToRgba = (hex: string, opacity: number) => {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${opacity})`;
            };
            const patternColor = hexToRgba(state.bgPatternColor, state.bgPatternOpacity);
            const encodedColor = encodeURIComponent(state.bgPatternColor);
            
            const patterns: Record<string, { image: string; size: string; position?: string }> = {
                dots: { image: `radial-gradient(${patternColor} 1px, transparent 1px)`, size: '20px 20px' },
                grid: { image: `linear-gradient(${patternColor} 1px, transparent 1px), linear-gradient(90deg, ${patternColor} 1px, transparent 1px)`, size: '20px 20px' },
                lines: { image: `repeating-linear-gradient(0deg, ${patternColor}, ${patternColor} 1px, transparent 1px, transparent 10px)`, size: '10px 10px' },
                diagonal: { image: `repeating-linear-gradient(45deg, ${patternColor}, ${patternColor} 1px, transparent 1px, transparent 10px)`, size: '10px 10px' },
                waves: { image: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='${encodedColor}' fill-opacity='${state.bgPatternOpacity}' fill-rule='evenodd'/%3E%3C/svg%3E")`, size: '100px 20px' },
                circles: { image: `radial-gradient(circle, ${patternColor} 1px, transparent 1px), radial-gradient(circle, ${patternColor} 1px, transparent 1px)`, size: '30px 30px, 30px 30px', position: '0 0, 15px 15px' },
                hexagons: { image: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0l43.3 25v50L50 100 6.7 75V25z' fill='none' stroke='${encodedColor}' stroke-width='1' stroke-opacity='${state.bgPatternOpacity}'/%3E%3C/svg%3E")`, size: '50px 50px' },
                crosses: { image: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodedColor}' fill-opacity='${state.bgPatternOpacity}'%3E%3Cpath d='M0 38h40v2H0zM0 0h40v2H0zM38 0v40h2V0zM0 0v40h2V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '40px 40px' },
                zigzag: { image: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10l10-10 10 10 10-10 10 10 10-10 10 10 10-10 10 10 10-10v10H0z' fill='${encodedColor}' fill-opacity='${state.bgPatternOpacity}'/%3E%3C/svg%3E")`, size: '100px 20px' },
                diamonds: { image: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodedColor}' fill-opacity='${state.bgPatternOpacity}'%3E%3Cpath d='M20 0l20 20-20 20L0 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '40px 40px' },
                stars: { image: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodedColor}' fill-opacity='${state.bgPatternOpacity}'%3E%3Cpath d='M20 0l4.9 15.1L40 20l-15.1 4.9L20 40l-4.9-15.1L0 20l15.1-4.9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '40px 40px' },
                plus: { image: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodedColor}' fill-opacity='${state.bgPatternOpacity}'%3E%3Cpath d='M18 0h4v18h18v4H22v18h-4V22H0v-4h18z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '40px 40px' },
                squares: { image: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodedColor}' fill-opacity='${state.bgPatternOpacity}'%3E%3Cpath d='M0 0h20v20H0zM20 20h20v20H20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '40px 40px' },
                triangles: { image: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodedColor}' fill-opacity='${state.bgPatternOpacity}'%3E%3Cpath d='M20 0l20 20H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '40px 40px' },
                crosshatch: { image: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='${encodedColor}' stroke-opacity='${state.bgPatternOpacity}' stroke-width='1'%3E%3Cpath d='M0 0l40 40M40 0L0 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '40px 40px' },
                bricks: { image: `url("data:image/svg+xml,%3Csvg width='100' height='40' viewBox='0 0 100 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodedColor}' fill-opacity='${state.bgPatternOpacity}'%3E%3Cpath d='M0 0h50v20H0zM50 20h50v20H50z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '100px 40px' },
            };
            
            const pattern = patterns[state.bgPattern] || patterns.dots;
            return { 
                style: { 
                    backgroundColor: state.bgColor,
                    backgroundImage: pattern.image,
                    backgroundSize: pattern.size,
                    backgroundPosition: pattern.position || '0 0',
                }
            };
        }
        if (state.bgType === 'image' && state.bgImage) {
            return { 
                style: { 
                    backgroundImage: `url(${state.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }
            };
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
                    "flex-1 w-full transition-all duration-500 overflow-y-auto",
                    fontInfo.class,
                    bgProps.className
                )}
                style={{ ...bgProps.style, color: state.textColor, fontFamily: `'${fontInfo.family}', ${fontInfo.class.includes('serif') ? 'serif' : fontInfo.class.includes('mono') ? 'monospace' : 'sans-serif'}` }}
            >
                {state.layoutType === 'simple' ? (
                    // Simple centered layout
                    <div className="flex flex-col justify-center items-center text-center p-8 min-h-full">
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

                            {state.showSocialProof && (
                                <div className="flex items-center justify-center gap-2 mt-6">
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
                                    <p className="text-sm opacity-70" style={{ color: state.subTextColor || state.textColor }}>
                                        <span className="font-semibold">500+</span> people joined
                                    </p>
                                </div>
                            )}

                            <div className="mt-8">
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
                                    <form onSubmit={handleSubmit} className={cn(
                                        "max-w-md m-auto",
                                        state.nameField ? "space-y-3" : "flex gap-2 items-center relative group"
                                    )}>
                                        <style dangerouslySetInnerHTML={{
                                            __html: `
                                                .custom-input::placeholder {
                                                    color: ${state.inputPlaceholderColor} !important;
                                                    opacity: 1;
                                                }
                                                .custom-input::-webkit-input-placeholder {
                                                    color: ${state.inputPlaceholderColor} !important;
                                                    opacity: 1;
                                                }
                                                .custom-input::-moz-placeholder {
                                                    color: ${state.inputPlaceholderColor} !important;
                                                    opacity: 1;
                                                }
                                                .custom-input:-ms-input-placeholder {
                                                    color: ${state.inputPlaceholderColor} !important;
                                                    opacity: 1;
                                                }
                                            `
                                        }} />
                                        {state.nameField && (
                                            <Input
                                                type="text"
                                                placeholder="Enter your name"
                                                className={cn(
                                                    "custom-input h-12 pl-4 transition-all backdrop-blur-sm shadow-sm",
                                                    state.buttonStyle === 'rounded' && "rounded-md",
                                                    state.buttonStyle === 'pill' && "rounded-full",
                                                    state.buttonStyle === 'sharp' && "rounded-none",
                                                )}
                                                style={{ 
                                                    backgroundColor: state.inputColor,
                                                    color: state.textColor === '#ffffff' ? '#fff' : '#000',
                                                }}
                                            />
                                        )}
                                        <div className={cn("relative", !state.nameField && "flex-1")}>
                                            <Input
                                                type="email"
                                                placeholder={state.inputPlaceholder}
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className={cn(
                                                    "custom-input h-12 pl-4 transition-all backdrop-blur-sm shadow-sm",
                                                    !state.nameField && "pr-32",
                                                    state.buttonStyle === 'rounded' && "rounded-md",
                                                    state.buttonStyle === 'pill' && "rounded-full",
                                                    state.buttonStyle === 'sharp' && "rounded-none",
                                                )}
                                                style={{ 
                                                    backgroundColor: state.inputColor,
                                                    color: state.textColor === '#ffffff' ? '#fff' : '#000',
                                                }}
                                            />
                                            {!state.nameField && (
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
                                            )}
                                        </div>
                                        {state.nameField && (
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className={cn(
                                                    "w-full h-12 transition-all hover:scale-105 active:scale-95",
                                                    state.buttonStyle === 'rounded' && "rounded-md",
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
                                        )}
                                    </form>
                                )}
                                <div className="mt-4 flex justify-center">
                                    <a href="https://waitbridge.com/ref=badge" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black dark:bg-white text-[10px] font-medium text-white dark:invert font-sans">
                                        <span>Built using</span>
                                        <span className="font-bold flex gap-1"><Loader className="w-4 h-4" /> waitbridge</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Split layout with container queries for proper responsive behavior
                    <div className="h-full @container">
                        <div className={cn(
                            "h-full grid grid-cols-1",
                            // Wide container: side by side or stacked based on textPosition
                            state.textPosition === 'top' 
                                ? "@[600px]:grid-cols-1 @[600px]:grid-rows-2" 
                                : "@[600px]:grid-cols-2"
                        )}>
                            {/* Text Content Section */}
                            <div className={cn(
                                "flex flex-col justify-center items-center text-center p-8",
                                // Narrow container: text is always first (top)
                                "order-1",
                                // Wide container: order based on position
                                state.textPosition === 'right' && "@[600px]:order-2",
                                state.textPosition === 'left' && "@[600px]:order-1",
                                state.textPosition === 'top' && "@[600px]:order-1"
                            )}>
                            <div className="w-full max-w-lg space-y-6 mx-auto">
                                {state.logo && (
                                    <div className="flex mb-6 justify-center">
                                        <img src={state.logo} alt="Logo" className="h-12 w-auto object-contain drop-shadow-sm" />
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <h1 className="text-4xl font-bold tracking-tight @[600px]:text-5xl transition-colors duration-300 wrap-break-word" style={{ color: state.textColor }}>
                                        {state.headerText}
                                    </h1>
                                    <p className="text-lg opacity-80 leading-relaxed transition-colors duration-300 wrap-break-word" style={{ color: state.subTextColor || state.textColor }}>
                                        {state.subText}
                                    </p>
                                </div>

                                {state.showSocialProof && (
                                    <div className="flex items-center justify-center gap-2 mt-4">
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
                                        <p className="text-sm opacity-70" style={{ color: state.subTextColor || state.textColor }}>
                                            <span className="font-semibold">500+</span> people joined
                                        </p>
                                    </div>
                                )}

                                <div className="pt-4">
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
                                        <form onSubmit={handleSubmit} className={cn(
                                            "max-w-md mx-auto",
                                            state.nameField ? "space-y-3" : "flex gap-2 items-center relative group"
                                        )}>
                                            <style dangerouslySetInnerHTML={{
                                                __html: `
                                                    .custom-input::placeholder {
                                                        color: ${state.inputPlaceholderColor} !important;
                                                        opacity: 1;
                                                    }
                                                    .custom-input::-webkit-input-placeholder {
                                                        color: ${state.inputPlaceholderColor} !important;
                                                        opacity: 1;
                                                    }
                                                    .custom-input::-moz-placeholder {
                                                        color: ${state.inputPlaceholderColor} !important;
                                                        opacity: 1;
                                                    }
                                                    .custom-input:-ms-input-placeholder {
                                                        color: ${state.inputPlaceholderColor} !important;
                                                        opacity: 1;
                                                    }
                                                `
                                            }} />
                                            {state.nameField && (
                                                <Input
                                                    type="text"
                                                    placeholder="Enter your name"
                                                    className={cn(
                                                        "custom-input h-12 pl-4 transition-all backdrop-blur-sm shadow-sm",
                                                        state.buttonStyle === 'rounded' && "rounded-md",
                                                        state.buttonStyle === 'pill' && "rounded-full",
                                                        state.buttonStyle === 'sharp' && "rounded-none",
                                                    )}
                                                    style={{ 
                                                        backgroundColor: state.inputColor,
                                                        color: state.textColor === '#ffffff' ? '#fff' : '#000',
                                                    }}
                                                />
                                            )}
                                            <div className={cn("relative", !state.nameField && "flex-1")}>
                                                <Input
                                                    type="email"
                                                    placeholder={state.inputPlaceholder}
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className={cn(
                                                        "custom-input h-12 pl-4 transition-all backdrop-blur-sm shadow-sm",
                                                        !state.nameField && "pr-32",
                                                        state.buttonStyle === 'rounded' && "rounded-md",
                                                        state.buttonStyle === 'pill' && "rounded-full",
                                                        state.buttonStyle === 'sharp' && "rounded-none",
                                                    )}
                                                    style={{ 
                                                        backgroundColor: state.inputColor,
                                                        color: state.textColor === '#ffffff' ? '#fff' : '#000',
                                                    }}
                                                />
                                                {!state.nameField && (
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
                                                )}
                                            </div>
                                            {state.nameField && (
                                                <Button
                                                    type="submit"
                                                    disabled={loading}
                                                    className={cn(
                                                        "w-full h-12 transition-all hover:scale-105 active:scale-95",
                                                        state.buttonStyle === 'rounded' && "rounded-md",
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
                                            )}
                                        </form>
                                    )}
                                    <div className="mt-4 flex justify-center">
                            <a href="https://waitbridge.com/ref=badge" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black dark:bg-white text-[10px] font-medium text-white dark:invert font-sans">
                                <span>Built using</span>
                                <span className="font-bold flex gap-1"><Loader className="w-4 h-4" /> waitbridge</span>
                            </a>
                        </div>
                    </div>
                            </div>
                            </div>

                        {/* Image/Content Area Section */}
                                    <div className={cn(
                                "relative overflow-hidden",
                                // Narrow container: image is always second (bottom)
                                "order-2 min-h-[250px]",
                                // Wide container: order based on position
                                state.textPosition === 'right' && "@[600px]:order-1",
                                state.textPosition === 'left' && "@[600px]:order-2",
                                state.textPosition === 'top' && "@[600px]:order-2"
                            )}>
                                <img 
                                    src="/building.png" 
                                    alt="Product preview" 
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
