export default class ApiClient {
    private static _i: ApiClient | null = null;
    private constructor(private readonly base = process.env.NEXT_PUBLIC_API_BASE ?? "") {}
    static get i() { return this._i ?? (this._i = new ApiClient()); }

    private refreshing: Promise<void> | null = null;

    private async fetchJSON<T>(url: string, init?: RequestInit, retry = true): Promise<T> {
        const r = await fetch(this.base + url, { credentials: "include", ...init });
        if (r.status === 401 && retry) {
            if (!this.refreshing) {
                this.refreshing = fetch("/api/auth/refresh", { method: "POST", credentials: "include" })
                    .then(res => { if (!res.ok) throw new Error("refresh-failed"); })
                    .finally(() => { this.refreshing = null; });
            }
            await this.refreshing;
            // coba ulang sekali
            return this.fetchJSON<T>(url, init, /*retry*/ false);
        }
        if (!r.ok) throw new Error(await r.text());
        return r.json() as Promise<T>;
    }

    get<T>(u: string, i?: RequestInit)  { return this.fetchJSON<T>(u, { method: "GET",  ...i }); }
    post<T>(u: string, b?: unknown, i?: RequestInit) {
        return this.fetchJSON<T>(u, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(i?.headers ?? {}) },
            body: b ? JSON.stringify(b) : undefined,
            ...i,
        });
    }
    patch<T>(u: string, b?: unknown, i?: RequestInit) {
        return this.fetchJSON<T>(u, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", ...(i?.headers ?? {}) },
            body: b ? JSON.stringify(b) : undefined,
            ...i,
        });
    }
    del<T>(u: string, i?: RequestInit) { return this.fetchJSON<T>(u, { method: "DELETE", ...i }); }
}
