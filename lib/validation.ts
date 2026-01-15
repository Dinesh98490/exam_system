import { z } from "zod";
import { Role } from "@prisma/client";


import { passwordSchema } from "@/lib/auth/password";


// User registration validation schema
export const registerSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  name: z.string().min(2),
  role: z.enum(['STUDENT', 'LECTURER', 'MODERATOR', 'ADMIN']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
