import {  type Request, type Response } from 'express' ; 
import { prismaClient }  from '@repo/database/client'; 
import type { node } from '../types.js';
import { executeIt } from '../services/executeIt.js';
import { workflowLogStreams } from './sse.controllers.js';
import z from "zod"

export async function Webhook(req : Request , res : Response){ 
    const id  :number = Number( req.params.id ); 
    //@ts-ignore
    //ADD userId and workflow Id in params too
    // let userId = req.userId;

    let userId = "";
    let ResponseData = "";
    try{ 
        if(req.body.message){ 
            console.log("fuckin inside this")
            ResponseData = req.body.message;
        }
    }
    catch(e){ 
        console.log("cant read message " + e)
    }
    
    const workflowId :string  = (req.query.workflowId) as string;
    try { 
        const data = await prismaClient.workflow.findFirst({ 
            where : { 
                id : workflowId
            }
        })
        if (data) { 
            if(!data.userId){ 
                console.log("corrupted data ")
            }
            console.log("webhook details " + JSON.stringify(data))
            userId = data.userId
        }
        
    }
    catch(e) { 
        console.log("cant find the user ID , db error , please try again" + e)
        return res.status(404).json({
            success : false , 
            data : null,
            error : "PROJECT_NOT_FOUND",
            message : "Coudnt Found the workspace"
        })
    }
    console.log("workflow Id " + workflowId)
    console.log(" here is the workflow id " + workflowId)

    //we need workflowID here , assuming that there is one workflow only
    //ab ye node already hai db mein , we just have to update its value to true and hit the execution end point again 

    try{ 
        const data = await prismaClient.workflow.findFirst({ 
            where : { 
                id : workflowId
            }
        })
        if(data){ 
            const nodes = JSON.parse(data.nodes);
            const connections = JSON.parse(data.Connections)
            // const webHookNode  = nodes.find((value : node ) => value.id == id);
            console.log("webhook id : " + id)
            const indexToUpdate = nodes.findIndex((value : node) => value.id == id);
            const payloadToSend= { 
                data : ResponseData , 
                outputNodeIndex : id 
            }
            if(nodes[indexToUpdate].data.isExecuting == false){ 
                console.log(" nodes " + JSON.stringify(nodes[indexToUpdate]))   

                res.json("please execute the workflow first ")
            }
            else{ 
                nodes[indexToUpdate].data.webhook = true;
                let indexToStartWith = nodes[indexToUpdate].data.afterPlayNodes ;
                // webHookNode.data.webhook = true;
                console.log(" updated the webhook " + JSON.stringify(nodes[indexToUpdate]))   
                    await prismaClient.workflow.update({ 
                        where : { 
                            id : workflowId
                        } , 
                        data : { 
                            nodes : JSON.stringify(nodes)
                        }
                    })
                    if(ResponseData){ 
                        console.log("yha tk agya lesgo")
                        const oldData =  await prismaClient.responses.findFirst({
                            where : { 
                                workflowId : workflowId
                            }
                        })
                        if(oldData){ 
                            console.log("yha tk agya hu olddata ke andr")
                            let newData
                            if(oldData.data == ""){ 
                                 newData = [ payloadToSend ]

                            }
                            else {
                            let parsedOldData = JSON.parse(oldData?.data)
                             newData = [...parsedOldData , payloadToSend ]
                            }
                            
                            console.log("new Data " + JSON.stringify(newData))
                            await prismaClient.responses.update({ 
                                where : { 
                                    workflowId : workflowId 
                                } ,
                                data : { 
                                    data : JSON.stringify(newData) 
                                }
                            })
                            console.log("updated the data")
                        }
                    }
                    //call execute here
                    const payload = { 
                        nodes :JSON.stringify(nodes) , 
                        connections : JSON.stringify(connections) 
                    }
                    const logCallback = workflowLogStreams[workflowId]; // SSE callback from main execution

                    // res.send({status : "continuing"})
                    // res.json("executed the webhook");
                    logCallback?.("Webhook executed, continuing remaining workflow");
                    res.send({ status: "Webhook executed" });
                    await executeIt(payload , userId ,  workflowId ,  indexToStartWith ,true ,logCallback)
                   
                    


                        
            }   

        } 

    }
    catch(e) { 
        console.error("errrorrrr "  + e) 
    }
    //webhook is a node , which is false by default , will turn true as soon as someone hits this end point 
//    { 
//         "id" : 1 ,
//         "type" : "webhook", 
//         "data" : { 
//             "webhook" = false;
//         }
//     }
}


export const ExecuteSchema = z.object({
    id : z.string(),
    nodes : z.string(),
    connections : z.string()
})

export  async function  Execute(req : Request , res : Response) { 
    const {data , success } = ExecuteSchema.safeParse(req.body)
    
        if(!data || !success){ 
            return res.status(400).json({
                success : false , 
                data : null,
                error : "INVALID_REQUEST",
                message : "Invalid Schema"
            })
        }
    const payload = data;

    const  workflowId :string = payload.id; //this will be workflow id only  , considering there will be only 1 workflow

    const userId  = req.userId;
    console.log("userID : from execute : " + userId)
    const FilteredNodes = JSON.parse(payload.nodes)

    FilteredNodes.forEach((i : node) => { i.type == 'webhook' || i.type == 'awaitGmail' ?( i.data.webhook = false  ,i.data.isExecuting = false , i.data.afterPlayNodes = undefined ) : console.log("wow bhay") })

    payload.nodes = JSON.stringify(FilteredNodes);

    //we must take data from backend here instead of taking nodes and connections in payload
    //one simple good solution to filter nodes here only and make isexecuting and webhook false here

    const logCallback = workflowLogStreams[workflowId];
    await executeIt(payload , userId , workflowId , 0  , false , logCallback)
    res.json('send the message bhai ab jao cold coffee pi aao')
    
}