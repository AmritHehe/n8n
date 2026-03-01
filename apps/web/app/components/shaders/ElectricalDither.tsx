"use client";

import { useEffect, useRef } from "react";

export default function ElectricalDither() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);
        let animId: number;
        let time = 0;

        const particles: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }[] = [];

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize);

        const spawnParticle = () => {
            particles.push({
                x: 0,
                y: Math.random() * height,
                vx: 1.5 + Math.random() * 3,
                vy: (Math.random() - 0.5) * 1.5,
                life: 0,
                maxLife: 120 + Math.random() * 180,
            });
        };

        const draw = () => {
            time++;
            ctx.fillStyle = "rgba(3, 3, 3, 0.08)";
            ctx.fillRect(0, 0, width, height);

            // Spawn — slightly less frequent for lighter feel
            if (time % 4 === 0) spawnParticle();

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                if(!p){
                    continue
                }
                p.x += p.vx;
                p.y += p.vy + Math.sin(time * 0.02 + p.x * 0.01) * 0.3;
                p.life++;

                const alpha = Math.min(p.life / 20, 1) * Math.max(0, 1 - p.life / p.maxLife);
                const size = 1 + alpha * 1.5;

                // Main particle — lighter alpha
                ctx.beginPath();
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(96, 165, 250, ${alpha * 0.35})`;
                ctx.fill();

                // Electrical glow — subtler
                ctx.beginPath();
                ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(96, 165, 250, ${alpha * 0.04})`;
                ctx.fill();

                // Random electrical branch — less frequent
                if (Math.random() < 0.02 && alpha > 0.3) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    const bx = p.x + (Math.random() - 0.3) * 40;
                    const by = p.y + (Math.random() - 0.5) * 40;
                    ctx.lineTo(bx, by);
                    ctx.strokeStyle = `rgba(96, 165, 250, ${alpha * 0.08})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }

                if (p.life > p.maxLife || p.x > width + 20) {
                    particles.splice(i, 1);
                }
            }

            // Dither grid — sparser & lighter
            if (time % 6 === 0) {
                const gridSize = 3;
                for (let x = 0; x < width; x += gridSize * 10) {
                    for (let y = 0; y < height; y += gridSize * 10) {
                        if (Math.random() < 0.012) {
                            ctx.fillStyle = `rgba(96, 165, 250, ${Math.random() * 0.025})`;
                            ctx.fillRect(x, y, gridSize, gridSize);
                        }
                    }
                }
            }

            animId = requestAnimationFrame(draw);
        };

        draw();
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}
