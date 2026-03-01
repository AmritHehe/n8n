"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Workflow, ArrowRight, Star } from "lucide-react";
import ElectricalDither from "./components/shaders/ShaderDither";
import ElectricalDitherNice  from "./components/shaders/ElectricalDither2";

const nodes = [
    { name: "Telegram", desc: "Send messages to Telegram chats and channels", icon: "/telegram.svg" },
    { name: "Gmail", desc: "Send emails through SMTP with full control", icon: "/sendmail.svg" },
    { name: "Await Gmail", desc: "Pause workflow and wait for an email reply", icon: "/sendMail&wait.svg" },
    { name: "Webhook", desc: "Trigger workflows from HTTP requests", icon: "/workflow.svg" },
];

export default function LandingPage() {
    const [tooltip, setTooltip] = useState<string | null>(null);

    return (
        <div className="h-screen bg-[#030303] text-white overflow-hidden flex flex-col">
            
            <ElectricalDither />
            {/* <ElectricalDitherNice /> */}

            {/* Navbar */}
            <nav className="relative z-10 flex items-center justify-between px-8 py-5">
                <div className="flex items-center gap-2">

                    <span className="text-[14px] font-medium text-white/60 tracking-tight">AUTM8N</span>
                </div>
                <div className="flex items-center gap-5">
                    <a
                        href="https://github.com/amrithehe/n8n"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[13px] text-white/30 hover:text-white/60 transition-colors"
                    >
                        <Star className="w-3.5 h-3.5" />
                        Star on GitHub
                    </a>
                    <Link href="/workflows" className="text-[13px] text-white/30 hover:text-white/60 transition-colors">
                        Workflows
                    </Link>
                    <Link href="/credentials" className="text-[13px] text-white/30 hover:text-white/60 transition-colors">
                        Credentials
                    </Link>
                    <Link
                        href="/workflows"
                        className="text-[13px] px-5 py-2 bg-blue-400/90 hover:bg-blue-400 text-white rounded-xl font-medium transition-all"
                    >
                        Dashboard
                    </Link>
                </div>
            </nav>

            {/* Centered content */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-6 sm:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-xl text-center"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-none whitespace-nowrap">
                        Automate{" "}
                        <em className="  italic font-light bg-linear-to-r from-white via-blue-100 to-blue-200 p-3 bg-clip-text text-transparent">
                            anything
                        </em>
                    </h1>

                    <p className="mt-6 text-white/25 text-[15px] leading-relaxed max-w-md mx-auto">
                        Wire up your apps with visual workflows. Trigger, process, and respond — all on autopilot.
                    </p>

                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Link
                            href="/workflows"
                            className="group flex items-center gap-2 px-7 py-3.5 bg-blue-400  text-white rounded-xl text-sm font-semibold transition-all hover:bg-blue-500"
                        >
                            Start Building
                        </Link>
                        <Link
                            href="/credentials"
                            className="px-7 py-3.5 bg-white/4 border border-white/8 hover:bg-white/8 text-white/60 hover:text-white/80 rounded-xl text-sm font-medium transition-all backdrop-blur-lg"
                        >
                            Setup Credentials
                        </Link>
                    </div>

                    {/* Available Nodes */}
                    <div className="mt-14">
                        <p className="text-[11px] text-white/20 uppercase tracking-[0.2em] mb-4">Available Nodes</p>
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            {nodes.map((node, i) => (
                                <motion.div
                                    key={node.name}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + i * 0.08 }}
                                    className="relative"
                                    onMouseEnter={() => setTooltip(node.name)}
                                    onMouseLeave={() => setTooltip(null)}
                                >
                                    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/3 border border-white/6 hover:border-blue-400/25 hover:bg-white/6 transition-all cursor-default group">
                                        <Image
                                            src={node.icon}
                                            alt={node.name}
                                            width={16}
                                            height={16}
                                            className="invert opacity-40 group-hover:opacity-80 transition-opacity"
                                        />
                                        <span className="text-[12px] font-medium text-white/50 group-hover:text-white/80 transition-colors">
                                            {node.name}
                                        </span>
                                    </div>
                                    {tooltip === node.name && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#0c0c14] border border-white/10 rounded-lg whitespace-nowrap z-50"
                                        >
                                            <p className="text-[11px] text-white/60">{node.desc}</p>
                                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-[#0c0c14] border-r border-b border-white/10 rotate-45 -mt-1" />
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

           
        </div>
    );
}
