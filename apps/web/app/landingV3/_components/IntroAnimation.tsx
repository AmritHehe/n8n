"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const introNodes = [
    { id: "trigger", label: "Manual Trigger", emoji: "▶️", color: "#22c55e", angle: -144 },
    { id: "webhook", label: "Webhook", emoji: "⚡", color: "#f59e0b", angle: -72 },
    { id: "ai", label: "AI Agent", emoji: "🧠", color: "#a855f7", angle: 0 },
    { id: "smtp", label: "SMTP", emoji: "✉️", color: "#3b82f6", angle: 72 },
    { id: "telegram", label: "Telegram", emoji: "✈️", color: "#06b6d4", angle: 144 },
];

// Particle system
function Particles({ active }: { active: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!active) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = [];
        const colors = ["#a855f7", "#3b82f6", "#ec4899", "#06b6d4"];
        let animationId: number;

        const createParticle = () => {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 100;

            particles.push({
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 1,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (Math.random() > 0.7) createParticle();

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.01;

                if (p.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = p.color + Math.floor(p.life * 255).toString(16).padStart(2, '0');
                ctx.fill();
            }

            // Draw connections
            ctx.strokeStyle = "rgba(255,255,255,0.05)";
            ctx.lineWidth = 1;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 80) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            animationId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationId);
    }, [active]);

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

function IntroNode({ node, phase }: { node: typeof introNodes[0]; phase: number }) {
    const radius = 160;
    const angleRad = (node.angle * Math.PI) / 180;
    const targetX = Math.cos(angleRad) * radius;
    const targetY = Math.sin(angleRad) * radius;
    const startX = Math.cos(angleRad) * 500;
    const startY = Math.sin(angleRad) * 500;

    return (
        <motion.div
            initial={{ x: startX, y: startY, scale: 0, opacity: 0 }}
            animate={
                phase === 0 ? { x: startX, y: startY, scale: 0, opacity: 0 } :
                    phase === 1 ? { x: targetX, y: targetY, scale: 1, opacity: 1 } :
                        phase === 2 ? { x: 0, y: 0, scale: 0.6, opacity: 1 } :
                            { x: 0, y: 0, scale: 0, opacity: 0 }
            }
            transition={{ duration: phase === 1 ? 1 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute flex flex-col items-center"
            style={{ left: "50%", top: "50%", marginLeft: -32, marginTop: -32 }}
        >
            <motion.div
                animate={{ boxShadow: phase === 1 ? `0 0 60px ${node.color}60` : `0 0 30px ${node.color}30` }}
                className="w-16 h-16 rounded-2xl border border-white/30 backdrop-blur-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${node.color}50, ${node.color}20)` }}
            >
                <span className="text-2xl">{node.emoji}</span>
            </motion.div>
            {phase === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-2 text-[10px] text-white/60 whitespace-nowrap">
                    {node.label}
                </motion.div>
            )}
        </motion.div>
    );
}

// Outer bezier curves
function BezierConnections({ phase }: { phase: number }) {
    if (phase !== 1) return null;

    const radius = 160;
    const paths = introNodes.map((node, i) => {
        const nextNode = introNodes[(i + 1) % introNodes.length];
        const angle1 = (node.angle * Math.PI) / 180;
        const angle2 = (nextNode.angle * Math.PI) / 180;
        const x1 = Math.cos(angle1) * radius;
        const y1 = Math.sin(angle1) * radius;
        const x2 = Math.cos(angle2) * radius;
        const y2 = Math.sin(angle2) * radius;
        const midAngle = (angle1 + angle2) / 2;
        const controlRadius = radius * 1.3;
        const cx = Math.cos(midAngle) * controlRadius;
        const cy = Math.sin(midAngle) * controlRadius;
        return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
    });

    return (
        <svg className="absolute pointer-events-none" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 500, height: 500, overflow: "visible" }} viewBox="-250 -250 500 500">
            <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#ec4899" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
                </linearGradient>
            </defs>
            {paths.map((d, i) => (
                <motion.path key={i} d={d} fill="none" stroke="url(#lineGradient)" strokeWidth="2" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.8, delay: 0.8 + i * 0.1, ease: "easeOut" }} />
            ))}
        </svg>
    );
}

export default function IntroAnimation({ onComplete }: { onComplete: () => void }) {
    const [phase, setPhase] = useState(0);
    const [showText, setShowText] = useState(false);
    const [showParticles, setShowParticles] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 200);
        const t2 = setTimeout(() => { setPhase(2); setShowParticles(true); }, 2700);
        const t3 = setTimeout(() => { setPhase(3); setShowText(true); }, 3200);
        const t4 = setTimeout(() => onComplete(), 5000);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }, [onComplete]);

    return (
        <motion.div className="fixed inset-0 z-50 bg-[#030303] flex items-center justify-center overflow-hidden" exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <Particles active={showParticles} />
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: phase >= 1 ? 0.5 : 0, scale: phase >= 2 ? 1.5 : 1 }} transition={{ duration: 1 }} className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-cyan-600/30 blur-[100px]" />
            <div className="relative">
                <BezierConnections phase={phase} />
                {introNodes.map((node) => <IntroNode key={node.id} node={node} phase={phase} />)}
                <AnimatePresence>
                    {showText && (
                        <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center whitespace-nowrap">
                            <h1 className="text-[clamp(2.5rem,10vw,6rem)] font-bold tracking-[-0.04em] leading-[1] text-white pb-2">Automate</h1>
                            <h1 className="text-[clamp(2.5rem,10vw,6rem)] font-bold tracking-[-0.04em] leading-[1] bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Everything</h1>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
