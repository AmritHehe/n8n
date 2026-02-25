"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "../../apiClient";

export default function SignIn() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await api.post("/api/v1/signin", { name: email, pass: password });
            const token = (res.data as { token: string }).token;
            localStorage.setItem("token", token);
            router.push("/landingV3/workflows");
        } catch {
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4">
            {/* Subtle background glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[200px] bg-blue-300/[0.06]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-full max-w-sm"
            >
                {/* Back link */}
                <Link href="/landingV3" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
                    Back
                </Link>

                {/* Header */}
                <h1 className="text-2xl font-semibold text-white mb-1 tracking-tight">Sign in</h1>
                <p className="text-white/40 text-sm mb-8">Enter your credentials to continue</p>

                {/* Error */}
                {error && (
                    <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs text-white/50 mb-1.5">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-white text-sm placeholder-white/25 focus:outline-none focus:border-blue-300/50 transition-colors"
                            placeholder="name@company.com"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs text-white/50">Password</label>
                            <a href="#" className="text-xs text-blue-200/70 hover:text-blue-200">Forgot?</a>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-white text-sm placeholder-white/25 focus:outline-none focus:border-blue-300/50 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-lg font-medium text-sm text-black bg-white hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-white/35 text-sm mt-8">
                    Don&apos;t have an account?{" "}
                    <Link href="/landingV3/signup" className="text-blue-200/80 hover:text-blue-200">
                        Sign up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
