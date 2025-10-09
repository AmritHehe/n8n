import { FunctionResponse, GoogleGenAI, type FunctionDeclaration } from "@google/genai";

function calculateSum(a:any , b : any){ 
    return `Sum is ${a+b}`
}

const ai = new GoogleGenAI({
    apiKey : ''
})


const sumFunctionCall : FunctionDeclaration= { 
    name : 'sum_function' , 
    description : 'this functions add two numbers and return their sum' , 
    parametersJsonSchema : { 
        type : 'object' , 
        properties : { 
            a : { 
                type : 'number'
            },
            b: { 
                type : 'number'
            },
        }, 
        required : ['a' , 'b'],
    },
}
const response = await ai.models.generateContent({ 
    model : 'gemini-2.5-flash' , 
    contents : 'return the function call /code' , 
    config : { 
        tools : [{ 
            functionDeclarations : [sumFunctionCall]
        }]
    }
})
if(!response){ 
    process.exit()
}
const functionCalls = response.functionCalls
if(functionCalls && functionCalls.length > 0){ 
    console.log('processing function calls  , length : ' +response.functionCalls.length)

    const functionResponses = []
    for(let call of functionCalls) { 
        console.log('executing ' + call.name + "args " + call.args)
        let functionResult ; 
        switch(call.name){ 
            case 'sum' : 
                functionResult :calculateSum(call?.args?.a , call?.args?.b); 
                break;
            default : 
                functionResult = 'unknown function '
        }
        functionResponses.push({ 
            functionResponse : { 
                name : call.name , 
                response : { result : functionResult}
            }
        })
    }
    const finalResult = await ai.models.generateContent({ 
    model : 'gemini-2.5-flash' , 
    contents : [
        { 
            //@ts-ignore
            role : "user" , 
            parts  : [{text : 'what is the sum of 2 and 3'}]
        }, 
        //@ts-ignore
        response.candidates[0]?.content, 
        //@ts-ignore
        {role : 'user' , parts : functionResponses}
    ]
})
console.log('final output' + finalResult.text)
}
else{ 
    console.log('direct call' + response.text)
}

