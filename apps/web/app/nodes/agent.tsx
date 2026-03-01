import { Handle, Position, useReactFlow } from "@xyflow/react";
import { useState, useEffect, useCallback } from "react";
import { Bot } from "lucide-react";
import NodeConfigModal from "../components/NodeConfigModal";

export function AINode({ id, data }: { id: string; data: any }) {
  const { setNodes, getNodes } = useReactFlow();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    setIsExecuting(data.isExecuting);
  }, [data.isExecuting]);

  const previousNodes = getNodes().filter((n) => n.id !== id);

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

  const handleDeleteNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((nds) => nds.filter((n) => n.id !== id));
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className={`bg-[#0c0c14] border rounded-xl min-w-[280px] cursor-pointer transition-all duration-200
          ${isExecuting
            ? "border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.15)] animate-pulse"
            : "border-purple-500/25 hover:border-purple-500/40 shadow-lg shadow-purple-500/5"
          }`}
      >
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-purple-500/15 rounded-lg flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-[13px] font-medium text-white/80">AI Agent</h3>
              <p className="text-[10px] text-white/25">id: {id}</p>
            </div>
          </div>
          <button onClick={handleDeleteNode} className="p-1.5 rounded-lg hover:bg-white/6 transition-colors">
            <svg className="w-3.5 h-3.5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-3.5 pb-3 text-[11px] text-white/30 space-y-0.5">
          <p>Model: <span className="text-white/50 font-medium">{data?.model || "Gemini"}</span></p>
          {data?.usePreviousResponse ? (
            <p>Input from node: <span className="text-white/50 font-medium">{data?.previousNodeId || "N/A"}</span></p>
          ) : (
            <p className="truncate italic">"{data?.message || "No message set"}"</p>
          )}
        </div>

        {isExecuting && (
          <div className="mx-3.5 mb-3 flex items-center gap-2 text-[10px] text-purple-300/70 bg-purple-500/8 px-2.5 py-1.5 rounded-lg">
            <div className="w-2.5 h-2.5 border border-purple-300/40 border-t-purple-300 rounded-full animate-spin" />
            Generating response...
          </div>
        )}

        <Handle type="target" position={Position.Left} className="bg-purple-400! w-3! h-3! border-0!" />
        <Handle type="source" position={Position.Right} className="bg-purple-400! w-3! h-3! border-0!" />
      </div>

      <NodeConfigModal
        isOpen={isModalOpen}
        nodeType="agent"
        nodeData={data}
        nodeId={id}
        onClose={() => setIsModalOpen(false)}
        onSave={(updatedData: any) => updateField("", updatedData)}
        previousNodes={previousNodes}
      />
    </>
  );
}
