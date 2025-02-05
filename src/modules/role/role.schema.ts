import {z} from "zod";
import "@/config/zod";


export const roleSchema = {
    create : z.object({
        body: z.object({
            name : z.string(),
            permissions : z.array(z.string())
        })
    }),
    update: z.object({
        body: z.object({
            name: z.string().optional(),
            permissions: z.array(z.string()).optional()
        })
    })
}

export namespace RoleDTO {
    export type Create = z.infer<typeof roleSchema.create>['body'];
    export type Update = z.infer<typeof roleSchema.update>['body'];
}