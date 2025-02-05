import { z } from 'zod';
import "@/config/zod";

export const createUserSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        name: z.string().min(2, 'Name must be at least 2 characters'),
        roleId: z.number({
            required_error: 'Role ID is required',
            invalid_type_error: 'Role ID must be a number'
        })
    })
});

export const updateUserSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address').optional(),
        name: z.string().min(2, 'Name must be at least 2 characters').optional(),
        roleId: z.number().optional()
    }),
    params: z.object({
        id: z.string().transform(val => Number(val))
    })
});

export type CreateUserDTO = z.infer<typeof createUserSchema>['body'];
export type UpdateUserDTO = z.infer<typeof updateUserSchema>['body']; 