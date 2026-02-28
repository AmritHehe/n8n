import {type Request,type Response } from 'express' ; 
import jwt, { type JwtPayload }  from 'jsonwebtoken' ; 


export const workflowLogStreams: { [workflowId: string]: ((msg: string) => void) | undefined } = {};

export async function SSE(req : Request , res :Response){

  const { workflowId } = req.params;
  const id  : string = (workflowId)!
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

    workflowLogStreams[id] = sendLog;

    req.on("close", () => {
    delete workflowLogStreams[id];
  });  

  req.on("close", () => {
    res.end();
  });
};
