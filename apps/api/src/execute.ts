import { preOrderTraversal } from "./veryBigBrain.js";
import  type { node } from "./types.js";
import { prismaClient }  from '@repo/database/client'; 
import { telegramBot } from "./teligram.js";
import { gmail } from "./gmail.js";
import { genai } from "./langchain.js";
export async function executeIt( payload : any , user :any){ 
        const nodes = (payload.nodes); 
        const connections = JSON.stringify(payload.connections);
        const sortedArray = preOrderTraversal(connections) ; 
        
        const userId  = user;
        
        console.log('userId : ' + userId)
        // console.log("nodes " + nodes)
        //now we have to execute the nodes(sources) of the sorted array by processing the nodes
        //take the data from the nodes 

        for(let i = 0 ; i < sortedArray.length ; i++){ 
            
            const processtoexecute = sortedArray[i].target
            const proces :node = nodes[processtoexecute-1]!
            if(proces.data.afterPlayNodes){ 
                i = proces.data.afterPlayNodes;
            }
            console.log('currently executing process no ' + processtoexecute);
            console.log("the process / node " + JSON.stringify(proces))
            if(proces.data.label == 'trigger'){ 
                // proces.done = true;
                console.log('this done')
            }

            else if (proces.data.label == 'action'){ 
                if(proces.type == 'telegram'){ 
                    const message = proces.data.message!
                    console.log("reached inside telegram")
                    try { 
                        const credentials = await prismaClient.credentials.findFirst({ 
                            where : { 
                                userId : userId , 
                                platform : 'teligram'
                            }
                        })
                        const data = credentials!.data
                        console.log('credentials data' + data)
                        await telegramBot(data ,message)
                        
                    }
                    catch(e) { 
                        // res.status(403).json("the error " + e)
                        console.log("process with id  : " + processtoexecute + " failed with error " + e )
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
                        const credentials = await prismaClient.credentials.findFirst({
                            where : { 
                                userId : userId,
                                platform : 'gmail'
                            }
                        })
                        
                        const data = credentials!.data
                        console.log('credentials data' + data)
                        await gmail(data ,to ,  subject , message)
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
                        proces.data.afterPlayNodes = i;
                        proces.data.isExecuting = true;
                        nodes[processtoexecute-1].data.isExecuting = true;
                        await prismaClient.workflow.update({
                            where : { 
                                id : 1
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