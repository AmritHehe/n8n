"use client"
import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge  , Background , Controls, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { snapshot } from "node:test";
import { TeligramNode } from "./teligram";
import { Trigger } from "./Trigger";
import { Gmail } from "./Gmail";
import axios from "axios";
import { connection } from "next/server";


const inititalNodes = [{ 
  id : '1' , 
  position : { x : 0 , y : 0} , 
  type : 'trigger' ,
  data : { label : 'Node 1'} , 
} 
]
const nodeTypes = { 
  telegram : TeligramNode ,
  trigger : Trigger , 
  gmail : Gmail
}


const initialEdges :any  = []


export default function App() {
  const [nodes ,setNodes] = useState(inititalNodes)
  const [edges , setEdges] = useState(initialEdges)
  const [token , setToken ] = useState<string|null>()
  function addNode(name : string){ 
    let size = (nodes.length + 1).toString()
    console.log("size" + size)
    
    setNodes(nodes => [...nodes , { 
      id : size , 
      position : { x : 200 , y : 200} , 
      data : { label : name} , 
      type : name
    }])
  }
  useEffect(()=> {
      const tokenn = localStorage.getItem("token")
      setToken(tokenn)
      console.log("token " + tokenn )
      let data 
      async function datacall(){ 
        data = await axios.get("http://localhost:3002/workflow/01" , { 
        
          headers : {  
            authorization  : tokenn
          }
        
        })
        
        console.log("got the data")
        console.log("data" + JSON.stringify(data.data))
        //@ts-ignore
        const noodes = JSON.parse(data.data.nodes);
        //@ts-ignore
        const cooonecs = JSON.parse(data.data.Connections)   ;
        setNodes(noodes)
        setEdges(cooonecs)
      }
      datacall()
      console.log("i am here")
     
     
      
   }, [])
  //@ts-ignore
  
  async function savegraph(){ 
    console.log("inside savegraph function ")
    //axios call here 
    //@ts-ignore
    console.log("nodes " + nodes + "edges" + edges)
    const res = await axios.put('http://localhost:3002/workflow/01' ,  { 
        data : { 
          nodes : JSON.stringify(nodes) , 
          connections : JSON.stringify(edges) ,  
        }
      } , 
      { 
        headers : {  
          authorization  : token
        }
      }
    )
    console.log("response " + res); 
    
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
          
          <button onClick={()=> {addNode('telegram')}} className="bg-black rounded-lg p-2 m-2 text-white"> telegram </button>
          <button onClick={()=> {addNode('gmail')}} className="bg-black rounded-lg p-2 m-2 text-white"> gmail </button>
          <button className="bg-indigo-700 text-white font-bold p-2 m-2 rounded-xl " onClick={savegraph}> Save Graph </button>
        </div> 
        <div className="w-full h-full" >
          <ReactFlow colorMode="dark" nodeTypes={nodeTypes} nodes={nodes} edges={edges} onNodesChange={onNodeChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView>
            <Background/>
            <Controls/>
          </ReactFlow>
        </div>
        
      </div>
    </>
  );
}

