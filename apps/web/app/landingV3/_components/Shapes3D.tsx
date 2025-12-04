"use client";

import { motion } from "framer-motion";

export default function Shapes3D() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Floating Glass Cube */}
            <motion.div
                animate={{
                    rotateX: [0, 360],
                    rotateY: [0, 360],
                    y: [0, -20, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute top-1/4 left-1/4 w-32 h-32 opacity-40 blur-sm"
                style={{
                    perspective: "1000px",
                    transformStyle: "preserve-3d",
                }}
            >
                <div className="w-full h-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 backdrop-blur-xl border border-white/20 rounded-xl shadow-[0_0_50px_rgba(120,50,255,0.3)]" />
            </motion.div>

            {/* Abstract Sphere/Blob */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-gradient-to-tr from-pink-500/20 to-orange-500/20 blur-3xl mix-blend-screen"
            />

            {/* Another Glass Element */}
            <motion.div
                animate={{
                    rotate: [0, -360],
                    y: [0, 30, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute bottom-1/4 right-1/3 w-40 h-40 border border-white/10 bg-white/5 backdrop-blur-md rounded-full shadow-2xl"
            />
        </div>
    );
}
