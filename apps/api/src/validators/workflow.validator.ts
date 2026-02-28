import z from "zod"
export const CreateWorflowSchema = z.object({

    title : z.string(),
    nodes : z.any(),
    connections : z.any()
})


export const DeleteWorkflowSchema = z.object({
    id : z.string()
})

export const UpdateWorkflowSchema = z.object({
 
})