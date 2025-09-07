
"use client";

import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from '../ThemeProvider';
import { useEffect, useState } from 'react';

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
}) {
    const { theme } = useTheme();
    // For light theme, use a soft color gradient for visibility
    let effectiveGradient = gradient;
    if (theme === 'light') {
        if (gradient.includes('indigo')) effectiveGradient = 'from-indigo-200';
        else if (gradient.includes('rose')) effectiveGradient = 'from-rose-100';
        else if (gradient.includes('violet')) effectiveGradient = 'from-violet-100';
        else if (gradient.includes('amber')) effectiveGradient = 'from-amber-100';
        else if (gradient.includes('cyan')) effectiveGradient = 'from-cyan-100';
        else effectiveGradient = 'from-gray-100';
    }
    const border = theme === 'dark' ? 'border-white/[0.07]' : 'border-black/[0.06]';
    const shadow = theme === 'dark'
        ? 'shadow-[0_8px_32px_0_rgba(255,255,255,0.04)]'
        : 'shadow-[0_8px_32px_0_rgba(0,0,0,0.06)]';
    const afterBg = theme === 'dark'
        ? 'after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_70%)]'
        : 'after:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.03),transparent_70%)]';
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96] as [number, number, number, number],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        effectiveGradient,
                        border,
                        shadow,
                        afterBg
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);
    return isMobile;
}

function HeroGeometric({
    badge = "Design Collective",
    title1 = "Elevate Your Digital Vision",
    title2 = "Crafting Exceptional Websites",
    subtitle = "Professional-grade indexing tools trusted by SEO agencies and enterprise companies worldwide.",
    primaryCTA = "Get Started",
    secondaryCTA = "View Pricing",
    onPrimaryCTA,
    onSecondaryCTA,
}: {
    badge?: string;
    title1?: string;
    title2?: string;
    subtitle?: string;
    primaryCTA?: string;
    secondaryCTA?: string;
    onPrimaryCTA?: () => void;
    onSecondaryCTA?: () => void;
}) {
    const { theme } = useTheme();
    const isMobile = useIsMobile();
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5,
                ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
            },
        },
    };

    // Responsive sizes for ElegantShape
    const shapeSizes = isMobile
        ? [
            { width: 260, height: 60 },
            { width: 200, height: 50 },
            { width: 120, height: 30 },
            { width: 90, height: 24 },
            { width: 70, height: 18 },
        ]
        : [
            { width: 600, height: 140 },
            { width: 500, height: 120 },
            { width: 300, height: 80 },
            { width: 200, height: 60 },
            { width: 150, height: 40 },
        ];

    return (
        <div className={cn(
            "relative min-h-screen w-full flex items-center justify-center overflow-hidden transition-colors duration-300",
            "bg-background text-foreground"
        )}>
            {/* Theme-aware background gradient overlays */}
            <div className={cn(
                "absolute inset-0 blur-3xl z-0 transition-colors duration-300",
                theme === 'dark'
                    ? "bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05]"
                    : "bg-gradient-to-br from-indigo-200/[0.10] via-transparent to-rose-200/[0.10]"
            )} />

            <div className="absolute inset-0 overflow-hidden z-0">
                {/* ElegantShape gradients remain, as they are subtle and work for both themes */}
                <ElegantShape
                    delay={0.3}
                    width={shapeSizes[0].width}
                    height={shapeSizes[0].height}
                    rotate={12}
                    gradient={theme === 'dark' ? "from-indigo-500/[0.15]" : "from-indigo-300/[0.10]"}
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                />
                <ElegantShape
                    delay={0.5}
                    width={shapeSizes[1].width}
                    height={shapeSizes[1].height}
                    rotate={-15}
                    gradient={theme === 'dark' ? "from-rose-500/[0.15]" : "from-rose-300/[0.10]"}
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                />
                <ElegantShape
                    delay={0.4}
                    width={shapeSizes[2].width}
                    height={shapeSizes[2].height}
                    rotate={-8}
                    gradient={theme === 'dark' ? "from-violet-500/[0.15]" : "from-violet-300/[0.10]"}
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                />
                <ElegantShape
                    delay={0.6}
                    width={shapeSizes[3].width}
                    height={shapeSizes[3].height}
                    rotate={20}
                    gradient={theme === 'dark' ? "from-amber-500/[0.15]" : "from-amber-300/[0.10]"}
                    className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
                />
                <ElegantShape
                    delay={0.7}
                    width={shapeSizes[4].width}
                    height={shapeSizes[4].height}
                    rotate={-25}
                    gradient={theme === 'dark' ? "from-cyan-500/[0.15]" : "from-cyan-300/[0.10]"}
                    className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
                />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 }}
                        className={cn(
                            "inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8 md:mb-12 border",
                            theme === 'dark'
                                ? "bg-white/[0.03] border-white/[0.08]"
                                : "bg-black/[0.03] border-black/[0.08]"
                        )}
                    >
                        <Circle className={cn("h-2 w-2", theme === 'dark' ? "fill-rose-500/80" : "fill-rose-400/80")} />
                        <span className={cn("text-sm tracking-wide", theme === 'dark' ? "text-white/60" : "text-gray-700/80")}>{badge}</span>
                    </motion.div>

                    <motion.div
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.3 }}
                    >
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
                            <span className={cn(
                                "bg-clip-text text-transparent bg-gradient-to-b",
                                theme === 'dark'
                                    ? "from-white to-white/80"
                                    : "from-gray-900 to-gray-700/80"
                            )}>
                                {title1}
                            </span>
                            <br />
                            <span
                                className={cn(
                                    "bg-clip-text text-transparent bg-gradient-to-r",
                                    theme === 'dark'
                                        ? "from-indigo-300 via-white/90 to-rose-300"
                                        : "from-indigo-700 via-gray-900/90 to-rose-500"
                                )}
                            >
                                {title2}
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.5 }}
                    >
                        <p className="text-base sm:text-lg md:text-xl mb-12 leading-relaxed font-light tracking-wide max-w-2xl mx-auto text-muted-foreground">
                            {subtitle}
                        </p>
                    </motion.div>

                    <motion.div
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.7 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <button
                            onClick={onPrimaryCTA}
                            className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            {primaryCTA}
                        </button>
                        <button
                            onClick={onSecondaryCTA}
                            className={cn(
                                "px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 border",
                                theme === 'dark'
                                    ? "bg-white/[0.05] hover:bg-white/[0.1] text-white border-white/[0.15] hover:border-white/[0.3]"
                                    : "bg-card hover:bg-gray-100 text-gray-900 border-border hover:border-gray-300"
                            )}
                        >
                            {secondaryCTA}
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export { HeroGeometric };
