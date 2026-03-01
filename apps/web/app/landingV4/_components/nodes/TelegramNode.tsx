"use client";

import { useState, useEffect } from "react";
import { useReactFlow } from "@xyflow/react";
import Image from "next/image";
import PremiumNode from "../PremiumNode";
import api from "../../../apiClient";

export default function TelegramNode({ id, data }: { id: string; data: any }) {
    const { setNodes, getNodes } = useReactFlow();
    const [message, setMessage] = useState(data?.message || "");
    const [credentialId, setCredentialId] = useState(data?.credentialsId || "");
    const [credentials, setCredentials] = useState<any[]>([]);
    const [usePrevious, setUsePrevious] = useState(data?.previousResponse || false);

    useEffect(() => {
        api.get("/api/v1/credentials").then((res: any) =>
            setCredentials(Array.isArray(res.data) ? res.data : [])
        );
    }, []);

    const updateNodeData = (updates: any) => {
        setNodes((nds) =>
            nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...updates } } : n))
        );
    };

    const previousNodes = getNodes().filter((n) => n.id !== id);

    return (
        <PremiumNode
            id={id}
            data={data}
            icon={<Image src="/telegram.svg" alt="Telegram" width={20} height={20} className="invert" />}
            color="#0ea5e9"
            title="Send Telegram"
            subtitle={data?.message ? `"${data.message.slice(0, 20)}..."` : "Configure message"}
            onSave={() => updateNodeData({ message, credentialsId: credentialId, previousResponse: usePrevious })}
        >
            <div className="space-y-3">
                <div>
                    <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Credential</label>
                    <select
                        value={credentialId}
                        onChange={(e) => setCredentialId(e.target.value)}
                        className="w-full px-3 py-2 bg-white/4 border border-white/8 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500/50"
                    >
                        <option value="">Select credential...</option>
                        {credentials
                            .filter((c) => c.platform === "teligram")
                            .map((c) => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={usePrevious}
                        onChange={(e) => setUsePrevious(e.target.checked)}
                        className="rounded accent-cyan-500"
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
                            <option key={n.id} value={n.id}>Node #{n.id} ({n.type})</option>
                        ))}
                    </select>
                )}

                <div>
                    <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter message..."
                        className="w-full px-3 py-2 bg-white/4 border border-white/8 rounded-lg text-white text-sm h-20 resize-none focus:outline-none focus:border-cyan-500/50"
                    />
                </div>
            </div>
        </PremiumNode>
    );
}
