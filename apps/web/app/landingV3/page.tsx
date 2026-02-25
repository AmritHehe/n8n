"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import IntroAnimation from "./_components/IntroAnimation";
import Hero from "./_components/Hero";
import BentoGrid from "./_components/BentoGrid";
import FluidBackground from "./_components/FluidBackground";
import ScrollSection from "./_components/ScrollSection";
import WorkflowAnimation from "./_components/WorkflowAnimation";
import SocialProof from "./_components/SocialProof";
import Footer from "./_components/Footer";

export default function LandingV3() {
    const [showIntro, setShowIntro] = useState(true);

    const handleIntroComplete = useCallback(() => {
        setShowIntro(false);
    }, []);

    return (
        <main className="relative min-h-screen w-full bg-[#030303] text-white selection:bg-blue-400/30 antialiased">

          

                <AnimatePresence>
                    {/* <FluidBackground /> */}


                    <div className="relative z-10">
                        <Hero />
                        <SocialProof />
                        <WorkflowAnimation />
                    </div>


                    <ScrollSection />


                    <div className="relative z-10">
                        <BentoGrid />
                        <Footer />
                    </div>
                </AnimatePresence>
         
        </main>
    );
}
