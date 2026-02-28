import { prismaClient } from "@repo/database/client";
import type { node } from "../types.js";

export default async function OldResponses(workflowId : string , logCallBack : any , proces : node) : Promise<string | null | undefined>{

    let oldResponses;
    try{ 
        oldResponses = await prismaClient.responses.findFirst({ 
            where : { 
                workflowId : workflowId 
            }
        })
    }
    catch(err){ 
        console.error("prismaClient old responses Serch Failed" + err)
        logCallBack?.("unable to fetch previous node data because of error" + err)
        return null;
    }
    if(!oldResponses){
        logCallBack?.("No Responses from previous Nodes" )
        return null 
    }

    let oldResponsesData = JSON.parse(oldResponses.data);
    let whichNodePreviousData = proces.data.previousResponseFromWhichNode; 
    
    if(whichNodePreviousData){ 
        console.log("which node previous data : " + whichNodePreviousData)

        let PreviousNodeData = oldResponsesData.find((i : any) => i.outputNodeIndex == whichNodePreviousData)

        console.log(" dataa"+ JSON.stringify(PreviousNodeData))
        let Message : string = PreviousNodeData.data

        console.log("message "+ Message)

        return Message
    }
}