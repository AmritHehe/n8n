import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    MousePointerClick,
    Webhook,
    Bot,
    Key,
} from "lucide-react";
import type { Node } from "@xyflow/react";

interface EditorSidebarProps {
    workflowId: string;
    nodes: Node[];
    addNode: (type: string, isTrigger?: boolean) => void;
    executionLogs: string[];
}

export default function EditorSidebar({
    workflowId,
    nodes,
    addNode,
    executionLogs,
}: EditorSidebarProps) {
    const logsRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logs
    useEffect(() => {
        if (logsRef.current) {
            logsRef.current.scrollTop = logsRef.current.scrollHeight;
        }
    }, [executionLogs]);

    const triggerNodes = [
        { type: "trigger", icon: <MousePointerClick className="w-4 h-4" style={{ color: "#60a5fa" }} />, label: "Manual Trigger", color: "#60a5fa" },
        { type: "webhook", icon: <Webhook className="w-4 h-4" style={{ color: "#8b5cf6" }} />, label: "Webhook Trigger", color: "#8b5cf6", isTrigger: true },
    ];

    const actionNodes = [
        { type: "telegram", icon: <Image src="/telegram.svg" alt="Telegram" width={16} height={16} className="invert" />, label: "Telegram", color: "#0ea5e9" },
        { type: "gmail", icon: <Image src="/sendmail.svg" alt="Gmail" width={16} height={16} className="invert" />, label: "Gmail", color: "#ef4444" },
        { type: "webhook", icon: <Webhook className="w-4 h-4" style={{ color: "#8b5cf6" }} />, label: "Webhook (Wait)", color: "#8b5cf6", isTrigger: false },
        { type: "awaitGmail", icon: <Image src="/sendMail&wait.svg" alt="Await Gmail" width={16} height={16} className="invert" />, label: "Await Gmail", color: "#f97316" },
        { type: "aiagent", icon: <Bot className="w-4 h-4" style={{ color: "#a855f7" }} />, label: "AI Agent", color: "#a855f7" },
    ];

    return (
        <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col"
        >
            {/* Header */}
            <div className="p-4 border-b border-white/10">
                <Link
                    href="/workflows"
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm">Back to Workflows</span>
                </Link>
                <h1 className="text-lg font-semibold text-white">Workflow Editor</h1>
                <p className="text-xs text-white/40 mt-1">ID: {workflowId}</p>
            </div>

            {/* Add Nodes Section */}
            <div className="flex-1 overflow-y-auto p-4">
                <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Add Nodes</h3>

                {/* Triggers - only show when no nodes exist */}
                {nodes.length === 0 && (
                    <div className="mb-4">
                        <p className="text-xs text-white/30 mb-2">Triggers (start with one)</p>
                        <div className="space-y-2">
                            {triggerNodes.map((opt) => (
                                <button
                                    key={`${opt.type}-trigger`}
                                    onClick={() => addNode(opt.type, opt.isTrigger ?? true)}
                                    className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-left transition-all flex items-center gap-3 group"
                                >
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{ background: `${opt.color}20` }}
                                    >
                                        {opt.icon}
                                    </div>
                                    <span className="text-sm text-white/80 group-hover:text-white">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions - always show if nodes exist */}
                {nodes.length > 0 && (
                    <div>
                        <p className="text-xs text-white/30 mb-2">Actions</p>
                        <div className="space-y-2">
                            {actionNodes.map((opt, idx) => (
                                <button
                                    key={`${opt.type}-${idx}`}
                                    onClick={() => addNode(opt.type, opt.isTrigger ?? false)}
                                    className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-left transition-all flex items-center gap-3 group"
                                >
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{ background: `${opt.color}20` }}
                                    >
                                        {opt.icon}
                                    </div>
                                    <span className="text-sm text-white/80 group-hover:text-white">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty hint */}
                {nodes.length === 0 && (
                    <p className="text-xs text-white/20 mt-4 text-center">
                        Start by adding a trigger node
                    </p>
                )}
            </div>

            {/* Credentials Link */}
            <Link
                href="/credentials"
                className="mx-4 mb-2 p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 text-white/40 hover:text-white/80 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
            >
                <Key className="w-4 h-4" />
                <span className="text-xs">Manage Credentials</span>
            </Link>

            {/* Execution Logs */}
            {executionLogs.length > 0 && (
                <div className="border-t border-white/10 p-4">
                    <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Logs</h3>
                    <div
                        ref={logsRef}
                        className="h-32 overflow-y-auto bg-black/40 rounded-lg p-2 text-xs font-mono text-white/60 space-y-1"
                    >
                        {executionLogs.map((log, i) => (
                            <div key={i}>{log}</div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
