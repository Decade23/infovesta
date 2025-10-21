import type { User } from "./models";
import type { ApiResult } from "./api";

export type TokenType = "Bearer";

export interface Tokens {
    accessToken: string;
    refreshToken?: string;
    tokenType?: TokenType;   // default "Bearer"
    expiresAt?: number;      // epoch seconds (opsional)
}

export interface AuthPayload {
    user: User;
    tokens: Tokens;
}

// Hasil login/register
export type AuthResult = ApiResult<AuthPayload>;

// Hasil me()
export type MeResult = ApiResult<User>;

// Hasil logout
export type LogoutResult = { ok: true };
