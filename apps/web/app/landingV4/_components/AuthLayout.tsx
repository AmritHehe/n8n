"use client";

import Link from "next/link";
import Image from "next/image";

interface AuthLayoutProps {
    children: React.ReactNode;
    heading: string;
    sub: string;
}

export default function AuthLayout({ children, heading, sub }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-[#08080c] flex items-center justify-center p-4 antialiased">
            {/* Fonts */}
            {/* eslint-disable-next-line @next/next/no-page-custom-font */}
            <link
                href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />
            <style>{`
                :root { --serif: 'Playfair Display', Georgia, serif; --sans: 'Inter', system-ui, sans-serif; }
                body, * { font-family: var(--sans); }
                .font-ed { font-family: var(--serif); }
                .grain::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    pointer-events: none;
                    opacity: 0.02;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
                    background-size: 128px 128px;
                }
            `}</style>

            <div className="grain" />

            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[200px] bg-blue-400/4" />
            </div>

            <div className="relative w-full max-w-sm animate-[fadeIn_0.5s_forwards]">
                {/* Back */}
                <Link
                    href="/landingV4"
                    className="inline-flex items-center gap-2.5 text-white/25 hover:text-white/50 text-[13px] mb-10 transition-colors group"
                >
                    <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </Link>

                {/* Logo */}
                <div className="flex items-center gap-2.5 mb-10">
                    <div className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center">
                        <Image src="/workflow.svg" alt="" width={13} height={13} className="invert" />
                    </div>
                    <span className="font-ed text-[15px] italic text-white/60">autm8n</span>
                </div>

                {/* Heading */}
                <h1 className="font-ed text-[28px] text-white/90 mb-1 tracking-tight">{heading}</h1>
                <p className="text-[13px] text-white/25 font-light mb-8">{sub}</p>

                {children}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
