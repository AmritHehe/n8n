

import {  type Request, type Response } from 'express' ; 
import { prismaClient }  from '@repo/database/client'; 
import { encryptJSON , safeDecrypt } from '../utls/crypto.js';
import { CreateCredentialSchema , DeleteCredentialsSchema } from '../validators/credential.validators.js';

export async function GetCredentials( req :Request , res : Response){ 

    const userId  = req.userId; 
    try { 
        const data  = await prismaClient.credentials.findMany({ 
            where : { 
                userId : userId
            }
        })

        const result = data.map((cred)=> { 
            let decrypted = null ; 
            try { 
                decrypted = safeDecrypt(cred.data )
            }
            catch(e){ 
                console.error(`Decryption failed for credential ${cred.id}:`, e);
                decrypted = null;
            }
            return { 
                ...cred,
                data: decrypted
            }
        }) 
        
        // console.log(" data " + JSON.stringify(data) );
        return res.status(200).json({
            success : true , 
            data : result,
            message : "successfully fetched the credentials",
            error : null
        })
    }
    catch(e){ 
        console.log("this credentials end point is not working , error :  "   + e )
        res.status(500).json({
            success : false , 
            data : null,
            error : "SERVER_ERROR",
            message : "unable to fetch the credentials please try again"
        })
    }
}

export async function CreateCredentials(req :Request , res :Response) { 

    const userId  = req.userId;
    
    const {data , success } = CreateCredentialSchema.safeParse(req.body)

    if(!data || !success){ 
        return res.status(400).json({
            success : false , 
            data : null,
            error : "INVALID_REQUEST",
            message : "Invalid Schema"
        })
    }
    const payload = data
    try{ 
        const encryptedData = encryptJSON(payload.data);
        const response = await prismaClient.credentials.create({ 
            data : {    
                title : payload.title , 
                platform : payload.platform , 
                data : encryptedData , 
                userId : userId
            }
        })
        res.status(201).json({
            success : true, 
            data : {
                id : response.id
            },
            message : "credential created sucessfully",
            error : null 
        })
    }
    catch(err){ 
        console.error('something went wrong : ' + err)
        return res.status(400).json({
            success : false , 
            data : null,
            error : "SERVER_DOWN",
            message : "Failed to save the credentials" + err
        })
    }
    
    //what we need is title platform data
}

export async function DeleteCredentials(req :Request, res : Response){ 
   
    const userId = req.userId; 
    const {data , success } = DeleteCredentialsSchema.safeParse(req.body)

    if(!data || !success){ 
        return res.status(400).json({
            success : false , 
            data : null,
            error : "INVALID_REQUEST",
            message : "Invalid Schema"
        })
    }

    const id = data.id; 
    try{ 

        const response = await prismaClient.credentials.delete({ 
            where : { 
                id : id, 
                userId : userId
            }
        })
        return res.status(200).json({
            success : true , 
            data : null,
            error : null,
            message : "Sucessfully deleted the credential with id " + response.id
        })
    }
    catch(e){ 
        return res.status(500).json({
            success : false , 
            data : null,
            error : "SERVER_DOWN",
            message : "cant delete because of error" + e
        })
    }
    

}
