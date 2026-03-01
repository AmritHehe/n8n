"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Zap,
    Trash2,
    Play,
    Clock,
    ArrowLeft,
    Search,
    Grid3X3,
    List,
} from "lucide-react";
import Toast from "../_components/Toast";
import api from "../../apiClient";

interface Workflow {
    id: number;
    title: string;
    nodes: string;
    createdAt: string;
    updatedAt?: string;
}

export default function WorkflowsPage() {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) redirect("/landingV4/signin");
        fetchWorkflows();
    }, []);

    const fetchWorkflows = async () => {
        try {
            const response = await api.get("/workflow");
            setWorkflows(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Failed to fetch workflows:", error);
            setWorkflows([]);
        } finally {
            setLoading(false);
        }
    };

    const createWorkflow = async () => {
        if (!newTitle.trim()) {
            setMessage({ type: "error", text: "Please enter a workflow title" });
            return;
        }
        try {
            await api.post("/workflow", { title: newTitle, nodes: [], connections: [] });
            setMessage({ type: "success", text: "Workflow created successfully!" });
            setNewTitle("");
            setShowCreateModal(false);
            fetchWorkflows();
        } catch {
            setMessage({ type: "error", text: "Failed to create workflow" });
        }
    };

    const deleteWorkflow = async (id: number) => {
        try {
            await api.delete("/workflow", { data: { id } } as any);
            setMessage({ type: "success", text: "Workflow deleted successfully!" });
            setDeleteConfirm(null);
            fetchWorkflows();
        } catch {
            setMessage({ type: "error", text: "Failed to delete workflow" });
        }
    };

    const filteredWorkflows = workflows.filter((w) =>
        w.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const clearMessage = useCallback(() => setMessage(null), []);

    return (
        <div className="min-h-screen bg-[#08080c] text-white antialiased overflow-hidden">
            {/* Fonts */}
            {/* eslint-disable-next-line @next/next/no-page-custom-font */}
            <link
                href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />
            <style>{`
                :root { --serif: 'Playfair Display', Georgia, serif; --sans: 'Inter', system-ui, sans-serif; }
                body, * { font-family: var(--sans); }
                .font-ed { font-family: var(--serif); }
            `}</style>

            {/* Ambient bg */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[700px] h-[700px] rounded-full blur-[200px] bg-blue-400/4" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[180px] bg-blue-400/3" />
            </div>

            {/* Dot grid */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.015]"
                style={{
                    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                }}
            />

            <Toast message={message} onDismiss={clearMessage} />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
                >
                    <div className="flex items-center gap-4">
                        <Link
                            href="/landingV4"
                            className="p-2.5 rounded-xl bg-white/4 border border-white/6 hover:bg-white/8 hover:border-white/12 transition-all duration-300"
                        >
                            <ArrowLeft className="w-4 h-4 text-white/50" />
                        </Link>
                        <div>
                            <h1 className="font-ed text-3xl text-white/90 tracking-tight">
                                Workflows
                            </h1>
                            <p className="text-white/25 text-[13px] mt-0.5">Manage your automation workflows</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                                type="text"
                                placeholder="Search workflows..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-5 py-2.5 w-56 bg-white/3 border border-white/6 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-blue-400/40 transition-all"
                            />
                        </div>

                        {/* View toggle */}
                        <div className="flex bg-white/3 border border-white/6 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-blue-400/15 text-blue-300" : "text-white/30 hover:text-white/50"}`}
                            >
                                <Grid3X3 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-blue-400/15 text-blue-300" : "text-white/30 hover:text-white/50"}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Create */}
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-400/90 hover:bg-blue-400 rounded-xl text-sm font-medium text-white transition-all hover:shadow-[0_0_30px_rgba(96,165,250,0.15)]"
                        >
                            <Plus className="w-4 h-4" />
                            Create Workflow
                        </button>
                    </div>
                </motion.div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <div className="w-8 h-8 border-2 border-blue-400/25 border-t-blue-400 rounded-full animate-spin" />
                    </div>
                ) : filteredWorkflows.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-32"
                    >
                        <div className="w-20 h-20 rounded-2xl bg-blue-400/8 flex items-center justify-center mb-6 border border-blue-400/15">
                            <Zap className="w-8 h-8 text-blue-300/60" />
                        </div>
                        <h3 className="font-ed text-xl text-white/80 mb-2">No workflows yet</h3>
                        <p className="text-white/25 text-[13px] mb-8 text-center max-w-sm">
                            Create your first automation workflow to start connecting your apps
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-400/90 hover:bg-blue-400 rounded-xl text-sm font-medium text-white transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Create Your First Workflow
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            : "flex flex-col gap-3"
                        }
                    >
                        {filteredWorkflows.map((workflow, index) => {
                            const nodeCount = workflow.nodes ? JSON.parse(workflow.nodes).length : 0;

                            return (
                                <motion.div
                                    key={workflow.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.04 }}
                                    className={`group relative bg-white/2 border border-white/6 rounded-2xl hover:border-blue-400/20 hover:bg-white/4 transition-all duration-500 ${viewMode === "list" ? "flex items-center justify-between p-4" : "p-6"
                                        }`}
                                >
                                    <Link href={`/landingV4/workflow/${workflow.id}`} className="relative z-10 flex-1">
                                        <div className={viewMode === "list" ? "flex items-center gap-4" : ""}>
                                            <div className={`${viewMode === "list" ? "" : "mb-4"} w-11 h-11 rounded-xl bg-blue-400/8 flex items-center justify-center border border-blue-400/15 group-hover:border-blue-400/30 transition-colors`}>
                                                <Image src="/Workflow.svg" alt="" width={22} height={22} className="invert opacity-80" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-white/90 group-hover:text-blue-300 transition-colors">
                                                    {workflow.title || "Untitled Workflow"}
                                                </h3>
                                                <div className={`flex items-center gap-4 ${viewMode === "list" ? "" : "mt-1.5"} text-[12px] text-white/25`}>
                                                    <span className="flex items-center gap-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400/50" />
                                                        {nodeCount} node{nodeCount !== 1 ? "s" : ""}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(workflow.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Actions */}
                                    <div className={`relative z-10 flex items-center gap-2 ${viewMode === "list" ? "" : "mt-5 pt-4 border-t border-white/4"}`}>
                                        <Link
                                            href={`/landingV4/workflow/${workflow.id}`}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white/4 hover:bg-blue-400/15 text-white/40 hover:text-blue-300 transition-all text-[12px] font-medium"
                                        >
                                            <Play className="w-3.5 h-3.5" />
                                            {viewMode === "list" ? "" : "Open"}
                                        </Link>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setDeleteConfirm(workflow.id);
                                            }}
                                            className="p-2 rounded-xl bg-white/4 hover:bg-red-500/15 text-white/30 hover:text-red-400 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Delete confirm */}
                                    <AnimatePresence>
                                        {deleteConfirm === workflow.id && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="absolute inset-0 bg-[#0c0c14]/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-20 p-6"
                                            >
                                                <p className="text-center mb-4 text-white/60 text-sm">Delete this workflow?</p>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="px-4 py-2 rounded-xl bg-white/6 hover:bg-white/12 text-white/50 transition-all text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => deleteWorkflow(workflow.id)}
                                                        className="px-4 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 transition-all text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowCreateModal(false)}
                    >
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-lg bg-[#0c0c14] border border-white/8 rounded-2xl p-8"
                        >
                            <h2 className="font-ed text-2xl text-white/90 mb-1">Create New Workflow</h2>
                            <p className="text-white/25 text-[13px] mb-6">Give your workflow a descriptive name</p>

                            <input
                                type="text"
                                placeholder="My Awesome Workflow"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && createWorkflow()}
                                autoFocus
                                className="w-full px-5 py-4 bg-white/3 border border-white/8 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-blue-400/40 transition-all text-base"
                            />

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 py-3 rounded-xl bg-white/4 border border-white/6 text-white/40 hover:bg-white/8 hover:text-white/60 transition-all font-medium text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createWorkflow}
                                    className="flex-1 py-3 rounded-xl bg-blue-400/90 hover:bg-blue-400 text-white font-medium text-sm transition-all"
                                >
                                    Create Workflow
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
