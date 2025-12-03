import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
export function Usemiddleware( req : Request , res : Response , next : NextFunction){ 
    const token = req.headers.authorization ; 
    if(!token){ 
       return res.status(403).json("please sign in first")
    }
    const JWT_SECRET = process.env.JWT_SECRET! ;
    try { 
        const user = jwt.verify(token , JWT_SECRET)
        //@ts-ignore
        req.userId = user.id
        next()
    }
    catch(e){ 
        res.status(403).json({ 
            error : "invalid token"
        })
    }
}