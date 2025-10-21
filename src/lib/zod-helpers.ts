import { ZodSchema, ZodError } from "zod";

export function toErrorMap(err: ZodError): Record<string, string[]> {
    const out: Record<string, string[]> = {};
    err.issues.forEach(e => {
        const key = e.path.join(".") || "_";
        (out[key] ??= []).push(e.message);
    });
    return out;
}

/** HOF untuk Route Handler (Next.js) */
export async function withValidation<T>(
    req: Request,
    schema: ZodSchema<T>
): Promise<{ ok: true; data: T } | { ok: false; status: number; body: { ok:false; message: string; errors?: Record<string, string[]> } }> {
    try {
        const json = await req.json();
        const data = schema.parse(json); // throw kalau invalid
        return { ok: true, data };
    } catch (e) {
        if (e instanceof ZodError) {
            return { ok: false, status: 422, body: { ok:false, message:"Validation error", errors: toErrorMap(e) } };
        }
        return { ok: false, status: 400, body: { ok:false, message:"Bad request" } as const };
    }
}
