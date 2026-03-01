"use client";

import { useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { Bot } from "lucide-react";
import PremiumNode from "../PremiumNode";

export default function AIAgentNode({ id, data }: { id: string; data: any }) {
    const { setNodes, getNodes } = useReactFlow();
    const previousNodes = getNodes().filter((n) => n.id !== id);
    const [message, setMessage] = useState(data?.message || "");
    const [usePrevious, setUsePrevious] = useState(data?.previousResponse || false);

    const updateNodeData = (updates: any) => {
        setNodes((nds) =>
            nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...updates } } : n))
        );
    };

    return (
        <PremiumNode
            id={id}
            data={data}
            icon={<Bot className="w-5 h-5" style={{ color: "#a855f7" }} />}
            color="#a855f7"
            title="AI Agent"
            subtitle={data?.message ? "Prompt configured" : "Configure AI prompt"}
            onSave={() => updateNodeData({ message, previousResponse: usePrevious })}
        >
            <div className="space-y-3">
                <div>
                    <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Model</label>
                    <select
                        value={data?.model || "gemini"}
                        onChange={(e) => updateNodeData({ model: e.target.value })}
                        className="w-full px-3 py-2 bg-white/4 border border-white/8 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50"
                    >
                        <option value="gemini">Gemini (Google)</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={usePrevious}
                        onChange={(e) => setUsePrevious(e.target.checked)}
                        className="rounded accent-purple-500"
                    />
                    <label className="text-[11px] text-white/50">Use previous node response</label>
                </div>

                {usePrevious && (
                    <select
                        value={data?.previousResponseFromWhichNode || ""}
                        onChange={(e) => updateNodeData({ previousResponseFromWhichNode: e.target.value })}
                        className="w-full px-3 py-2 bg-white/4 border border-white/8 rounded-lg text-white text-sm focus:outline-none"
                    >
                        <option value="">Select node...</option>
                        {previousNodes.map((n) => (
                            <option key={n.id} value={n.id}>#{n.id} ({n.type})</option>
                        ))}
                    </select>
                )}

                <textarea
                    placeholder="Enter AI prompt..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-white/4 border border-white/8 rounded-lg text-white text-sm h-20 resize-none focus:outline-none focus:border-purple-500/50"
                />
            </div>
        </PremiumNode>
    );
}
