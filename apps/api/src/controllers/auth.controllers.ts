

import{type Request, type Response } from 'express' ; 
import jwt  from 'jsonwebtoken' ; 
import { prismaClient }  from '@repo/database/client'; 
import type { users } from '../types/types.js';
import { Auth } from '../validators/auth.validators.js';
import bcrypt from "bcrypt";


export async function  Signup(req : Request , res : Response){ 
    const {data , success} = Auth.safeParse(req.body)

    if(!data || !success){
        return res.status(400).json({
            success : false , 
            data : null,
            error : "INVALID_REQUEST",
            message : "Invalid Schema"
        })
    }
    let existingUser;
    try { 
        existingUser = await prismaClient.user.findUnique({
            where : { 
                name : data.name 
            }
        })
        if(existingUser){ 
            return res.status(400).json({
                success : false , 
                data : null,
                error : "USER_ALREADY_EXISTS",
                message : "user with this name already exists"
            })
        }
    }
    catch(e){
        return res.status(500).json({
            success : false , 
            data : null,
            error : "DATABASE_DOWN",
            message : "error : " + JSON.stringify(e)
        })
    }
    
    const hashedPass =  await bcrypt.hash(data.pass , 10) ;
    try{ 
        const newUser = await prismaClient.user.create({
            data : { 
                name : data.name , 
                pass : hashedPass
            }
        })
        res.status(201).json({
            success : true , 
            data : {
               name : newUser.name , 
               id : newUser.id
            },
            error : null ,
            message : "user created suncessfully"
        })
        
    }
    catch(e){ 
        res.status(500).json("database is down !")
    }
}

export  async function  Signin(req : Request, res :Response){ 
    const {data , success} = Auth.safeParse(req.body)

    if(!data || !success){
        return res.status(400).json({
            success : false , 
            data : null,
            error : "INVALID_REQUEST",
            message : "Invalid Schema"
        })
    }

    const user  : users | null = await prismaClient.user.findUnique({
        where : { 
            name : data.name, 
        }
    })
    if(!user){
        return res.status(401).json({
            success : false , 
            data : null,
            error : "UNAUTHORIZED",
            message : "Invalid UserName or password"
        })
    }

    const checkPass = await bcrypt.compare( data.pass , user.pass )
    
    if(checkPass || user.pass == data.pass){ 

        const token  = jwt.sign({id : user.id},process.env.JWT_SECRET!)
        return res.status(200).json({ 
            success : true , 
            data : { 
                token : token 
            },
            error : null , 
            message : "user signed IN Successfully"
        })
    }   

    return res.status(401).json({
        success : false , 
        data : null,
        error : "UNAUTHORIZED",
        message : "Invalid UserName or password"
    })
    
}