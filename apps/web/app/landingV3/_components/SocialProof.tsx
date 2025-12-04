"use client";

import { motion } from "framer-motion";

const stats = [
    { value: "10M+", label: "Workflows Executed" },
    { value: "500+", label: "Integrations" },
    { value: "50K+", label: "Active Users" },
    { value: "99.9%", label: "Uptime" },
];

export default function SocialProof() {
    return (
        <section className="relative py-16 overflow-hidden">
            {/* Stats only - no testimonials */}
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08 }}
                            className="text-center py-6 px-4 rounded-xl bg-white/[0.01] border border-white/[0.04]"
                        >
                            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-1">
                                {stat.value}
                            </div>
                            <div className="text-xs text-white/40">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
