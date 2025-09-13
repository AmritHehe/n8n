import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
export function Usemiddleware( req : Request , res : Response , next : NextFunction){ 
    const token = req.headers.authorization ; 
    const JWT_SECRET = process.env.JWT_SECRET! ;
    console.log(JWT_SECRET)
    if(token){ 
        const user = jwt.verify(token , JWT_SECRET)
        if(user){ 
            //@ts-ignore
            req.userId = user.id
        }
        
        next()
    }
    else{ 
        res.json("user not found")
    }
}