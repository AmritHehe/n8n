import React from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { useState, useCallback } from "react";
import { Bot } from "lucide-react";
import NodeConfigModal from "./components/NodeConfigModal";
import Cross from "./components/cross";

export function AINode({ id, data }: { id: string; data: any }) {
  const { setNodes } = useReactFlow();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
const { getNodes, getEdges } = useReactFlow();

// const previousNodes = React.useMemo(() => {
//   const edges = getEdges() ?? [];
//   const nodes = getNodes() ?? [];
//   const incomingEdges = edges.filter(edge => String(edge.target) === String(id));
  const previousNodes = getNodes().filter((n) => n.id !== id);

//   return incomingEdges
//     .map(edge => nodes.find(node => String(node.id) === String(edge.source)))
//     .filter((node): node is NonNullable<typeof node> => Boolean(node));
// }, [id, getNodes, getEdges]);
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

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSaveModal = (updatedData: any) => updateField("", updatedData);
  const handleDeleteNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((nds) => nds.filter((n) => n.id !== id));
  };

  return (
    <>
      <div
        onClick={handleOpenModal}
        className={`relative cursor-pointer bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl shadow-lg border-2 border-purple-400 min-w-[400px] transition-all duration-300 hover:shadow-xl ${
          data?.isExecuting
            ? "animate-[pulse_1.2s_ease-in-out_infinite] shadow-purple-400/40 ring-4 ring-purple-400/30"
            : ""
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          {/* Left side: Icon + Title */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-sm">{"AI agent, " + "id " +id || "AI Node"}</h3>
          </div>

          {/* Delete Button */}
          <button onClick={handleDeleteNode} className="text-white">
            <Cross />
          </button>
        </div>

        {/* Node Info */}
        <div className="px-4 pb-4 text-xs text-white/80 space-y-1">
          <p>
            Model:{" "}
            <span className="font-medium text-white">
              {data?.model || "Gemini"}
            </span>
          </p>

          {data?.usePreviousResponse ? (
            <p>
              Using response from node:{" "}
              <span className="font-medium text-white">
                {data?.previousNodeId || "N/A"}
              </span>
            </p>
          ) : (
            <p className="truncate italic">
              “{data?.message || "No message set"}”
            </p>
          )}
        </div>

        {/* Show progress if executing */}
        {data?.isExecuting && (
          <div className="mt-2 text-xs bg-white/20 px-2 py-1 rounded flex items-center gap-2 mx-4">
            <div className="w-3 h-3 border border-white/50 border-t-white rounded-full animate-spin"></div>
            Generating response...
          </div>
        )}

        {/* React Flow Handles */}
        <Handle
          type="target"
          position={Position.Left}
          className="!bg-white !w-3 !h-3"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="!bg-white !w-3 !h-3"
        />
      </div>

      {/* Modal */}
      <NodeConfigModal
        isOpen={isModalOpen}
        nodeType="agent"
        nodeData={data}
        nodeId={id}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        previousNodes={previousNodes} 

      />

    </>
  );
}
