import React, { useState } from 'react';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Type, Palette, LayoutTemplate, Square, Circle, MousePointerClick, LayoutDashboard, User, ChevronDown } from 'lucide-react';

interface EditorState {
    headerText: string;
    subText: string;
    submissionMessage: string;
    bgColor: string;
    textColor: string;
    logo: string | null;
    font: string;
    layout: 'center' | 'left' | 'right';
    bgType: 'solid' | 'gradient' | 'image';
    bgGradient: string;
    buttonStyle: 'rounded' | 'pill' | 'sharp';
    buttonText: string;
    buttonColor: string;
    buttonTextColor: string;
    inputColor: string;
    inputPlaceholderColor: string;
    inputPlaceholder: string;
}

interface ControlsPanelProps {
    state: EditorState;
    onChange: (key: keyof EditorState, value: any) => void;
}

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
];


export function ControlsPanel({ state, onChange }: ControlsPanelProps) {
    const [openSection, setOpenSection] = useState<string>('content');

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange('logo', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? '' : section);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header with Profile and Dashboard */}
            <div className="shrink-0 border-b border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900/50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {/* Profile Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">John Doe</p>
                            <p className="text-xs text-muted-foreground">john@example.com</p>
                        </div>
                    </div>
                </div>
                {/* Dashboard Link */}
                <a 
                    href="#" 
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm font-medium"
                >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                </a>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col gap-8 p-8 pb-20">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold tracking-tight">Editor</h2>
                        <p className="text-sm text-muted-foreground">Customize your waitlist page.</p>
                    </div>

                    <div className="space-y-8">
                        {/* Content Section */}
                        <div className="space-y-4">
                            <button
                                onClick={() => toggleSection('content')}
                                className="flex items-center justify-between w-full text-sm font-medium text-primary/80 uppercase tracking-wider hover:text-primary transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Type className="w-4 h-4" />
                                    <span>Content</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'content' ? 'rotate-180' : ''}`} />
                            </button>
                            {openSection === 'content' && (
                                <div className="grid gap-4 pl-2 border-l-2 border-border/50">
                         <div className="grid w-full items-center gap-2">
                             <Label htmlFor="headerText" className="text-xs font-semibold text-muted-foreground">Header Text</Label>
                             <Input
                                 type="text"
                                 id="headerText"
                                 value={state.headerText}
                                 onChange={(e) => onChange('headerText', e.target.value)}
                                 className="bg-background/50 focus:bg-background transition-all"
                             />
                         </div>

                         <div className="grid w-full items-center gap-2">
                             <Label htmlFor="subText" className="text-xs font-semibold text-muted-foreground">Subtext</Label>
                             <Textarea
                                 id="subText"
                                 value={state.subText}
                                 onChange={(e) => onChange('subText', e.target.value)}
                                 className="bg-background/50 focus:bg-background transition-all min-h-[150px] resize-none"
                             />
                         </div>

                          <div className="grid w-full items-center gap-2">
                             <Label htmlFor="buttonText" className="text-xs font-semibold text-muted-foreground">Button Text</Label>
                             <Input
                                 type="text"
                                 id="buttonText"
                                 value={state.buttonText}
                                 onChange={(e) => onChange('buttonText', e.target.value)}
                                 className="bg-background/50 focus:bg-background transition-all"
                             />
                         </div>

                          <div className="grid w-full items-center gap-2">
                             <Label htmlFor="inputPlaceholder" className="text-xs font-semibold text-muted-foreground">Input Placeholder Text</Label>
                             <Input
                                 type="text"
                                 id="inputPlaceholder"
                                 value={state.inputPlaceholder}
                                 onChange={(e) => onChange('inputPlaceholder', e.target.value)}
                                 className="bg-background/50 focus:bg-background transition-all"
                             />
                         </div>

                         <div className="grid w-full items-center gap-2">
                             <Label htmlFor="submissionMessage" className="text-xs font-semibold text-muted-foreground">Success Message</Label>
                             <Input
                                 type="text"
                                 id="submissionMessage"
                                 value={state.submissionMessage}
                                onChange={(e) => onChange('submissionMessage', e.target.value)}
                                className="bg-background/50 focus:bg-background transition-all"
                            />
                        </div>
                    </div>
                            )}
                </div>

                {/* Typography & Layout Section */}
                <div className="space-y-4">
                    <button
                        onClick={() => toggleSection('typography')}
                        className="flex items-center justify-between w-full text-sm font-medium text-primary/80 uppercase tracking-wider hover:text-primary transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <LayoutTemplate className="w-4 h-4" />
                            <span>Layout & Type</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'typography' ? 'rotate-180' : ''}`} />
                    </button>
                    {openSection === 'typography' && (
                        <div className="grid gap-4 pl-2 border-l-2 border-border/50">
                        <div className="grid w-full items-center gap-2">
                            <Label className="text-xs font-semibold text-muted-foreground">Font Family</Label>
                            <Select value={state.font} onValueChange={(value) => onChange('font', value)}>
                                <SelectTrigger className="w-full">
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
                        className="flex items-center justify-between w-full text-sm font-medium text-primary/80 uppercase tracking-wider hover:text-primary transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <Palette className="w-4 h-4" />
                            <span>Appearance</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'appearance' ? 'rotate-180' : ''}`} />
                    </button>
                    {openSection === 'appearance' && (
                        <div className="grid gap-4 pl-2 border-l-2 border-border/50">
                        <div className="grid w-full items-center gap-2">
                            <Label className="text-xs font-semibold text-muted-foreground">Background Type</Label>
                            <div className="flex gap-2">
                                {['solid', 'gradient'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => onChange('bgType', type)}
                                        className={`flex-1 px-3 py-2 text-xs border rounded-md transition-all ${state.bgType === type ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                                    >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {state.bgType === 'solid' ? (
                            <div className="grid w-full items-center gap-2">
                                <Label htmlFor="bgColor" className="text-xs font-semibold text-muted-foreground">Background Color</Label>
                                <div className="flex gap-2 items-center">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border shadow-sm">
                                        <Input
                                            type="color"
                                            id="bgColor"
                                            value={state.bgColor}
                                            className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                            onChange={(e) => onChange('bgColor', e.target.value)}
                                        />
                                    </div>
                                    <Input
                                        type="text"
                                        value={state.bgColor}
                                        onChange={(e) => onChange('bgColor', e.target.value)}
                                        className="flex-1 font-mono text-xs"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid w-full items-center gap-2">
                                <Label className="text-xs font-semibold text-muted-foreground">Gradient Preset</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {GRADIENTS.map((gradient) => (
                                        <button
                                            key={gradient.name}
                                            onClick={() => onChange('bgGradient', gradient.value)}
                                            className={`h-10 rounded-md bg-gradient-to-r ${gradient.value} border-2 transition-all ${state.bgGradient === gradient.value ? 'border-primary scale-105' : 'border-transparent hover:scale-105'}`}
                                            title={gradient.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="textColor" className="text-xs font-semibold text-muted-foreground">Text Color</Label>
                            <div className="flex gap-2 items-center">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border shadow-sm">
                                    <Input
                                        type="color"
                                        id="textColor"
                                        value={state.textColor}
                                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                        onChange={(e) => onChange('textColor', e.target.value)}
                                    />
                                </div>
                                <Input
                                    type="text"
                                    value={state.textColor}
                                    onChange={(e) => onChange('textColor', e.target.value)}
                                    className="flex-1 font-mono text-xs"
                                />
                            </div>
                        </div>

                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="buttonColor" className="text-xs font-semibold text-muted-foreground">Button Color</Label>
                            <div className="flex gap-2 items-center">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border shadow-sm">
                                    <Input
                                        type="color"
                                        id="buttonColor"
                                        value={state.buttonColor}
                                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                        onChange={(e) => onChange('buttonColor', e.target.value)}
                                    />
                                </div>
                                <Input
                                    type="text"
                                    value={state.buttonColor}
                                    onChange={(e) => onChange('buttonColor', e.target.value)}
                                    className="flex-1 font-mono text-xs"
                                />
                            </div>
                        </div>

                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="buttonTextColor" className="text-xs font-semibold text-muted-foreground">Button Text Color</Label>
                            <div className="flex gap-2 items-center">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border shadow-sm">
                                    <Input
                                        type="color"
                                        id="buttonTextColor"
                                        value={state.buttonTextColor}
                                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                        onChange={(e) => onChange('buttonTextColor', e.target.value)}
                                    />
                                </div>
                                <Input
                                    type="text"
                                    value={state.buttonTextColor}
                                    onChange={(e) => onChange('buttonTextColor', e.target.value)}
                                    className="flex-1 font-mono text-xs"
                                />
                            </div>
                        </div>

                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="inputColor" className="text-xs font-semibold text-muted-foreground">Input Background Color</Label>
                            <div className="flex gap-2 items-center">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border shadow-sm">
                                    <Input
                                        type="color"
                                        id="inputColor"
                                        value={state.inputColor}
                                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                        onChange={(e) => onChange('inputColor', e.target.value)}
                                    />
                                </div>
                                <Input
                                    type="text"
                                    value={state.inputColor}
                                    onChange={(e) => onChange('inputColor', e.target.value)}
                                    className="flex-1 font-mono text-xs"
                                />
                            </div>
                        </div>

                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="inputPlaceholderColor" className="text-xs font-semibold text-muted-foreground">Input Placeholder Color</Label>
                            <div className="flex gap-2 items-center">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border shadow-sm">
                                    <Input
                                        type="color"
                                        id="inputPlaceholderColor"
                                        value={state.inputPlaceholderColor}
                                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                        onChange={(e) => onChange('inputPlaceholderColor', e.target.value)}
                                    />
                                </div>
                                <Input
                                    type="text"
                                    value={state.inputPlaceholderColor}
                                    onChange={(e) => onChange('inputPlaceholderColor', e.target.value)}
                                    className="flex-1 font-mono text-xs"
                                />
                            </div>
                        </div>


                        <div className="grid w-full items-center gap-2">
                            <Label className="text-xs font-semibold text-muted-foreground">Button Style</Label>
                            <div className="flex gap-2 bg-muted/50 p-1 rounded-lg">
                                {[
                                    { value: 'rounded', icon: Square, label: 'Rounded' },
                                    { value: 'pill', icon: Circle, label: 'Pill' },
                                    { value: 'sharp', icon: MousePointerClick, label: 'Sharp' },
                                ].map(({ value, icon: Icon }) => (
                                    <button
                                        key={value}
                                        onClick={() => onChange('buttonStyle', value)}
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
            </div>
            </div>
        </div>
    );
}
