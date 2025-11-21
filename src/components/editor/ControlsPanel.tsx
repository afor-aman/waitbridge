import React from 'react';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Type, Palette, LayoutTemplate, Square, Circle, MousePointerClick } from 'lucide-react';

interface EditorState {
    headerText: string;
    subText: string;
    submissionMessage: string;
    bgColor: string;
    textColor: string;
    logo: string | null;
    font: 'sans' | 'serif' | 'mono';
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

const GRADIENTS = [
    { name: 'Sunset', value: 'from-orange-500 to-pink-600' },
    { name: 'Ocean', value: 'from-blue-400 to-emerald-400' },
    { name: 'Midnight', value: 'from-slate-900 to-slate-700' },
    { name: 'Purple Haze', value: 'from-purple-500 to-indigo-500' },
];

export function ControlsPanel({ state, onChange }: ControlsPanelProps) {
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

    return (
        <div className="flex flex-col gap-8 p-8 pb-20">
            <div className="space-y-1">
                <h2 className="text-xl font-bold tracking-tight">Editor</h2>
                <p className="text-sm text-muted-foreground">Customize your waitlist page.</p>
            </div>

            <div className="space-y-8">
                {/* Content Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary/80 uppercase tracking-wider">
                        <Type className="w-4 h-4" />
                        <span>Content</span>
                    </div>
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
                                className="bg-background/50 focus:bg-background transition-all min-h-[100px]"
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
                </div>

                {/* Typography & Layout Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary/80 uppercase tracking-wider">
                        <LayoutTemplate className="w-4 h-4" />
                        <span>Layout & Type</span>
                    </div>
                    <div className="grid gap-4 pl-2 border-l-2 border-border/50">
                        <div className="grid w-full items-center gap-2">
                            <Label className="text-xs font-semibold text-muted-foreground">Font Family</Label>
                            <div className="flex gap-2">
                                {['sans', 'serif', 'mono'].map((font) => (
                                    <button
                                        key={font}
                                        onClick={() => onChange('font', font)}
                                        className={`flex-1 px-3 py-2 text-xs border rounded-md transition-all ${state.font === font ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                                    >
                                        {font.charAt(0).toUpperCase() + font.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Appearance Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary/80 uppercase tracking-wider">
                        <Palette className="w-4 h-4" />
                        <span>Appearance</span>
                    </div>
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
                </div>

                {/* Assets Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary/80 uppercase tracking-wider">
                        <Upload className="w-4 h-4" />
                        <span>Assets</span>
                    </div>
                    <div className="grid gap-4 pl-2 border-l-2 border-border/50">
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="logo" className="text-xs font-semibold text-muted-foreground">Logo</Label>
                            <div className="flex items-center gap-4">
                                <div className="relative flex-1">
                                    <Input
                                        id="logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="hidden"
                                    />
                                    <Label htmlFor="logo" className="flex items-center justify-center w-full h-24 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <Upload className="w-5 h-5" />
                                            <span className="text-xs">Upload Logo</span>
                                        </div>
                                    </Label>
                                </div>
                                {state.logo && (
                                    <div className="w-24 h-24 rounded-lg border border-border bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-2 relative group">
                                        <img src={state.logo} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                                        <button
                                            onClick={() => onChange('logo', null)}
                                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <span className="sr-only">Remove</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
