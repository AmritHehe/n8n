import { Handle, Position, useReactFlow } from "@xyflow/react";
import { useState, useCallback } from "react";
import Image from "next/image";
import NodeConfigModal from "../components/NodeConfigModal";

export function TeligramNode({ id, data }: { id: string; data: any }) {
  const { setNodes, setEdges, getNodes } = useReactFlow();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteNode = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((edges) => edges.filter((e) => e.target !== id));
  };

  const updateField = useCallback(
    (field: string, value: any) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id
            ? field
              ? { ...n, data: { ...n.data, [field]: value } }
              : { ...n, data: value }
            : n
        )
      );
    },
    [id, setNodes]
  );

  const previousNodes = getNodes().filter((n) => n.id !== id);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className={`bg-[#0c0c14] border rounded-xl min-w-[280px] cursor-pointer transition-all duration-200
          ${data?.isExecuting
            ? "border-blue-400/50 shadow-[0_0_20px_rgba(96,165,250,0.15)] animate-pulse"
            : "border-blue-500/25 hover:border-blue-500/40 shadow-lg shadow-blue-500/5"
          }`}
      >
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-500/15 rounded-lg flex items-center justify-center">
              <Image src="/telegram.svg" alt="Telegram" width={14} height={14} className="invert opacity-70" />
            </div>
            <div>
              <h3 className="text-[13px] font-medium text-white/80">Telegram</h3>
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

        <p className="px-3.5 pb-3 text-[11px] text-white/30">{data?.description || "Send message via Telegram"}</p>

        <Handle type="source" position={Position.Right} className="bg-blue-400! w-3! h-3! border-0!" />
        <Handle type="target" position={Position.Left} className="bg-blue-400! w-3! h-3! border-0!" />
      </div>

      <NodeConfigModal
        isOpen={isModalOpen}
        nodeType="teligram"
        nodeData={data}
        nodeId={id}
        previousNodes={previousNodes}
        onClose={() => setIsModalOpen(false)}
        onSave={(updatedData: any) => updateField("", updatedData)}
      />
    </>
  );
}
