"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative py-20 border-t border-white/[0.05]">
            {/* CTA Section */}
            <div className="container mx-auto px-4 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative max-w-4xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-white/[0.08] overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-cyan-600/20 blur-3xl" />
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to automate everything?
                        </h2>
                        <p className="text-white/50 mb-8 max-w-lg mx-auto">
                            Join thousands of teams building workflows that scale. Start free, no credit card required.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="group px-8 py-4 bg-white text-black rounded-full font-semibold text-base flex items-center gap-2 hover:scale-[1.03] transition-transform">
                                Get Started Free
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-8 py-4 bg-white/[0.05] text-white rounded-full font-medium text-base border border-white/[0.1] hover:bg-white/[0.1] transition-colors">
                                Talk to Sales
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Footer links */}
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">A</span>
                        </div>
                        <span className="font-semibold text-white">Autm8n</span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-white/40">
                        <a href="#" className="hover:text-white transition-colors">Documentation</a>
                        <a href="#" className="hover:text-white transition-colors">Pricing</a>
                        <a href="#" className="hover:text-white transition-colors">Blog</a>
                        <a href="#" className="hover:text-white transition-colors">Support</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center hover:bg-white/[0.1] transition-colors">
                            <Github className="w-5 h-5 text-white/60" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center hover:bg-white/[0.1] transition-colors">
                            <Twitter className="w-5 h-5 text-white/60" />
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/[0.05] text-center text-sm text-white/30">
                    © 2024 Autm8n. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
