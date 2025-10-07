import express, {  type Request, type Response } from 'express' ; 
import jwt  from 'jsonwebtoken' ; 
import { prismaClient }  from '@repo/database/client'; 
import type { node } from './types.js';
import type { users } from './types.js';
// import { processess } from './processess.js';
import {Usemiddleware } from './middleware.js';
import cors from 'cors';
import { executeIt } from './execute.js';
const app  = express() ; 
app.use(express.json()); 
app.use(cors())
const workflowLogStreams: { [workflowId: string]: ((msg: string) => void) | undefined } = {};

const JWT_SECRET  : string = process.env.JWT_SECRET!;



app.post('/api/v1/signup' , async (req , res)=> { 
    const payload = req.body ;
    const name : string= payload.name ; 
    const pass : string = payload.pass ; 
    
    await prismaClient.user.create({
        data : { 
            name : name , 
            pass : pass
        }
    })

    res.json("user created")

})
app.post('/api/v1/signin' ,async (req : Request, res :Response)=> { 
    console.log('hitted the endpoint ?')
    const payload = req.body ;
    const name = payload.name ; 
    const pass = payload.pass ; 
    
    
    const user  : users | null = await prismaClient.user.findFirst({
        where : { 
            name : name, 
            pass : pass
        }
    })

    if(user) {
        const token  = jwt.sign({ 
            id : user.id
        }, JWT_SECRET)
        res.status(200).json({ 
            token : token
        })
    }
    else { 
        res.status(403).json("please sign up first")
    }
    

})
//payload or data or schema 
// title : workflow name 
//
app.post('/workflow' , Usemiddleware, async (req : Request , res : Response)=> { 
    //user
    //yha userId leke ek new workflow with empty nodes create hojana chaiye
    const payload = req.body; 

    const title = payload.title; 
    const nodes = payload.nodes;
    const connections = payload.connections;
    //@ts-ignore
    const userId = req.userId  
    //prisma call to make a new emty workspace
    const response = await prismaClient.workflow.create({ 
        data : { 
            title : title , 
            nodes : JSON.stringify(nodes) , 
            Connections : JSON.stringify(connections) ,
            userId : userId
        }
    })
    await prismaClient.responses.create({ 
            data : { 
                workflowId : response.id,
                data : "",
                userId : userId
            }
        })
    res.json(response)
    //do a db call to post the nodes
})


app.get('/workflow' , Usemiddleware ,async (req  : Request, res : Response)=> { 
    //yha bs ek be call jayega vo call karega aur sara data be se le aayega

    //@ts-ignore
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
    

})
app.delete('/workflow' , Usemiddleware , async(req : Request , res : Response) => { 
    const id = req.body.id; 
    try{ 
        const data = await prismaClient.workflow.delete({ 
            where : { 
                id : id
            }
        })
        res.json(data)
    }
    catch(e){ 
        console.log("error happened " + e) 
    }
})

// app.post('/workflow/:id', Usemiddleware ,async (req , res)=> { 
//     //create new node and dump it there as a json , what it does 
//     //@ts-ignore
//     const id : number= parseInt(req.params.id)
//     console.log(typeof(id))
//     const payload = req.body ; 
//     console.log("id + : "+ id)
//     console.log("iddd dekhraha hu " + req.params.id)
//     const data = payload.data 
//     // const data = JSON.parse(payload.data) ; 
//     // processess.push(data)
    
//     const nodes  = data.nodes ; 
//     const connections = data.connections;
//     //@ts-ignore
//     const userId = req.userId 
//     console.log("hitted the data")
//     try {
//         await prismaClient.workflow.create({ 
//             data : { 
//                 id : 1 , 
//                 title : "data" , 
//                 nodes : nodes , 
//                 Connections : connections ,
//                 userId : userId , 
//             }
//         })
//         await prismaClient.responses.create({ 
//             data : { 
//                 workflowId : id,
//                 data : "",
//                 userId : userId
//             }
//         })
//         console.log("data" + JSON.stringify(payload.data) )

//         res.json("done")
//     }
//     catch(err){ 
//         console.error(" error hogis " + err)
//         res.json("something bad happened")
//     } 
    
    
//     //nodes mein we ll just push nodes and connections to be 



app.put('/workflow/:id' , Usemiddleware ,async (req : Request , res : Response)=> { 
    //update that node with the following , dump new json there
    //@ts-ignore
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
               title : "updated data" , 
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
        res.json("updated the data" + response)
    } catch (error) {
        console.log(error)
        
    }
})
app.get('/workflow/:id' , Usemiddleware , async(req  : Request, res : Response) => { 

    console.log("tried to hit the end point")
    //@ts-ignore
    
    const userId = req.userId ;
    const id : string = (req.params.id)!;
    try {
        const response = await prismaClient.workflow.findFirst({ 
            where : { 
                id : id
            } 
        })
        console.log("response " + response)
        res.json(response)
    } catch (error) {
        console.log(error)   
    }

})
app.all('/webhook/:id' ,Usemiddleware ,  async(req : Request , res : Response) => { 
    const id  :number = Number( req.params.id ); 
    //@ts-ignore
    //ADD userId and workflow Id in params too
    const userId = req.userId;
    const ResponseData = req.body.message;
    const workflowId :string  = (req.query.workflowId) as string;
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
                            title : "changed the webhook " ,
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
                    await executeIt(payload , userId ,  workflowId ,  indexToStartWith ,true ,logCallback)
                    res.send({ status: "Webhook executed" });
                    


                        
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
})

app.post('/execute' , Usemiddleware , async (req : Request , res : Response)=> { 
    const payload = req.body;
    const  workflowId :string = payload.id; //this will be workflow id only  , considering there will be only 1 workflow
    //@ts-ignore
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
    
})
app.get('/execute/logs/:workflowId', async (req : Request , res :Response) => {
  const { workflowId } = req.params;
  //@ts-ignore
  const token = req.query.token as string ;
  if(!token){ 
    return res.status(401).send('Unauthorized: Token missing');
  }
  const JWT_SECRET = process.env.JWT_SECRET! ;
  console.log(JWT_SECRET)
  const user = jwt.verify(token , JWT_SECRET)
  //@ts-ignore
  const userId = user.id;
          
  console.log("user Id sdjsdfmnvfx  : " + userId )
  const id  : string = (workflowId)!
  console.log(" workflow Id dgfkgjkf : " + workflowId)
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  console.log("arrived till here" )
  const sendLog = (msg: string) => {
    res.write(`data: ${msg}\n\n`);
  };
  // Helper to send log messages
    workflowLogStreams[id] = sendLog;

    req.on("close", () => {
    delete workflowLogStreams[id];
  });  
    // sendLog("SSE connected. Waiting for workflow execution...");
  req.on("close", () => {
    res.end();
  });
});

app.get('/api/v1/credentials' , Usemiddleware  ,  async ( req :Request , res : Response) => { 
    //@ts-ignore
    const userId  = req.userId; 
    try { 
        const data = await prismaClient.credentials.findMany({ 
            where : { 
                userId : userId
            }
        })
        console.log(" data " + JSON.stringify(data) );
        res.json(data)
    }
    catch(e){ 
        console.log("this credentials end point is not working , error :  "   + e )
        res.json("something went wrong " + e)
    }
})
app.post('/api/v1/credentials', Usemiddleware , async(req :Request , res :Response) => { 
    //use middleware
    const payload = req.body;
    //@ts-ignore
    const userId  = req.userId;
    try{ 
        const response = await prismaClient.credentials.create({ 
            data : {    
                title : payload.title , 
                platform : payload.platform , 
                data : payload.data , 
                userId : userId
            }
        
        })
        res.json({id : response.id})
    }
    catch(err){ 
        res.status(411).json("something went wrong" + err)
        console.error('something went wrong : ' + err)
    }
    
    //what we need is title platform data
})
app.delete('/api/v1/credentials' , Usemiddleware ,async(req :Request, res : Response)=> { 
    const payload = req.body;
    //@ts-ignore
    const userId = req.userId; 
    const id = payload.id; 
    try{ 
        if(id){
            const response = await prismaClient.credentials.delete({ 
                where : { 
                    id : id 
                }
            })
        }
        res.json("sucessfully deleted the credential" )
    }
    catch(e){ 
        res.status(403).json('didnt worked well ')
    }
    

})
        
app.listen(3002 , ()=> { 
    console.log("listening to port 3002")
})