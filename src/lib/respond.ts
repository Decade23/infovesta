import { NextResponse } from "next/server";
import type { ApiOk, ApiError } from "@/dto/responses/common";

export const ok = <T>(data: T, init?: number | ResponseInit) =>
    NextResponse.json<ApiOk<T>>({ ok: true, data }, typeof init === "number" ? { status: init } : init);

export const fail = (message: string, errors?: Record<string, string[]>, status = 400) =>
    NextResponse.json<ApiError>({ ok: false, message, errors }, { status });
