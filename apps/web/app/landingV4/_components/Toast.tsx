"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
    message: { type: "success" | "error" | "info"; text: string } | null;
    onDismiss: () => void;
}

export default function Toast({ message, onDismiss }: ToastProps) {
    useEffect(() => {
        if (message) {
            const t = setTimeout(onDismiss, 4000);
            return () => clearTimeout(t);
        }
    }, [message, onDismiss]);

    const colors = {
        success: "bg-blue-400/15 border-blue-400/30 text-blue-300",
        error: "bg-red-500/15 border-red-500/30 text-red-300",
        info: "bg-cyan-500/15 border-cyan-500/30 text-cyan-300",
    };

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -20, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: -20, x: "-50%" }}
                    className={`fixed top-6 left-1/2 z-50 px-6 py-3 rounded-full backdrop-blur-xl border text-[13px] font-medium ${colors[message.type]}`}
                >
                    {message.text}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
