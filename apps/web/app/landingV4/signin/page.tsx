"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "../_components/AuthLayout";
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
            router.push("/landingV4/workflows");
        } catch (err: any) {
            setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout heading="Sign in" sub="Enter your credentials to continue">
            {/* Error */}
            {error && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/8 border border-red-500/15 text-red-400 text-[13px]">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-white/3 border border-white/8 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-400/40 transition-colors"
                        placeholder="name@company.com"
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[11px] text-white/40 uppercase tracking-wider">Password</label>
                        <a href="#" className="text-[11px] text-blue-300/50 hover:text-blue-300/80 transition-colors">Forgot?</a>
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white/3 border border-white/8 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-400/40 transition-colors"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-medium text-sm text-white bg-blue-400/90 hover:bg-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>

            <p className="text-center text-white/25 text-[13px] mt-10">
                Don&apos;t have an account?{" "}
                <Link href="/landingV4/signup" className="text-blue-300/70 hover:text-blue-300 transition-colors">
                    Sign up
                </Link>
            </p>
        </AuthLayout>
    );
}
