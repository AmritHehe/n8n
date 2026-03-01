"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Webhook, MousePointerClick } from "lucide-react";
import Image from "next/image";

const workflowNodes = [
    {
        id: "trigger",
        label: "Manual Trigger",
        description: "Start your workflow with a single click. Perfect for testing and one-time runs.",
        icon: <MousePointerClick className="w-7 h-7" />,
        color: "#60a5fa",
    },
    {
        id: "webhook",
        label: "Webhook",
        description: "Pause execution and wait for an external HTTP request to resume. Great for API integrations.",
        icon: <Webhook className="w-7 h-7" />,
        color: "#93c5fd",
    },
    {
        id: "aiagent",
        label: "AI Agent",
        description: "Process text with Gemini 2.0 Flash via LangChain. Chain AI output into other nodes.",
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
        ),
        color: "#60a5fa",
    },
    {
        id: "gmail",
        label: "Gmail / SMTP",
        description: "Send emails via any SMTP server. Supports HTML templates and attachments.",
        icon: <Image src="/sendmail.svg" alt="Send Mail" width={28} height={28} className="invert opacity-90" />,
        color: "#93c5fd",
    },
    {
        id: "telegram",
        label: "Telegram",
        description: "Send messages to Telegram chats or channels via your bot token.",
        icon: <Image src="/telegram.svg" alt="Telegram" width={28} height={28} className="invert opacity-90" />,
        color: "#60a5fa",
    },
    {
        id: "awaitGmail",
        label: "Await Response",
        description: "Send an email with a callback link, then pause until the recipient clicks it. Human-in-the-loop.",
        icon: <Image src="/sendMail&wait.svg" alt="Send Mail & Wait" width={28} height={28} className="invert opacity-90" />,
        color: "#93c5fd",
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
            <div className="absolute inset-0 bg-linear-to-r from-white/20 to-white/5" />
            <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-1/3 bg-linear-to-r from-transparent via-white/50 to-transparent"
            />
        </motion.div>
    );
}

export default function WorkflowAnimation() {
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    return (
        <section className="relative py-28 overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-400/10 rounded-full blur-[150px]" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <p className="text-sm font-medium text-blue-400 uppercase tracking-widest mb-3">Available Nodes</p>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Everything you need to automate
                    </h2>
                    <p className="text-base text-white/50 max-w-lg mx-auto">
                        Drag, connect, and configure. Each node handles a specific integration or action.
                    </p>
                </motion.div>

                {/* Workflow visualization */}
                <div className="relative max-w-5xl mx-auto">
                    <div className="relative p-8 md:p-10 rounded-3xl bg-white/3 border border-white/1backdrop-blur-xl overflow-visible shadow-2xl">
                        <div className="absolute inset-0 bg-linear-to-r from-white/5 to-transparent pointer-events-none rounded-3xl" />

                        {/* Nodes row */}
                        <div className="relative flex items-center justify-center flex-wrap gap-8 md:gap-0 md:flex-nowrap py-8">
                            {workflowNodes.map((node, index) => (
                                <div key={node.id} className="flex w-full items-center justify-center">
                                    <WorkflowNode
                                        node={node}
                                        index={index}
                                        hoveredNode={hoveredNode}
                                        setHoveredNode={setHoveredNode}
                                    />
                                    {/* {index < workflowNodes.length - 1 && (
                                        <ConnectionLine index={index} />
                                    )} */}
                                </div>
                            ))}
                        </div>

                        {/* Status indicator */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            className="mt-8 flex items-center justify-center gap-4"
                        >
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-400/10 border border-blue-400/20 backdrop-blur-xl">
                                <span className="text-sm text-blue-400">Hover to explore each node</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
