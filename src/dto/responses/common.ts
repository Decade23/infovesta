export type ApiOk<T> = { ok: true; data: T };
export type ApiList<T> = { ok: true; data: T[]; total?: number };
export type ApiError = { ok: false; message: string; errors?: Record<string, string[]> };

// helper type untuk handler:
export type ApiResult<T> = ApiOk<T> | ApiError;
