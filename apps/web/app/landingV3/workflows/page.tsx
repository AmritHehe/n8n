"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Zap,
    MoreHorizontal,
    Trash2,
    Edit3,
    Play,
    Clock,
    ArrowLeft,
    Search,
    Grid3X3,
    List,
    Sparkles
} from "lucide-react";
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
        if (!token) redirect("/landingV3/signin");
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
        } catch (error) {
            setMessage({ type: "error", text: "Failed to create workflow" });
        }
    };

    const deleteWorkflow = async (id: number) => {
        try {
            await api.delete("/workflow", { data: { id } } as any);
            setMessage({ type: "success", text: "Workflow deleted successfully!" });
            setDeleteConfirm(null);
            fetchWorkflows();
        } catch (error) {
            setMessage({ type: "error", text: "Failed to delete workflow" });
        }
    };

    const filteredWorkflows = workflows.filter(w =>
        w.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Auto-dismiss messages
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div className="min-h-screen bg-[#030303] text-white overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full blur-[200px] bg-teal-500/10" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[180px] bg-emerald-500/8" />
                <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full blur-[150px] bg-cyan-500/6" />
            </div>

            {/* Subtle grid pattern */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Toast Message */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className={`fixed top-6 left-1/2 z-50 px-6 py-3 rounded-full backdrop-blur-xl border ${message.type === "success"
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                            : "bg-red-500/20 border-red-500/40 text-red-300"
                            }`}
                    >
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
                >
                    <div className="flex items-center gap-4">
                        <Link
                            href="/landingV3"
                            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                                Workflows
                            </h1>
                            <p className="text-white/40 mt-1">Manage your automation workflows</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                                type="text"
                                placeholder="Search workflows..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 pr-5 py-2.5 w-64 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-teal-500/50 focus:bg-white/8 transition-all duration-300"
                            />
                        </div>

                        {/* View Toggle */}
                        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg transition-all duration-300 ${viewMode === "grid" ? "bg-teal-500/20 text-teal-400" : "text-white/40 hover:text-white/60"}`}
                            >
                                <Grid3X3 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg transition-all duration-300 ${viewMode === "list" ? "bg-teal-500/20 text-teal-400" : "text-white/40 hover:text-white/60"}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Create Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl font-medium hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-300"
                        >
                            <Plus className="w-4 h-4" />
                            Create Workflow
                        </motion.button>
                    </div>
                </motion.div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <div className="w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
                    </div>
                ) : filteredWorkflows.length === 0 ? (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-32"
                    >
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 flex items-center justify-center mb-6 border border-teal-500/20">
                            <Sparkles className="w-10 h-10 text-teal-400" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">No workflows yet</h3>
                        <p className="text-white/40 mb-8 text-center max-w-md">
                            Create your first automation workflow to start connecting your apps
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl font-medium hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-300"
                        >
                            <Plus className="w-5 h-5" />
                            Create Your First Workflow
                        </button>
                    </motion.div>
                ) : (
                    /* Workflows Grid/List */
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
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
                                    transition={{ delay: index * 0.05 }}
                                    className={`group relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl hover:border-teal-500/30 hover:bg-white/[0.05] transition-all duration-500 ${viewMode === "list" ? "flex items-center justify-between p-4" : "p-6"
                                        }`}
                                >
                                    {/* Hover glow */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500/10 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                    <Link href={`/landingV3/workflow/${workflow.id}`} className="relative z-10 flex-1">
                                        <div className={viewMode === "list" ? "flex items-center gap-4" : ""}>
                                            {/* Icon */}
                                            <div className={`${viewMode === "list" ? "" : "mb-4"} w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/10 flex items-center justify-center border border-teal-500/20 group-hover:border-teal-500/40 transition-colors duration-300`}>
                                                <Zap className="w-5 h-5 text-teal-400" />
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-lg text-white group-hover:text-teal-300 transition-colors duration-300">
                                                    {workflow.title || "Untitled Workflow"}
                                                </h3>
                                                <div className={`flex items-center gap-4 ${viewMode === "list" ? "" : "mt-2"} text-sm text-white/40`}>
                                                    <span className="flex items-center gap-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                                                        {nodeCount} node{nodeCount !== 1 ? "s" : ""}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {new Date(workflow.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Actions */}
                                    <div className={`relative z-10 flex items-center gap-2 ${viewMode === "list" ? "" : "mt-5 pt-4 border-t border-white/5"}`}>
                                        <Link
                                            href={`/landingV3/workflow/${workflow.id}`}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white/5 hover:bg-teal-500/20 text-white/60 hover:text-teal-300 transition-all duration-300 text-sm font-medium"
                                        >
                                            <Play className="w-3.5 h-3.5" />
                                            {viewMode === "list" ? "" : "Open"}
                                        </Link>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setDeleteConfirm(workflow.id);
                                            }}
                                            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all duration-300"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Delete Confirmation */}
                                    <AnimatePresence>
                                        {deleteConfirm === workflow.id && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-20 p-6"
                                            >
                                                <p className="text-center mb-4 text-white/80">Delete this workflow?</p>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/60 transition-all duration-300"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => deleteWorkflow(workflow.id)}
                                                        className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all duration-300"
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
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl p-8"
                        >
                            {/* Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-3xl blur-xl opacity-50" />

                            <div className="relative">
                                <h2 className="text-2xl font-bold mb-2">Create New Workflow</h2>
                                <p className="text-white/40 mb-6">Give your workflow a descriptive name</p>

                                <input
                                    type="text"
                                    placeholder="My Awesome Workflow"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && createWorkflow()}
                                    autoFocus
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all duration-300 text-lg"
                                />

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all duration-300 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={createWorkflow}
                                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-300"
                                    >
                                        Create Workflow
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
