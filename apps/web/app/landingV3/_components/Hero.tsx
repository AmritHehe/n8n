"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Github, Star, Webhook } from "lucide-react";

// Floating node decoration
function FloatingNode({
    delay,
    position,
    icon,
}: {
    delay: number;
    position: { x: string; y: string };
    icon: React.ReactNode;
}) {
    const color = "#60a5fa";
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
    const router = useRouter();
    const { scrollY } = useScroll();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleGetStarted = () => {
        if (isLoggedIn) {
            router.push("/landingV3/workflows");
        } else {
            router.push("/landingV3/signup");
        }
    };

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
            {/* Floating nodes — real node type icons */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Telegram */}
                <FloatingNode delay={0.2} position={{ x: "12%", y: "22%" }}
                    icon={<Image src="/telegram.svg" alt="Telegram" width={20} height={20} className="invert opacity-80" />}
                />
                {/* Webhook */}
                <FloatingNode delay={0.35} position={{ x: "82%", y: "18%" }}
                    icon={<Webhook className="flex items-center justify-center opacity-80"/>} />
                {/* Send Mail */}
                <FloatingNode delay={0.5} position={{ x: "8%", y: "68%" }}
                    icon={<Image src="/sendmail.svg" alt="Send Mail" width={20} height={20} className="invert opacity-80" />}
                />
                {/* AI Agent */}
                <FloatingNode delay={0.65} position={{ x: "85%", y: "62%" }}
                    icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>}
                />
            </div>

            {/* Main Content */}
            <motion.div style={{ x: smoothX, y: smoothY }} className="container mx-auto px-4 relative z-10 text-center">
                {/* Headline */}
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
                        className="text-[clamp(2.5rem,10vw,7rem)] font-bold tracking-[-0.03em] leading-[1.1]  text-white"
                        style={{ paddingBottom: "0.15em" }}
                    >
                        Everything
                    </motion.h1>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[60%] bg-blue-400/10 blur-[80px] -z-10" />
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
                    <button onClick={handleGetStarted} className="group relative px-7 py-3.5 bg-white text-black rounded-full font-semibold text-sm overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-transform">
                        <div className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                            {isLoggedIn ? "Go to Dashboard" : "Start Building Free"}
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </span>
                    </button>
                    <Link
                        href="https://github.com/amrithehe/n8n"
                        target="_blank"
                        className="group relative p-4 bg-white/5 hover:bg-white/10 rounded-full font-medium text-sm border border-white/10 backdrop-blur-xl transition-all flex items-center justify-center overflow-hidden"
                    >
                        <Github className="w-5 h-5 text-white/70 transition-all duration-300 group-hover:opacity-0 group-hover:scale-75" />
                        <Star className="w-5 h-5 text-yellow-100 absolute transition-all duration-300 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100" />
                    </Link>
                </motion.div>
            </motion.div>



        </motion.section>
    );
}
