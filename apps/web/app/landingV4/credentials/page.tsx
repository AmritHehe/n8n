"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
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
    X,
} from "lucide-react";
import Toast from "../_components/Toast";
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

    /* Form states */
    const [telegramData, setTelegramData] = useState({ token: "", chatId: "" });
    const [smtpData, setSmtpData] = useState({ HOST: "", PORT: "", username: "", password: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) redirect("/landingV4/signin");
        fetchCredentials();
    }, []);

    const fetchCredentials = async () => {
        try {
            const res = await api.get("/api/v1/credentials");
            setCredentials(Array.isArray(res.data) ? res.data : []);
        } catch {
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
                data: telegramData,
            });
            setMessage({ type: "success", text: "Telegram credentials saved!" });
            setTelegramData({ token: "", chatId: "" });
            setShowCreateForm(null);
            fetchCredentials();
        } catch {
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
                platform: "gmail",
                data: smtpData,
            });
            setMessage({ type: "success", text: "SMTP credentials saved!" });
            setSmtpData({ HOST: "", PORT: "", username: "", password: "" });
            setShowCreateForm(null);
            fetchCredentials();
        } catch {
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
        } catch {
            setMessage({ type: "error", text: "Failed to delete credential" });
        }
    };

    const clearMessage = useCallback(() => setMessage(null), []);
    const togglePassword = (key: string) => setShowPassword((p) => ({ ...p, [key]: !p[key] }));

    const inputCls = "w-full px-4 py-3 bg-white/3 border border-white/8 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-blue-400/40 transition-all";

    return (
        <div className="min-h-screen bg-[#08080c] text-white antialiased overflow-hidden">
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

            {/* Ambient */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[700px] h-[700px] rounded-full blur-[200px] bg-blue-400/4" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[180px] bg-blue-400/3" />
            </div>

            <Toast message={message} onDismiss={clearMessage} />

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-12"
                >
                    <Link
                        href="/landingV4/workflows"
                        className="p-2.5 rounded-xl bg-white/4 border border-white/6 hover:bg-white/8 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4 text-white/50" />
                    </Link>
                    <div>
                        <h1 className="font-ed text-3xl text-white/90 tracking-tight">Credentials</h1>
                        <p className="text-white/25 text-[13px] mt-0.5">Securely manage your integration credentials</p>
                    </div>
                </motion.div>

                {/* Your Credentials */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
                    <h2 className="text-[13px] font-medium text-white/40 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-300/50" />
                        Your Credentials
                    </h2>

                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="w-8 h-8 border-2 border-blue-400/25 border-t-blue-400 rounded-full animate-spin" />
                        </div>
                    ) : credentials.length === 0 ? (
                        <div className="text-center py-12 bg-white/2 border border-white/6 rounded-2xl">
                            <Key className="w-8 h-8 text-white/15 mx-auto mb-3" />
                            <p className="text-white/25 text-sm">No credentials yet. Add your first one below.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {credentials.map((cred, i) => (
                                <motion.div
                                    key={cred.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group relative bg-white/2 border border-white/6 rounded-2xl p-5 hover:border-blue-400/20 hover:bg-white/4 transition-all duration-500"
                                >
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-xl bg-blue-400/8 flex items-center justify-center border border-blue-400/15">
                                                {cred.platform === "teligram" ? (
                                                    <Image src="/telegram.svg" alt="" width={18} height={18} className="invert opacity-70" />
                                                ) : (
                                                    <Image src="/sendmail.svg" alt="" width={18} height={18} className="invert opacity-70" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-white/80 group-hover:text-blue-300 transition-colors text-sm">
                                                    {cred.title}
                                                </h3>
                                                <p className="text-[12px] text-white/25 capitalize">{cred.platform}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setDeleteConfirm(cred.id)}
                                            className="p-2 rounded-xl bg-white/4 hover:bg-red-500/15 text-white/30 hover:text-red-400 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Delete confirm */}
                                    <AnimatePresence>
                                        {deleteConfirm === cred.id && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="absolute inset-0 bg-[#0c0c14]/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-20 p-6"
                                            >
                                                <p className="text-center mb-4 text-white/60 text-sm">Delete this credential?</p>
                                                <div className="flex gap-3">
                                                    <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-xl bg-white/6 text-white/50 hover:bg-white/12 transition-all text-sm">Cancel</button>
                                                    <button onClick={() => deleteCredential(cred.id)} className="px-4 py-2 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all text-sm">Delete</button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Add New Credential */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h2 className="text-[13px] font-medium text-white/40 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-blue-300/50" />
                        Add New Credential
                    </h2>

                    {!showCreateForm ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => setShowCreateForm("telegram")}
                                className="group p-6 bg-white/2 border border-white/6 rounded-2xl hover:border-blue-400/20 transition-all text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-400/8 flex items-center justify-center border border-blue-400/15 group-hover:border-blue-400/30 transition-colors">
                                        <Image src="/telegram.svg" alt="" width={22} height={22} className="invert opacity-70" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white/80 group-hover:text-blue-300 transition-colors">Telegram Bot</h3>
                                        <p className="text-[12px] text-white/25">Send messages via Telegram</p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => setShowCreateForm("smtp")}
                                className="group p-6 bg-white/2 border border-white/6 rounded-2xl hover:border-blue-400/20 transition-all text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-400/8 flex items-center justify-center border border-blue-400/15 group-hover:border-blue-400/30 transition-colors">
                                        <Image src="/sendmail.svg" alt="" width={22} height={22} className="invert opacity-70" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white/80 group-hover:text-blue-300 transition-colors">SMTP Account</h3>
                                        <p className="text-[12px] text-white/25">Send emails via SMTP</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/2 border border-white/6 rounded-2xl p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-400/8 flex items-center justify-center border border-blue-400/15">
                                        {showCreateForm === "telegram" ? (
                                            <Image src="/telegram.svg" alt="" width={18} height={18} className="invert opacity-70" />
                                        ) : (
                                            <Image src="/sendmail.svg" alt="" width={18} height={18} className="invert opacity-70" />
                                        )}
                                    </div>
                                    <h3 className="font-medium text-white/80">
                                        {showCreateForm === "telegram" ? "Telegram Bot" : "SMTP Account"}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setShowCreateForm(null)}
                                    className="p-2 rounded-xl bg-white/4 hover:bg-white/8 text-white/30 hover:text-white/60 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {showCreateForm === "telegram" ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[11px] text-white/40 mb-2 uppercase tracking-wider">Bot Token *</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword.telegramToken ? "text" : "password"}
                                                placeholder="Enter your bot token"
                                                value={telegramData.token}
                                                onChange={(e) => setTelegramData((p) => ({ ...p, token: e.target.value }))}
                                                className={`${inputCls} pr-12`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePassword("telegramToken")}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50"
                                            >
                                                {showPassword.telegramToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] text-white/40 mb-2 uppercase tracking-wider">Chat ID *</label>
                                        <input
                                            type="text"
                                            placeholder="Enter chat ID"
                                            value={telegramData.chatId}
                                            onChange={(e) => setTelegramData((p) => ({ ...p, chatId: e.target.value }))}
                                            className={inputCls}
                                        />
                                    </div>
                                    <button
                                        onClick={saveTelegramCredential}
                                        disabled={saving}
                                        className="w-full py-3 mt-2 rounded-xl bg-blue-400/90 hover:bg-blue-400 text-white font-medium text-sm disabled:opacity-50 transition-all"
                                    >
                                        {saving ? "Saving..." : "Save Telegram Credential"}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] text-white/40 mb-2 uppercase tracking-wider">SMTP Host *</label>
                                            <input
                                                type="text"
                                                placeholder="smtp.gmail.com"
                                                value={smtpData.HOST}
                                                onChange={(e) => setSmtpData((p) => ({ ...p, HOST: e.target.value }))}
                                                className={inputCls}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] text-white/40 mb-2 uppercase tracking-wider">Port *</label>
                                            <input
                                                type="text"
                                                placeholder="587"
                                                value={smtpData.PORT}
                                                onChange={(e) => setSmtpData((p) => ({ ...p, PORT: e.target.value }))}
                                                className={inputCls}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] text-white/40 mb-2 uppercase tracking-wider">Username *</label>
                                        <input
                                            type="text"
                                            placeholder="your-email@gmail.com"
                                            value={smtpData.username}
                                            onChange={(e) => setSmtpData((p) => ({ ...p, username: e.target.value }))}
                                            className={inputCls}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] text-white/40 mb-2 uppercase tracking-wider">Password *</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword.smtpPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                value={smtpData.password}
                                                onChange={(e) => setSmtpData((p) => ({ ...p, password: e.target.value }))}
                                                className={`${inputCls} pr-12`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePassword("smtpPassword")}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50"
                                            >
                                                {showPassword.smtpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={saveSMTPCredential}
                                        disabled={saving}
                                        className="w-full py-3 mt-2 rounded-xl bg-blue-400/90 hover:bg-blue-400 text-white font-medium text-sm disabled:opacity-50 transition-all"
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
