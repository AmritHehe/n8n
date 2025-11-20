// import { Handle , Position, useEdges, useReactFlow } from "@xyflow/react"
// import Cross from "./components/cross";
// import { setEngine } from "crypto";
// import { useCallback, useState } from "react";
// export function Webhook({ id , data }: { id: string , data :any }) {
//   const { setNodes } = useReactFlow();
//   const { setEdges } = useReactFlow();
//   const workflowId = data.workflowId;
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
//                     {/* <input value={data?.to || ""}  onChange={(e)=>updateField("to" , e.target.value)} type="text" className="ronded-l p-2 m-2 bg-amber-100 text-black font-bold" placeholder="to :"   />
//                     <input value={data?.subject || ""} onChange={(e)=>updateField("subject" , e.target.value)} type="text" className="ronded-l p-2 m-2 bg-amber-100 text-black font-bold" placeholder="subject : "/>
//                     <input value={data?.message || ""} onChange={(e)=>updateField("message" , e.target.value)} type="text" className="ronded-l p-2 m-2 bg-amber-100 text-black font-bold" placeholder="body" /> */}
//                     <div className="text-white "> Webhook Link : {`http://localhost:3002/webhook/${id}?workflowId=${workflowId}`} </div>
//                 </div>
//                  : <></> } 
//             <div className="flex items-center justify-center shadow-zinc-600 bg-zinc-300 px-6 py-4 rounded-xl">
//                 <svg width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M4 6V3.6C4 3.26863 4.26863 3 4.6 3H19.4C19.7314 3 20 3.26863 20 3.6V6" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path><path d="M4 18V20.4C4 20.7314 4.26863 21 4.6 21H19.4C19.7314 21 20 20.7314 20 20.4V18" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path><path d="M13.5 15V12V9H15.9C16.2314 9 16.5 9.26863 16.5 9.6L16.5 10.5C16.5 11.3284 15.8284 12 15 12V12" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.5 15H15.9C16.2314 15 16.5 14.7314 16.5 14.4L16.5 13.5C16.5 12.6716 15.8284 12 15 12V12H13.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19.5 15V12M19.5 12V9H22.5L22.5 12H19.5Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M1.5 9L1.5 15L3 12L4.5 15L4.5 9" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.5 9H7.5L7.5 15L10.5 15" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7.5 12H9.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
//                 <Handle type = "source"  position = {Position.Right}/>
//                 <Handle type = "target" position = {Position.Left}/>
                
//             </div>
//         </div>
//     </>
// }
import { Handle, Position, useEdges, useReactFlow } from "@xyflow/react";
import Cross from "../components/cross";
import { useState, useCallback } from "react";

export function Webhook({ id, data }: { id: string; data: any }) {
  const { setNodes } = useReactFlow();
  const { setEdges } = useReactFlow();
  const [details, setDetails] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  const workflowId = data.workflowId;
  const webhookUrl = `https://api-n8n.amrithehe.com/webhook/${id}?workflowId=${workflowId}`;

  const deleteNode = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((edges) => edges.filter((n) => n.target !== id));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl).then(() => {
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 1500);
    });
  };

  const updateField = useCallback(
    (field: string, value: string) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, [field]: value } } : n))
      );
    },
    [id, setNodes]
  );

  return (
    <div 
    className={`relative w-80 bg-zinc-900 rounded-2xl shadow-lg border border-zinc-700 p-4 flex flex-col gap-3 ${
          data?.isExecuting
            ? "animate-[pulse_1.2s_ease-in-out_infinite] shadow-black-400/30 shadow-lg ring-4 ring-red-400/20"
            : ""
        }`}>
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-700 pb-2">
        <span className="font-semibold text-white">Webhook, id :  {id}</span>
        <button
          onClick={deleteNode}
          className="p-1 rounded hover:bg-zinc-800 transition-colors"
          title="Delete Node"
        >
          <Cross />
        </button>
      </div>

      {/* Details toggle */}
      <button
        onClick={() => setDetails(!details)}
        className="text-blue-400 hover:text-blue-500 font-medium self-start"
      >
        {details ? "Hide Details" : "Show Details"}
      </button>

      {/* Details section */}
      {details && (
        <div className="flex flex-col gap-2 bg-zinc-800 p-3 rounded-xl border border-zinc-700">
          <div className="text-sm text-zinc-300 font-medium">Webhook URL</div>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              readOnly
              value={webhookUrl}
              className="flex-1 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white text-sm"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium text-white text-sm"
            >
              Copy
            </button>
          </div>
          {copySuccess && <span className="text-green-400 text-xs">{copySuccess}</span>}
        </div>
      )}

      {/* React Flow Handles */}
      <Handle type="source" position={Position.Right} className="!bg-white !w-4 !h-4 hover:scale-125 transition-transform" />
      <Handle type="target" position={Position.Left} className="!bg-white !w-4 !h-4 hover:scale-125 transition-transform" />
    </div>
  );
}
