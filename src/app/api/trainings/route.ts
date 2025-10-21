import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/respond";
import { withValidation } from "@/lib/zod-helpers";
import { CreateTrainingSchema, CreateTrainingInput } from "@/validation/training";
import type { Training } from "@/domain/models";

const mem: { trainings: Training[] } = { trainings: [] };

export async function GET() { return ok<Training[]>(mem.trainings); }

export async function POST(req: NextRequest) {
    const v = await withValidation<CreateTrainingInput>(req, CreateTrainingSchema);
    if (!v.ok) return fail(v.body.message, v.body.errors, v.status);

    const payload = v.data;
    const now = new Date().toISOString();
    const t: Training = { id: crypto.randomUUID(), active: true, createdAt: now, updatedAt: now, ...payload };
    mem.trainings.push(t);
    return ok<Training>(t, 201);
}
