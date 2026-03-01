"use client";

import { useEffect, useRef } from "react";

/**
 * Electricity FLOW — persistent glowing wire paths with bright current
 * pulses flowing left → right along them, like power through circuits.
 */
export default function ElectricalDither3() {
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

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            buildPaths();
        };
        window.addEventListener("resize", resize);

        // ── Wire paths: permanent curved lines across the screen ──
        interface WirePath {
            points: Array<{ x: number; y: number }>;
            baseOpacity: number;
        }

        let paths: WirePath[] = [];

        const buildPaths = () => {
            paths = [];
            const count = 7;
            for (let i = 0; i < count; i++) {
                const yStart = height * 0.1 + (height * 0.8) * (i / (count - 1));
                const points: Array<{ x: number; y: number }> = [];
                const steps = 80;

                // Build a smooth wavy path using layered sine waves
                for (let s = 0; s <= steps; s++) {
                    const t = s / steps;
                    const x = t * (width + 100) - 50;
                    const wave1 = Math.sin(t * Math.PI * 2 + i * 1.2) * (25 + i * 8);
                    const wave2 = Math.sin(t * Math.PI * 4.5 + i * 0.8) * 8;
                    const y = yStart + wave1 + wave2;
                    points.push({ x, y });
                }

                paths.push({
                    points,
                    baseOpacity: 0.02 + (i % 3 === 0 ? 0.015 : 0),
                });
            }
        };
        buildPaths();

        // ── Current pulses: bright spots that travel along paths ──
        interface Pulse {
            pathIndex: number;
            position: number; // 0..1 along the path
            speed: number;
            intensity: number;
            trailLength: number;
        }

        const pulses: Pulse[] = [];

        const spawnPulse = () => {
            const pi = Math.floor(Math.random() * paths.length);
            pulses.push({
                pathIndex: pi,
                position: -0.02,
                speed: 0.003 + Math.random() * 0.004,
                intensity: 0.4 + Math.random() * 0.4,
                trailLength: 0.06 + Math.random() * 0.08,
            });
        };

        // Seed some initial pulses
        for (let i = 0; i < 6; i++) {
            const pi = Math.floor(Math.random() * paths.length);
            pulses.push({
                pathIndex: pi,
                position: Math.random(),
                speed: 0.003 + Math.random() * 0.004,
                intensity: 0.4 + Math.random() * 0.4,
                trailLength: 0.06 + Math.random() * 0.08,
            });
        }

        // Get interpolated point on a path at position t (0..1)
        const getPointOnPath = (path: WirePath, t: number): { x: number; y: number } => {
            const idx = t * (path.points.length - 1);
            const i0 = Math.floor(idx);
            const i1 = Math.min(i0 + 1, path.points.length - 1);
            const frac = idx - i0;
            const p0 = path.points[i0];
            const p1 = path.points[i1];
            if(!p0 || !p1){
                    return { x : 1 , y : 2}
                }
            return {
                x: p0.x + (p1.x - p0.x) * frac,
                y: p0.y + (p1.y - p0.y) * frac,
            };
        };

        // ── Draw ──
        const draw = () => {
            time++;
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = "#030303";
            ctx.fillRect(0, 0, width, height);

            // Spawn pulses regularly
            if (time % 25 === 0) spawnPulse();
            if (pulses.length < 4 && time % 10 === 0) spawnPulse();

            // Draw wire paths (subtle base glow — always visible)
            for (const path of paths) {
                
                ctx.beginPath();
                const firstPoint = path.points[0]!;
                ctx.moveTo(firstPoint.x, firstPoint.y);
                for (let i = 1; i < path.points.length; i++) {
                    const pt = path.points[i]!;
                    ctx.lineTo(pt.x, pt.y);
                }
                // Thin base wire
                ctx.strokeStyle = `rgba(96, 165, 250, ${path.baseOpacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Draw & update pulses
            for (let pi = pulses.length - 1; pi >= 0; pi--) {
                const pulse = pulses[pi]!;
                pulse.position += pulse.speed;

                const path = paths[pulse.pathIndex];
                if (!path) { pulses.splice(pi, 1); continue; }

                // Draw the trail: a gradient of bright segments behind the head
                const trailSteps = 20;
                for (let t = 0; t <= trailSteps; t++) {
                    const trailT = pulse.position - (t / trailSteps) * pulse.trailLength;
                    if (trailT < 0 || trailT > 1) continue;

                    const pt = getPointOnPath(path, trailT);
                    const fade = 1 - (t / trailSteps); // 1 at head, 0 at tail
                    const alpha = pulse.intensity * fade;

                    // Core glow
                    const radius = 1.5 + fade * 2;
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(147, 197, 253, ${alpha * 0.6})`;
                    ctx.fill();

                    // Medium glow
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, radius * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(96, 165, 250, ${alpha * 0.1})`;
                    ctx.fill();

                    // Wide ambient glow (head only)
                    if (t === 0) {
                        ctx.beginPath();
                        ctx.arc(pt.x, pt.y, 15, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(96, 165, 250, ${alpha * 0.04})`;
                        ctx.fill();
                    }
                }

                // Also brighten the wire segment near the pulse head
                const headT = Math.max(0, Math.min(1, pulse.position));
                if (headT >= 0 && headT <= 1) {
                    const headPt = getPointOnPath(path, headT);
                    const trailStartT = Math.max(0, pulse.position - pulse.trailLength);

                    ctx.beginPath();
                    let started = false;
                    for (let i = 0; i < path.points.length; i++) {
                        const segT = i / (path.points.length - 1);
                        if (segT >= trailStartT && segT <= pulse.position) {
                            const pt = path.points[i]!;
                            if (!started) {
                                ctx.moveTo(pt.x, pt.y);
                                started = true;
                            } else {
                                ctx.lineTo(pt.x, pt.y);
                            }
                        }
                    }
                    ctx.strokeStyle = `rgba(96, 165, 250, ${pulse.intensity * 0.15})`;
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    ctx.strokeStyle = `rgba(96, 165, 250, ${pulse.intensity * 0.04})`;
                    ctx.lineWidth = 8;
                    ctx.stroke();
                }

                // Remove pulse when it exits
                if (pulse.position > 1.1) {
                    pulses.splice(pi, 1);
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
