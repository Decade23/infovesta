import type {Level, Mode} from "@/domain/models";

export type CreateTrainingRequest = {
    title: string; slug: string; desc: string;
    level?: Level; duration?: string; mode?: Mode;
    price?: string; imageUrl?: string; outline?: string[];
    active?: boolean;
};
export type UpdateTrainingRequest = Partial<CreateTrainingRequest>;
