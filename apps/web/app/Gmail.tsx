import { Handle , Position, useEdges, useReactFlow } from "@xyflow/react"
import Cross from "./components/cross";
import { setEngine } from "crypto";
export function Gmail({ id }: { id: string }) {
  const { setNodes } = useReactFlow();
  const { setEdges } = useReactFlow();

  function deleteNode() {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((edges)=>edges.filter((n)=>n.target!==id));
  }
  
    
    return <> 
        <button onClick={deleteNode} className="text-white "><Cross/></button>
        <div className="flex items-center justify-center shadow-zinc-600 bg-zinc-300 px-6 py-4 rounded-xl">
            <svg width="24px" height="24px" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M9 9L13.5 12L18 9" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M3 13.5H5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M1 10.5H5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M5 7.5V7C5 5.89543 5.89543 5 7 5H20C21.1046 5 22 5.89543 22 7V17C22 18.1046 21.1046 19 20 19H7C5.89543 19 5 18.1046 5 17V16.5" stroke="#000000" stroke-Width="1.5" strokeLinecap="round"></path></svg>
            <Handle type = "source"  position = {Position.Right}/>
            <Handle type = "target" position = {Position.Left}/>
            
        </div>
    </>
}