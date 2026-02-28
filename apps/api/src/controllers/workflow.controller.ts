import express, {  type Request, type Response } from 'express' ; 

import { prismaClient }  from '@repo/database/client'; 
import type { node } from '../types/types.js';

import { CreateWorflowSchema , DeleteWorkflowSchema } from '../validators/workflow.validator.js';



export async function CreateWorflow (req : Request , res : Response){ 
    //user
    //yha userId leke ek new workflow with empty nodes create hojana chaiye
    const {data , success } = CreateWorflowSchema.safeParse(req.body)
    
        if(!data || !success){ 
            return res.status(400).json({
                success : false , 
                data : null,
                error : "INVALID_REQUEST",
                message : "Invalid Schema"
            })
        }
    const payload = data

    const {title , nodes , connections} = payload; 
    const userId = req.userId  
    try { 
        const newWorkflow = await prismaClient.workflow.create({ 
            data : { 
                title : title , 
                nodes : JSON.stringify(nodes) , 
                Connections : JSON.stringify(connections) ,
                userId : userId
            }
        })
        await prismaClient.responses.create({ 
                data : { 
                    workflowId : newWorkflow.id,
                    data : "",
                    userId : userId
                }
            })
        return res.status(201).json({
            success : true , 
            data : { 
                newWorkflow 
            },
            error : null , 
            message : "workflow created sucessfully"
        })
    }
    catch(e){
        return res.status(500).json({
            success : false , 
            data : null ,
            error : "SERVER_DOWN" ,
            message : "failed with error " + JSON.stringify(e)
        })
    }    

}
export async function GetAllWorkflows (req  : Request, res : Response){ 
    //yha bs ek be call jayega vo call karega aur sara data be se le aayega

    const userId = req.userId; 
    try { 
        const data = await prismaClient.workflow.findMany({ 
            where : { 
                userId : userId
            }
        })
        res.json(data)
    }
    catch(e) { 
        res.json("erro hogis" + e)
    }
    

}
export async function DeleteWorkflow(req : Request , res : Response){ 
    const {data , success } = DeleteWorkflowSchema.safeParse(req.body)
    
        if(!data || !success){ 
            return res.status(400).json({
                success : false , 
                data : null,
                error : "INVALID_REQUEST",
                message : "Invalid Schema"
            })
        }
    const id = data.id
    try{ 
        await prismaClient.responses.delete({ 
            where: { 
                workflowId : id
            }
        })
        const data = await prismaClient.workflow.delete({ 
            where : { 
                id : id
            }
        })
        return res.status(200).json({
            success : true , 
            data : { 
                data 
            }, 
            message : "sucessfully deleted workflow" , 
            error : null
        })
    }
    catch(e){ 
        console.log("error happened at delete workflwo " + e) 
        return res.status(500).json({
            success : false , 
            data : null ,
            error : "SERVER_DOWN" ,
            message : "failed with error " + JSON.stringify(e)
        })
    }
}
export async function UpdateWorkflow(req : Request , res : Response){ 
    //update that node with the following , dump new json there
    const userId = req.userId ;
    const payload = req.body ;
    const id : string = (req.params.id)!;
    console.log("checking req params id "  + id )
    console.log("id + : "+ id)
    const data = payload.data;
    const FilteredNodes = JSON.parse(data.nodes)

    FilteredNodes.forEach((i : node) => { i.type == 'webhook' || i.type == 'awaitGmail' ?( i.data.webhook = false  ,i.data.isExecuting = false , i.data.afterPlayNodes = undefined ) : console.log("wow bhay") })
  
    try {
        const response = await prismaClient.workflow.update({ 
            where : { 
                id : id
            } , 
            data : { 
               //add new data here 
               //JSON stringify is only for backend , as our frontend already send the data in string only 
               nodes :  JSON.stringify(FilteredNodes), 
               Connections :(data.connections) , 
               userId : userId
            }
        })
        await prismaClient.responses.update({ 
            where : { 
                workflowId : id
            },
            data : { 
                workflowId : id,
                data : "",
                userId : userId
            }
        })
        return res.status(200).json({
            success : true ,
            data : response , 
            error : null , 
            message : "updated the data" 
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false , 
            data : null , 
            error : "SERVER_DOWN",
            message : "failed with error " + JSON.stringify(error)
        })
        
    }
}
export async function GetWorkflow(req  : Request, res : Response){ 

    const userId = req.userId ;
    const id : string = (req.params.id)!;
    try {
        const response = await prismaClient.workflow.findUnique({ 
            where : { 
                id : id,
                userId : userId
            } 
        })
        console.log("response " + response)
        res.status(200).json({
            success : true , 
            data : response , 
            error : null,
            message  : "sucessfully fetched the workflow"
        })
    } catch (error) {
        console.log(error)   
        return res.status(500).json({
            success : false , 
            data : null , 
            error : "SERVER_DOWN",
            message : "failed with error " + JSON.stringify(error)
        })
    }

}
