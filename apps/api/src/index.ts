import express from 'express' ; 
import jwt  from 'jsonwebtoken' ; 
import { prismaClient }  from '@repo/database/client'; 
import type { node } from './types.js';
import type { users } from './types.js';
import { processess } from './processess.js';
import {Usemiddleware } from './middleware.js';
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

app.post('/workflow/:id' , (req , res)=> { 
    //create new node and dump it there as a json , what it does 
    const id : number = Number(req.params.id)
    const payload = req.body ; 
    const data = JSON.parse(payload.data) ; 
    processess.push(data)
    processess.push({ 
            id : id ,
            name : 'actiontrigger' ,
            type : 'trigger' ,
            do :  'onclick' ,
            done : false 
        })
    
})
app.put('/workflow/:id' , (req , res)=> { 
    //update that node with the following , dump new json there
})

app.post('/execute' , (req , res)=> { 
    //use middleware
    const payload = req.body;
    const id = payload.id; //this is the process id , not the workflow id 
    let proces =  processess.find(o=> o.id == id)
    if(proces){ 
        if(proces.type == 'trigger'){ 
            proces.done = true;
            whatToExecute = 2 ;
        }
        else if (proces.type == 'action'){ 
            if(proces.do == 'teligram'){ 
                //function call teligram
                //check krenge ki kya us cheez ke credentials hai
            }
            else if(proces.do == 'gmail'){ 
                //function call gmail 
                //check krenge ki credentials hai ya nahi
            }
        }
        else { 
            console.log("what the fuck process is this " + proces.type)
        }
    }
    else { 
        console.log('no process to do ')
    }
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