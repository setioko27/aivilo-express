import dotenv from "dotenv";
import { z } from 'zod';
dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']),
    PORT: z.string().transform(Number),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(32)
});

// Validasi env saat startup
export const env = envSchema.parse(process.env);
