"use client";

import { useState } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X, Save, Check } from "lucide-react";

interface PremiumNodeProps {
    id: string;
    data: any;
    icon: React.ReactNode;
    color: string;
    title: string;
    subtitle: string;
    children?: React.ReactNode;
    onSave?: () => void;
}

export default function PremiumNode({
    id,
    data,
    icon,
    color,
    title,
    subtitle,
    children,
    onSave,
}: PremiumNodeProps) {
    const { setNodes, setEdges } = useReactFlow();
    const [showConfig, setShowConfig] = useState(false);

    const deleteNode = (e: React.MouseEvent) => {
        e.stopPropagation();
        setNodes((nds) => nds.filter((n) => n.id !== id));
        setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    };

    const handleSave = () => {
        onSave?.();
        setShowConfig(false);
    };

    const isExecuting = data?.isExecuting;
    const isCompleted = data?.isCompleted;

    return (
        <>
            <div className="relative">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative group min-w-[280px] rounded-2xl overflow-hidden cursor-pointer"
                    style={{
                        background: `linear-gradient(135deg, ${color}12 0%, #0c0c14 100%)`,
                        borderColor: isExecuting ? color : `${color}30`,
                        borderWidth: "1px",
                        borderStyle: "solid",
                        boxShadow: isExecuting
                            ? `0 0 24px ${color}25`
                            : "0 4px 24px rgba(0,0,0,0.4)",
                        transition: "box-shadow 0.3s ease",
                    }}
                    onClick={() => setShowConfig(true)}
                >
                    {/* Completed indicator */}
                    {isCompleted && !isExecuting && (
                        <div className="absolute top-3 right-12 w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center z-10">
                            <Check className="w-4 h-4 text-white" />
                        </div>
                    )}

                    {/* Header */}
                    <div className="p-4 flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: `${color}25` }}
                        >
                            {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-sm truncate">{title}</h3>
                            <p className="text-xs text-white/40 truncate">{subtitle}</p>
                        </div>
                        <button
                            onClick={deleteNode}
                            className="p-1.5 rounded-lg bg-white/4 hover:bg-red-500/20 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Node ID */}
                    <div className="absolute bottom-2 left-4 text-[10px] text-white/20 font-mono">
                        #{id}
                    </div>
                </motion.div>

                {/* Handles */}
                <Handle
                    type="target"
                    position={Position.Left}
                    className="w-4! h-4! bg-white! border-2! hover:scale-150! transition-all duration-200"
                    style={{ borderColor: color }}
                />
                <Handle
                    type="source"
                    position={Position.Right}
                    className="w-4! h-4! bg-white! border-2! hover:scale-150! transition-all duration-200"
                    style={{ borderColor: color }}
                />
            </div>

            {/* Config modal */}
            <AnimatePresence>
                {showConfig && children && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 w-80 bg-[#0c0c14] border border-white/8 rounded-xl shadow-2xl z-50 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-white/6 flex items-center justify-between">
                            <h4 className="font-medium text-white text-sm">Configure {title}</h4>
                            <button
                                onClick={() => setShowConfig(false)}
                                className="p-1 rounded hover:bg-white/8 text-white/40 hover:text-white/70 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-4">{children}</div>
                        <div className="p-4 pt-0 border-t border-white/4 mt-2">
                            <button
                                onClick={handleSave}
                                className="w-full py-2.5 rounded-lg bg-blue-400/90 hover:bg-blue-400 text-white font-medium text-sm transition-all flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save Configuration
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
