import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import { z } from "zod"; 
export async function genai (){ 
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
                content : "how to get the only message you reply when I call this invoke function , it returns an array "
            }
        ]
    })

    console.log("response : " + JSON.stringify(result.messages[1]?.content))
}
genai()
