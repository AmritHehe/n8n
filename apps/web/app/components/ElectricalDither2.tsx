"use client";

import { useEffect, useRef } from "react";

export default function ElectricalDitherNice() {
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

        const particles: { 
            x: number; 
            y: number; 
            vx: number; 
            vy: number; 
            life: number; 
            maxLife: number; 
            yBase: number;
            history: { x: number; y: number }[];
        }[] = [];

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize);

        // Central flow — particles converge toward center then fan out
        const spawnParticle = () => {
            const side = Math.random();
            const fromLeft = side < 0.7; // bias toward left→right
            particles.push({
                x: fromLeft ? -10 : width + 10,
                y: height * 0.3 + Math.random() * height * 0.4,
                vx: fromLeft ? 1 + Math.random() * 2.5 : -(1 + Math.random() * 2.5),
                vy: 0,
                life: 0,
                maxLife: 200 + Math.random() * 200,
                yBase: height * 0.1 + Math.random() * height * 0.1,
                history: [],
            });
        };

        const draw = () => {
            time++;

            // EXACT CLEAR: NO MORE MUDDY GREY BOX!
            ctx.clearRect(0, 0, width, height);

            // Spawn
            if (time % 2 === 0) spawnParticle();

            const cx = width * 0.5;
            const cy = height * 0.5;

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                if (!p) continue;
                
                // Pull toward center vertically, with sine wave
                const distToCenterX = cx - p.x;
                const pullStrength = 0.001;
                p.vy += (cy - p.y) * pullStrength;
                p.vy *= 0.97; // damping
                
                p.x += p.vx;
                p.y += p.vy + Math.sin(time * 0.015 + p.x * 0.008) * 0.5;
                p.life++;

                // Record history for smooth trail without screen accumulation
                p.history.push({ x: p.x, y: p.y });
                if (p.history.length > 25) {
                    p.history.shift(); // Keep trail fixed length
                }

                const alpha = Math.min(p.life / 30, 1) * Math.max(0, 1 - p.life / p.maxLife);
                
                // Draw trailing line
                if (p.history.length > 1) {
                    ctx.beginPath();
                    for (let j = 0; j < p.history.length; j++) {
                        const pt = p.history[j];
                        if (j === 0) ctx.moveTo(pt.x, pt.y);
                        else ctx.lineTo(pt.x, pt.y);
                    }
                    // Trail fades out at the tail
                    const grad = ctx.createLinearGradient(
                        p.history[0].x, p.history[0].y, 
                        p.x, p.y
                    );
                    grad.addColorStop(0, `rgba(96, 165, 250, 0)`);
                    grad.addColorStop(1, `rgba(96, 165, 250, ${alpha * 0.8})`);
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }

                const size = 0.8 + alpha * 1.2;

                // Core particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(96, 165, 250, ${alpha * 0.5})`;
                ctx.fill();

                // Soft glow
                ctx.beginPath();
                ctx.arc(p.x, p.y, size * 4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(96, 165, 250, ${alpha * 0.06})`;
                ctx.fill();

                // Electrical branch — less frequent, subtle
                if (Math.random() < 0.015 && alpha > 0.2) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    const bLen = 15 + Math.random() * 30;
                    const bAngle = Math.random() * Math.PI * 2;
                    ctx.lineTo(p.x + Math.cos(bAngle) * bLen, p.y + Math.sin(bAngle) * bLen);
                    ctx.strokeStyle = `rgba(96, 165, 250, ${alpha * 0.12})`;
                    ctx.lineWidth = 0.3;
                    ctx.stroke();
                }

                if (p.life > p.maxLife || p.x > width + 30 || p.x < -30) {
                    particles.splice(i, 1);
                }
            }

            // Dither dots — sparse grid shimmer
            if (time % 6 === 0) {
                for (let x = 0; x < width; x += 24) {
                    for (let y = 0; y < height; y += 24) {
                        if (Math.random() < 0.008) {
                            const distFromCenter = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
                            const intensity = Math.max(0, 1 - distFromCenter / (width * 0.5));
                            ctx.fillStyle = `rgba(96, 165, 250, ${intensity * 0.06})`;
                            ctx.fillRect(x, y, 2, 2);
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
