import { Handle , Position, useEdges, useReactFlow } from "@xyflow/react"
import Cross from "./components/cross";
import { setEngine } from "crypto";
import { useCallback, useState } from "react";
export function Gmail({ id , data }: { id: string , data :any }) {
  const { setNodes } = useReactFlow();
  const { setEdges } = useReactFlow();

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
                </div>
                 : <></> } 
            <div className="flex items-center justify-center shadow-zinc-600 bg-zinc-300 px-6 py-4 rounded-xl">
                <svg width="24px" height="24px" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M9 9L13.5 12L18 9" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M3 13.5H5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M1 10.5H5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M5 7.5V7C5 5.89543 5.89543 5 7 5H20C21.1046 5 22 5.89543 22 7V17C22 18.1046 21.1046 19 20 19H7C5.89543 19 5 18.1046 5 17V16.5" stroke="#000000" stroke-Width="1.5" strokeLinecap="round"></path></svg>
                <Handle type = "source"  position = {Position.Right}/>
                <Handle type = "target" position = {Position.Left}/>
                
            </div>
        </div>
    </>
}