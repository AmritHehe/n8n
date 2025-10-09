// import { Handle , Position, useEdges, useReactFlow } from "@xyflow/react"
// import Cross from "./components/cross";
// import { setEngine } from "crypto";
// import { useCallback, useState } from "react";
// export function Gmail({ id , data }: { id: string , data :any }) {
//   const { setNodes } = useReactFlow();
//   const { setEdges } = useReactFlow();

//   function deleteNode() {
//     setNodes((nds) => nds.filter((n) => n.id !== id));
//     setEdges((edges)=>edges.filter((n)=>n.target!==id));
//   }
//     const updateField = useCallback((field: string, value: string) => {
//         setNodes((nds) =>
//             nds.map((n) =>
//                 n.id === id ? { ...n, data: { ...n.data, [field]: value } } : n
//             )
//         );
//     }, [id, setNodes]);
//     const [details  ,  setDetails] = useState<boolean>(false)
//     return <> 
//         <div className="relative">
//             <button onClick={deleteNode} className="text-white "><Cross/></button>
//             <button className="text-white" onClick={()=> {setDetails(!details)}}>Details</button>
//             {details ? <div className="flex flex-col gap-2 absolute bg-zinc-950 p-2 m-2 rounded-xl">
//                     <input value={data?.to || ""}  onChange={(e)=>updateField("to" , e.target.value)} type="text" className="ronded-l p-2 m-2 bg-amber-100 text-black font-bold" placeholder="to :"   />
//                     <input value={data?.subject || ""} onChange={(e)=>updateField("subject" , e.target.value)} type="text" className="ronded-l p-2 m-2 bg-amber-100 text-black font-bold" placeholder="subject : "/>
//                     <input value={data?.message || ""} onChange={(e)=>updateField("message" , e.target.value)} type="text" className="ronded-l p-2 m-2 bg-amber-100 text-black font-bold" placeholder="body" />
//                 </div>
//                  : <></> } 
//             <div className="flex items-center justify-center shadow-zinc-600 bg-zinc-300 px-6 py-4 rounded-xl">
//                 <svg width="24px" height="24px" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M9 9L13.5 12L18 9" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M3 13.5H5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M1 10.5H5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M5 7.5V7C5 5.89543 5.89543 5 7 5H20C21.1046 5 22 5.89543 22 7V17C22 18.1046 21.1046 19 20 19H7C5.89543 19 5 18.1046 5 17V16.5" stroke="#000000" stroke-Width="1.5" strokeLinecap="round"></path></svg>
//                 <Handle type = "source"  position = {Position.Right}/>
//                 <Handle type = "target" position = {Position.Left}/>
                
//             </div>
//         </div>
//     </>
// }
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { useState, useCallback } from "react";
import NodeConfigModal from "../components/NodeConfigModal";
import Cross from "../components/cross";

export function Gmail({ id, data }: { id: string; data: any }) {
  const { setNodes   , getNodes} = useReactFlow();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Update node.data directly
  const updateField = useCallback(
  (field: string, value: any) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? field
            ? { ...n, data: { ...n.data, [field]: value } }
            : { ...n, data: value } // if field is empty, replace whole data
          : n
      )
    );
  },
  [id, setNodes]
);  
  // Modal handlers
    const previousNodes = getNodes().filter((n) => n.id !== id);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSaveModal = (updatedData: any) => {
    updateField("", updatedData); // save entire modal data directly to node.data
  };

  const handleDeleteNode = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
  };

  return (
    <>
      <div
        onClick={handleOpenModal}
        className={`bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow-lg min-w-[400px]  border-2 border-red-400 relative cursor-pointer hover:shadow-xl transition-all duration-200 ${
          data?.isExecuting
            ? "animate-[pulse_1.2s_ease-in-out_infinite] shadow-red-400/30 shadow-lg ring-4 ring-red-400/20"
            : ""
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <h3 className="font-semibold text-sm">{"send mail , id : " + id || "Gmail"}</h3>
          </div>
          <button onClick={(e) => { e.stopPropagation(); handleDeleteNode(); }} className="text-white">
            <Cross />
          </button>
        </div>

        <p className="text-xs text-white/80 p-4">{data?.description || "Send email via Gmail"}</p>

        {data?.isExecuting && (
          <div className="mt-2 text-xs bg-white/20 px-2 py-1 rounded flex items-center gap-2 mx-4">
            <div className="w-3 h-3 border border-white/50 border-t-white rounded-full animate-spin"></div>
            Sending email...
          </div>
        )}

        <Handle type="target" position={Position.Left} className="!bg-white !w-4 !h-4 hover:scale-125 transition-transform" />
        <Handle type="source" position={Position.Right} className="!bg-white !w-4 !h-4 hover:scale-125 transition-transform" />
      </div>

      <NodeConfigModal
        isOpen={isModalOpen}
        nodeType="gmail"
        nodeData={data} // pass current node.data
        nodeId={id}
        previousNodes={previousNodes} 
        onClose={handleCloseModal}
        onSave={handleSaveModal}
      />
    </>
  );
}
