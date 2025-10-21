export type ID = string;

export interface User {
    id: ID;
    email: string;
    name?: string;
    roles: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface Role {
    id: ID;
    name: string;            // admin, editor, trainer
    permissions?: string[];
}

export type Level = "Beginner" | "Intermediate" | "Advanced";
export type Mode  = "Online" | "Offline" | "Hybrid";

export interface Training {
    id: ID;
    title: string;
    slug: string;
    desc: string;
    level?: Level;
    duration?: string;
    mode?: Mode;
    price?: string;
    imageUrl?: string;
    outline?: string[];
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
}
