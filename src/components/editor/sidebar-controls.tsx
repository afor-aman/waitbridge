'use client'
import React, { useState } from 'react';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
                                        <div className="grid w-full items-center gap-2">
                                            <Label className="text-xs">Background Type</Label>
                                            <div className="flex gap-2">
                                                {['solid', 'gradient'].map((type) => (
                                                    <button
                                                        key={type}
                                                        onClick={() => handleChange('bgType', type)}
                                                        className={`flex-1 px-2 py-1.5 text-xs border rounded-md transition-all ${state.bgType === type ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                                                    >
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {state.bgType === 'solid' ? (
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
                                        ) : (
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

                                        <div className="grid w-full items-center gap-2">
                                            <Label htmlFor="textColor" className="text-xs">Text Color</Label>
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
