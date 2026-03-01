"use client";
import { PremiumNode } from "./PremiumNode";
import { MousePointerClick } from "lucide-react";

export function TriggerNode({ id, data }: { id: string; data: any }) {
    return (
        <PremiumNode
            id={id}
            data={data}
            icon={<MousePointerClick className="w-5 h-5" style={{ color: "#60a5fa" }} />}
            color="#60a5fa"
            title="Manual Trigger"
            subtitle="Click Execute to start"
        />
    );
}
