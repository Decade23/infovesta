import { z } from "zod";
export const CreateTrainingSchema = z.object({
    title: z.string().min(3),
    slug: z.string().min(3),
    desc: z.string().min(10),
    level: z.enum(["Beginner","Intermediate","Advanced"]).optional(),
    duration: z.string().optional(),
    mode: z.enum(["Online","Offline","Hybrid"]).optional(),
    price: z.string().optional(),
    imageUrl: z.string().url().optional(),
    outline: z.array(z.string()).optional(),
    active: z.boolean().default(true),
});
export const UpdateTrainingSchema = CreateTrainingSchema.partial();

export type CreateTrainingInput = z.infer<typeof CreateTrainingSchema>;
export type UpdateTrainingInput = z.infer<typeof UpdateTrainingSchema>;
