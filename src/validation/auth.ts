import { z } from "zod";

export const LoginSchema = z.object({
    email: z.email(),                      // ⬅️ versi baru
    password: z.string().min(6),
});
export const RegisterSchema = z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(6),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
