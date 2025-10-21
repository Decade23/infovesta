import { z } from "zod";
export const CreateRoleSchema = z.object({
    name: z.string().min(2),
    permissions: z.array(z.string()).optional(),
});
export const UpdateRoleSchema = CreateRoleSchema.partial();

export type CreateRoleInput = z.infer<typeof CreateRoleSchema>;
export type UpdateRoleInput = z.infer<typeof UpdateRoleSchema>;
