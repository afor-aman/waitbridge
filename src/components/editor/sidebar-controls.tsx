'use client'
import React, { useState } from 'react';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Type, Palette, LayoutTemplate, Square, Circle, MousePointerClick, ChevronDown, Home } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';

const FONT_FAMILIES = [
    { value: 'inter', label: 'Inter', class: 'font-sans' },
    { value: 'roboto', label: 'Roboto', class: 'font-sans' },
    { value: 'poppins', label: 'Poppins', class: 'font-sans' },
    { value: 'open-sans', label: 'Open Sans', class: 'font-sans' },
    { value: 'lato', label: 'Lato', class: 'font-sans' },
    { value: 'montserrat', label: 'Montserrat', class: 'font-sans' },
    { value: 'playfair', label: 'Playfair Display', class: 'font-serif' },
    { value: 'merriweather', label: 'Merriweather', class: 'font-serif' },
    { value: 'lora', label: 'Lora', class: 'font-serif' },
    { value: 'space-mono', label: 'Space Mono', class: 'font-mono' },
    { value: 'jetbrains-mono', label: 'JetBrains Mono', class: 'font-mono' },
    { value: 'fira-code', label: 'Fira Code', class: 'font-mono' },
];

const GRADIENTS = [
    { name: 'Sunset', value: 'from-orange-500 to-pink-600' },
    { name: 'Ocean', value: 'from-blue-400 to-emerald-400' },
    { name: 'Midnight', value: 'from-slate-900 to-slate-700' },
    { name: 'Purple Haze', value: 'from-purple-500 to-indigo-500' },
    { name: 'Forest', value: 'from-green-600 to-teal-500' },
    { name: 'Custom', value: 'custom' },
];

const getPatternStyle = (pattern: string, color: string, opacity: number) => {
    const hexToRgba = (hex: string, op: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${op})`;
    };
    const patternColor = hexToRgba(color, opacity);
    const encodedColor = encodeURIComponent(color);
    
    const patterns: Record<string, { image: string; size: string; position?: string }> = {
        dots: { image: `radial-gradient(${patternColor} 1px, transparent 1px)`, size: '20px 20px' },
        grid: { image: `linear-gradient(${patternColor} 1px, transparent 1px), linear-gradient(90deg, ${patternColor} 1px, transparent 1px)`, size: '20px 20px' },
        lines: { image: `repeating-linear-gradient(0deg, ${patternColor}, ${patternColor} 1px, transparent 1px, transparent 10px)`, size: '10px 10px' },
        diagonal: { image: `repeating-linear-gradient(45deg, ${patternColor}, ${patternColor} 1px, transparent 1px, transparent 10px)`, size: '10px 10px' },
        waves: { image: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='${encodedColor}' fill-opacity='${opacity}' fill-rule='evenodd'/%3E%3C/svg%3E")`, size: '100px 20px' },
        circles: { image: `radial-gradient(circle, ${patternColor} 1px, transparent 1px), radial-gradient(circle, ${patternColor} 1px, transparent 1px)`, size: '30px 30px, 30px 30px', position: '0 0, 15px 15px' },
        hexagons: { image: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0l43.3 25v50L50 100 6.7 75V25z' fill='none' stroke='${encodedColor}' stroke-width='1' stroke-opacity='${opacity}'/%3E%3C/svg%3E")`, size: '50px 50px' },
        crosses: { image: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodedColor}' fill-opacity='${opacity}'%3E%3Cpath d='M0 38h40v2H0zM0 0h40v2H0zM38 0v40h2V0zM0 0v40h2V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '40px 40px' },
        zigzag: { image: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10l10-10 10 10 10-10 10 10 10-10 10 10 10-10 10 10 10-10v10H0z' fill='${encodedColor}' fill-opacity='${opacity}'/%3E%3C/svg%3E")`, size: '100px 20px' },
        diamonds: { image: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodedColor}' fill-opacity='${opacity}'%3E%3Cpath d='M20 0l20 20-20 20L0 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '40px 40px' },
        stars: { image: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodedColor}' fill-opacity='${opacity}'%3E%3Cpath d='M20 0l4.9 15.1L40 20l-15.1 4.9L20 40l-4.9-15.1L0 20l15.1-4.9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '40px 40px' },
        plus: { image: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodedColor}' fill-opacity='${opacity}'%3E%3Cpath d='M18 0h4v18h18v4H22v18h-4V22H0v-4h18z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '40px 40px' },
        squares: { image: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodedColor}' fill-opacity='${opacity}'%3E%3Cpath d='M0 0h20v20H0zM20 20h20v20H20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '40px 40px' },
        triangles: { image: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodedColor}' fill-opacity='${opacity}'%3E%3Cpath d='M20 0l20 20H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '40px 40px' },
        crosshatch: { image: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='${encodedColor}' stroke-opacity='${opacity}' stroke-width='1'%3E%3Cpath d='M0 0l40 40M40 0L0 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '40px 40px' },
        bricks: { image: `url("data:image/svg+xml,%3Csvg width='100' height='40' viewBox='0 0 100 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodedColor}' fill-opacity='${opacity}'%3E%3Cpath d='M0 0h50v20H0zM50 20h50v20H50z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, size: '100px 40px' },
    };
    
    return patterns[pattern] || patterns.dots;
};

export function SidebarControls() {
    const state = useEditorStore((state) => state);
    const handleChange = useEditorStore((state) => state.updateState);
    const [openSection, setOpenSection] = useState<string>('content');
    const [isCustomGradient, setIsCustomGradient] = useState(false);
    const [customGradient, setCustomGradient] = useState({
        color1: '#3b82f6',
        color2: '#8b5cf6',
        color3: '#ec4899',
        direction: 'to-br',
        type: 'linear',
        angle: 135,
        pos1: 0,
        pos2: 50,
        pos3: 100,
        colorCount: 2
    });

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? '' : section);
    };

    const handleGradientSelect = (gradientValue: string) => {
        if (gradientValue === 'custom') {
            setIsCustomGradient(true);
            updateCustomGradient('colorCount', customGradient.colorCount);
        } else {
            setIsCustomGradient(false);
            handleChange('bgGradient', gradientValue);
        }
    };

    const updateCustomGradient = (key: string, value: any) => {
        const updated = { ...customGradient, [key]: value };
        setCustomGradient(updated);

        const { color1, color2, color3, type, angle, pos1, pos2, pos3, colorCount } = updated;

        let gradientCSS = '';

        if (type === 'radial') {
            if (colorCount === 2) {
                gradientCSS = `radial-gradient(circle at center, ${color1} ${pos1}%, ${color2} ${pos2}%)`;
            } else {
                gradientCSS = `radial-gradient(circle at center, ${color1} ${pos1}%, ${color2} ${pos2}%, ${color3} ${pos3}%)`;
            }
        } else {
            if (colorCount === 2) {
                gradientCSS = `linear-gradient(${angle}deg, ${color1} ${pos1}%, ${color2} ${pos2}%)`;
            } else {
                gradientCSS = `linear-gradient(${angle}deg, ${color1} ${pos1}%, ${color2} ${pos2}%, ${color3} ${pos3}%)`;
            }
        }

        handleChange('bgGradient', `css:${gradientCSS}`);
    };

    return (
        <SidebarGroup>
            <div className="space-y-4 px-2 mb-2">
                <button
                    className="flex items-center justify-between w-full px-2 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-all"
                >
                    <div className="flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        <Link href="/dashboard">Home</Link>
                    </div>
                </button>
            </div>
            <SidebarGroupLabel>Editor Controls</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex flex-col gap-4 p-2">
                            {/* Content Section */}
                            <div className="space-y-4">
                                <button
                                    onClick={() => toggleSection('content')}
                                    className="flex items-center justify-between w-full px-2 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-all"
                                >
                                    <div className="flex items-center gap-2">
                                        <Type className="w-4 h-4" />
                                        <span>Content</span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'content' ? 'rotate-180' : ''}`} />
                                </button>
                                {openSection === 'content' && (
                                    <div className="space-y-4 pl-2 border-l-2 border-border/50">
                                        <div className="grid w-full items-center gap-2">
                                            <Label htmlFor="headerText" className="text-xs">Header Text</Label>
                                            <Input
                                                id="headerText"
                                                value={state.headerText}
                                                onChange={(e) => handleChange('headerText', e.target.value)}
                                                className="h-8 text-xs"
                                            />
                                        </div>
                                        <div className="grid w-full items-center gap-2">
                                            <Label htmlFor="subText" className="text-xs">Subtext</Label>
                                            <Textarea
                                                id="subText"
                                                value={state.subText}
                                                onChange={(e) => handleChange('subText', e.target.value)}
                                                className="min-h-[100px] text-xs resize-none"
                                            />
                                        </div>
                                        <div className="grid w-full items-center gap-2">
                                            <Label htmlFor="buttonText" className="text-xs">Button Text</Label>
                                            <Input
                                                id="buttonText"
                                                value={state.buttonText}
                                                onChange={(e) => handleChange('buttonText', e.target.value)}
                                                className="h-8 text-xs"
                                            />
                                        </div>
                                        <div className="grid w-full items-center gap-2">
                                            <Label htmlFor="inputPlaceholder" className="text-xs">Placeholder</Label>
                                            <Input
                                                id="inputPlaceholder"
                                                value={state.inputPlaceholder}
                                                onChange={(e) => handleChange('inputPlaceholder', e.target.value)}
                                                className="h-8 text-xs"
                                            />
                                        </div>
                                        <div className="grid w-full items-center gap-2">
                                            <Label htmlFor="submissionMessage" className="text-xs">Success Message</Label>
                                            <Input
                                                id="submissionMessage"
                                                value={state.submissionMessage}
                                                onChange={(e) => handleChange('submissionMessage', e.target.value)}
                                                className="h-8 text-xs"
                                            />
                                        </div>

                                        <div className="pt-2 border-t border-border/50">
                                            <Label className="text-xs font-medium text-muted-foreground mb-2 block">Additional Fields</Label>
                                            <div className="flex items-center justify-between gap-2">
                                                <Label htmlFor="nameField" className="text-xs">Collect Name</Label>
                                                <Switch
                                                    id="nameField"
                                                    checked={state.nameField}
                                                    onCheckedChange={(checked) => handleChange('nameField', checked)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Typography & Layout Section */}
                            <div className="space-y-4">
                                <button
                                    onClick={() => toggleSection('typography')}
                                    className="flex items-center justify-between w-full px-2 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-all"
                                >
                                    <div className="flex items-center gap-2">
                                        <LayoutTemplate className="w-4 h-4" />
                                        <span>Layout & Type</span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'typography' ? 'rotate-180' : ''}`} />
                                </button>
                                {openSection === 'typography' && (
                                    <div className="space-y-4 pl-2 border-l-2 border-border/50">
                                        <div className="grid w-full items-center gap-2">
                                            <Label className="text-xs">Layout Type</Label>
                                            <div className="flex gap-2">
                                                {['simple', 'split'].map((type) => (
                                                    <button
                                                        key={type}
                                                        onClick={() => handleChange('layoutType', type)}
                                                        className={`flex-1 px-2 py-1.5 text-xs border rounded-md transition-all ${state.layoutType === type ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                                                    >
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {state.layoutType === 'split' && (
                                            <div className="grid w-full items-center gap-2">
                                                <Label className="text-xs">Text Position</Label>
                                                <div className="flex gap-2">
                                                    {['left', 'right', 'top'].map((position) => (
                                                        <button
                                                            key={position}
                                                            onClick={() => handleChange('textPosition', position)}
                                                            className={`flex-1 px-2 py-1.5 text-xs border rounded-md transition-all ${state.textPosition === position ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                                                        >
                                                            {position.charAt(0).toUpperCase() + position.slice(1)}
                                                        </button>
                                                    ))}
                                                </div>
                                                <p className="text-[10px] text-muted-foreground">On mobile, text always appears on top</p>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between gap-2">
                                            <Label htmlFor="showSocialProof" className="text-xs">Show Social Proof</Label>
                                            <Switch
                                                id="showSocialProof"
                                                checked={state.showSocialProof}
                                                onCheckedChange={(checked) => handleChange('showSocialProof', checked)}
                                            />
                                        </div>

                                        <div className="grid w-full items-center gap-2">
                                            <Label className="text-xs">Font Family</Label>
                                            <Select value={state.font} onValueChange={(value) => handleChange('font', value)}>
                                                <SelectTrigger className="w-full h-8 text-xs">
                                                    <SelectValue placeholder="Select a font" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {FONT_FAMILIES.map((font) => (
                                                        <SelectItem key={font.value} value={font.value}>
                                                            <span className={font.class}>{font.label}</span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Appearance Section */}
                            <div className="space-y-4">
                                <button
                                    onClick={() => toggleSection('appearance')}
                                    className="flex items-center justify-between w-full px-2 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-all"
                                >
                                    <div className="flex items-center gap-2">
                                        <Palette className="w-4 h-4" />
                                        <span>Appearance</span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'appearance' ? 'rotate-180' : ''}`} />
                                </button>
                                {openSection === 'appearance' && (
                                    <div className="space-y-4 pl-2 border-l-2 border-border/50">
                                        {/* Background Section */}
                                        <Label className="text-xs font-semibold text-muted-foreground block">Background</Label>
                                        
                                        <div className="grid w-full items-center gap-2">
                                            <Label className="text-xs">Type</Label>
                                            <Select value={state.bgType} onValueChange={(value) => handleChange('bgType', value)}>
                                                <SelectTrigger className="w-full h-8 text-xs">
                                                    <SelectValue placeholder="Select background type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="solid">Solid Color</SelectItem>
                                                    <SelectItem value="gradient">Gradient</SelectItem>
                                                    <SelectItem value="pattern">SVG Pattern</SelectItem>
                                                    <SelectItem value="image">Custom Image</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {state.bgType === 'solid' && (
                                            <div className="grid w-full items-center gap-2">
                                                <Label htmlFor="bgColor" className="text-xs">Background Color</Label>
                                                <div className="flex gap-2 items-center">
                                                    <div className="relative w-8 h-8 rounded-md overflow-hidden border border-border shadow-sm">
                                                        <Input
                                                            type="color"
                                                            id="bgColor"
                                                            value={state.bgColor}
                                                            className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                                            onChange={(e) => handleChange('bgColor', e.target.value)}
                                                        />
                                                    </div>
                                                    <Input
                                                        type="text"
                                                        value={state.bgColor}
                                                        onChange={(e) => handleChange('bgColor', e.target.value)}
                                                        className="flex-1 h-8 font-mono text-xs"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {state.bgType === 'gradient' && (
                                            <div className="grid w-full items-center gap-4">
                                                <div>
                                                    <Label className="text-xs">Gradient Preset</Label>
                                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                                        {GRADIENTS.map((gradient) => (
                                                            <button
                                                                key={gradient.name}
                                                                onClick={() => handleGradientSelect(gradient.value)}
                                                                className={`h-8 rounded-md ${gradient.value === 'custom' ? 'border-dashed flex items-center justify-center text-[10px]' : `bg-linear-to-r ${gradient.value}`} border transition-all ${(gradient.value === 'custom' && isCustomGradient) || state.bgGradient === gradient.value ? 'border-primary ring-1 ring-primary' : 'border-transparent'}`}
                                                                title={gradient.name}
                                                            >
                                                                {gradient.value === 'custom' && 'Custom'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {isCustomGradient && (
                                                    <div className="space-y-3 p-3 border border-border rounded-lg bg-muted/30">
                                                        <Label className="text-xs font-semibold">Custom Gradient</Label>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => updateCustomGradient('colorCount', 2)}
                                                                className={`flex-1 px-2 py-1 text-[10px] rounded-md transition-all ${customGradient.colorCount === 2 ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
                                                            >
                                                                2 Colors
                                                            </button>
                                                            <button
                                                                onClick={() => updateCustomGradient('colorCount', 3)}
                                                                className={`flex-1 px-2 py-1 text-[10px] rounded-md transition-all ${customGradient.colorCount === 3 ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
                                                            >
                                                                3 Colors
                                                            </button>
                                                        </div>

                                                        <div className="space-y-3 pt-2 border-t border-border/50">
                                                            <div>
                                                                <Label className="text-[10px] text-muted-foreground mb-1 block">Type</Label>
                                                                <div className="flex bg-background rounded-md border border-border p-0.5">
                                                                    <button
                                                                        onClick={() => updateCustomGradient('type', 'linear')}
                                                                        className={`flex-1 px-2 py-0.5 text-[10px] rounded-sm transition-all ${customGradient.type === 'linear' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                                                    >
                                                                        Linear
                                                                    </button>
                                                                    <button
                                                                        onClick={() => updateCustomGradient('type', 'radial')}
                                                                        className={`flex-1 px-2 py-0.5 text-[10px] rounded-sm transition-all ${customGradient.type === 'radial' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                                                    >
                                                                        Radial
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            
                                                            {customGradient.type === 'linear' && (
                                                                <div>
                                                                    <Label className="text-[10px] text-muted-foreground mb-1 block">Angle: {customGradient.angle}°</Label>
                                                                    <input
                                                                        type="range"
                                                                        min="0"
                                                                        max="360"
                                                                        value={customGradient.angle}
                                                                        onChange={(e) => updateCustomGradient('angle', parseInt(e.target.value))}
                                                                        className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="space-y-2 pt-2 border-t border-border/50">
                                                            <Label className="text-[10px] text-muted-foreground">Colors & Positions</Label>
                                                            <div className="space-y-2">
                                                                {[
                                                                    { color: customGradient.color1, pos: customGradient.pos1, key: 'color1', posKey: 'pos1', label: 'Color 1' },
                                                                    { color: customGradient.color2, pos: customGradient.pos2, key: 'color2', posKey: 'pos2', label: 'Color 2' },
                                                                    ...(customGradient.colorCount === 3 ? [{ color: customGradient.color3, pos: customGradient.pos3, key: 'color3', posKey: 'pos3', label: 'Color 3' }] : [])
                                                                ].map((item, idx) => (
                                                                    <div key={idx} className="flex items-center gap-2">
                                                                        <div className="relative w-6 h-6 rounded overflow-hidden border border-border shrink-0">
                                                                            <Input
                                                                                type="color"
                                                                                value={item.color}
                                                                                onChange={(e) => updateCustomGradient(item.key, e.target.value)}
                                                                                className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                                                            />
                                                                        </div>
                                                                        <div className="flex-1 flex flex-col gap-0.5">
                                                                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                                                                <span>{item.label}</span>
                                                                                <span>{item.pos}%</span>
                                                                            </div>
                                                                            <input
                                                                                type="range"
                                                                                min="0"
                                                                                max="100"
                                                                                value={item.pos}
                                                                                onChange={(e) => updateCustomGradient(item.posKey, parseInt(e.target.value))}
                                                                                className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {state.bgType === 'pattern' && (
                                            <div className="space-y-4 p-3 border border-border rounded-lg bg-muted/30">
                                                <Label className="text-xs font-semibold block">Pattern Settings</Label>
                                                <div>
                                                    <Label className="text-xs mb-2 block text-muted-foreground">Select Pattern</Label>
                                                    <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                                                        {[
                                                            { name: 'Dots', value: 'dots' },
                                                            { name: 'Grid', value: 'grid' },
                                                            { name: 'Lines', value: 'lines' },
                                                            { name: 'Diagonal', value: 'diagonal' },
                                                            { name: 'Waves', value: 'waves' },
                                                            { name: 'Circles', value: 'circles' },
                                                            { name: 'Hexagons', value: 'hexagons' },
                                                            { name: 'Crosses', value: 'crosses' },
                                                            { name: 'Zigzag', value: 'zigzag' },
                                                            { name: 'Diamonds', value: 'diamonds' },
                                                            { name: 'Stars', value: 'stars' },
                                                            { name: 'Plus', value: 'plus' },
                                                            { name: 'Squares', value: 'squares' },
                                                            { name: 'Triangles', value: 'triangles' },
                                                            { name: 'Crosshatch', value: 'crosshatch' },
                                                            { name: 'Bricks', value: 'bricks' },
                                                        ].map((pattern) => {
                                                            const patternStyle = getPatternStyle(pattern.value, state.bgPatternColor, state.bgPatternOpacity);
                                                            return (
                                                                <button
                                                                    key={pattern.value}
                                                                    onClick={() => handleChange('bgPattern', pattern.value)}
                                                                    className={`h-16 rounded-md border transition-all relative overflow-hidden ${state.bgPattern === pattern.value ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/50'}`}
                                                                    style={{ backgroundColor: state.bgColor }}
                                                                >
                                                                    <div 
                                                                        className="absolute inset-0"
                                                                        style={{
                                                                            backgroundImage: patternStyle.image,
                                                                            backgroundSize: patternStyle.size,
                                                                            backgroundPosition: patternStyle.position || '0 0',
                                                                        }}
                                                                    />
                                                                    <span className="relative text-[10px] font-medium" style={{ color: state.textColor }}>{pattern.name}</span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <div className="grid w-full items-center gap-2">
                                                    <Label htmlFor="bgColor" className="text-xs">Background Color</Label>
                                                    <div className="flex gap-2 items-center">
                                                        <div className="relative w-8 h-8 rounded-md overflow-hidden border border-border shadow-sm">
                                                            <Input
                                                                type="color"
                                                                value={state.bgColor}
                                                                className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                                                onChange={(e) => handleChange('bgColor', e.target.value)}
                                                            />
                                                        </div>
                                                        <Input
                                                            type="text"
                                                            value={state.bgColor}
                                                            onChange={(e) => handleChange('bgColor', e.target.value)}
                                                            className="flex-1 h-8 font-mono text-xs"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid w-full items-center gap-2">
                                                    <Label htmlFor="bgPatternColor" className="text-xs">Pattern Color</Label>
                                                    <div className="flex gap-2 items-center">
                                                        <div className="relative w-8 h-8 rounded-md overflow-hidden border border-border shadow-sm">
                                                            <Input
                                                                type="color"
                                                                value={state.bgPatternColor}
                                                                className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                                                onChange={(e) => handleChange('bgPatternColor', e.target.value)}
                                                            />
                                                        </div>
                                                        <Input
                                                            type="text"
                                                            value={state.bgPatternColor}
                                                            onChange={(e) => handleChange('bgPatternColor', e.target.value)}
                                                            className="flex-1 h-8 font-mono text-xs"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid w-full items-center gap-2">
                                                    <Label className="text-xs">Pattern Opacity: {Math.round(state.bgPatternOpacity * 100)}%</Label>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="1"
                                                        step="0.05"
                                                        value={state.bgPatternOpacity}
                                                        onChange={(e) => handleChange('bgPatternOpacity', parseFloat(e.target.value))}
                                                        className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {state.bgType === 'image' && (
                                            <div className="space-y-4 p-3 border border-border rounded-lg bg-muted/30">
                                                <Label className="text-xs font-semibold block">Image Settings</Label>
                                                <div className="grid w-full items-center gap-2">
                                                    <Label htmlFor="bgImage" className="text-xs text-muted-foreground">Image URL</Label>
                                                    <Input
                                                        id="bgImage"
                                                        type="text"
                                                        placeholder="https://example.com/image.jpg"
                                                        value={state.bgImage || ''}
                                                        onChange={(e) => handleChange('bgImage', e.target.value || null)}
                                                        className="h-8 text-xs"
                                                    />
                                                </div>
                                                {state.bgImage && (
                                                    <div className="rounded-md overflow-hidden border border-border">
                                                        <img 
                                                            src={state.bgImage} 
                                                            alt="Background preview" 
                                                            className="w-full h-24 object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <p className="text-[10px] text-muted-foreground">
                                                    Enter a URL to an image. For best results, use a high-resolution image.
                                                </p>
                                            </div>
                                        )}

                                        {/* Separator for Colors Section */}
                                        <div className="pt-2 mt-2 border-t border-border">
                                            <Label className="text-xs font-semibold text-muted-foreground mb-3 block">Colors</Label>
                                        </div>

                                        <div className="grid w-full items-center gap-2">
                                            <Label htmlFor="textColor" className="text-xs">Header Text Color</Label>
                                            <div className="flex gap-2 items-center">
                                                <div className="relative w-8 h-8 rounded-md overflow-hidden border border-border shadow-sm">
                                                    <Input
                                                        type="color"
                                                        id="textColor"
                                                        value={state.textColor}
                                                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                                        onChange={(e) => handleChange('textColor', e.target.value)}
                                                    />
                                                </div>
                                                <Input
                                                    type="text"
                                                    value={state.textColor}
                                                    onChange={(e) => handleChange('textColor', e.target.value)}
                                                    className="flex-1 h-8 font-mono text-xs"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid w-full items-center gap-2">
                                            <Label htmlFor="subTextColor" className="text-xs">Subtext Color</Label>
                                            <div className="flex gap-2 items-center">
                                                <div className="relative w-8 h-8 rounded-md overflow-hidden border border-border shadow-sm">
                                                    <Input
                                                        type="color"
                                                        id="subTextColor"
                                                        value={state.subTextColor}
                                                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                                        onChange={(e) => handleChange('subTextColor', e.target.value)}
                                                    />
                                                </div>
                                                <Input
                                                    type="text"
                                                    value={state.subTextColor}
                                                    onChange={(e) => handleChange('subTextColor', e.target.value)}
                                                    className="flex-1 h-8 font-mono text-xs"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid w-full items-center gap-2">
                                            <Label htmlFor="buttonColor" className="text-xs">Button Color</Label>
                                            <div className="flex gap-2 items-center">
                                                <div className="relative w-8 h-8 rounded-md overflow-hidden border border-border shadow-sm">
                                                    <Input
                                                        type="color"
                                                        id="buttonColor"
                                                        value={state.buttonColor}
                                                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                                        onChange={(e) => handleChange('buttonColor', e.target.value)}
                                                    />
                                                </div>
                                                <Input
                                                    type="text"
                                                    value={state.buttonColor}
                                                    onChange={(e) => handleChange('buttonColor', e.target.value)}
                                                    className="flex-1 h-8 font-mono text-xs"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid w-full items-center gap-2">
                                            <Label htmlFor="buttonTextColor" className="text-xs">Button Text Color</Label>
                                            <div className="flex gap-2 items-center">
                                                <div className="relative w-8 h-8 rounded-md overflow-hidden border border-border shadow-sm">
                                                    <Input
                                                        type="color"
                                                        id="buttonTextColor"
                                                        value={state.buttonTextColor}
                                                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                                        onChange={(e) => handleChange('buttonTextColor', e.target.value)}
                                                    />
                                                </div>
                                                <Input
                                                    type="text"
                                                    value={state.buttonTextColor}
                                                    onChange={(e) => handleChange('buttonTextColor', e.target.value)}
                                                    className="flex-1 h-8 font-mono text-xs"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid w-full items-center gap-2">
                                            <Label htmlFor="inputColor" className="text-xs">Input Background</Label>
                                            <div className="flex gap-2 items-center">
                                                <div className="relative w-8 h-8 rounded-md overflow-hidden border border-border shadow-sm">
                                                    <Input
                                                        type="color"
                                                        id="inputColor"
                                                        value={state.inputColor}
                                                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                                        onChange={(e) => handleChange('inputColor', e.target.value)}
                                                    />
                                                </div>
                                                <Input
                                                    type="text"
                                                    value={state.inputColor}
                                                    onChange={(e) => handleChange('inputColor', e.target.value)}
                                                    className="flex-1 h-8 font-mono text-xs"
                                                />
                                            </div>
                                        </div>

                                        {/* Separator for Style Section */}
                                        <div className="pt-2 mt-2 border-t border-border">
                                            <Label className="text-xs font-semibold text-muted-foreground mb-3 block">Style</Label>
                                        </div>

                                        <div className="grid w-full items-center gap-2">
                                            <Label className="text-xs">Button Style</Label>
                                            <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
                                                {[
                                                    { value: 'rounded', icon: Square, label: 'Rounded' },
                                                    { value: 'pill', icon: Circle, label: 'Pill' },
                                                    { value: 'sharp', icon: MousePointerClick, label: 'Sharp' },
                                                ].map(({ value, icon: Icon }) => (
                                                    <button
                                                        key={value}
                                                        onClick={() => handleChange('buttonStyle', value)}
                                                        className={`flex-1 flex items-center justify-center py-1.5 rounded-md transition-all ${state.buttonStyle === value ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                        title={value}
                                                    >
                                                        <Icon className="w-4 h-4" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
