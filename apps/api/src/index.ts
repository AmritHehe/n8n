import express, { response } from 'express' ; 
import jwt  from 'jsonwebtoken' ; 
import { prismaClient }  from '@repo/database/client'; 
import type { node } from './types.js';
import type { users } from './types.js';
// import { processess } from './processess.js';
import {Usemiddleware } from './middleware.js';
import { gmail } from './gmail.js';
import { telegramBot } from './teligram.js';
import cors from 'cors';
import { preOrderTraversal } from './veryBigBrain.js';
import { genai } from './langchain.js';
import { executeIt } from './execute.js';
const app  = express() ; 
app.use(express.json()); 
app.use(cors())
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
app.post('/api/v1/signin' ,async (req, res)=> { 
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
app.post('/workflow' , Usemiddleware, async (req , res)=> { 
    //user
    //yha userId leke ek new workflow with empty nodes create hojana chaiye
    const payload = req.body; 

    const title = payload.title; 
    const nodes = payload.nodes;
    const connections = payload.connections;
    //@ts-ignore
    const userId = req.userId  
    //prisma call to make a new emty workspace
    await prismaClient.workflow.create({ 
        data : { 
            title : title , 
            nodes : nodes , 
            Connections : connections ,
            userId : userId
        }
    })
    //do a db call to post the nodes
})


app.get('/workflow' , Usemiddleware ,async (req , res)=> { 
    //yha bs ek be call jayega vo call karega aur sara data be se le aayega

    //@ts-ignore
    const userId = req.userId
    await prismaClient.workflow.findMany({ 
        where : { 
            userId : userId
        }
    })

})

app.post('/workflow/:id', Usemiddleware ,async (req , res)=> { 
    //create new node and dump it there as a json , what it does 
    //@ts-ignore
    const id = parseInt(req.params.id)
    console.log(typeof(id))
    const payload = req.body ; 
    console.log("id + : "+ id)
    console.log("iddd dekhraha hu " + req.params.id)
    const data = payload.data 
    // const data = JSON.parse(payload.data) ; 
    // processess.push(data)
    
    const nodes  = data.nodes ; 
    const connections = data.connections;
    //@ts-ignore
    const userId = req.userId 
    console.log("hitted the data")
    await prismaClient.workflow.create({ 
        data : { 
            title : "data" , 
            nodes : nodes , 
            Connections : connections ,
            userId : userId , 
        }
    })
    console.log("data" + JSON.stringify(payload.data) )
    res.json("done")
    //nodes mein we ll just push nodes and connections to be 


    //process schema 
    // processess.push({ 
    //     id : 1 , 
    //     name : "start",
    //     type : "trigger",
    //     do : "onclick" , 
    //     done : false , 
    //     connection: true
    // })
    // processess.push({ 
    //     id : 2 , 
    //     name : "action",
    //     type : "action",
    //     do : "gmail" , 
    //     done : false , 
    //     connection: true
    // })
    // console.log("processes " + processess )
})
app.put('/workflow/:id' , Usemiddleware ,async (req , res)=> { 
    //update that node with the following , dump new json there
    //@ts-ignore
    const userId = req.userId ;
    const payload = req.body ;
    const id : number = Number(req.params.id);
    console.log("id + : "+ id)
    const data = payload.data
    try {
        const response = await prismaClient.workflow.update({ 
            where : { 
                id : id
            } , 
            data : { 
               //add new data here 
               title : "updated data" , 
               //JSON stringify is only for backend , as our frontend already send the data in string only 
               nodes :  JSON.stringify(data.nodes), 
               Connections :JSON.stringify(data.connections) , 
               userId : userId
            }
        })
        res.json("updated the data" + response)
    } catch (error) {
        console.log(error)
        
    }
})
app.get('/workflow/:id' , Usemiddleware , async(req , res) => { 

    console.log("tried to hit the end point")
    //@ts-ignore
    
    const userId = req.userId ;
    const id : number = Number(req.params.id);
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
app.all('/webhook/:id' , Usemiddleware  , async(req , res) => { 
    const id  :number = Number( req.params.id ); 
    //@ts-ignore
    const userId = req.userId;
    //we need workflowID here , assuming that there is one workflow only
    //ab ye node already hai db mein , we just have to update its value to true and hit the execution end point again 
    try{ 
        const data = await prismaClient.workflow.findFirst({ 
            where : { 
                id : 1
            }
        })
        if(data){ 
            const nodes = JSON.parse(data.nodes);
            const connections = JSON.parse(data.Connections)
            // const webHookNode  = nodes.find((value : node ) => value.id == id);
            
            const indexToUpdate = nodes.findIndex((value : node) => value.id == id)
            if(nodes[indexToUpdate].data.isExecuting == false){ 
                console.log(" nodes " + JSON.stringify(nodes[indexToUpdate]))   

                res.json("please execute the workflow first ")
            }
            else{ 
                nodes[indexToUpdate].data.webhook = true;
                // webHookNode.data.webhook = true;
                console.log(" updated the webhook " + JSON.stringify(nodes[indexToUpdate]))   
                    await prismaClient.workflow.update({ 
                        where : { 
                            id : 1
                        } , 
                        data : { 
                            title : "changed the webhook " ,
                            nodes : JSON.stringify(nodes)
                        }
                    })
                    //call execute here
                    const payload = { 
                        nodes : nodes , 
                        connections : connections 
                    }
                    res.json("executed the webhook");
                    executeIt(payload , userId)
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

app.post('/execute' , Usemiddleware , async (req , res)=> { 

    const payload = req.body;
    const id = payload.id; //this will be workflow id only  , considering there will be only 1 workflow
    //@ts-ignore
    const userId  = req.userId;
    await executeIt(payload , userId)
    // const nodes = JSON.parse(payload.nodes); 
    // const connections = (payload.connections);
    // const sortedArray = preOrderTraversal(connections) ; 
    // //@ts-ignore
    // const userId  = req.userId;
    
    // console.log('userId : ' + userId)
    // // console.log("nodes " + nodes)
    // //now we have to execute the nodes(sources) of the sorted array by processing the nodes
    // //take the data from the nodes 

    // for(let i = 0 ; i < sortedArray.length ; i++){ 
    //     const processtoexecute = sortedArray[i].target
    //     const proces :node = nodes[processtoexecute-1]!
    //     console.log('currently executing process no ' + processtoexecute);
    //     console.log("the process / node " + JSON.stringify(proces))
    //     if(proces.data.label == 'trigger'){ 
    //         // proces.done = true;
    //         console.log('this done')
    //     }
    //     else if (proces.data.label == 'action'){ 
    //         if(proces.type == 'telegram'){ 
    //             const message = proces.data.message!
    //             console.log("reached inside telegram")
    //             try { 
    //                 const credentials = await prismaClient.credentials.findFirst({ 
    //                     where : { 
    //                         userId : userId , 
    //                         platform : 'teligram'
    //                     }
    //                 })
    //                 const data = credentials!.data
    //                 console.log('credentials data' + data)
    //                 await telegramBot(data ,message)
                    
    //             }
    //             catch(e) { 
    //                 // res.status(403).json("the error " + e)
    //                 console.log("process with id  : " + processtoexecute + " failed with error " + e )
    //             }
    //             //function call teligram
    //             //check krenge ki kya us cheez ke credentials hai
                
    //         }
    //         else if(proces.type == 'gmail'){ 
    //             const message = proces.data.message!
    //             const subject = proces.data.subject!
    //             const to = proces.data.to!
    //             try{ 
    //                 console.log('inside gmail execution part ')
    //                 const credentials = await prismaClient.credentials.findFirst({
    //                     where : { 
    //                         userId : userId,
    //                         platform : 'gmail'
    //                     }
    //                 })
                    
    //                 const data = credentials!.data
    //                 console.log('credentials data' + data)
    //                 await gmail(data ,to ,  subject , message)
    //                 // res.json('send the mail bhosdu yayaya')
    //             }
    //             catch(err){ 
    //                 // res.status(403).json('didnt found the credentials')
    //                 console.log("process with id  : " + processtoexecute + " failed with error " + err )

    //             }
                
    //             //function call gmail 
    //             //check krenge ki credentials hai ya nahi
                
    //         }
    //         else if(proces.type == 'agent'){ 
    //             const message = proces.data.message; 
    //             console.log("reached till here agent 1")
    //             try { 
    //                 if(message){ 
    //                     const ai_response = await genai(message); 
    //                     console.log("reached till here agent !")
    //                     console.log("response : " +  JSON.stringify(ai_response)); 
    //                     //store the message here 
    //                 }

    //             }
    //             catch(e){ 
    //                 console.log("something went wrong!" + e)
    //             }
    //         }
    //         else { 
    //             console.log("wtf proces is this bhay" + JSON.stringify(proces))
    //         }
    //     }
    //     else { 
    //         console.log("what the fuck process is this " + proces.type)
    //     }
    // }
    // for(let i = 0 ; i <nodes.length; i++ ){ 
    //     let start = nodes[i] ; 
    //     //execute the process here 
    //     let target = connections[i]
    // }
    res.json('send the message bhai ab jao cold coffee pi aao')
    
})

app.post('/api/v1/credentials', Usemiddleware , async(req , res) => { 
    //use middleware
    const payload = req.body;
    //@ts-ignore
    const userId  = req.userId;
    try{ 
        await prismaClient.credentials.create({ 
            data : {    
                title : payload.title , 
                platform : payload.platform , 
                data : payload.data , 
                userId : userId
            }
        
        })
        res.json("created the credentials table")
    }
    catch(err){ 
        res.status(411).json("something went wrong" + err)
        console.error('something went wrong : ' + err)
    }
    
    //what we need is title platform data
})
app.delete('/api/v1/credentials' , Usemiddleware ,async(req , res)=> { 
    const payload = req.body;
    //@ts-ignore
    const userId = req.userId; 
    const platform = payload.platform; 
    try{ 
        const data  = await prismaClient.credentials.findFirst({ 
            where : { 
                platform : platform , 
                userId : userId
            }
        })
        const id = data?.id
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