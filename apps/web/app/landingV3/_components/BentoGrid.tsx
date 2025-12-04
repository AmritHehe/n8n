"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, MouseEvent } from "react";
import { Zap, Code, Grid3X3, Sparkles } from "lucide-react";

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
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={`relative group rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl overflow-hidden hover:border-white/[0.15] transition-colors ${className}`}
        >
            {gradient && <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient}`} style={{ filter: "blur(50px)" }} />}
            <div className="relative z-10 h-full p-8">{children}</div>
        </motion.div>
    );
}

function MiniWorkflow() {
    const nodes = [{ emoji: "⚡", label: "Trigger" }, { emoji: "🔄", label: "Transform" }, { emoji: "📤", label: "Send" }];
    return (
        <div className="relative h-32 mt-6">
            <div className="absolute inset-0 flex items-center justify-between px-4">
                {nodes.map((node, i) => (
                    <motion.div key={node.label} initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.12 }} className="flex flex-col items-center gap-2">
                        <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-lg">{node.emoji}</div>
                        <span className="text-[10px] text-white/40">{node.label}</span>
                    </motion.div>
                ))}
            </div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.4 }} x1="22%" y1="40%" x2="42%" y2="40%" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4,4" />
                <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.4 }} x1="58%" y1="40%" x2="78%" y2="40%" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4,4" />
            </svg>
        </div>
    );
}

export default function BentoGrid() {
    return (
        <section className="relative py-28 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[180px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                    <p className="text-sm font-medium text-purple-400 uppercase tracking-widest mb-3">Why Autm8n</p>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-5 tracking-tight">
                        Built for <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">power users</span>
                    </h2>
                    <p className="text-lg text-white/50 max-w-xl mx-auto">Everything you need to automate at scale. No compromises.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto" style={{ perspective: "1000px" }}>
                    <BentoItem className="md:col-span-2 lg:row-span-2" gradient="bg-gradient-to-br from-amber-500/20 to-orange-500/20" delay={0.1}>
                        <motion.div animate={{ filter: ["drop-shadow(0 0 8px rgba(251,191,36,0.4))", "drop-shadow(0 0 15px rgba(251,191,36,0.6))", "drop-shadow(0 0 8px rgba(251,191,36,0.4))"] }} transition={{ duration: 2, repeat: Infinity }} className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                            <Zap className="w-6 h-6 text-white" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-white mt-5 mb-2">Lightning Fast Execution</h3>
                        <p className="text-white/50 text-sm leading-relaxed">Our engine processes millions of workflow executions daily. Built on a high-performance runtime that scales horizontally.</p>
                        <MiniWorkflow />
                    </BentoItem>

                    <BentoItem gradient="bg-gradient-to-br from-violet-500/20 to-purple-500/20" delay={0.15}>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                            <Code className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mt-5 mb-2">Code When You Need It</h3>
                        <p className="text-white/50 text-sm leading-relaxed">Write JavaScript or Python directly in nodes.</p>
                        <div className="mt-4 bg-black/30 rounded-lg p-3 font-mono text-[11px] text-green-400/80">
                            <div className="text-white/25">// Transform</div>
                            <div><span className="text-purple-400">const</span> r = items.<span className="text-cyan-400">map</span>(i =&gt; &#123;...&#125;);</div>
                        </div>
                    </BentoItem>

                    <BentoItem gradient="bg-gradient-to-br from-cyan-500/20 to-blue-500/20" delay={0.2}>
                        <motion.div animate={{ rotate: [0, 3, -3, 0] }} transition={{ duration: 4, repeat: Infinity }} className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                            <Grid3X3 className="w-6 h-6 text-white" />
                        </motion.div>
                        <h3 className="text-lg font-bold text-white mt-5 mb-2">500+ Ready Nodes</h3>
                        <p className="text-white/50 text-sm leading-relaxed">Slack to Salesforce, Postgres to S3.</p>
                        <div className="mt-4 grid grid-cols-4 gap-1.5">
                            {["📧", "💬", "📊", "🗄️", "📱", "🔔", "📁", "🌐"].map((e, i) => (
                                <motion.div key={i} initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.04 }} className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center text-sm">{e}</motion.div>
                            ))}
                        </div>
                    </BentoItem>

                    <BentoItem className="lg:col-span-2" gradient="bg-gradient-to-br from-pink-500/20 to-rose-500/20" delay={0.25}>
                        <div className="flex flex-col md:flex-row md:items-start gap-6">
                            <div className="flex-1">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/25 relative overflow-hidden">
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute inset-0 opacity-30" style={{ background: "conic-gradient(from 0deg, transparent, white, transparent)" }} />
                                    <Sparkles className="w-6 h-6 text-white relative z-10" />
                                </div>
                                <h3 className="text-xl font-bold text-white mt-5 mb-2">AI That Actually Works</h3>
                                <p className="text-white/50 text-sm leading-relaxed">Deploy autonomous agents with LangChain. Memory, tools, reasoning built-in. Connect OpenAI, Anthropic, or self-hosted.</p>
                            </div>
                            <div className="flex-1 relative h-32 flex items-center justify-center">
                                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }} className="relative">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500/30 to-rose-500/30 blur-xl absolute inset-0" />
                                    <div className="relative text-4xl">🤖</div>
                                </motion.div>
                                {[0, 1, 2].map((i) => (
                                    <motion.div key={i} animate={{ rotate: 360 }} transition={{ duration: 7 + i * 2, repeat: Infinity, ease: "linear" }} className="absolute" style={{ width: `${80 + i * 30}px`, height: `${80 + i * 30}px` }}>
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-pink-400/50" />
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
