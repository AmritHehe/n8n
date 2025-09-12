"use client"
import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";


const inititalNodes = [{ 
  id : 'n1' , 
  position : { x : 0 , y : 0} , 
  data : { label : 'Node 1'} , 
  type : 'input'
} , 
{ 
  id : 'n2' , 
  position : { x : 100 , y : 100} , 
  data : { label : 'Node 2'} , 

},
]

const initialEdges = [{ 
  id : 'n1-n2' , 
  source : 'n1' , 
  target : 'n2' ,
},]
import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge  , Background , Controls, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
 

export default function App() {
  
  return (
    <div style={{ height: '80vh', width: '80vh' }}>
      <ReactFlow nodes={inititalNodes}>
        <Background/>
        <Controls/>
      </ReactFlow>
        
      
    </div>
  );
}