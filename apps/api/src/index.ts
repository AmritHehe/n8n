import express from 'express' ; 
import jwt from 'jsonwebtoken' ; 
import { users } from './users.js';
import { prismaClient }  from '@repo/database/client'
const app  = express() ; 
app.use(express.json()); 

interface node { 
    id : string ;
    name : string ; 
    type : 'trigger'| 'action' | 'string' ;
    do ?: string  | 'mail' | 'teligram';
    done ?: boolean ;
    connection ?: boolean

}
let nodes :any[] = []
app.post('/api/v0/signup' , (req , res)=> { 
    const payload = req.body();
    const username = payload.username ; 
    const pass = payload.pass ; 
    

    users.push({ 
        name : username , 
        pass : pass
    })

    res.json("user created")

})
app.post('api/v0/signin' , (req, res)=> { 
    const payload = req.body();
    const username = payload.username ; 
    const pass = payload.pass ; 
    
    const user = users.find(u=> username ===username && u.pass === pass)
    if(user) {
        res.json("user created")
    }
    else { 
        res.status(403).json("please sign in first")
    }
    

})
//payload or data or schema 
// title : workflow name 
//
app.post('/workflow' , (req , res)=> { 

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
    
})
app.put('/workflow/:id' , (req , res)=> { 
    //update that node with the following , dump new json there
})


app.listen(3000)