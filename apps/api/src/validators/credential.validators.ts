import z from "zod" 

export const CreateCredentialSchema = z.object({
    title : z.string(),
    platform : z.enum(["teligram", "gmail"]),
    data : z.any(),
})

export const DeleteCredentialsSchema = z.object({
    id : z.number()
})