"use client";
import { useState } from "react";
import { PremiumNode } from "./PremiumNode";
import { Webhook, Check, Copy } from "lucide-react";

export function WebhookNode({ id, data }: { id: string; data: any }) {
    const [copied, setCopied] = useState(false);
    const base = process.env.NEXT_PUBLIC_BACKEND_API || "";
    const webhookUrl = `${base}/webhook/${id}?workflowId=${data?.workflowId || ""}`;

    const copyUrl = () => {
        navigator.clipboard.writeText(webhookUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Determine if this is a trigger or action based on label
    const isTrigger = data?.label === "trigger";

    return (
        <PremiumNode
            id={id}
            data={data}
            icon={<Webhook className="w-5 h-5" style={{ color: "#8b5cf6" }} />}
            color="#8b5cf6"
            title={isTrigger ? "Webhook Trigger" : "Webhook Action"}
            subtitle="HTTP endpoint"
        >
            <div className="space-y-3">
                <div>
                    <label className="block text-xs text-white/50 mb-1.5">Webhook URL</label>
                    <div className="flex gap-2">
                        <input
                            readOnly
                            value={webhookUrl}
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs font-mono truncate"
                        />
                        <button
                            onClick={copyUrl}
                            className="px-3 py-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 rounded-lg transition-colors"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                <p className="text-xs text-white/40">
                    {isTrigger
                        ? "Send POST request to this URL to trigger workflow"
                        : "Workflow pauses here, waiting for webhook call"
                    }
                </p>
            </div>
        </PremiumNode>
    );
}
