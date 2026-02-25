"use client";

import { useRef, useState, useEffect } from "react";
import { LayoutGrid, Settings, Play, Webhook, LucideIcon } from "lucide-react";

interface Feature {
    id: number;
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
}

const features: Feature[] = [
    {
        id: 1,
        title: "Build Your Workflow",
        description: "Drag nodes onto a visual canvas and connect them with edges. Powered by React Flow.",
        icon: LayoutGrid,
        color: "#60a5fa",
    },
    {
        id: 2,
        title: "Configure Each Node",
        description: "Set messages, pick credentials, and chain outputs between nodes. Every node has its own config panel.",
        icon: Settings,
        color: "#60a5fa",
    },
    {
        id: 3,
        title: "Execute & Monitor",
        description: "Hit play and watch real-time logs stream in via SSE. Nodes light up as they execute sequentially.",
        icon: Play,
        color: "#60a5fa",
    },
    {
        id: 4,
        title: "Webhooks & Await",
        description: "Workflows can pause at webhook and await nodes, then resume when an external event arrives.",
        icon: Webhook,
        color: "#60a5fa",
    },
];


const getFeature = (index: number): Feature => features[index % features.length]!;




export default function ScrollSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [smoothProgress, setSmoothProgress] = useState(0);
    const [isInView, setIsInView] = useState(false);
    const animationRef = useRef<number>(0);

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const activeFeature = getFeature(activeIndex);
    const nextFeature = getFeature(activeIndex + 1);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;
            const section = sectionRef.current;
            const rect = section.getBoundingClientRect();
            const scrollableDistance = section.offsetHeight - window.innerHeight;
            const scrollProgress = Math.max(0, Math.min(1, -rect.top / scrollableDistance));
            setProgress(scrollProgress);

            // Check if section is in viewport
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            setIsInView(inView);
        };

        const animate = () => {
            setSmoothProgress(prev => {
                const newProgress = lerp(prev, progress, 0.06);
                const featureIndex = Math.min(features.length - 1, Math.floor(newProgress * features.length));
                setActiveIndex(featureIndex);
                return newProgress;
            });
            animationRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            cancelAnimationFrame(animationRef.current);
        };
    }, [progress]);

    const gradientOpacity = Math.min(0.4, smoothProgress * 0.5);
    const rotateY = Math.sin(smoothProgress * Math.PI * 2) * 5;
    const rotateX = Math.cos(smoothProgress * Math.PI) * 3;

    return (
        <section ref={sectionRef} className="relative h-[400vh] bg-[#030303]">
           

            {/* Sticky container */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
  
               

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Left: Text */}
                        <div className="space-y-6">
                            {/* Node progress indicator */}
                            {/* <div className="flex items-center gap-3 mb-8">
                                {features.map((feature, i) => (
                                    <div key={i} className="flex items-center">
                                        <div
                                            className="relative w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-700"
                                            style={{
                                                borderColor: i <= activeIndex ? feature.color : 'rgba(255,255,255,0.2)',
                                                backgroundColor: i < activeIndex ? feature.color : 'transparent',
                                                boxShadow: i === activeIndex ? `0 0 20px ${feature.color}60` : 'none',
                                                transform: i === activeIndex ? 'scale(1.3)' : 'scale(1)',
                                            }}
                                        >
                                            {i === activeIndex && (
                                                <div className="absolute inset-0 rounded-full animate-ping"
                                                    style={{ backgroundColor: `${feature.color}40` }}
                                                />
                                            )}
                                        </div>
                                        {i < features.length - 1 && (
                                            <div className="relative w-12 h-0.5 mx-1 overflow-hidden rounded-full bg-white/10">
                                                <div
                                                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                                                    style={{
                                                        width: i < activeIndex ? '100%' : i === activeIndex ? `${(smoothProgress * features.length - i) * 100}%` : '0%',
                                                        background: `linear-gradient(90deg, ${feature.color}, ${getFeature(i + 1).color})`,
                                                    }}
                                                />
                                                {i === activeIndex && (
                                                    <div
                                                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                                                        style={{
                                                            left: `${((smoothProgress * features.length - i) * 100) - 10}%`,
                                                            background: feature.color,
                                                            boxShadow: `0 0 10px ${feature.color}`,
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div> */}

                            {/* Title */}
                            <div className="relative h-[120px] overflow-hidden">
                                {features.map((feature, i) => (
                                    <h2
                                        key={feature.id}
                                        className="absolute inset-0 text-4xl md:text-6xl font-bold text-white"
                                        style={{
                                            opacity: i === activeIndex ? 1 : 0,
                                            transform: `translateY(${i === activeIndex ? 0 : i < activeIndex ? -100 : 100}%) rotateX(${i === activeIndex ? 0 : 10}deg)`,
                                            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                                        }}
                                    >
                                        {feature.title}
                                    </h2>
                                ))}
                            </div>
                            <div className="relative h-[80px] overflow-hidden">
                                {features.map((feature, i) => (
                                    <p
                                        key={feature.id}
                                        className="absolute inset-0 text-lg md:text-xl text-white/50 leading-relaxed"
                                        style={{
                                            opacity: i === activeIndex ? 1 : 0,
                                            transform: `translateY(${i === activeIndex ? 0 : i < activeIndex ? -100 : 100}%)`,
                                            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
                                        }}
                                    >
                                        {feature.description}
                                    </p>
                                ))}
                            </div>

                            {/* CTA */}
                            {/* <button
                                className="group flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-500 mt-4"
                                style={{
                                    background: `linear-gradient(135deg, ${activeFeature.color}20, transparent)`,
                                    border: `1px solid ${activeFeature.color}40`,
                                }}
                            >
                                <span className="text-white/80 group-hover:text-white transition-colors">Learn more</span>
                                <svg className="w-4 h-4 text-white/60 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button> */}
                        </div>

                        {/* Right: 3D Node */}
                        <div className="flex items-center justify-center perspective-1000">
                            <div
                                className="relative"
                                style={{
                                    transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
                                    transition: 'transform 0.3s ease-out',
                                    transformStyle: 'preserve-3d',
                                }}
                            >
                               

                                {/* Outer ring */}
                                <div
                                    className="absolute -inset-16 rounded-full pointer-events-none"
                                    style={{
                                        border: `2px dashed ${activeFeature.color}30`,
                                        transform: `rotate(${smoothProgress * 180}deg)`,
                                        transition: 'border-color 0.5s ease-out',
                                    }}
                                />

                                {/* Inner ring */}
                                <div
                                    className="absolute -inset-8 rounded-[48px] pointer-events-none"
                                    style={{
                                        border: `1px solid ${activeFeature.color}20`,
                                        transition: 'border-color 0.5s ease-out',
                                    }}
                                />

                                {/* Glow */}
                                <div
                                    // className="absolute inset-0 rounded-[32px] blur-2xl scale-125 transition-all duration-700"
                                    // style={{ background: `${activeFeature.color}25` }}
                                />

                                {/* Main card */}
                                <div
                                    className="relative w-44 h-44 rounded-[32px] flex items-center justify-center"
                                    style={{
                                        // background: `linear-gradient(135deg, ${activeFeature.color}15 0%, #0f1f1f 50%, #0a1a1a 100%)`,
                                        // boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 60px -20px ${activeFeature.color}40`,
                                        border: `1px solid ${activeFeature.color}30`,
                                        transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                                        transform: 'translateZ(40px)',
                                    }}
                                >
                                    {features.map((feature, i) => {
                                        // Calculate rotation based on index difference
                                        const indexDiff = i - activeIndex;
                                        const rotateY3D = indexDiff * 100;
                                        const rotateZ = i === activeIndex ? 0 : (i < activeIndex ? -180 : 180);

                                        return (
                                            <feature.icon
                                                key={feature.id}
                                                className="absolute w-20 h-20"
                                                style={{
                                                    opacity: i === activeIndex ? 1 : 0,
                                                    transform: `
                                                        perspective(500px)
                                                        rotateY(${i === activeIndex ? 0 : rotateY3D}deg)
                                                        rotateZ(${rotateZ}deg)
                                                        scale(${i === activeIndex ? 1 : 0.3})
                                                    `,
                                                    color: feature.color,
                                                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                                                    filter: `drop-shadow(0 0 25px ${feature.color}80)`,
                                                }}
                                                strokeWidth={1.5}
                                            />
                                        );
                                    })}
                                </div>

                                {/* Orbiting nodes */}
                                {/* {[0, 1, 2].map((i) => {
                                    const orbitFeature = getFeature(activeIndex + i);
                                    return (
                                        <div
                                            key={i}
                                            className="absolute w-3 h-3 rounded-full"
                                            style={{
                                                background: orbitFeature.color,
                                                boxShadow: `0 0 15px ${orbitFeature.color}`,
                                                top: '50%',
                                                left: '50%',
                                                transform: `rotate(${(smoothProgress * 360) + (i * 120)}deg) translateX(${100 + i * 20}px) translateY(-50%)`,
                                                transition: 'background 0.5s, box-shadow 0.5s',
                                            }}
                                        />
                                    );
                                })} */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}
