import express from 'express' ; 
import jwt  from 'jsonwebtoken' ; 
import { users } from './users.js';
import { prismaClient }  from '@repo/database/client'; 

const app  = express() ; 
app.use(express.json()); 
const JWT_SECRET  : string = process.env.JWT_SECRET!;

interface node { 
    id : string ;
    name : string ; 
    type : 'trigger'| 'action' | 'string' ;
    do ?: string  | 'mail' | 'teligram';
    done ?: boolean ;
    connection ?: boolean

}
let nodes :any[] = []
app.post('/api/v0/signup' , async (req , res)=> { 
    const payload = req.body ;
    const name = payload.name ; 
    const pass = payload.pass ; 
    
    await prismaClient.user.create({
        data : { 
            name : name , 
            pass : pass
        }
    })
    users.push({ 
        name : name , 
        pass : pass
    })

    res.json("user created")

})
app.post('/api/v0/signin' ,async (req, res)=> { 
    const payload = req.body ;
    const name = payload.name ; 
    const pass = payload.pass ; 
    
    
    const user = await prismaClient.user.findFirst({
        where : { 
            name : name, 
            pass : pass
        }
    })

    if(user) {
        const token  = jwt.sign({ 
            name : name
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

app.post('/api/v0/credentials'  , async(req , res) => { 
    const payload = req.body;
    
})

app.listen(3000)