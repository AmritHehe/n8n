import { Handle , Position, useEdges, useReactFlow } from "@xyflow/react"
import Cross from "./components/cross";
import { setEngine } from "crypto";
import { useCallback, useState } from "react";
export function AwaitGmail({ id , data }: { id: string , data :any}) {
  const { setNodes } = useReactFlow();
  const { setEdges } = useReactFlow();
  const workflowId = data.workflowId
  console.log(" data workflow id " + workflowId)
  function deleteNode() {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((edges)=>edges.filter((n)=>n.target!==id));
  }
    const updateField = useCallback((field: string, value: string) => {
        setNodes((nds) =>
            nds.map((n) =>
                n.id === id ? { ...n, data: { ...n.data, [field]: value } } : n
            )
        );
    }, [id, setNodes]);
    const [details  ,  setDetails] = useState<boolean>(false)
    return <> 
        <div className="relative">
            <button onClick={deleteNode} className="text-white "><Cross/></button>
            <button className="text-white" onClick={()=> {setDetails(!details)}}>Details</button>
            {details ? <div className="flex flex-col gap-2 absolute bg-zinc-950 p-2 m-2 rounded-xl">
                    <input value={data?.to || ""}  onChange={(e)=>updateField("to" , e.target.value)} type="text" className="ronded-l p-2 m-2 bg-amber-100 text-black font-bold" placeholder="to :"   />
                    <input value={data?.subject || ""} onChange={(e)=>updateField("subject" , e.target.value)} type="text" className="ronded-l p-2 m-2 bg-amber-100 text-black font-bold" placeholder="subject : "/>
                    <input value={data?.message || ""} onChange={(e)=>updateField("message" , e.target.value)} type="text" className="ronded-l p-2 m-2 bg-amber-100 text-black font-bold" placeholder="body" />
                    <div className="text-white "> Webhook Link : {`http://localhost:3002/webhook/${id}?workflowId=${workflowId}`} </div>
                </div>
                 : <></> } 
            <div className="flex items-center justify-center shadow-zinc-600 bg-zinc-300 px-6 py-4 rounded-xl">
                <svg width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M5 9L9.5 12L14 9" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17 19H3C1.89543 19 1 18.1046 1 17V7C1 5.89543 1.89543 5 3 5H16C17.1046 5 18 5.89543 18 7V9" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path><path d="M23 14H17M17 14L20 11M17 14L20 17" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                <Handle type = "source"  position = {Position.Right}/>
                <Handle type = "target" position = {Position.Left}/>
                
            </div>
        </div>
    </>
}