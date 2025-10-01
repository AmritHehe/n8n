"use client"
import React  from "react";
import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge  , Background , Controls, Position, useReactFlow, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TeligramNode } from "../../teligram";
import { Trigger } from "../../Trigger";
import { Gmail } from "../../Gmail";
import { Webhook } from "../../Webhook";
import axios from "axios";
import { AwaitGmail } from "../../AwaitGmail";


const inititalNodes = [{ 
  id : '1' , 
  position : { x : 0 , y : 0} , 
  type : 'trigger' ,
  data : { label : 'trigger'} , 
} 
]

const initialEdges :any  = []

const nodeTypes = { 
  telegram : TeligramNode ,
  trigger : Trigger , 
  gmail : Gmail , 
  webhook : Webhook , 
  awaitGmail : AwaitGmail
}

export default function MainWorkFlow({id} : {id : number}){ 
  const [nodes ,setNodes , onNodeChange] = useNodesState(inititalNodes)
  const [edges , setEdges , onEdgesChange] = useEdgesState(initialEdges)
  const [token , setToken ] = useState<string|null>(null)
  function addNode(name : string , webhook ?: boolean , isExecuting ?:boolean){ 
    let size = (nodes.length + 1).toString()
    console.log("size" + size)
    
    setNodes(nodes => [...nodes , { 
      id : size , 
      position : { x : 200 , y : 200} , 
      data : { label : 'action', 
        message : "", 
      } , 
      type : name
    }])
  }
  function addWebhookNode(name : string ){ 
    let size = (nodes.length + 1).toString()
    console.log("size" + size)
    
    setNodes(nodes => [...nodes , { 
      id : size , 
      position : { x : 200 , y : 200} , 
      data : { label : 'action', 
        message : "", 
        webhook : false , 
        isExecuting : false ,
        afterPlayNodes : null
      } , 
      type : name
    }])
  }

  useEffect(()=> {
      const tokenn = localStorage.getItem("token")
      setToken(tokenn)
      console.log("token " + tokenn )
      let data 
      async function datacall(){ 
        data = await axios.get(`http://localhost:3002/workflow/${id}` , { 
        
          headers : {  
            authorization  : tokenn
          }
        
        })
        
        console.log("got the data")
        // console.log("data" + JSON.stringify(data.data))
        //@ts-ignore
        const noodes = JSON.parse(data.data.nodes);
        //@ts-ignore
        const cooonecs = JSON.parse(data.data.Connections)   ;
        if(noodes.length > 0){ 
            setNodes(noodes) 
            setEdges(cooonecs)
        }
   
      }

      datacall()
      console.log("i am here")
     
     
      
   }, [])
  //@ts-ignore
  
  async function savegraph(){ 
    
    console.log("inside savegraph function ");
    console.log("nodes " + nodes + "edges" + edges)
    console.log( " id from same graph " + id)
    const res = await axios.put(`http://localhost:3002/workflow/${id}` ,  { 
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
  async function  execute() {
    const response = await axios.post('http://localhost:3002/execute', { 
      nodes : JSON.stringify(nodes) , 
      connections : JSON.stringify(edges) ,
      id : id
    }, { 
      headers : { 
        authorization : token
      }
    })
    console.log("response " + response)
    alert("executed the node ! ")
  }
  
  const onConnect = useCallback((params :any)=> setEdges((edgesSnapshot)=> addEdge(params , edgesSnapshot)) ,[], ) 
  
  return (
    <>
      <div className="flex items-center w-full h-dvh gap-4 bg-amber-50 relative">
        <div className="flex flex-col absolute z-10 items-center justify-center bg-zinc-800 w-1/6 h-full">
        <h1 className="font-bold text-xl text-white">Whats Next</h1>
          
          <button onClick={()=> {addNode('telegram')}} className="bg-black rounded-lg p-2 m-2 text-white"> telegram </button>
          <button onClick={()=> {addNode('gmail')}} className="bg-black rounded-lg p-2 m-2 text-white"> gmail </button>
          <button onClick={()=> {addWebhookNode('webhook')}} className="bg-black rounded-lg p-2 m-2 text-white"> webhook </button>
          <button onClick={()=> {addWebhookNode('awaitGmail')}} className="bg-black rounded-lg p-2 m-2 text-white"> awaitGMil </button>
          <button className="bg-indigo-700 text-white font-bold p-2 m-2 rounded-xl " onClick={savegraph}> Save Graph </button>
          <button onClick={execute} className="bg-orange-600 text-amber-50 font bold px-4 py-3 m-2 rounded-xl"> Execute Workflow</button>
        </div> 
        <div className="w-full h-full" >
          <ReactFlow colorMode="dark" nodeTypes={nodeTypes} nodes={nodes} edges={edges} onNodesChange={onNodeChange} onEdgesChange={onEdgesChange} onConnect={onConnect}  fitView>
            <Background/>
            <Controls/>
          </ReactFlow>
        </div>
        
      </div>
    </>
  );
}