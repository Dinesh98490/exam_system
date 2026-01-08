import { z } from "zod";
import { Role } from "@prisma/client";


import { passwordSchema } from "@/lib/auth/password";

export const registerSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  name: z.string().min(2),
  role: z.nativeEnum(Role).optional(), // Optional, defaults to STUDENT. In real app, only Admin can set roles.
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
