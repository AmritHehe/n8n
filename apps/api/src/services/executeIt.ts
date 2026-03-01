import { preOrderTraversal } from "./veryBigBrain.js";
import  type { node } from "../types/types.js";
import { prismaClient }  from '@repo/database/client'; 
import { telegramBot } from "../ExecuteNodes/ExecuteTeligram.js";
import { genai } from "../ExecuteNodes/ExecuteAiAgent.js";
import OldResponses from "./fetchOldResponses.js";
import fetchCredentials from "./fetchCredentials.js";
import ExecuteGmail from "./ExecuteGmail.js";

export async function executeIt( payload : any , userId :string  , workflowId : string , indexToStartWith ?: number , ExecutedFirstIndex ?: boolean , logCallBack ?: (msg : string)=> void){ 
    const nodes = JSON.parse(payload.nodes); 
    const connections = payload.connections;
    const sortedArray = preOrderTraversal(connections) ; 

    let i  = 0 
    if(indexToStartWith){ 
        i = indexToStartWith;
    }
    for( ; i <= sortedArray.length ; i++){ 

        if(i == sortedArray.length){ 
            await prismaClient.responses.update({ 
                where : { 
                    workflowId : workflowId
                },
                data : { 
                    data : JSON.stringify([])
                }
            })
            logCallBack?.('done')
            return ;
        }    

        let processtoexecute = sortedArray[i].target

        if(i==0 && ExecutedFirstIndex == false){ 
            console.log("executed first index")
            processtoexecute = 1;
            i-- ;
            ExecutedFirstIndex = true
        }
        const proces :node = nodes[processtoexecute-1]!


        logCallBack?.("currently executing the process no . " + processtoexecute)

        if(proces.data.label == 'trigger'){ 
            console.log('trigger done')
        }
        else if (proces.data.label == 'action'){ 

            if(proces.type == 'telegram'){ 

                const message = proces.data.message || "[EMPTY_MESSAGE]"

                logCallBack?.("executing telegram")
                logCallBack?.(`${JSON.stringify({ type: "nodeExecuting", nodeId: proces.id })}`);

                try { 
            
                    const credId = proces.data.credentialsId; 
                    const chatId = proces.data.chatId;

                    const DecryptedCredentialsData = await fetchCredentials("teligram" , logCallBack, userId , credId)
                    
                    if(!DecryptedCredentialsData){
                        logCallBack?.("unable to fetch the credentials from backend")
                    }
                    
                    if(proces.data.previousResponse){ 
                        let OldNodeDataAsMessage = await OldResponses(workflowId , logCallBack , proces)

                        if(!OldNodeDataAsMessage){ 
                            OldNodeDataAsMessage = "EMPTY_DATA/MSG"
                        }
                        await telegramBot(DecryptedCredentialsData , OldNodeDataAsMessage )
                        logCallBack?.(`${JSON.stringify({ type: "nodeCompleted", nodeId: proces.id })}`);
                    }

                    else { 
                        await telegramBot(DecryptedCredentialsData ,message);
                        logCallBack?.(`${JSON.stringify({ type: "nodeCompleted", nodeId: proces.id })}`);

                    } 
                }
                catch(e) { 
                    logCallBack?.("process with id  : " + processtoexecute + " failed with error " + e)
                }  
            }
            else if(proces.type == 'gmail'){ 
                const result = await ExecuteGmail(proces , logCallBack , workflowId , processtoexecute , userId)
                if(result != 1){
                    continue;
                }
            }
            else if(proces.type == 'webhook'){ 

                if (proces.data.webhook==false){ 

                    console.log("waiting for webhook execution")

                    logCallBack?.(`${JSON.stringify({ type: "nodeExecuting", nodeId: proces.id })}`);
                    logCallBack?.("waiting for webhook execution ! ")                 

                    proces.data.afterPlayNodes = i + 1;
                    proces.data.isExecuting = true;
                    nodes[processtoexecute-1].data.isExecuting = true;

                    try { 
                        await prismaClient.workflow.update({
                            where : { 
                                id : workflowId
                            }, 
                            data : { 
                                nodes : JSON.stringify(nodes)
                            }
                        })
                    }
                    catch(e){
                        logCallBack?.("ERROR : Cant Update Webhook status in DATABASE , try reexecuting The workdlow" + e)   
                    }
                    console.log("proces : " + JSON.stringify(proces))
                    break;

                }
                else { 
                    console.log("webhook executed")
                    logCallBack?.(`${JSON.stringify({ type: "nodeCompleted", nodeId: proces.id })}`);
                }
            }
            else if (proces.type == 'awaitGmail'){ 
                try {
                    const result = await ExecuteGmail(proces , logCallBack , workflowId , processtoexecute , userId)
                    if(result != 1){
                        continue;
                    }
                    if (proces.data.webhook==false){ 
                        console.log("waiting for user to respond ")
                        logCallBack?.("awaiting gmail response")
                        proces.data.afterPlayNodes = i + 1;
                        proces.data.isExecuting = true;
                        nodes[processtoexecute-1].data.isExecuting = true;
                        await prismaClient.workflow.update({
                            where : { 
                                id : workflowId
                            }, 
                            data : { 
                                nodes : JSON.stringify(nodes)
                            }
                        })
                        console.log("proces : " + JSON.stringify(proces))
                        break;
                    }
                    else { 
                        console.log("webhook executed")
                        logCallBack?.("response arrived ")
                        logCallBack?.(`${JSON.stringify({ type: "nodeCompleted", nodeId: proces.id })}`);

                    }
                }
                catch(err){ 
                    console.log("process with id  : " + processtoexecute + " failed with error " + err )
                    logCallBack?.("process with id  : " + processtoexecute + " failed with error " + err )
                }
            }
            else if (proces.type === 'aiagent') {
                const message = proces.data.message;

                logCallBack?.("executing agent");
                logCallBack?.(`${JSON.stringify({ type: "nodeExecuting", nodeId: proces.id })}`);
                try {

                    let finalPrompt = message || "";

                    if(proces.data.previousResponse){ 
                    let OldNodeDataAsMessage = await OldResponses(workflowId , logCallBack , proces)
                        finalPrompt += OldNodeDataAsMessage
                    }

                    if (finalPrompt.trim()) {
                        const ai_response = await genai(finalPrompt);
                        console.log("AI Response:", ai_response);
                        const AIAgentResponse = {
                            outputNodeIndex : proces.id,
                            type: "agent",
                            data : ai_response,
                            timestamp: new Date().toISOString(),
                        };

                        const oldData = await prismaClient.responses.findFirst({
                            where: { workflowId },
                        });

                        if (oldData) {
                            let newData;
                            if (!oldData.data || oldData.data === "") {
                            newData = [AIAgentResponse];
                            } 
                            else {
                            let parsedOldData = JSON.parse(oldData.data);
                            newData = [...parsedOldData, AIAgentResponse];
                            }
                            await prismaClient.responses.update({
                                where: { 
                                    workflowId
                                },
                                data: {
                                    data: JSON.stringify(newData)
                                },
                            });
                        }
                        console.log("AI response stored successfully");
                        logCallBack?.(`${JSON.stringify({ type: "nodeCompleted", nodeId: proces.id })}`);
                    }
                } catch (err) {
                    console.error("Error executing agent node:", err);
                    logCallBack?.("Error executing AI node");
                }
            }
            else { 
                console.log("wrong prcess" + JSON.stringify(proces))
            }
        }
        else { 
            console.log("wrong process" + proces.type)
        }
    }
}