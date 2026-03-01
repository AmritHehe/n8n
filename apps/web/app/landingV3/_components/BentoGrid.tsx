"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, MouseEvent } from "react";
import { Brain, UserCheck, Lock, Radio } from "lucide-react";

function BentoItem({ className = "", children, gradient, delay = 0 }: { className?: string; children: React.ReactNode; gradient?: string; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

    const handleMouseMove = (e: MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => { x.set(0); y.set(0); };

    return (
        <motion.div
            ref={ref}
            // onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={`relative group rounded-3xl border border-white/9 bg-white/2 backdrop-blur-xl overflow-hidden hover:border-white/15 transition-colors ${className}`}
        >
            {gradient && <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient}`} style={{ filter: "blur(50px)" }} />}
            <div className="relative z-10 h-full p-8">{children}</div>
        </motion.div>
    );
}

function MiniAIFlow() {
    const steps = [
        {
            label: "Prompt",
            icon: (
                <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
            ),
        },
        {
            label: "Gemini",
            icon: (
                <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
            ),
        },
        {
            label: "Output",
            icon: (
                <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
            ),
        },
    ];
    return (
        <div className="relative h-28 mt-6">
            <div className="absolute inset-0 flex items-center justify-between px-4">
                {steps.map((step, i) => (
                    <motion.div key={step.label} initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.12 }} className="flex flex-col items-center gap-2">
                        <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">{step.icon}</div>
                        <span className="text-[10px] text-white/40">{step.label}</span>
                    </motion.div>
                ))}
            </div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.4 }} x1="22%" y1="38%" x2="42%" y2="38%" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4,4" />
                <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.4 }} x1="58%" y1="38%" x2="78%" y2="38%" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4,4" />
            </svg>
        </div>
    );
}

export default function BentoGrid() {
    return (
        <section className="relative py-28 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-400/10 rounded-full blur-[180px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                    <p className="text-sm font-medium text-blue-400 uppercase tracking-widest mb-3">Why Autm8n</p>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-5 tracking-tight">
                        Built for <span className="bg-linear-to-r from-blue-300 to-blue-400 bg-clip-text text-transparent">real workflows</span>
                    </h2>
                    <p className="text-lg text-white/50 max-w-xl mx-auto">Not just another drag-and-drop. Actually useful automation.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto" style={{ perspective: "1000px" }}>
                    {/* AI-Powered Nodes — large card */}
                    <BentoItem className="md:col-span-2 lg:row-span-2" gradient="bg-linear-to-r from-blue-400/20 to-blue-300/20" delay={0.1}>
                        <motion.div animate={{ filter: ["drop-shadow(0 0 8px rgba(96,165,250,0.4))", "drop-shadow(0 0 15px rgba(96,165,250,0.6))", "drop-shadow(0 0 8px rgba(96,165,250,0.4))"] }} transition={{ duration: 2, repeat: Infinity }} className="w-12 h-12 rounded-xl bg-linear-to-r from-blue-300 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-400/25">
                            <Brain className="w-6 h-6 text-white" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-white mt-5 mb-2">AI-Powered Nodes</h3>
                        <p className="text-white/50 text-sm leading-relaxed">Built-in AI Agent node using Gemini 2.0 Flash via LangChain. Chain AI responses directly into emails, Telegram messages, or any other node in your workflow.</p>
                        <MiniAIFlow />
                    </BentoItem>

                    {/* Human-in-the-Loop */}
                    <BentoItem gradient="bg-linear-to-r from-blue-400/20 to-blue-300/20" delay={0.15}>
                        <div className="w-12 h-12 rounded-xl bg-linear-to-r from-blue-300 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-400/25">
                            <UserCheck className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mt-5 mb-2">Human-in-the-Loop</h3>
                        <p className="text-white/50 text-sm leading-relaxed">Await Gmail sends an email with a callback link. Workflow pauses until the recipient clicks it.</p>
                        <div className="mt-4 bg-black/30 rounded-lg p-3 text-[11px] space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="text-blue-400/80">Waiting for approval...</span>
                            </div>
                            <div className="text-white/30 font-mono">→ email sent to amritbx@gmail.com</div>
                        </div>
                    </BentoItem>

                    {/* Encrypted Credentials */}
                    <BentoItem gradient="bg-linear-to-r from-blue-400/20 to-blue-300/20" delay={0.2}>
                        <div className="w-12 h-12 rounded-xl bg-linear-to-r from-blue-300 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-400/25">
                            <Lock className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mt-5 mb-2">Encrypted Credentials</h3>
                        <p className="text-white/50 text-sm leading-relaxed">API keys and passwords are AES-encrypted at rest. Connect Telegram bots and SMTP accounts securely.</p>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            {["Telegram Bot", "SMTP", "AI Agent", "Webhook"].map((cred, i) => (
                                <motion.div key={i} initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.06 }} className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-white/50 text-center">
                                    {cred}
                                </motion.div>
                            ))}
                        </div>
                    </BentoItem>

                    {/* Real-time Execution Logs — wide card */}
                    <BentoItem className="lg:col-span-2" gradient="bg-linear-to-r from-blue-400/20 to-blue-300/20" delay={0.25}>
                        <div className="flex flex-col md:flex-row md:items-start gap-6">
                            <div className="flex-1">
                                <div className="w-12 h-12 rounded-xl bg-linear-to-r from-blue-300 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-400/25 relative overflow-hidden">
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute inset-0 opacity-30" style={{ background: "conic-gradient(from 0deg, transparent, white, transparent)" }} />
                                    <Radio className="w-6 h-6 text-white relative z-10" />
                                </div>
                                <h3 className="text-xl font-bold text-white mt-5 mb-2">Real-Time Execution Logs</h3>
                                <p className="text-white/50 text-sm leading-relaxed">Watch your workflow execute node-by-node with live SSE streaming. See exactly what happened, when, and debug faster.</p>
                            </div>
                            <div className="flex-1 bg-black/30 rounded-xl p-4 font-mono text-[11px] space-y-1.5">
                                {[
                                    { text: "Executing node 1 (trigger)", delay: 0.3 },
                                    { text: "Executing node 2 (aiagent)", delay: 0.5 },
                                    { text: "AI response stored", delay: 0.7 },
                                    { text: "Executing node 3 (gmail)", delay: 0.9 },
                                    { text: "Message sent", delay: 1.1 },
                                ].map((log, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: log.delay }}
                                        className="text-white/50"
                                    >
                                        {log.text}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </BentoItem>
                </div>
            </div>
        </section>
    );
}
