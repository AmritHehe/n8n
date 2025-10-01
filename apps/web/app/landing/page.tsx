    "use client";

    import { motion } from "framer-motion";
    import Link from "next/link";
    import { Workflow, Zap, Bot, Mail } from "lucide-react";

    const features = [
    {
        icon: Workflow,
        title: "Drag & Drop Builder",
        description: "Visual ReactFlow editor for intuitive workflow creation",
    },
    {
        icon: Mail,
        title: "Triggers & Actions",
        description: "Gmail, Telegram, Webhook integrations with popup configs",
    },
    {
        icon: Bot,
        title: "AI Agent",
        description: "Intelligent automation with configurable AI models",
    },
    {
        icon: Zap,
        title: "Real-time Execution",
        description: "Live workflow execution with glowing node animations",
    },
    ];

    const FeatureCard = ({ icon: Icon, title, description }: any) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-800 hover:border-[hsl(var(--primary))]/50 transition-all duration-300"
    >
        <div className="w-16 h-16 bg-[hsl(var(--primary)/0.2)] rounded-2xl flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-[hsl(var(--primary))] drop-shadow-[0_0_12px_hsl(var(--primary))]" />
        </div>
        <h3 className="font-bold text-xl text-white mb-4">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
    );

    export default function Home() {
    return (
        <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] relative overflow-hidden">

        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden px-4">
            {/* Background circles */}
            <motion.div
            className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,_hsl(var(--primary)/0.3),transparent_70%)] rounded-full"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
            className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,_hsl(var(--secondary)/0.25),transparent_70%)] rounded-full"
            animate={{ scale: [1, 1.07, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />

            {/* Logo */}
            <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="mb-6"
            >
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] transition-all duration-300 shadow-[0_0_60px_hsl(var(--primary)/0.2)]">
                <Workflow className="w-10 h-10 text-white" />
            </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight relative z-10"
                >
                {/* White base text with animated gradient overlay */}
                <span className="relative text-white">
                    Automate{" "}
                    <span className="bg-gradient-to-r from-[hsl(var(--primary))]  to-[#e6ccdb] bg-clip-text text-transparent animate-gradient-x">
                    Everything
                    </span>{" "}
                    Effortlessly
                    {/* Glowing shadow effect */}
                    <span className="absolute inset-0 text-transparent drop-shadow-[0_0_20px_hsl(var(--primary))]"></span>
                </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="text-lg md:text-2xl text-[hsl(var(--foreground-secondary))] mb-10 max-w-3xl mx-auto"
            >
            Build intelligent workflows faster with our visual automation platform.
            </motion.p>

            {/* CTA */}
            <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.7 }}
            className="z-40"
            >
            
            <Link
                href="/workflows"
                className="inline-flex items-center gap-3 px-10 py-4 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] text-white font-semibold z-4 text-lg md:text-xl rounded-xl shadow-[0_0_40px_hsl(var(--primary)/0.25)] hover:shadow-[0_0_60px_hsl(var(--primary)/0.35)] transition-all "
            >
                <Zap className="w-6 h-6" />
                Get Started
            </Link>
            </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Core Features</h2>
                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                Everything you need to automate and visualize complex workflows.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((f, i) => (
                <FeatureCard key={i} {...f} />
                ))}
            </div>
            </div>
        </section>

        {/* Screenshot / Preview Section */}
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Live Preview</h2>
            <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                Get a glimpse of your workflows in action.
            </p>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl"
            >
                <div className="bg-gray-800/50 rounded-xl p-8 min-h-[400px] flex items-center justify-center border border-gray-600">
                <div className="text-center">
                    <Workflow className="w-24 h-24 text-[hsl(var(--primary))] mx-auto mb-4 opacity-50 drop-shadow-[0_0_40px_hsl(var(--primary)/0.15)]" />
                    <p className="text-gray-500 text-lg">Workflow Editor Preview</p>
                    <p className="text-gray-600 text-sm mt-2">Coming Soon...</p>
                </div>
                </div>
            </motion.div>
            </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-4 border-t border-gray-800">
            <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center gap-3 mb-8 md:mb-0">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] flex items-center justify-center shadow-[0_0_40px_hsl(var(--primary)/0.15)]">
                    <Workflow className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Visual Workflow Builder</span>
                </div>

                <div className="flex items-center gap-8">
                <Link href="/docs" className="text-gray-400 hover:text-[hsl(var(--primary))] transition-colors">Docs</Link>
                <Link href="/github" className="text-gray-400 hover:text-[hsl(var(--primary))] transition-colors">GitHub</Link>
                <Link href="/contact" className="text-gray-400 hover:text-[hsl(var(--primary))] transition-colors">Contact</Link>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-800 text-center">
                <p className="text-gray-500">
                © 2024 Visual Workflow Builder. Built with Next.js, ReactFlow & Tailwind CSS.
                </p>
            </div>
            </div>
        </footer>
        </div>
    );
    }
