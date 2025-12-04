"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

// Floating node decoration
function FloatingNode({
    delay,
    position,
    icon,
    color,
}: {
    delay: number;
    position: { x: string; y: string };
    icon: React.ReactNode;
    color: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
            className="absolute group"
            style={{ left: position.x, top: position.y }}
        >
            <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
            >
                <div
                    className="absolute inset-0 w-12 h-12 rounded-xl blur-xl opacity-40"
                    style={{ background: color }}
                />
                <div
                    className="relative w-12 h-12 rounded-xl border border-white/20 backdrop-blur-xl flex items-center justify-center"
                    style={{
                        background: `linear-gradient(135deg, ${color}40, ${color}15)`,
                    }}
                >
                    <div className="text-white w-5 h-5">{icon}</div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            mouseX.set((e.clientX - rect.left - rect.width / 2) / 50);
            mouseY.set((e.clientY - rect.top - rect.height / 2) / 50);
        }
    };

    const opacity = useTransform(scrollY, [0, 400], [1, 0]);
    const y = useTransform(scrollY, [0, 400], [0, 80]);
    const scale = useTransform(scrollY, [0, 400], [1, 0.95]);

    return (
        <motion.section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            style={{ opacity, y, scale }}
            className="relative min-h-screen flex flex-col items-center justify-center overflow-visible pt-16"
        >
            {/* Floating nodes */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <FloatingNode delay={0.2} position={{ x: "12%", y: "22%" }} color="#a855f7"
                    icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3" /></svg>}
                />
                <FloatingNode delay={0.35} position={{ x: "82%", y: "18%" }} color="#06b6d4"
                    icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7" /></svg>}
                />
                <FloatingNode delay={0.5} position={{ x: "8%", y: "68%" }} color="#3b82f6"
                    icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                />
                <FloatingNode delay={0.65} position={{ x: "85%", y: "62%" }} color="#ec4899"
                    icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18" /></svg>}
                />
            </div>

            {/* Main Content */}
            <motion.div style={{ x: smoothX, y: smoothY }} className="container mx-auto px-4 relative z-10 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] backdrop-blur-xl mb-8 cursor-pointer group hover:bg-white/[0.08] transition-all"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-sm font-medium text-white/60">Workflow Automation Reimagined</span>
                </motion.div>

                {/* Headline - ORIGINAL purple/pink/cyan gradient */}
                <div className="relative mb-6 overflow-visible">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[clamp(2.5rem,10vw,7rem)] font-bold tracking-[-0.03em] leading-[1.1] text-white"
                        style={{ paddingBottom: "0.1em" }}
                    >
                        Automate
                    </motion.h1>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[clamp(2.5rem,10vw,7rem)] font-bold tracking-[-0.03em] leading-[1.1] bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
                        style={{ paddingBottom: "0.15em" }}
                    >
                        Everything
                    </motion.h1>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[60%] bg-gradient-to-r from-purple-600/15 via-pink-600/12 to-cyan-600/15 blur-[80px] -z-10" />
                </div>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-base md:text-lg text-white/50 max-w-md mx-auto mb-10 leading-relaxed"
                >
                    Build complex workflows with a visual node editor.
                    <span className="text-white/70"> The open-source alternative that scales.</span>
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3"
                >
                    <button className="group relative px-7 py-3.5 bg-white text-black rounded-full font-semibold text-sm overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-transform">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                            Start Building Free
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </span>
                    </button>
                    <button className="px-7 py-3.5 bg-white/[0.05] hover:bg-white/[0.1] text-white/70 hover:text-white rounded-full font-medium text-sm border border-white/[0.1] backdrop-blur-xl transition-all">
                        Github 
                    </button>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] text-white/25 tracking-widest uppercase">Scroll</span>
                <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-[1px] h-8 bg-gradient-to-b from-white/30 to-transparent" />
            </motion.div>
        </motion.section>
    );
}
