export type CreateRoleRequest = { name: string; permissions?: string[] };
export type UpdateRoleRequest = Partial<CreateRoleRequest>;
