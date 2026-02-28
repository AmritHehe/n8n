import z from "zod"
export const ExecuteSchema = z.object({
    id : z.string(),
    nodes : z.string(),
    connections : z.string()
})