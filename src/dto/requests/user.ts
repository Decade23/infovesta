export type CreateUserRequest = {
    email: string; name?: string; password: string; roles: string[];
};
export type UpdateUserRequest = Partial<{
    email: string; name: string; roles: string[]; password: string;
}>;
