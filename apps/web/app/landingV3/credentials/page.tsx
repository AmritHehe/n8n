"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Key,
    Mail,
    Send,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    Shield,
    Server,
    Check,
    X,
    Sparkles
} from "lucide-react";
import api from "../../apiClient";

interface Credential {
    id: number;
    title: string;
    platform: string;
    data: any;
    createdAt: string;
}

export default function CredentialsPage() {
    const [credentials, setCredentials] = useState<Credential[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState<"telegram" | "smtp" | null>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});

    // Form states
    const [telegramData, setTelegramData] = useState({ token: "", chatId: "" });
    const [smtpData, setSmtpData] = useState({ HOST: "", PORT: "", username: "", password: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) redirect("/landingV3/signin");
        fetchCredentials();
    }, []);

    const fetchCredentials = async () => {
        try {
            const response = await api.get("/api/v1/credentials");
            setCredentials(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Failed to fetch credentials:", error);
            setCredentials([]);
        } finally {
            setLoading(false);
        }
    };

    const saveTelegramCredential = async () => {
        if (!telegramData.token || !telegramData.chatId) {
            setMessage({ type: "error", text: "Please fill all Telegram fields" });
            return;
        }
        setSaving(true);
        try {
            await api.post("/api/v1/credentials", {
                title: "Telegram Send Message",
                platform: "teligram",
                data: telegramData
            });
            setMessage({ type: "success", text: "Telegram credentials saved!" });
            setTelegramData({ token: "", chatId: "" });
            setShowCreateForm(null);
            fetchCredentials();
        } catch (error) {
            setMessage({ type: "error", text: "Failed to save Telegram credentials" });
        }
        setSaving(false);
    };

    const saveSMTPCredential = async () => {
        if (!smtpData.HOST || !smtpData.PORT || !smtpData.username || !smtpData.password) {
            setMessage({ type: "error", text: "Please fill all SMTP fields" });
            return;
        }
        setSaving(true);
        try {
            await api.post("/api/v1/credentials", {
                title: "SMTP Account",
                platform: "smtp",
                data: smtpData
            });
            setMessage({ type: "success", text: "SMTP credentials saved!" });
            setSmtpData({ HOST: "", PORT: "", username: "", password: "" });
            setShowCreateForm(null);
            fetchCredentials();
        } catch (error) {
            setMessage({ type: "error", text: "Failed to save SMTP credentials" });
        }
        setSaving(false);
    };

    const deleteCredential = async (id: number) => {
        try {
            await api.delete("/api/v1/credentials", { data: { id } } as any);
            setMessage({ type: "success", text: "Credential deleted!" });
            setDeleteConfirm(null);
            fetchCredentials();
        } catch (error) {
            setMessage({ type: "error", text: "Failed to delete credential" });
        }
    };

    // Auto-dismiss messages
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const togglePassword = (key: string) => {
        setShowPassword(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="min-h-screen bg-[#030303] text-white overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[800px] h-[800px] rounded-full blur-[200px] bg-emerald-500/10" />
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[180px] bg-teal-500/8" />
                <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full blur-[150px] bg-cyan-500/6" />
            </div>

            {/* Grid pattern */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Toast */}
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

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-12"
                >
                    <Link
                        href="/landingV3"
                        className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                            Credentials
                        </h1>
                        <p className="text-white/40 mt-1">Securely manage your integration credentials</p>
                    </div>
                </motion.div>

                {/* Your Credentials Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-teal-400" />
                        Your Credentials
                    </h2>

                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
                        </div>
                    ) : credentials.length === 0 ? (
                        <div className="text-center py-12 bg-white/[0.02] border border-white/10 rounded-2xl">
                            <Key className="w-10 h-10 text-white/20 mx-auto mb-3" />
                            <p className="text-white/40">No credentials yet. Add your first one below.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {credentials.map((cred, index) => (
                                <motion.div
                                    key={cred.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-teal-500/30 hover:bg-white/[0.05] transition-all duration-500"
                                >
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500/10 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/10 flex items-center justify-center border border-teal-500/20">
                                                {cred.platform === "teligram" ? (
                                                    <Send className="w-5 h-5 text-teal-400" />
                                                ) : (
                                                    <Mail className="w-5 h-5 text-teal-400" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-white group-hover:text-teal-300 transition-colors">
                                                    {cred.title}
                                                </h3>
                                                <p className="text-sm text-white/40 capitalize">{cred.platform}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setDeleteConfirm(cred.id)}
                                            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all duration-300"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Delete Confirmation */}
                                    <AnimatePresence>
                                        {deleteConfirm === cred.id && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-20 p-6"
                                            >
                                                <p className="text-center mb-4 text-white/80">Delete this credential?</p>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/60 transition-all duration-300"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => deleteCredential(cred.id)}
                                                        className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all duration-300"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Add New Credential Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-emerald-400" />
                        Add New Credential
                    </h2>

                    {!showCreateForm ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Telegram Option */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowCreateForm("telegram")}
                                className="group p-6 bg-white/[0.03] border border-white/10 rounded-2xl hover:border-teal-500/30 transition-all duration-300 text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/10 flex items-center justify-center border border-teal-500/20 group-hover:border-teal-500/40 transition-colors">
                                        <Send className="w-6 h-6 text-teal-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-white group-hover:text-teal-300 transition-colors">
                                            Telegram Bot
                                        </h3>
                                        <p className="text-sm text-white/40">Send messages via Telegram</p>
                                    </div>
                                </div>
                            </motion.button>

                            {/* SMTP Option */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowCreateForm("smtp")}
                                className="group p-6 bg-white/[0.03] border border-white/10 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
                                        <Mail className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-white group-hover:text-emerald-300 transition-colors">
                                            SMTP Account
                                        </h3>
                                        <p className="text-sm text-white/40">Send emails via SMTP</p>
                                    </div>
                                </div>
                            </motion.button>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/[0.03] border border-white/10 rounded-2xl p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/10 flex items-center justify-center">
                                        {showCreateForm === "telegram" ? (
                                            <Send className="w-5 h-5 text-teal-400" />
                                        ) : (
                                            <Mail className="w-5 h-5 text-emerald-400" />
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-lg">
                                        {showCreateForm === "telegram" ? "Telegram Bot" : "SMTP Account"}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setShowCreateForm(null)}
                                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {showCreateForm === "telegram" ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-white/50 mb-2">Bot Token *</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword.telegramToken ? "text" : "password"}
                                                placeholder="Enter your bot token"
                                                value={telegramData.token}
                                                onChange={(e) => setTelegramData(prev => ({ ...prev, token: e.target.value }))}
                                                className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-teal-500/50 transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePassword("telegramToken")}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                                            >
                                                {showPassword.telegramToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/50 mb-2">Chat ID *</label>
                                        <input
                                            type="text"
                                            placeholder="Enter chat ID"
                                            value={telegramData.chatId}
                                            onChange={(e) => setTelegramData(prev => ({ ...prev, chatId: e.target.value }))}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-teal-500/50 transition-all"
                                        />
                                    </div>
                                    <button
                                        onClick={saveTelegramCredential}
                                        disabled={saving}
                                        className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium hover:shadow-lg hover:shadow-teal-500/20 disabled:opacity-50 transition-all"
                                    >
                                        {saving ? "Saving..." : "Save Telegram Credential"}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-white/50 mb-2">SMTP Host *</label>
                                            <input
                                                type="text"
                                                placeholder="smtp.gmail.com"
                                                value={smtpData.HOST}
                                                onChange={(e) => setSmtpData(prev => ({ ...prev, HOST: e.target.value }))}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-white/50 mb-2">Port *</label>
                                            <input
                                                type="text"
                                                placeholder="587"
                                                value={smtpData.PORT}
                                                onChange={(e) => setSmtpData(prev => ({ ...prev, PORT: e.target.value }))}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/50 mb-2">Username *</label>
                                        <input
                                            type="text"
                                            placeholder="your-email@gmail.com"
                                            value={smtpData.username}
                                            onChange={(e) => setSmtpData(prev => ({ ...prev, username: e.target.value }))}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/50 mb-2">Password *</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword.smtpPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                value={smtpData.password}
                                                onChange={(e) => setSmtpData(prev => ({ ...prev, password: e.target.value }))}
                                                className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePassword("smtpPassword")}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                                            >
                                                {showPassword.smtpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={saveSMTPCredential}
                                        disabled={saving}
                                        className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 transition-all"
                                    >
                                        {saving ? "Saving..." : "Save SMTP Credential"}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
