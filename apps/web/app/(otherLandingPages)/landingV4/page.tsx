"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    Github,
    ArrowRight,
    Webhook,
    MousePointerClick,
    Star,
    Menu,
    X,
    ArrowDown,
} from "lucide-react";

/* ════════════════════════ GSAP SCROLL PAGE ════════════════════════ */

export default function LandingV4() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [triggered, setTriggered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerBtnRef = useRef<HTMLButtonElement>(null);
    const dotBgRef = useRef<HTMLDivElement>(null);

    /* refs for each story section */
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);
    const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
    const textRefs = useRef<(HTMLDivElement | null)[]>([]);
    const lineRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("token"));
    }, []);

    const go = () => router.push(isLoggedIn ? "/workflows" : "/signup");

    /* ─── GSAP init ─── */
    useEffect(() => {
        let ctx: any;
        const initGSAP = async () => {
            const gsapModule = await import("gsap");
            const scrollModule = await import("gsap/ScrollTrigger");
            const gsap = gsapModule.default;
            gsap.registerPlugin(scrollModule.ScrollTrigger);

            ctx = gsap.context(() => {
                /* ── story sections: each node + text block ── */
                sectionRefs.current.forEach((section, i) => {
                    if (!section) return;
                    const node = nodeRefs.current[i];
                    const text = textRefs.current[i];
                    const isLeft = i % 2 === 0;

                    if (node) {
                        gsap.fromTo(
                            node,
                            {
                                x: isLeft ? -120 : 120,
                                opacity: 0,
                                scale: 0.6,
                                rotate: isLeft ? -8 : 8,
                            },
                            {
                                x: 0,
                                opacity: 1,
                                scale: 1,
                                rotate: 0,
                                duration: 1,
                                ease: "power3.out",
                                scrollTrigger: {
                                    trigger: section,
                                    start: "top 75%",
                                    end: "top 35%",
                                    scrub: 1,
                                },
                            }
                        );
                    }

                    if (text) {
                        gsap.fromTo(
                            text,
                            { y: 50, opacity: 0 },
                            {
                                y: 0,
                                opacity: 1,
                                duration: 1,
                                ease: "power2.out",
                                scrollTrigger: {
                                    trigger: section,
                                    start: "top 65%",
                                    end: "top 30%",
                                    scrub: 1,
                                },
                            }
                        );
                    }
                });

                /* ── S-curve path ── */
                if (lineRef.current) {
                    const path = lineRef.current.querySelector("path");
                    if (path) {
                        const length = path.getTotalLength();
                        gsap.set(path, {
                            strokeDasharray: length,
                            strokeDashoffset: length,
                        });
                        gsap.to(path, {
                            strokeDashoffset: 0,
                            ease: "none",
                            scrollTrigger: {
                                trigger: containerRef.current,
                                start: "top top",
                                end: "bottom bottom",
                                scrub: 2,
                            },
                        });
                    }
                }
            }, containerRef);
        };

        initGSAP();
        return () => ctx?.revert();
    }, [triggered]);

    /* ─── Manual Trigger click ─── */
    const handleTrigger = () => {
        setTriggered(true);
        setTimeout(() => {
            const target = sectionRefs.current[0];
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }, 600);
    };

    /* ─── Story sections data ─── */
    const storySections = [
        {
            id: "telegram",
            icon: <Image src="/telegram.svg" alt="Telegram" width={28} height={28} className="invert" />,
            nodeLabel: "Telegram",
            nodeColor: "#60a5fa",
            headline: "Busy enough?",
            sub: "Let our workflow handle your Telegram messages. Auto-respond, forward, or trigger actions from any chat.",
            align: "left" as const,
        },
        {
            id: "gmail",
            icon: <Image src="/sendmail.svg" alt="Gmail" width={28} height={28} className="invert" />,
            nodeLabel: "Gmail / SMTP",
            nodeColor: "#93c5fd",
            headline: "Too many mails?",
            sub: "Let our workflow handle it all. Send, filter, and automate your email pipeline — no more manual sorting.",
            align: "right" as const,
        },
        {
            id: "ai",
            icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
            ),
            nodeLabel: "AI Agent",
            nodeColor: "#60a5fa",
            headline: "What to write? I'm tired.",
            sub: "Let our AI node draft it for you. Gemini 2.0 Flash generates content and passes output to the next node.",
            align: "left" as const,
            hasOutput: true,
        },
        {
            id: "data",
            icon: <Image src="/sendMail&wait.svg" alt="Await" width={28} height={28} className="invert" />,
            nodeLabel: "Get Previous Data",
            nodeColor: "#93c5fd",
            headline: "Need data from previous nodes?",
            sub: "Each node can access outputs from any node that ran before it. Chain results effortlessly.",
            align: "right" as const,
            hasButton: true,
        },
        {
            id: "webhook",
            icon: <Webhook className="w-7 h-7" />,
            nodeLabel: "Webhook",
            nodeColor: "#60a5fa",
            headline: "Wait for the outside world.",
            sub: "Pause your workflow until an external event arrives via HTTP. Human-in-the-loop, API callbacks, anything.",
            align: "left" as const,
        },
    ];

    return (
        <main ref={containerRef} className="relative min-h-screen w-full bg-[#08080c] text-white antialiased selection:bg-blue-400/20 overflow-x-hidden">
            {/* Fonts */}
            {/* eslint-disable-next-line @next/next/no-page-custom-font */}
            <link
                href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />
            <style>{`
                :root { --serif: 'Playfair Display', Georgia, serif; --sans: 'Inter', system-ui, sans-serif; }
                body, * { font-family: var(--sans); }
                .font-ed { font-family: var(--serif); }

                .dot-bg {
                    background-image: radial-gradient(circle, rgba(96,165,250,0.12) 1px, transparent 1px);
                    background-size: 24px 24px;
                }
                
                .grain::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    pointer-events: none;
                    opacity: 0.02;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
                    background-size: 128px 128px;
                }

                @keyframes pulse-ring {
                    0% { transform: scale(1); opacity: 0.4; }
                    100% { transform: scale(2.2); opacity: 0; }
                }
                .pulse-ring { animation: pulse-ring 2s ease-out infinite; }
            `}</style>

            <div className="grain" />

            {/* ═══ NAVBAR ═══ */}
            <nav className="fixed top-0 left-0 right-0 z-50">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="mt-5 flex items-center justify-between rounded-full border border-white/5 bg-[#08080c]/70 backdrop-blur-2xl px-6 py-3">
                        <Link href="/landingV4" className="flex items-center gap-2.5 group">
                            <div className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Image src="/workflow.svg" alt="" width={13} height={13} className="invert" />
                            </div>
                            <span className="font-ed text-[15px] italic text-white/80 tracking-tight">autm8n</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-4">
                            <Link href="/signin" className="text-[12px] text-white/30 hover:text-white/60 transition-colors">
                                Sign in
                            </Link>
                            <button
                                onClick={go}
                                className="text-[12px] font-medium px-5 py-2 rounded-full bg-white/8 border border-white/6 text-white/70 hover:bg-white/14 transition-all duration-300"
                            >
                                Get Started →
                            </button>
                        </div>

                        <button className="md:hidden text-white/40" onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>

                    {menuOpen && (
                        <div className="md:hidden mt-2 rounded-2xl border border-white/5 bg-[#0c0c12]/95 backdrop-blur-2xl p-6 space-y-4">
                            <Link href="/signin" className="block text-sm text-white/40">Sign in</Link>
                            <button onClick={() => { setMenuOpen(false); go(); }} className="w-full text-sm py-2.5 rounded-full bg-white/8 text-white/70">
                                Get Started →
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* ═══ HERO — Manual Trigger ═══ */}
            <section className="relative min-h-dvh flex flex-col items-center justify-center text-center px-6 overflow-hidden">
                {/* Ambient */}
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(96,165,250,0.04) 0%, transparent 70%)" }} />

                {/* Open source pill */}
                <div className="mb-12 opacity-0 animate-[fadeIn_0.6s_0.2s_forwards]">
                    <Link
                        href="https://github.com/amrithehe/n8n"
                        target="_blank"
                        className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/6 text-[11px] uppercase tracking-[0.2em] text-white/25 hover:text-white/50 hover:border-white/12 transition-all duration-300"
                    >
                        <Star className="w-3 h-3 text-amber-400/50" />
                        Open Source
                    </Link>
                </div>

                {/* Headline */}
                <h1
                    className="font-ed text-[clamp(2.8rem,8vw,6rem)] font-medium leading-[1.05] tracking-[-0.02em] mb-6 opacity-0 animate-[fadeIn_0.8s_0.3s_forwards]"
                >
                    <span className="text-white/90">Every workflow starts</span>
                    <br />
                    <span className="italic text-white/90">with a </span>
                    <span className="italic bg-linear-to-r from-blue-300 via-blue-400 to-blue-300 bg-clip-text text-transparent">
                        trigger
                    </span>
                </h1>

                <p className="text-[14px] text-white/25 font-light max-w-sm mb-12 leading-relaxed opacity-0 animate-[fadeIn_0.7s_0.5s_forwards]">
                    Click the button below to start your first automation.
                </p>

                {/* Manual Trigger Button */}
                <div className="relative opacity-0 animate-[fadeIn_0.8s_0.7s_forwards]">
                    {/* Pulse rings */}
                    {!triggered && (
                        <>
                            <div className="absolute inset-0 rounded-3xl border border-blue-400/20 pulse-ring" />
                            <div className="absolute inset-0 rounded-3xl border border-blue-400/15 pulse-ring" style={{ animationDelay: "0.7s" }} />
                        </>
                    )}

                    <button
                        ref={triggerBtnRef}
                        onClick={handleTrigger}
                        disabled={triggered}
                        className={`relative w-24 h-24 rounded-3xl border flex flex-col items-center justify-center gap-2 transition-all duration-700 ${triggered
                            ? "bg-blue-400/20 border-blue-400/30 shadow-[0_0_60px_rgba(96,165,250,0.2)] scale-95"
                            : "bg-white/3 border-white/8 hover:border-blue-400/30 hover:bg-blue-400/6 hover:shadow-[0_0_40px_rgba(96,165,250,0.12)] cursor-pointer hover:scale-105 active:scale-95"
                            }`}
                    >
                        <MousePointerClick className={`w-7 h-7 transition-colors duration-500 ${triggered ? "text-blue-300" : "text-white/40"}`} />
                        <span className={`text-[9px] uppercase tracking-[0.15em] transition-colors duration-500 ${triggered ? "text-blue-300/70" : "text-white/20"}`}>
                            {triggered ? "Running" : "Trigger"}
                        </span>
                    </button>
                </div>

                {/* Scroll prompt (after trigger) */}
                {triggered && (
                    <div className="mt-12 flex flex-col items-center gap-2 animate-[fadeIn_0.5s_forwards]">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-white/15">Scroll to explore</span>
                        <ArrowDown className="w-4 h-4 text-white/15 animate-bounce" />
                    </div>
                )}
            </section>

            {/* ═══ DOT BACKGROUND TRANSITION ═══ */}
            {triggered && (
                <div
                    ref={dotBgRef}
                    className="dot-bg animate-[fadeIn_1s_forwards]"
                >
                    {/* ═══ S-CURVE SVG PATH ═══ */}
                    <div className="absolute inset-0 pointer-events-none hidden lg:block">
                        <svg
                            ref={lineRef}
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full"
                            viewBox="0 0 1200 5000"
                            preserveAspectRatio="none"
                            fill="none"
                        >
                            <path
                                d="M 600 0 C 200 400, 1000 800, 600 1000 C 200 1200, 1000 1600, 600 1800 C 200 2000, 1000 2400, 600 2600 C 200 2800, 1000 3200, 600 3400 C 200 3600, 1000 4000, 600 4200"
                                stroke="url(#line-grad)"
                                strokeWidth="1"
                                strokeLinecap="round"
                                opacity="0.15"
                            />
                            <defs>
                                <linearGradient id="line-grad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
                                    <stop offset="10%" stopColor="#60a5fa" stopOpacity="1" />
                                    <stop offset="90%" stopColor="#93c5fd" stopOpacity="1" />
                                    <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    {/* ═══ STORY SECTIONS ═══ */}
                    {storySections.map((s, i) => (
                        <section
                            key={s.id}
                            ref={(el) => { sectionRefs.current[i] = el; }}
                            className="relative min-h-[90vh] flex items-center px-6 py-20"
                        >
                            <div className={`max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${s.align === "right" ? "lg:direction-rtl" : ""}`}>

                                {/* NODE CARD */}
                                <div
                                    ref={(el) => { nodeRefs.current[i] = el; }}
                                    className={`flex justify-center ${s.align === "right" ? "lg:order-2" : "lg:order-1"}`}
                                    style={{ direction: "ltr" }}
                                >
                                    <div className="relative group">
                                        {/* Glow */}
                                        <div
                                            className="absolute inset-0 rounded-3xl blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                                            style={{ background: s.nodeColor, opacity: 0.08 }}
                                        />

                                        {/* Main node card */}
                                        <div
                                            className="relative w-36 h-36 md:w-44 md:h-44 rounded-3xl border flex flex-col items-center justify-center gap-3 transition-all duration-500 group-hover:scale-[1.03]"
                                            style={{
                                                background: `linear-gradient(135deg, ${s.nodeColor}15, ${s.nodeColor}05)`,
                                                borderColor: `${s.nodeColor}25`,
                                            }}
                                        >
                                            <div className="text-white/80">{s.icon}</div>
                                            <span className="text-[11px] uppercase tracking-[0.12em] text-white/35 font-medium">
                                                {s.nodeLabel}
                                            </span>

                                            {/* Connection dots */}
                                            <div
                                                className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2"
                                                style={{ borderColor: `${s.nodeColor}40`, background: `${s.nodeColor}20` }}
                                            />
                                            <div
                                                className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2"
                                                style={{ borderColor: `${s.nodeColor}40`, background: `${s.nodeColor}20` }}
                                            />
                                        </div>

                                        {/* AI output mock */}
                                        {s.hasOutput && (
                                            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-56 px-4 py-3 rounded-xl bg-white/3 border border-white/6 text-[10px] text-white/25 font-mono">
                                                <span className="text-blue-400/50">output: </span>
                                                &quot;Here&apos;s the drafted email content...&quot;
                                            </div>
                                        )}

                                        {/* Get data button */}
                                        {s.hasButton && (
                                            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
                                                <div className="px-5 py-2.5 rounded-full bg-blue-400/10 border border-blue-400/20 text-[11px] text-blue-300/70 font-medium whitespace-nowrap flex items-center gap-2">
                                                    <ArrowRight className="w-3 h-3" />
                                                    Get data from previous node
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* TEXT */}
                                <div
                                    ref={(el) => { textRefs.current[i] = el; }}
                                    className={`${s.align === "right" ? "lg:order-1 lg:text-right" : "lg:order-2 lg:text-left"} text-center lg:text-inherit`}
                                    style={{ direction: "ltr" }}
                                >
                                    <h2 className="font-ed text-3xl md:text-5xl lg:text-[3.5rem] font-medium leading-[1.1] text-white/90 mb-4">
                                        <em className="italic">{s.headline}</em>
                                    </h2>
                                    <p className="text-[14px] md:text-[15px] text-white/25 font-light leading-relaxed max-w-md mx-auto lg:mx-0">
                                        {s.sub}
                                    </p>
                                </div>
                            </div>
                        </section>
                    ))}

                    {/* ═══ FINAL CTA ═══ */}
                    <section className="relative min-h-[80vh] flex items-center justify-center px-6 py-20">
                        <div className="text-center max-w-2xl mx-auto">
                            <div className="w-14 h-14 rounded-full border border-white/6 flex items-center justify-center mx-auto mb-10">
                                <Github className="w-6 h-6 text-white/25" />
                            </div>

                            <h2 className="font-ed text-4xl md:text-[3.5rem] text-white/90 leading-[1.1] mb-4">
                                Ready to <em className="italic bg-linear-to-r from-blue-300 to-blue-400 bg-clip-text text-transparent">automate?</em>
                            </h2>
                            <p className="text-[14px] text-white/25 font-light max-w-sm mx-auto mb-10 leading-relaxed">
                                Open-source. Self-hostable. Built in public.
                                <br />
                                Your workflows, your data.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <button
                                    onClick={go}
                                    className="group flex items-center gap-2 px-8 py-3.5 rounded-full bg-blue-400/90 hover:bg-blue-400 text-[13px] font-medium text-white transition-all duration-300 hover:shadow-[0_0_50px_rgba(96,165,250,0.2)]"
                                >
                                    {isLoggedIn ? "Go to Dashboard" : "Start Building Free"}
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                                <Link
                                    href="https://github.com/amrithehe/n8n"
                                    target="_blank"
                                    className="group flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#08080c] text-[13px] font-medium hover:bg-blue-100 transition-colors duration-300"
                                >
                                    <Star className="w-3.5 h-3.5" />
                                    Star on GitHub
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* ═══ FOOTER ═══ */}
                    <footer className="relative py-24 overflow-hidden">
                        <div className="max-w-5xl mx-auto px-6">
                            {/* Watermark */}
                            <div className="text-center select-none mb-12 overflow-hidden">
                                <h2 className="font-ed italic text-[clamp(5rem,20vw,14rem)] font-light tracking-tight leading-none text-white/2">
                                    autm8n
                                </h2>
                            </div>

                            <div className="h-px bg-white/4 mb-8" />

                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-white/15">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center">
                                        <Image src="/workflow.svg" alt="" width={10} height={10} className="invert" />
                                    </div>
                                    <span className="font-ed italic text-white/25 text-[13px]">autm8n</span>
                                </div>

                                <div className="flex items-center gap-6">
                                    <Link href="https://github.com/amrithehe/n8n" target="_blank" className="hover:text-white/35 transition-colors">
                                        GitHub
                                    </Link>
                                    <Link href="https://github.com/amrithehe" target="_blank" className="hover:text-white/35 transition-colors">
                                        @amrithehe
                                    </Link>
                                </div>

                                <p className="text-[11px]">
                                    © 2025 autm8n · built by{" "}
                                    <Link href="https://github.com/amrithehe" target="_blank" className="text-white/25 hover:text-white/40 transition-colors">
                                        amrit
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </footer>
                </div>
            )}

            {/* fadeIn keyframe */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </main>
    );
}
