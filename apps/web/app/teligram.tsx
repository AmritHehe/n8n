// import { Handle , Position , useReactFlow  } from "@xyflow/react"
// import Cross from "./components/cross";
// import { useCallback, useState } from "react";
// export function TeligramNode({ id , data }: { id: string  , data : any}){ 
//     const { setNodes } = useReactFlow();
//     const {setEdges} = useReactFlow(); 

//   function deleteNode() {
//     setNodes((nds) => nds.filter((n) => n.id !== id));
//     setEdges((edges)=>edges.filter((n)=>n.target!==id));

//   }
//   const [previousResponse , setPreviousResponse] = useState<boolean>(true)
//   const updateField = useCallback((field: string, value: string |number |boolean) => {
//         setNodes((nds) =>
//             nds.map((n) =>
//                 n.id === id ? { ...n, data: { ...n.data, [field]: value } } : n
//             )
//         );
//     }, [id, setNodes , previousResponse]);
//     return <> 
//         <button onClick={deleteNode} className="text-white "><Cross/></button>
//         <input className="p-2 rounded-xl , border-1 border-black text-black bg-white" type="text" name="text"  onChange={(e)=>updateField("message" , e.target.value)} value={data?.message || ""} />
//         <button className="bg-white text-black rounded-xl p-2 m-2 " onClick={()=> { updateField("previousResponse" , !data?.previousResponse )}}>previousResponse </button>
//         {data.previousResponse ? <input  className="p-2 rounded-xl , border-1 border-black text-black bg-white" type= "number" placeholder="data from which previous node ? " onChange={(e) =>updateField("previousResponseFromWhichNode", e.target.value)}value={data?.previousResponseFromWhichNode || ""} /> : <></> }
//         <div className="flex items-center justify-center shadow-zinc-600 bg-zinc-300 px-6 py-4 rounded-xl">
//             <svg width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M21 5L2 12.5L9 13.5M21 5L18.5 20L9 13.5M21 5L9 13.5M9 13.5V19L12.2488 15.7229" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            
//             <Handle type = "source"  position = {Position.Right}/>
//              <Handle type = "target" position = {Position.Left}/>

//         </div>
//     </>
// }
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { useState, useCallback } from "react";
import NodeConfigModal from "./components/NodeConfigModal";
import Cross from "./components/cross";

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

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSaveModal = (updatedData: any) => {
    updateField("", updatedData);
  };

  // ✅ Fetch all previous nodes for dropdown
  const previousNodes = getNodes().filter((n) => n.id !== id);

  return (
    <>
      <div
        onClick={handleOpenModal}
        className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg min-w-[400px] border-2 border-blue-400 relative cursor-pointer hover:shadow-xl transition-all duration-200"
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10l16-5-5 16-3-5-3 5-5-16z" />
              </svg>
            </div>
            <h3 className="font-semibold text-sm">{"send telegram msg, "  +"id :  "+ id|| `Telegram  + ${id}`}</h3>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteNode();
            }}
            className="text-white"
          >
            <Cross />
          </button>
        </div>

        <p className="text-xs text-white/80 p-4">{data?.description || "Send message via Telegram"}</p>

        <div className="flex items-center justify-center shadow-zinc-600 bg-zinc-300 px-6 py-4 rounded-xl">
          <Handle type="source" position={Position.Right} className="w-3 h-3 bg-white" />
          <Handle type="target" position={Position.Left} className="w-3 h-3 bg-white" />
        </div>
      </div>

      {/* Node configuration modal */}
      <NodeConfigModal
        isOpen={isModalOpen}
        nodeType="teligram"
        nodeData={data}
        nodeId={id}
        previousNodes={previousNodes} // ✅ pass previous nodes here
        onClose={handleCloseModal}
        onSave={handleSaveModal}
      />
    </>
  );
}

