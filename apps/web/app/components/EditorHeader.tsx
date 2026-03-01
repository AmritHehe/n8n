import { motion } from "framer-motion";
import { Loader2, Save, Play } from "lucide-react";

interface EditorHeaderProps {
    nodesCount: number;
    saveWorkflow: () => void;
    saving: boolean;
    executeWorkflow: () => void;
    executing: boolean;
}

export default function EditorHeader({
    nodesCount,
    saveWorkflow,
    saving,
    executeWorkflow,
    executing,
}: EditorHeaderProps) {
    return (
        <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="bg-[#0a0a0a] border-b border-white/10 px-6 py-4 flex items-center justify-between"
        >
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white/40">
                    <span className="text-sm">{nodesCount} nodes</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={saveWorkflow}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/80 transition-all disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span className="text-sm">Save</span>
                </button>

                <button
                    onClick={executeWorkflow}
                    disabled={executing || nodesCount === 0}
                    className="flex items-center gap-2 px-5 py-2 bg-linear-to-r from-blue-400 to-blue-300 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-blue-300/20 transition-all disabled:opacity-50"
                >
                    {executing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Play className="w-4 h-4" />
                    )}
                    <span className="text-sm">{executing ? "Running..." : "Execute"}</span>
                </button>
            </div>
        </motion.div>
    );
}
