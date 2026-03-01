import { Handle, Position, useReactFlow } from "@xyflow/react";
import { useState, useCallback } from "react";
import Image from "next/image";

export function Webhook({ id, data }: { id: string; data: any }) {
  const { setNodes, setEdges } = useReactFlow();
  const [showUrl, setShowUrl] = useState(false);
  const [copied, setCopied] = useState(false);

  const workflowId = data.workflowId;
  const base = process.env.NEXT_PUBLIC_BACKEND_API;
  const webhookUrl = `${base}/webhook/${id}?workflowId=${workflowId}`;

  const deleteNode = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((edges) => edges.filter((n) => n.target !== id));
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(webhookUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div
      className={`bg-[#0c0c14] border rounded-xl min-w-[280px] transition-all duration-200
        ${data?.isExecuting
          ? "border-violet-400/50 shadow-[0_0_20px_rgba(167,139,250,0.15)] animate-pulse"
          : "border-violet-500/25 hover:border-violet-500/40 shadow-lg shadow-violet-500/5"
        }`}
    >
      <div className="p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-violet-500/15 rounded-lg flex items-center justify-center">
            <Image src="/workflow.svg" alt="Webhook" width={14} height={14} className="invert opacity-70" />
          </div>
          <div>
            <h3 className="text-[13px] font-medium text-white/80">Webhook</h3>
            <p className="text-[10px] text-white/25">id: {id}</p>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); deleteNode(); }}
          className="p-1.5 rounded-lg hover:bg-white/6 transition-colors"
        >
          <svg className="w-3.5 h-3.5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Toggle URL section */}
      <div className="px-3.5 pb-3">
        <button
          onClick={(e) => { e.stopPropagation(); setShowUrl(!showUrl); }}
          className="text-[11px] text-violet-300/60 hover:text-violet-300/90 transition-colors"
        >
          {showUrl ? "Hide URL" : "Show URL"}
        </button>

        {showUrl && (
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={webhookUrl}
              className="flex-1 px-2.5 py-1.5 bg-white/4 border border-white/8 rounded-lg text-[11px] text-white/50 outline-none"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={handleCopy}
              className="px-2.5 py-1.5 bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/20 rounded-lg text-[11px] text-violet-300/70 font-medium transition-all"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="bg-violet-400! w-3! h-3! border-0!" />
      <Handle type="target" position={Position.Left} className="bg-violet-400! w-3! h-3! border-0!" />
    </div>
  );
}
