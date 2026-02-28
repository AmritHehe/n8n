import { prismaClient } from "@repo/database/client";
import { safeDecrypt } from "../utls/crypto.js";

export default async function fetchCredentials(platform : "gmail" | "teligram" , logCallBack : any , userId : string , credId : number){
    

    let EncryptedCredentials = await prismaClient.credentials.findFirst({
            where : { 
                userId : userId,
                id : credId
            }
        })

    if(!EncryptedCredentials){
        logCallBack?.("failed to fetch credentials from Database " );
        return 
    }
    const DecryptedCredentialsData = safeDecrypt(EncryptedCredentials!.data)
    return DecryptedCredentialsData

 
}