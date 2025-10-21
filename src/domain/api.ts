// Bentuk respons API generik
export type ApiOk<T> = { ok: true; data: T; message?: string };
export type ApiErr  = { ok: false; error: string; code?: string; status?: number; details?: unknown };
export type ApiResult<T> = ApiOk<T> | ApiErr;
