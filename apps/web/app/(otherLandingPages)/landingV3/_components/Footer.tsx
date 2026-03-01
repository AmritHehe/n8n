"use client";

import { motion } from "framer-motion";
import { Github } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="relative py-20 border-t border-white/5 overflow-hidden">
            {/* Large AUTOM8N watermark */}
            <div className="container mx-auto px-4 relative">
                {/* GitHub link */}
                <div className="flex items-center justify-center mb-12">
                    <Link
                        href="https://github.com/amrithehe/n8n"
                        target="_blank"
                        className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10transition-all"
                    >
                        <Github className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                        <span className="text-sm text-white/60 group-hover:text-white transition-colors">Star on GitHub</span>
                    </Link>
                </div>

                {/* Giant AUTOM8N text */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center select-none"
                >
                    <h2 className="text-[clamp(4rem,20vw,14rem)] font-black tracking-tighter leading-none text-white/4">
                        AUTOM8N
                    </h2>
                </motion.div>

                {/* Copyright */}
                <div className="text-center text-sm text-white/20 mt-4">
                    © 2025 Autm8n. Built by{" "}
                    <Link href="https://github.com/amrithehe" target="_blank" className="text-white/30 hover:text-white/50 transition-colors">
                        amrit
                    </Link>
                </div>
            </div>
        </footer>
    );
}
