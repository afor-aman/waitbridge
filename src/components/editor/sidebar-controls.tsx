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
import { getPatternStyle } from '@/lib/patterns';
import { ImageUpload } from '@/components/ui/image-upload';

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
                                        {/* Logo Section */}
                                        <div className="space-y-3 p-3 border border-border rounded-lg bg-muted/30">
                                            <Label className="text-xs font-semibold block">Logo</Label>
                                            
                                            {/* Upload Option */}
                                            <div className="space-y-2">
                                                <Label className="text-xs text-muted-foreground">Upload Logo</Label>
                                                <ImageUpload
                                                    value={state.logo}
                                                    onChange={(url) => handleChange('logo', url)}
                                                />
                                            </div>

                                            {/* Divider */}
                                            <div className="flex items-center gap-2 py-1">
                                                <div className="flex-1 h-px bg-border"></div>
                                                <span className="text-[10px] text-muted-foreground">OR</span>
                                                <div className="flex-1 h-px bg-border"></div>
                                            </div>

                                            {/* URL Option */}
                                            <div className="grid w-full items-center gap-2">
                                                <Label htmlFor="logo" className="text-xs text-muted-foreground">Logo URL</Label>
                                                <Input
                                                    id="logo"
                                                    type="text"
                                                    placeholder="https://example.com/logo.png"
                                                    value={state.logo || ''}
                                                    onChange={(e) => handleChange('logo', e.target.value || null)}
                                                    className="h-8 text-xs"
                                                />
                                            </div>
                                            
                                            <p className="text-[10px] text-muted-foreground">
                                                Upload a logo or enter a URL. The logo will appear at the top of your waitlist.
                                            </p>

                                            {/* Logo Settings */}
                                            {state.logo && (
                                                <div className="pt-3 border-t border-border/50 space-y-3">
                                                    <div className="grid w-full items-center gap-2">
                                                        <Label className="text-xs">Size: {state.logoSize}px</Label>
                                                        <input
                                                            type="range"
                                                            min="32"
                                                            max="128"
                                                            step="4"
                                                            value={state.logoSize}
                                                            onChange={(e) => handleChange('logoSize', parseInt(e.target.value))}
                                                            className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                                        />
                                                        <div className="flex justify-between text-[10px] text-muted-foreground">
                                                            <span>32px</span>
                                                            <span>128px</span>
                                                        </div>
                                                    </div>

                                                    <div className="grid w-full items-center gap-2">
                                                        <Label className="text-xs">Padding: {state.logoPadding}px</Label>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="16"
                                                            step="1"
                                                            value={state.logoPadding}
                                                            onChange={(e) => handleChange('logoPadding', parseInt(e.target.value))}
                                                            className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                                        />
                                                        <div className="flex justify-between text-[10px] text-muted-foreground">
                                                            <span>0px</span>
                                                            <span>16px</span>
                                                        </div>
                                                    </div>

                                                    <div className="grid w-full items-center gap-2">
                                                        <Label className="text-xs">Border Width: {state.logoBorderWidth}px</Label>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="8"
                                                            step="1"
                                                            value={state.logoBorderWidth}
                                                            onChange={(e) => handleChange('logoBorderWidth', parseInt(e.target.value))}
                                                            className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                                        />
                                                        <div className="flex justify-between text-[10px] text-muted-foreground">
                                                            <span>0px</span>
                                                            <span>8px</span>
                                                        </div>
                                                    </div>

                                                    <div className="grid w-full items-center gap-2">
                                                        <Label htmlFor="logoBorderColor" className="text-xs">Border Color</Label>
                                                        <div className="flex gap-2 items-center">
                                                            <div className="relative w-8 h-8 rounded-md overflow-hidden border border-border shadow-sm">
                                                                <Input
                                                                    type="color"
                                                                    id="logoBorderColor"
                                                                    value={state.logoBorderColor}
                                                                    className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                                                    onChange={(e) => handleChange('logoBorderColor', e.target.value)}
                                                                />
                                                            </div>
                                                            <Input
                                                                type="text"
                                                                value={state.logoBorderColor}
                                                                onChange={(e) => handleChange('logoBorderColor', e.target.value)}
                                                                className="flex-1 h-8 font-mono text-xs"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid w-full items-center gap-2">
                                                        <Label htmlFor="logoBgColor" className="text-xs">Background Color</Label>
                                                        <div className="flex gap-2 items-center">
                                                            <div className="relative w-8 h-8 rounded-md overflow-hidden border border-border shadow-sm">
                                                                <Input
                                                                    type="color"
                                                                    id="logoBgColor"
                                                                    value={state.logoBgColor}
                                                                    className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                                                    onChange={(e) => handleChange('logoBgColor', e.target.value)}
                                                                />
                                                            </div>
                                                            <Input
                                                                type="text"
                                                                value={state.logoBgColor}
                                                                onChange={(e) => handleChange('logoBgColor', e.target.value)}
                                                                className="flex-1 h-8 font-mono text-xs"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

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

                                        {state.layoutType === 'split' && (
                                            <div className="space-y-3 p-3 border border-border rounded-lg bg-muted/30">
                                                <Label className="text-xs font-semibold block">Hero Image</Label>
                                                
                                                {/* Upload Option */}
                                                <div className="space-y-2">
                                                    <Label className="text-xs text-muted-foreground">Upload Image</Label>
                                                    <ImageUpload
                                                        value={state.heroImage}
                                                        onChange={(url) => handleChange('heroImage', url)}
                                                    />
                                                </div>

                                                {/* Divider */}
                                                <div className="flex items-center gap-2 py-1">
                                                    <div className="flex-1 h-px bg-border"></div>
                                                    <span className="text-[10px] text-muted-foreground">OR</span>
                                                    <div className="flex-1 h-px bg-border"></div>
                                                </div>

                                                {/* URL Option */}
                                                <div className="grid w-full items-center gap-2">
                                                    <Label htmlFor="heroImage" className="text-xs text-muted-foreground">Image URL</Label>
                                                    <Input
                                                        id="heroImage"
                                                        type="text"
                                                        placeholder="https://example.com/hero-image.jpg"
                                                        value={state.heroImage || ''}
                                                        onChange={(e) => handleChange('heroImage', e.target.value || null)}
                                                        className="h-8 text-xs"
                                                    />
                                                </div>
                                                
                                                <p className="text-[10px] text-muted-foreground">
                                                    Upload an image or enter a URL. This will be displayed in the split view.
                                                </p>
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
                                                            { name: 'Formal', value: 'formal-invitation' },
                                                        ].map((pattern) => {
                                                            const patternStyle = getPatternStyle(pattern.value, state.bgPatternColor, state.bgPatternOpacity, state.bgPatternScale, state.bgPatternStrokeWidth, state.bgPatternRotation);
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

                                                <div className="grid w-full items-center gap-2">
                                                    <Label className="text-xs">Scale: {state.bgPatternScale}x</Label>
                                                    <input
                                                        type="range"
                                                        min="0.1"
                                                        max="3"
                                                        step="0.1"
                                                        value={state.bgPatternScale}
                                                        onChange={(e) => handleChange('bgPatternScale', parseFloat(e.target.value))}
                                                        className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                                    />
                                                </div>

                                                <div className="grid w-full items-center gap-2">
                                                    <Label className="text-xs">Stroke Width: {state.bgPatternStrokeWidth}px</Label>
                                                    <input
                                                        type="range"
                                                        min="0.1"
                                                        max="10"
                                                        step="0.1"
                                                        value={state.bgPatternStrokeWidth}
                                                        onChange={(e) => handleChange('bgPatternStrokeWidth', parseFloat(e.target.value))}
                                                        className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                                    />
                                                </div>

                                                <div className="grid w-full items-center gap-2">
                                                    <Label className="text-xs">Rotation: {state.bgPatternRotation}°</Label>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="360"
                                                        step="1"
                                                        value={state.bgPatternRotation}
                                                        onChange={(e) => handleChange('bgPatternRotation', parseInt(e.target.value))}
                                                        className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {state.bgType === 'image' && (
                                            <div className="space-y-3 p-3 border border-border rounded-lg bg-muted/30">
                                                <Label className="text-xs font-semibold block">Image Settings</Label>
                                                
                                                {/* Upload Option */}
                                                <div className="space-y-2">
                                                    <Label className="text-xs text-muted-foreground">Upload Image</Label>
                                                    <ImageUpload
                                                        value={state.bgImage}
                                                        onChange={(url) => handleChange('bgImage', url)}
                                                    />
                                                </div>

                                                {/* Divider */}
                                                <div className="flex items-center gap-2 py-1">
                                                    <div className="flex-1 h-px bg-border"></div>
                                                    <span className="text-[10px] text-muted-foreground">OR</span>
                                                    <div className="flex-1 h-px bg-border"></div>
                                                </div>

                                                {/* URL Option */}
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
                                                
                                                <p className="text-[10px] text-muted-foreground">
                                                    Upload an image or enter a URL. For best results, use a high-resolution image.
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

                                        <div className="grid w-full items-center gap-2">
                                            <Label htmlFor="inputTextColor" className="text-xs">Input Text Color</Label>
                                            <div className="flex gap-2 items-center">
                                                <div className="relative w-8 h-8 rounded-md overflow-hidden border border-border shadow-sm">
                                                    <Input
                                                        type="color"
                                                        id="inputTextColor"
                                                        value={state.inputTextColor}
                                                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                                        onChange={(e) => handleChange('inputTextColor', e.target.value)}
                                                    />
                                                </div>
                                                <Input
                                                    type="text"
                                                    value={state.inputTextColor}
                                                    onChange={(e) => handleChange('inputTextColor', e.target.value)}
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
