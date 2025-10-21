import { z } from "zod";

export const CreateUserSchema = z.object({
    email: z.email(),
    name: z.string().min(2).optional(),
    password: z.string().min(6),
    roles: z.array(z.string()).min(1),
});
export const UpdateUserSchema = CreateUserSchema.partial();

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
