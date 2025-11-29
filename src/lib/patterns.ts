export const getPatternStyle = (
    pattern: string,
    color: string,
    opacity: number,
    scale: number = 1,
    strokeWidth: number = 1,
    rotation: number = 0
): { image: string; size: string; position?: string } => {
    const hexToRgba = (hex: string, op: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${op})`;
    };
    const patternColor = hexToRgba(color, opacity);
    
    // Helper to scale size
    const getScaledSize = (w: number, h: number) => `${w * scale}px ${h * scale}px`;
    
    // Helper for SVG content with rotation
    const getSvg = (w: number, h: number, content: string) => {
        const cx = w / 2;
        const cy = h / 2;
        const transform = rotation !== 0 ? ` transform='rotate(${rotation} ${cx} ${cy})'` : '';
        const svgContent = `<svg width='${w}' height='${h}' viewBox='0 0 ${w} ${h}' xmlns='http://www.w3.org/2000/svg'><g${transform}>${content}</g></svg>`;
        return `url("data:image/svg+xml,${encodeURIComponent(svgContent)}")`;
    };

    const patterns: Record<string, { image: string; size: string; position?: string }> = {
        dots: { 
            image: `radial-gradient(${patternColor} ${1 * strokeWidth}px, transparent ${1 * strokeWidth}px)`, 
            size: getScaledSize(20, 20) 
        },
        grid: { 
            image: `linear-gradient(${patternColor} ${1 * strokeWidth}px, transparent ${1 * strokeWidth}px), linear-gradient(90deg, ${patternColor} ${1 * strokeWidth}px, transparent ${1 * strokeWidth}px)`, 
            size: getScaledSize(20, 20) 
        },
        lines: { 
            image: `repeating-linear-gradient(${0 + rotation}deg, ${patternColor}, ${patternColor} ${1 * strokeWidth}px, transparent ${1 * strokeWidth}px, transparent 10px)`, 
            size: getScaledSize(10, 10) 
        },
        diagonal: { 
            image: `repeating-linear-gradient(${45 + rotation}deg, ${patternColor}, ${patternColor} ${1 * strokeWidth}px, transparent ${1 * strokeWidth}px, transparent 10px)`, 
            size: getScaledSize(10, 10) 
        },
        waves: { 
            image: getSvg(100, 20, `<path d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='${color}' fill-opacity='${opacity}' fill-rule='evenodd'/>`), 
            size: getScaledSize(100, 20) 
        },
        circles: { 
            image: `radial-gradient(circle, ${patternColor} ${1 * strokeWidth}px, transparent ${1 * strokeWidth}px), radial-gradient(circle, ${patternColor} ${1 * strokeWidth}px, transparent ${1 * strokeWidth}px)`, 
            size: `${30 * scale}px ${30 * scale}px, ${30 * scale}px ${30 * scale}px`, 
            position: `0 0, ${15 * scale}px ${15 * scale}px` 
        },
        hexagons: { 
            image: getSvg(100, 100, `<path d='M50 0l43.3 25v50L50 100 6.7 75V25z' fill='none' stroke='${color}' stroke-width='${strokeWidth}' stroke-opacity='${opacity}'/>`), 
            size: getScaledSize(50, 50) 
        },
        crosses: { 
            image: getSvg(40, 40, `<g fill='none' fill-rule='evenodd'><g fill='${color}' fill-opacity='${opacity}'><path d='M0 38h40v2H0zM0 0h40v2H0zM38 0v40h2V0zM0 0v40h2V0z'/></g></g>`), 
            size: getScaledSize(40, 40) 
        },
        zigzag: { 
            image: getSvg(100, 20, `<path d='M0 10l10-10 10 10 10-10 10 10 10-10 10 10 10-10 10 10 10-10v10H0z' fill='${color}' fill-opacity='${opacity}'/>`), 
            size: getScaledSize(100, 20) 
        },
        diamonds: { 
            image: getSvg(40, 40, `<g fill='none' fill-rule='evenodd'><g fill='${color}' fill-opacity='${opacity}'><path d='M20 0l20 20-20 20L0 20z'/></g></g>`), 
            size: getScaledSize(40, 40) 
        },
        stars: { 
            image: getSvg(40, 40, `<g fill='none' fill-rule='evenodd'><g fill='${color}' fill-opacity='${opacity}'><path d='M20 0l4.9 15.1L40 20l-15.1 4.9L20 40l-4.9-15.1L0 20l15.1-4.9z'/></g></g>`), 
            size: getScaledSize(40, 40) 
        },
        plus: { 
            image: getSvg(40, 40, `<g fill='none' fill-rule='evenodd'><g fill='${color}' fill-opacity='${opacity}'><path d='M18 0h4v18h18v4H22v18h-4V22H0v-4h18z'/></g></g>`), 
            size: getScaledSize(40, 40) 
        },
        squares: { 
            image: getSvg(40, 40, `<g fill='none' fill-rule='evenodd'><g fill='${color}' fill-opacity='${opacity}'><path d='M0 0h20v20H0zM20 20h20v20H20z'/></g></g>`), 
            size: getScaledSize(40, 40) 
        },
        triangles: { 
            image: getSvg(40, 40, `<g fill='none' fill-rule='evenodd'><g fill='${color}' fill-opacity='${opacity}'><path d='M20 0l20 20H0z'/></g></g>`), 
            size: getScaledSize(40, 40) 
        },
        crosshatch: { 
            image: getSvg(40, 40, `<g fill='none' fill-rule='evenodd'><g stroke='${color}' stroke-opacity='${opacity}' stroke-width='${strokeWidth}'><path d='M0 0l40 40M40 0L0 40'/></g></g>`), 
            size: getScaledSize(40, 40) 
        },
        bricks: { 
            image: getSvg(100, 40, `<g fill='none' fill-rule='evenodd'><g fill='${color}' fill-opacity='${opacity}'><path d='M0 0h50v20H0zM50 20h50v20H50z'/></g></g>`), 
            size: getScaledSize(100, 40) 
        },
        'formal-invitation': { 
            image: getSvg(100, 18, `<path fill='${color}' fill-opacity='${opacity}' d='M61.82 18c3.47-1.45 6.86-3.78 11.3-7.34C78 6.76 80.34 5.1 83.87 3.42 88.56 1.16 93.75 0 100 0v6.16C98.76 6.05 97.43 6 96 6c-9.59 0-14.23 2.23-23.13 9.34-1.28 1.03-2.39 1.9-3.4 2.66h-7.65zm-23.64 0H22.52c-1-.76-2.1-1.63-3.4-2.66C11.57 9.3 7.08 6.78 0 6.16V0c6.25 0 11.44 1.16 16.14 3.42 3.53 1.7 5.87 3.35 10.73 7.24 4.45 3.56 7.84 5.9 11.31 7.34zM61.82 0h7.66a39.57 39.57 0 0 1-7.34 4.58C57.44 6.84 52.25 8 46 8S34.56 6.84 29.86 4.58A39.57 39.57 0 0 1 22.52 0h15.66C41.65 1.44 45.21 2 50 2c4.8 0 8.35-.56 11.82-2z'/>`), 
            size: getScaledSize(100, 18) 
        },
    };
    
    return patterns[pattern] || patterns.dots;
};
