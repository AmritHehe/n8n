import {type Request,type Response } from 'express' ; 
import jwt, { type JwtPayload }  from 'jsonwebtoken' ; 


export const workflowLogStreams = new Map<string, (msg: string) => void>();

export async function SSE(req : Request , res :Response){

  const { workflowId } = req.params;
  const id   = (workflowId)!
  if(typeof(id)!="string"){
    return res.status(400).json({
            success : false , 
            message : "invalid params",
            error : "INVALID_REQUEST",
            data : null
        })
  }
  console.log(" workflow Id : " + workflowId)
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering",'no')
  res.flushHeaders();

  console.log("arrived till here" )
  const sendLog = (msg: string) => {
    res.write(`data: ${msg}\n\n`);
  };

    workflowLogStreams.set(id, sendLog);

    req.on("close", () => {
    workflowLogStreams.delete(id);
  });  

  req.on("close", () => {
    res.end();
  });
};
