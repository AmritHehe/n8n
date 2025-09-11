import express from 'express' ; 
import jwt from 'jsonwebtoken'
import { users } from './users.js';
const app  = express() ; 
app.use(express.json()); 


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

app.post('/workflow' , (req , res)=> { 

})


app.get('/workflow' , (req , res)=> { 
    
})

app.post('/workflow/:id' , (req , res)=> { 
    
})
app.put('/workflow/:id' , (req , res)=> { 
    
})


app.listen(3000)