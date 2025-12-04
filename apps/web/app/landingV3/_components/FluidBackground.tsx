"use client";

import { useEffect, useRef } from "react";

export default function FluidBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resize);
        resize();

        class Blob {
            x: number;
            y: number;
            radius: number;
            color: string;
            vx: number;
            vy: number;

            constructor(x: number, y: number, radius: number, color: string) {
                this.x = x;
                this.y = y;
                this.radius = radius;
                this.color = color;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
            }

            update(w: number, h: number) {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < -this.radius) this.x = w + this.radius;
                if (this.x > w + this.radius) this.x = -this.radius;
                if (this.y < -this.radius) this.y = h + this.radius;
                if (this.y > h + this.radius) this.y = -this.radius;
            }

            draw(ctx: CanvasRenderingContext2D) {
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, "transparent");
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Purple/pink/cyan palette matching the gradient
        const blobs = [
            new Blob(canvas.width * 0.2, canvas.height * 0.3, 450, "rgba(168, 85, 247, 0.08)"),
            new Blob(canvas.width * 0.8, canvas.height * 0.2, 400, "rgba(6, 182, 212, 0.06)"),
            new Blob(canvas.width * 0.5, canvas.height * 0.7, 500, "rgba(236, 72, 153, 0.05)"),
            new Blob(canvas.width * 0.3, canvas.height * 0.8, 350, "rgba(59, 130, 246, 0.06)"),
        ];

        const draw = () => {
            time += 0.005;
            ctx.fillStyle = "#030303";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            blobs.forEach((blob, i) => {
                blob.vx += Math.sin(time + i) * 0.005;
                blob.vy += Math.cos(time + i * 0.7) * 0.005;
                blob.vx *= 0.99;
                blob.vy *= 0.99;
                blob.update(canvas.width, canvas.height);
                blob.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <canvas ref={canvasRef} className="absolute inset-0" />
            <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI24pIi8+PC9zdmc+')] opacity-[0.02]" />
        </div>
    );
}
