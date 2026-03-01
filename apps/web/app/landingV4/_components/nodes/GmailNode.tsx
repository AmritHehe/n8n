"use client";

import { useState, useEffect } from "react";
import { useReactFlow } from "@xyflow/react";
import Image from "next/image";
import PremiumNode from "../PremiumNode";
import api from "../../../apiClient";

export default function GmailNode({ id, data }: { id: string; data: any }) {
    const { setNodes } = useReactFlow();
    const [credentials, setCredentials] = useState<any[]>([]);
    const [to, setTo] = useState(data?.to || "");
    const [subject, setSubject] = useState(data?.subject || "");
    const [message, setMessage] = useState(data?.message || "");
    const [credentialId, setCredentialId] = useState(data?.credentialsId || "");

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

    return (
        <PremiumNode
            id={id}
            data={data}
            icon={<Image src="/sendmail.svg" alt="Send Mail" width={20} height={20} className="invert" />}
            color="#ef4444"
            title="Send Email"
            subtitle={data?.to ? `To: ${data.to}` : "Configure email"}
            onSave={() => updateNodeData({ to, subject, message, credentialsId: credentialId })}
        >
            <div className="space-y-3">
                <div>
                    <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Credential</label>
                    <select
                        value={credentialId}
                        onChange={(e) => setCredentialId(e.target.value)}
                        className="w-full px-3 py-2 bg-white/4 border border-white/8 rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50"
                    >
                        <option value="">Select credential...</option>
                        {credentials
                            .filter((c) => c.platform === "gmail")
                            .map((c) => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                    </select>
                </div>
                <input
                    placeholder="To email"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full px-3 py-2 bg-white/4 border border-white/8 rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50"
                />
                <input
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-white/4 border border-white/8 rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50"
                />
                <textarea
                    placeholder="Message body..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-white/4 border border-white/8 rounded-lg text-white text-sm h-16 resize-none focus:outline-none focus:border-red-500/50"
                />
            </div>
        </PremiumNode>
    );
}
