"use client";
import { useState } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Check, X, Save } from "lucide-react";

export function PremiumNode({
    id,
    data,
    icon: Icon,
    color,
    title,
    subtitle,
    children,
    onSave,
}: {
    id: string;
    data: any;
    icon: any;
    color: string;
    title: string;
    subtitle: string;
    children?: React.ReactNode;
    onSave?: () => void;
}) {
    const { setNodes, setEdges } = useReactFlow();
    const [showConfig, setShowConfig] = useState(false);

    const deleteNode = (e: React.MouseEvent) => {
        e.stopPropagation();
        setNodes((nds) => {
            const updated = nds.filter((n) => n.id !== id);
            return [...updated];
        });
        setEdges((eds) => {
            const updated = eds.filter((e) => e.source !== id && e.target !== id);
            return [...updated];
        });
    };

    const handleSave = () => {
        onSave?.();
        setShowConfig(false);
    };

    const isExecuting = data?.isExecuting;
    const isCompleted = data?.isCompleted;

    return (
        <>
            {/* Wrapper for handles - must be outside overflow-hidden */}
            <div className="relative">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative group min-w-[280px] rounded-2xl overflow-hidden cursor-pointer"
                    style={{
                        background: `linear-gradient(135deg, ${color}15 0%, #0a0a0a 100%)`,
                        borderColor: isExecuting ? color : `${color}40`,
                        borderWidth: "1px",
                        borderStyle: "solid",
                        boxShadow: isExecuting
                            ? `0 0 20px ${color}30`
                            : `0 4px 24px rgba(0,0,0,0.4)`,
                        transition: 'box-shadow 0.3s ease',
                    }}
                    onClick={() => setShowConfig(true)}
                >

                    {/* Completed Indicator */}
                    {isCompleted && !isExecuting && (
                        <div className="absolute top-3 right-12 w-6 h-6 rounded-full bg-blue-300 flex items-center justify-center z-10">
                            <Check className="w-4 h-4 text-white" />
                        </div>
                    )}

                    {/* Header */}
                    <div className="p-4 flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: `${color}30` }}
                        >
                            {Icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-sm truncate">{title}</h3>
                            <p className="text-xs text-white/50 truncate">{subtitle}</p>
                        </div>
                        <button
                            onClick={deleteNode}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Node ID badge */}
                    <div className="absolute bottom-2 left-4 text-[10px] text-white/30 font-mono">#{id}</div>
                </motion.div>

                {/* Handles - Outside overflow-hidden container */}
                <Handle
                    type="target"
                    position={Position.Left}
                    className="w-4! h-4! bg-white! border-21 hover:scale-150! hover:shadow-lg! transition-all duration-200"
                    style={{ borderColor: color }}
                />
                <Handle
                    type="source"
                    position={Position.Right}
                    className="w-4! h-4! bg-white! border-21 hover:scale-150! hover:shadow-lg! transition-all duration-200"
                    style={{ borderColor: color }}
                />
            </div>

            {/* Config Modal */}
            <AnimatePresence>
                {showConfig && children && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 w-80 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                            <h4 className="font-medium text-white">Configure {title}</h4>
                            <button onClick={() => setShowConfig(false)} className="p-1 rounded hover:bg-white/10">
                                <X className="w-4 h-4 text-white/60" />
                            </button>
                        </div>
                        <div className="p-4">{children}</div>
                        {/* Save Button */}
                        <div className="p-4 pt-0 border-t border-white/5 mt-2">
                            <button
                                onClick={handleSave}
                                className="w-full py-2.5 rounded-lg bg-linear-to-r from-blue-300 to-blue-300 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-300/20 transition-all flex items-center justify-center gap-2"
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
