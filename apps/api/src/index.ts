import express from 'express' ; 
import jwt  from 'jsonwebtoken' ; 
import { prismaClient }  from '@repo/database/client'; 
import type { node } from './types.js';
import type { users } from './types.js';
import { processess } from './processess.js';
import {Usemiddleware } from './middleware.js';
import { gmail } from './gmail.js';
import { telegramBot } from './teligram.js';
const app  = express() ; 
app.use(express.json()); 
const JWT_SECRET  : string = process.env.JWT_SECRET!;
let whatToExecute =  0 ;



app.post('/api/v0/signup' , async (req , res)=> { 
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
app.post('/api/v0/signin' ,async (req, res)=> { 
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
        res.status(200).json("found the user , token : " + token)
    }
    else { 
        res.status(403).json("please sign up first")
    }
    

})
//payload or data or schema 
// title : workflow name 
//
app.post('/workflow' , (req , res)=> { 
    //user
    //yha userId leke ek new workflow with empty nodes create hojana chaiye
    const payload = req.body; 

    const title = payload.title; 
    const nodes = payload.nodes;
    const connections = payload.connections;
    
    //prisma call to make a new emty workspace

    //do a db call to post the nodes
    let node: node
})


app.get('/workflow' , (req , res)=> { 
    //yha bs ek be call jayega vo call karega aur sara data be se le aayega
})

app.post('/workflow/:id', Usemiddleware , (req , res)=> { 
    //create new node and dump it there as a json , what it does 
    const id : number = Number(req.params.id)
    const payload = req.body ; 
    // const data = JSON.parse(payload.data) ; 
    // processess.push(data)
    const data  = payload.data
    for(let i = 0 ; i < data.length ; i++){ 
        processess.push(data[i])
    }
    console.log("data" + JSON.stringify(payload.data) )
    
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
    console.log("processes " + processess )
    res.json("done")
})
app.put('/workflow/:id' , (req , res)=> { 
    //update that node with the following , dump new json there
})

app.post('/execute' , Usemiddleware , async (req , res)=> { 

    const payload = req.body;
    const id = payload.id; //this will be workflow id only  , considering there will be only 1 workflow
    //@ts-ignore
    const userId  = req.userId;
    for(let i = 0 ; i < processess.length ; i++){ 
        const proces :node = processess[i]!
        console.log('currently executing process no ' + i);
        if(proces.type == 'trigger'){ 
            proces.done = true;
            console.log('this done')
        }
        else if (proces.type == 'action'){ 
            if(proces.do == 'teligram'){ 
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
                    await telegramBot(data)
                    
                }
                catch(e) { 
                    // res.status(403).json("the error " + e)
                }
                //function call teligram
                //check krenge ki kya us cheez ke credentials hai
                
            }
            else if(proces.do == 'gmail'){ 
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
                    await gmail(data)
                    // res.json('send the mail bhosdu yayaya')
                }
                catch(err){ 
                    res.status(403).json('didnt found the credentials')
                }
                
                //function call gmail 
                //check krenge ki credentials hai ya nahi
                
            }
        }
        else { 
            console.log("what the fuck process is this " + proces.type)
        }
    }
    res.json('send the message bhai ab jao cold coffee pi aao')
    
})

app.post('/api/v0/credentials', Usemiddleware , async(req , res) => { 
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
app.delete('/api/v0/credentials' ,async(req , res)=> { 
    
})

app.listen(3000)