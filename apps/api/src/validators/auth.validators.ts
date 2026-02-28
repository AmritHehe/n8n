
import z from "zod" 

export const Auth = z.object({
    name : z.string(), 
    pass : z.string()
})
