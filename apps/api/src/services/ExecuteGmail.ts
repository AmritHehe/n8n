import { gmail } from "../ExecuteNodes/ExecuteGmail.js";
import  type { node } from "../types.js";
import fetchCredentials from "./fetchCredentials.js";
import OldResponses from "./fetchOldResponses.js";


export default async function ExecuteGmail(proces : node , logCallBack : any , workflowId : string  , processtoexecute : number , userId : string){

        let {message , subject , to , credentialsId } = proces.data

        if(!to){ 
            logCallBack?.("receiver mail ID is missing")
            return;
        }
        if(!message ||  message.length == 0){
            message = "FOLLOW_AMRITHEHE_ON_X_&_GITHUB"
        }
        if(!subject ||  subject.length == 0){
            subject = "FOLLOW_AMRITHEHE_ON_X_&_GITHUB"
        }
        try{ 

            console.log('inside gmail execution part ')
            logCallBack?.(`${JSON.stringify({ type: "nodeExecuting", nodeId: proces.id })}`);

            const DecryptedCredentialsData = await fetchCredentials("gmail" , logCallBack , userId , credentialsId)
            if(!DecryptedCredentialsData){
                logCallBack?.("failed to fetch credentials Data");
                return 0;
            }
            console.log('credentials data' + DecryptedCredentialsData)

            if(proces.data.previousResponse){ 
                let Message = await OldResponses(workflowId , logCallBack , proces)
                if(!Message){
                    logCallBack?.("failed to fetch old Node Data");
                    Message = "EMPTY_MESSAGE"
                }
                await gmail(DecryptedCredentialsData ,to ,  subject , Message , false , proces.id , workflowId)
                logCallBack?.(`${JSON.stringify({ type: "nodeCompleted", nodeId: proces.id })}`);
                return 1;
            }
            else { 
                await gmail(DecryptedCredentialsData ,to ,  subject , message , false , proces.id , workflowId)
                logCallBack?.(`${JSON.stringify({ type: "nodeCompleted", nodeId: proces.id })}`);
                return 1;
            } 
        }
        catch(err){ 
            console.log("process with id  : " + processtoexecute + " failed with error " + err )
            logCallBack?.(`${JSON.stringify({ type: "nodeCompleted", nodeId: proces.id })}`);
            return  0;
        } 
    
}