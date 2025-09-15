"use client"
import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge  , Background , Controls, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { snapshot } from "node:test";
 
const inititalNodes = [{ 
  id : '1' , 
  position : { x : 0 , y : 0} , 
  data : { label : 'Node 1'} , 
  type : 'input'
} 
]

const initialEdges :any  = []


export default function App() {
  const [nodes ,setNodes] = useState(inititalNodes)
  const [edges , setEdges] = useState(initialEdges)

  function addNode(name : string){ 
    let size = (nodes.length + 1).toString()
    console.log("size" + size)
    
    setNodes(nodes => [...nodes , { 
      id : size , 
      position : { x : 200 , y : 200} , 
      data : { label : name} , 
      type : 'default'
    }])
    setEdges(edges => [...edges , { 
      id : (Math.random().toFixed(0)).toString(),
      source : nodes.length.toString(),
      target : (nodes.length+1).toString()
    }])
  }
  const onNodeChange = useCallback(
    //@ts-ignore
  (changes) => setNodes((nodesSnapshot)=>applyNodeChanges(changes , nodesSnapshot))
   ,[]
  )
  const onEdgesChange = useCallback(
    //@ts-ignore
  (changes) => setEdges((edgesSnapshot) => applyNodeChanges(changes, edgesSnapshot)),
    [],
  );
  //@ts-ignore
  const onConnect = useCallback((params)=> setEdges((edgesSnapshot)=> addEdge(params , edgesSnapshot)) ,[], ) 
  return (
    <>
      <div className="flex items-center w-full h-dvh gap-4 bg-amber-50 relative">
        <div className="flex flex-col absolute z-10 items-center justify-center bg-zinc-800 w-1/6 h-full">
        <h1 className="font-bold text-xl text-white">Whats Next</h1>
          
          <button onClick={()=> {addNode('teligram')}} className="bg-black rounded-lg p-2 m-2 text-white"> telegram </button>
          <button onClick={()=> {addNode('gmail')}} className="bg-black rounded-lg p-2 m-2 text-white"> gmail </button>
        </div> 
        <div className="w-full h-full" >
          <ReactFlow colorMode="dark" nodes={nodes} edges={edges} onNodesChange={onNodeChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView>
            <Background/>
            <Controls/>
          </ReactFlow>
        </div>
        
      </div>
    </>
  );
}

