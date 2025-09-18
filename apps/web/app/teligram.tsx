import { Handle , Position , useReactFlow  } from "@xyflow/react"
import Cross from "./components/cross";
import { useCallback } from "react";
export function TeligramNode({ id , data }: { id: string  , data : any}){ 
    const { setNodes } = useReactFlow();
    const {setEdges} = useReactFlow(); 

  function deleteNode() {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((edges)=>edges.filter((n)=>n.target!==id));

  }
  const onChange = useCallback((e :any)=> { 
    const value = e.target.value;
    setNodes((nds) =>
            nds.map((n) =>
                n.id === id ? { ...n, data: { ...n.data, message: value } } : n
            )
        );
  },[id , setNodes])
    return <> 
        <button onClick={deleteNode} className="text-white "><Cross/></button>
        <input className="p-2 rounded-xl , border-1 border-black text-black bg-white" type="text" name="text" onChange={onChange} value={data?.message || ""} />
        <div className="flex items-center justify-center shadow-zinc-600 bg-zinc-300 px-6 py-4 rounded-xl">
            <svg width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M21 5L2 12.5L9 13.5M21 5L18.5 20L9 13.5M21 5L9 13.5M9 13.5V19L12.2488 15.7229" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            
            <Handle type = "source"  position = {Position.Right}/>
             <Handle type = "target" position = {Position.Left}/>

        </div>
    </>
}