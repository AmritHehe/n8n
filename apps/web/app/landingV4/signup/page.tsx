"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "../_components/AuthLayout";
import api from "../../apiClient";

export default function SignUp() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await api.post("/api/v1/signup", { name: email, pass: password });
            router.push("/landingV4/signin");
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout heading="Create account" sub="Start your automation journey">
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
                    <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white/3 border border-white/8 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-400/40 transition-colors"
                        placeholder="Minimum 8 characters"
                    />
                </div>

                <div>
                    <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white/3 border border-white/8 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-400/40 transition-colors"
                        placeholder="Confirm your password"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-medium text-sm text-white bg-blue-400/90 hover:bg-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                    {loading ? "Creating account..." : "Create account"}
                </button>
            </form>

            <p className="text-center text-white/25 text-[13px] mt-10">
                Already have an account?{" "}
                <Link href="/landingV4/signin" className="text-blue-300/70 hover:text-blue-300 transition-colors">
                    Sign in
                </Link>
            </p>
        </AuthLayout>
    );
}
