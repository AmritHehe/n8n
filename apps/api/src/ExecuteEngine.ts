import { preOrderTraversal } from "./veryBigBrain.js";
import  type { node } from "./types.js";
import { prismaClient }  from '@repo/database/client'; 
import { telegramBot } from "./ExecuteNodes/ExecuteTeligram.js";
import { gmail } from "./ExecuteNodes/ExecuteGmail.js";
import { genai } from "./ExecuteNodes/ExecuteAiAgent.js";

export async function executeIt( payload : any , user :any  , workflowId : string , indexToStartWith ?: number , ExecutedFirstIndex ?: boolean , logCallBack ?: (msg : string)=> void){ 
        const nodes = JSON.parse(payload.nodes); 
        const connections = (payload.connections);
        const sortedArray = preOrderTraversal(connections) ; 
        
        const userId  = user;
        console.log('userId : ' + userId)
        // logCallBack?.('userId : ' + userId)
        // console.log("hello I got this this data , payload : " + JSON.stringify(payload)  + " user " + JSON.stringify(user) + " workflowID " + workflowId    + "index to start with " + indexToStartWith    )
        // console.log("nodes " + nodes)
        //now we have to execute the nodes(sources) of the sorted array by processing the nodes
        //take the data from the nodes 
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
            console.log('currently executing process no ' + processtoexecute);
            logCallBack?.("currently executing the process no . " + processtoexecute)
            console.log("the process / node " + JSON.stringify(proces))
            // logCallBack?.('the node' + JSON.stringify(proces) )
            if(proces.data.label == 'trigger'){ 
                // proces.done = true;
                console.log('this done')
            }

            else if (proces.data.label == 'action'){ 
                if(proces.type == 'telegram'){ 
                    const message = proces.data.message!
                    console.log("reached inside telegram")
                    logCallBack?.("executing telegram")
                    let oldResponses;
                    try { 
                        try{ 
                            oldResponses = await prismaClient.responses.findFirst({ 
                                where : { 
                                    workflowId : workflowId
                                }
                            })
                        }
                        catch(err){ 
                            console.error("prismaClient Serch Failed")
                        }
                        const credId = proces.data.credentialsId; 
                        const chatId = proces.data.chatId;
                        const credentials = await prismaClient.credentials.findFirst({ 
                            where : { 
                                userId : userId , 
                                id : Number(credId)
                            }
                        })
                        console.log("user Id " + userId)
                        console.log("credentials " + credentials)
                        const data :any = credentials!.data
                        // if(chatId != null || chatId != "" || chatId !=undefined){ 
                        //     // console.log("yha araha hu bhai why ")
                        //     // data.chatId = chatId
                        // }
                        
                        // console.log("data chat id : " + data.chatId)
                        console.log('credentials data' + JSON.stringify(data))
                        if(proces.data.previousResponse){ 
                            if(oldResponses){ 
                                console.log("hi bhai ji bhai")
                                console.log(" old responses" + JSON.stringify(oldResponses))
                                let oldResponsesData = JSON.parse(oldResponses.data);
                                let whichNodePreviousData = proces.data.previousResponseFromWhichNode; 
                                console.log("old responses data  : " + JSON.stringify(oldResponsesData))
                                if(whichNodePreviousData){ 
                                    console.log("which node previous data : " + whichNodePreviousData)
                                    let dataa = oldResponsesData.find((i : any) => i.outputNodeIndex == whichNodePreviousData)
                                    console.log(" dataa"+ JSON.stringify(dataa))
                                    let Message = dataa.data
                                    console.log("message "+ Message)
                                    console.log(" data : " + JSON.stringify(dataa)) ; 
                                    console.log(" message "  + Message)
                                    await telegramBot(data , Message )

                                }
                                
                                

                            }
                            
                        }
                        else { 
                            await telegramBot(data ,message)
                        } 
                    }
                    catch(e) { 
                        // res.status(403).json("the error " + e)
                        console.log( )
                        logCallBack?.("process with id  : " + processtoexecute + " failed with error " + e)
                    }
                    //function call teligram
                    //check krenge ki kya us cheez ke credentials hai
                    
                }
                else if(proces.type == 'gmail'){ 
                    const message = proces.data.message!
                    const subject = proces.data.subject!
                    const to = proces.data.to!
                    try{ 
                        console.log('inside gmail execution part ')
                        logCallBack?.("executing gmail")
                        const credentials = await prismaClient.credentials.findFirst({
                            where : { 
                                userId : userId,
                                platform : 'gmail'
                            }
                        })
                        
                        const data = credentials!.data
                        console.log('credentials data' + data)
                        await gmail(data ,to ,  subject , message , false)
                        // res.json('send the mail bhosdu yayaya')
                    }
                    catch(err){ 
                        // res.status(403).json('didnt found the credentials')
                        console.log("process with id  : " + processtoexecute + " failed with error " + err )
    
                    }
                    
                    //function call gmail 
                    //check krenge ki credentials hai ya nahi
                    
                }
                else if(proces.type == 'agent'){ 
                    const message = proces.data.message; 
                    console.log("reached till here agent 1")
                    logCallBack?.("executing agent")
                    try { 
                        if(message){ 
                            const ai_response = await genai(message); 
                            console.log("reached till here agent !")
                            console.log("response : " +  JSON.stringify(ai_response)); 
                            //store the message here 
                        }
    
                    }
                    catch(e){ 
                        console.log("something went wrong!" + e)
                    }
                }
                else if(proces.type == 'webhook'){ 
                    if (proces.data.webhook==false){ 
                        console.log("waiting for webhook execution")
                        logCallBack?.("waiting for webhook execution ! ")
                        proces.data.afterPlayNodes = i + 1;
                        proces.data.isExecuting = true;
                        nodes[processtoexecute-1].data.isExecuting = true;
                        await prismaClient.workflow.update({
                            where : { 
                                id : workflowId
                            }, 
                            data : { 
                                title : "now it must work",
                                nodes : JSON.stringify(nodes)
                            }
                        })
                        console.log("proces : " + JSON.stringify(proces))
                        break;

                    }
                    else { 
                        console.log("webhook executed")
                        // logCallBack?.("webhook exceuted")
                    }

                }
                else if (proces.type == 'awaitGmail'){ 
                    const message = proces.data.message!
                    const subject = proces.data.subject!
                    const to = proces.data.to!
                    try{ 
                        console.log('inside gmail execution part ')
                        logCallBack?.("executing  awaitGmail")
                        const credentials = await prismaClient.credentials.findFirst({
                            where : { 
                                userId : userId,
                                platform : 'gmail'
                            }
                        })
                        
                        const data = credentials!.data
                        console.log('credentials data' + data)
                        await gmail(data ,to ,  subject , message , true , proces.id )
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
                                    title : "now it must work",
                                    nodes : JSON.stringify(nodes)
                                }
                            })
                            console.log("proces : " + JSON.stringify(proces))
                            break;

                        }
                        else { 
                            console.log("webhook executed")
                            logCallBack?.("response arrived ")
                        }

                        // res.json('send the mail bhosdu yayaya')
                    }
                    catch(err){ 
                        // res.status(403).json('didnt found the credentials')
                        console.log("process with id  : " + processtoexecute + " failed with error " + err )
                        logCallBack?.("process with id  : " + processtoexecute + " failed with error " + err )
    
                    }
                }
                else if (proces.type === 'aiagent') {
                    const message = proces.data.message;
                    const usePrevious = proces.data.previousResponse;
                    const previousNodeId = proces.data.previousResponseFromWhichNode;

                    logCallBack?.("executing agent");

                    try {
                        let finalPrompt = message || "";
                        console.log("inside this ")
                        // 🧩 If user selected a previous node response
                        if (usePrevious && previousNodeId) {
                        const previousData = await prismaClient.responses.findFirst({
                            where: { workflowId },
                        });
                        console.log("previous data  " +     JSON.stringify(previousData))
                        if (previousData && previousData.data) {
                            console.log("inside this again")
                            const parsed = JSON.parse(previousData.data);
                            console.log("parsed data " + JSON.stringify(parsed))
                            console.log("previous response id " + previousNodeId)
                            const prevNodeResponse = parsed.find(
                            (r: any) => r.outputNodeIndex == previousNodeId
                            );
                            console.log("previous data " + JSON.stringify(prevNodeResponse))
                            if (prevNodeResponse?.data)
                            finalPrompt += prevNodeResponse.data;
                        }
                        }

                        if (finalPrompt.trim()) {
                        const ai_response = await genai(finalPrompt);
                        console.log("AI Response:", ai_response);

                        const payloadToSend = {
                            outputNodeIndex : proces.id,
                            type: "agent",
                            data : ai_response,
                            timestamp: new Date().toISOString(),
                        };

                        // 💾 Store the AI response in responses table (like webhook logic)
                        const oldData = await prismaClient.responses.findFirst({
                            where: { workflowId },
                        });

                        if (oldData) {
                            let newData;
                            if (!oldData.data || oldData.data === "") {
                            newData = [payloadToSend];
                            } else {
                            let parsedOldData = JSON.parse(oldData.data);
                            newData = [...parsedOldData, payloadToSend];
                            }

                            await prismaClient.responses.update({
                            where: { workflowId },
                            data: { data: JSON.stringify(newData) },
                            });
                        }
                        console.log("✅ AI response stored successfully");
                        }
                    } catch (err) {
                        console.error("Error executing agent node:", err);
                    }
                }

                else { 
                    console.log("wtf proces is this bhay" + JSON.stringify(proces))
                }
            }
            else { 
                console.log("what the fuck process is this " + proces.type)
            }
        }
}