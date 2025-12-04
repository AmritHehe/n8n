"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// Unified color palette
const workflowNodes = [
    {
        id: "trigger",
        label: "Manual Trigger",
        description: "Start your workflow manually or on a schedule. Perfect for testing and one-time runs.",
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        color: "#a855f7", // purple
    },
    {
        id: "webhook",
        label: "Webhook",
        description: "Receive data from external services. Instant triggers from any HTTP request.",
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        color: "#3b82f6", // blue
    },
    {
        id: "ai",
        label: "AI Agent",
        description: "Process data with GPT-4, Claude, or any LLM. Intelligent decision making built-in.",
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        color: "#ec4899", // pink
    },
    {
        id: "smtp",
        label: "SMTP Email",
        description: "Send emails via any SMTP server. Templates, attachments, and HTML support.",
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        color: "#06b6d4", // cyan
    },
    {
        id: "telegram",
        label: "Telegram",
        description: "Send messages to Telegram chats or bots. Rich media and interactive buttons.",
        icon: (
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
        ),
        color: "#8b5cf6", // violet
    },
    {
        id: "wait",
        label: "Wait for Response",
        description: "Pause workflow until user responds. Perfect for approval flows and human-in-the-loop.",
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        color: "#06b6d4", // cyan
    },
];

function WorkflowNode({
    node,
    index,
    hoveredNode,
    setHoveredNode
}: {
    node: typeof workflowNodes[0];
    index: number;
    hoveredNode: string | null;
    setHoveredNode: (id: string | null) => void;
}) {
    const isHovered = hoveredNode === node.id;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            className="relative group cursor-pointer"
        >
            {/* Glow */}
            <motion.div
                animate={{ opacity: isHovered ? 0.6 : 0 }}
                className="absolute inset-0 rounded-2xl blur-xl"
                style={{ background: node.color }}
            />

            {/* Node with glassmorphism */}
            <motion.div
                animate={{ scale: isHovered ? 1.1 : 1 }}
                className="relative w-20 h-20 rounded-2xl border backdrop-blur-xl flex items-center justify-center transition-colors"
                style={{
                    background: `linear-gradient(135deg, ${node.color}30, ${node.color}10)`,
                    borderColor: isHovered ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                    boxShadow: isHovered ? `0 0 40px ${node.color}40` : 'none'
                }}
            >
                <div className="text-white">{node.icon}</div>
            </motion.div>

            {/* Label */}
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-white/50">
                {node.label}
            </div>

            {/* Tooltip on hover */}
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{
                    opacity: isHovered ? 1 : 0,
                    y: isHovered ? 0 : 10,
                    scale: isHovered ? 1 : 0.9
                }}
                className="absolute -top-32 left-1/2 -translate-x-1/2 w-60 p-4 rounded-xl bg-black/90 border border-white/10 backdrop-blur-xl z-50 pointer-events-none"
            >
                <div className="flex items-center gap-2 mb-2">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: `${node.color}30` }}
                    >
                        <div className="text-white scale-75">{node.icon}</div>
                    </div>
                    <span className="font-semibold text-white text-sm">{node.label}</span>
                </div>
                <p className="text-white/60 text-xs leading-relaxed">{node.description}</p>
                <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rotate-45 bg-black/90 border-r border-b border-white/10"
                />
            </motion.div>
        </motion.div>
    );
}

function ConnectionLine({ index }: { index: number }) {
    return (
        <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
            style={{ transformOrigin: "left" }}
            className="w-14 h-[2px] mx-2 relative hidden md:block"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/5" />
            <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />
        </motion.div>
    );
}

export default function WorkflowAnimation() {
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    return (
        <section className="relative py-28 overflow-hidden">
            {/* Background glow - unified palette */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-cyan-600/10 rounded-full blur-[150px]" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <p className="text-sm font-medium text-purple-400 uppercase tracking-widest mb-3">Live Workflow</p>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        See it in <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">action</span>
                    </h2>
                    <p className="text-base text-white/50 max-w-lg mx-auto">
                        A real workflow that receives webhooks, processes with AI, and sends notifications.
                    </p>
                </motion.div>

                {/* Workflow visualization with glassmorphism */}
                <div className="relative max-w-5xl mx-auto">
                    {/* Glass container */}
                    <div className="relative p-8 md:p-10 rounded-3xl bg-white/[0.03] border border-white/[0.1] backdrop-blur-xl overflow-visible shadow-2xl">
                        {/* Inner gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none rounded-3xl" />

                        {/* Nodes row */}
                        <div className="relative flex items-center justify-center flex-wrap gap-8 md:gap-0 md:flex-nowrap py-8">
                            {workflowNodes.map((node, index) => (
                                <div key={node.id} className="flex items-center">
                                    <WorkflowNode
                                        node={node}
                                        index={index}
                                        hoveredNode={hoveredNode}
                                        setHoveredNode={setHoveredNode}
                                    />
                                    {index < workflowNodes.length - 1 && (
                                        <ConnectionLine index={index} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Execution indicator */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            className="mt-8 flex items-center justify-center gap-4"
                        >
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-sm text-emerald-400">Execution Successful</span>
                            </div>
                            <span className="text-white/30 text-sm">32ms</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
