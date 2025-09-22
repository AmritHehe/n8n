import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import { z } from "zod"; 
import type { MessageContent } from "@langchain/core/messages";
export async function genai (message : string){ 
    const model = new ChatGoogleGenerativeAI({ 
        model : "gemini-2.0-flash" , 
        temperature : 0
    })
    const agent = createReactAgent({ 
        llm : model , 
        tools :[]
    }); 

    const result = await agent.invoke({ 
        messages : [
            { 
                role : "user" , 
                content : message
            }
        ]
    })
    let hehe : MessageContent =  (result.messages[1]?.content)!
     console.log("response inside: " + JSON.stringify(result.messages[1]?.content))

    return hehe;
}
