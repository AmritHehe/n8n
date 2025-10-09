// import { Handle , Position, useEdges, useReactFlow } from "@xyflow/react"
// import Cross from "./components/cross";
// import { setEngine } from "crypto";
// import { useCallback, useState } from "react";
// export function AwaitGmail({ id , data }: { id: string , data :any}) {
//   const { setNodes } = useReactFlow();
//   const { setEdges } = useReactFlow();
//   const workflowId = data.workflowId
//   console.log(" data workflow id " + workflowId)
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
//                     <div className="text-white "> Webhook Link : {`http://localhost:3002/webhook/${id}?workflowId=${workflowId}`} </div>
//                 </div>
//                  : <></> } 
//             <div className="flex items-center justify-center shadow-zinc-600 bg-zinc-300 px-6 py-4 rounded-xl">
//                 <svg width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M5 9L9.5 12L14 9" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17 19H3C1.89543 19 1 18.1046 1 17V7C1 5.89543 1.89543 5 3 5H16C17.1046 5 18 5.89543 18 7V9" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path><path d="M23 14H17M17 14L20 11M17 14L20 17" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
//                 <Handle type = "source"  position = {Position.Right}/>
//                 <Handle type = "target" position = {Position.Left}/>
                
//             </div>
//         </div>
//     </>
// }
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { useState, useCallback } from "react";
import NodeConfigModal from "./components/NodeConfigModal";
import Cross from "./components/cross";

export function AwaitGmail({ id, data }: { id: string; data: any }) {
  const { setNodes, setEdges } = useReactFlow();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // updateField works exactly like Gmail
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

  const handleDeleteNode = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.target !== id));
  };

  return (
    <>
      <div
        onClick={handleOpenModal}
        className={`bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-lg shadow-lg min-w-[400px] border-2 border-amber-400 relative cursor-pointer hover:shadow-xl transition-all duration-200 ${
        //   data?.isExecuting
        //     ? "animate-[pulse_1.2s_ease-in-out_infinite] shadow-amber-400/30 shadow-lg ring-4 ring-amber-400/20"
        //     : ""
        ""
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <h3 className="font-semibold text-sm">{"send mail nd wait til res ," + " id : " + id|| "Await Gmail"}</h3>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteNode();
            }}
            className="text-white"
          >
            <Cross />
          </button>
        </div>

        <p className="text-xs text-white/80 p-4">
          {data?.description || "Wait for Gmail trigger or response"}
        </p>

        

        <Handle type="target" position={Position.Left} className="w-3 h-3 bg-white" />
        <Handle type="source" position={Position.Right} className="w-3 h-3 bg-white" />
      </div>

      {/* Use same modal system */}
      <NodeConfigModal
        isOpen={isModalOpen}
        nodeType="awaitGmail"
        nodeData={data}
        nodeId={id}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
      />
    </>
  );
}
