"use client";

import { useRef, useState, useEffect } from "react";
import { Globe, Cpu, Shield, Zap } from "lucide-react";

const features = [
    {
        id: 1,
        title: "Connect Anything",
        description: "Integrate with any app, database, or API. If it has an API, you can connect to it.",
        icon: Globe,
    },
    {
        id: 2,
        title: "AI-Native Workflows",
        description: "Build autonomous agents with LangChain integration. Let AI handle the complexity.",
        icon: Cpu,
    },
    {
        id: 3,
        title: "Enterprise Security",
        description: "Self-host for complete control. SOC2 compliant, RBAC, and audit logs built-in.",
        icon: Shield,
    },
    {
        id: 4,
        title: "Blazing Fast",
        description: "Execute thousands of workflows per second. Built for scale from day one.",
        icon: Zap,
    },
];

export default function ScrollSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const [smoothProgress, setSmoothProgress] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const animationRef = useRef<number>();

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const section = sectionRef.current;
            const rect = section.getBoundingClientRect();
            const sectionHeight = section.offsetHeight;
            const windowHeight = window.innerHeight;

            const scrolledPast = -rect.top;
            const scrollableDistance = sectionHeight - windowHeight;
            const scrollProgress = Math.max(0, Math.min(1, scrolledPast / scrollableDistance));

            setProgress(scrollProgress);
        };

        // Buttery smooth animation loop
        const animate = () => {
            setSmoothProgress(prev => {
                // Very slow lerp factor = super smooth
                const lerped = prev + (progress - prev) * 0.04;
                
                // Update active feature based on smooth progress
                const featureIndex = Math.min(
                    features.length - 1,
                    Math.floor(lerped * features.length)
                );
                setActiveIndex(featureIndex);
                
                return lerped;
            });
            animationRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [progress]);

    // Very slow scroll - reduced from 200 to 80px total movement
    const slowScrollOffset = smoothProgress * 80;

    return (
        <section ref={sectionRef} className="relative h-[500vh] bg-[#030303]">
            {/* Container */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
                {/* Inner content with buttery slow scroll */}
                <div 
                    className="container mx-auto px-4"
                    style={{
                        transform: `translateY(${30 - slowScrollOffset}px)`,
                    }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Left: Text */}
                        <div className="space-y-6">
                            {/* Feature indicator dots */}
                            <div className="flex gap-2 mb-8">
                                {features.map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-2 rounded-full"
                                        style={{
                                            width: i === activeIndex ? 24 : 8,
                                            backgroundColor: i === activeIndex ? 'white' : 'rgba(255,255,255,0.2)',
                                            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Title - longer, smoother transition */}
                            <div className="relative h-[120px] overflow-hidden">
                                {features.map((feature, i) => (
                                    <h2
                                        key={feature.id}
                                        className="absolute inset-0 text-4xl md:text-6xl font-bold text-white"
                                        style={{
                                            opacity: i === activeIndex ? 1 : 0,
                                            transform: `translateY(${
                                                i === activeIndex ? 0 : i < activeIndex ? -50 : 50
                                            }px)`,
                                            transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                                        }}
                                    >
                                        {feature.title}
                                    </h2>
                                ))}
                            </div>

                            {/* Description - staggered timing */}
                            <div className="relative h-[80px] overflow-hidden">
                                {features.map((feature, i) => (
                                    <p
                                        key={feature.id}
                                        className="absolute inset-0 text-lg md:text-xl text-white/50 leading-relaxed"
                                        style={{
                                            opacity: i === activeIndex ? 1 : 0,
                                            transform: `translateY(${
                                                i === activeIndex ? 0 : i < activeIndex ? -30 : 30
                                            }px)`,
                                            transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
                                        }}
                                    >
                                        {feature.description}
                                    </p>
                                ))}
                            </div>

                            {/* CTA */}
                            <button className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors mt-4">
                                <span>Learn more</span>
                                <svg
                                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </div>

                        {/* Right: Icon Card - even slower parallax */}
                        <div 
                            className="flex items-center justify-center"
                            style={{
                                transform: `translateY(${-slowScrollOffset * 0.2}px)`,
                            }}
                        >
                            <div className="relative">
                                {/* Outer glow */}
                                <div 
                                    className="absolute inset-0 rounded-[32px] blur-2xl scale-110"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(6, 182, 212, 0.1))',
                                    }}
                                />

                                {/* Main card */}
                                <div
                                    className="relative w-40 h-40 rounded-[32px] flex items-center justify-center"
                                    style={{
                                        background: "linear-gradient(135deg, #1e3a3a 0%, #0f2828 50%, #0a1f1f 100%)",
                                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                    }}
                                >
                                    {/* Icons - buttery smooth */}
                                    {features.map((feature, i) => (
                                        <feature.icon
                                            key={feature.id}
                                            className="absolute w-20 h-20 text-white/90"
                                            style={{
                                                opacity: i === activeIndex ? 1 : 0,
                                                transform: `scale(${i === activeIndex ? 1 : 0.8})`,
                                                transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                                            }}
                                            strokeWidth={1}
                                        />
                                    ))}
                                </div>

                                {/* Decorative rings */}
                                <div className="absolute -inset-8 border border-white/5 rounded-[48px] pointer-events-none" />
                                <div 
                                    className="absolute -inset-16 border border-dashed border-white/5 rounded-[64px] pointer-events-none"
                                    style={{ 
                                        transform: `rotate(${smoothProgress * 60}deg)`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress bar - also smooth */}
            <div className="fixed right-8 top-1/2 -translate-y-1/2 w-1 h-32 bg-white/10 rounded-full overflow-hidden hidden lg:block">
                <div
                    className="w-full bg-gradient-to-b from-teal-400 to-cyan-400 rounded-full"
                    style={{ height: `${smoothProgress * 100}%` }}
                />
            </div>
        </section>
    );
}
