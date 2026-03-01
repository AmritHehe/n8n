"use client";

import { useState, useEffect } from "react";
import { useReactFlow } from "@xyflow/react";
import Image from "next/image";
import { Copy, Check } from "lucide-react";
import PremiumNode from "../PremiumNode";
import api from "../../../apiClient";

export default function AwaitGmailNode({ id, data }: { id: string; data: any }) {
    const { setNodes } = useReactFlow();
    const [credentials, setCredentials] = useState<any[]>([]);
    const base = process.env.NEXT_PUBLIC_BACKEND_API;
    const webhookUrl = `${base}/webhook/${id}?workflowId=${data?.workflowId || ""}`;
    const [copied, setCopied] = useState(false);
    const [to, setTo] = useState(data?.to || "");
    const [subject, setSubject] = useState(data?.subject || "");
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
            icon={<Image src="/sendMail&wait.svg" alt="Send Mail & Wait" width={20} height={20} className="invert" />}
            color="#f97316"
            title="Await Gmail Reply"
            subtitle="Wait for email response"
            onSave={() => updateNodeData({ to, subject, credentialsId: credentialId })}
        >
            <div className="space-y-3">
                <div>
                    <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Webhook URL</label>
                    <div className="flex gap-2">
                        <input
                            readOnly
                            value={webhookUrl}
                            className="flex-1 px-2 py-1.5 bg-white/4 border border-white/8 rounded text-white text-[10px] font-mono truncate focus:outline-none"
                        />
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(webhookUrl);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }}
                            className="px-2 py-1.5 bg-orange-500/15 text-orange-400 rounded text-xs hover:bg-orange-500/25 transition-colors"
                        >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                </div>
                <select
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    className="w-full px-3 py-2 bg-white/4 border border-white/8 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50"
                >
                    <option value="">Select credential...</option>
                    {credentials
                        .filter((c) => c.platform === "gmail")
                        .map((c) => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                </select>
                <input
                    placeholder="To email"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full px-3 py-2 bg-white/4 border border-white/8 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50"
                />
                <input
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-white/4 border border-white/8 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50"
                />
            </div>
        </PremiumNode>
    );
}
