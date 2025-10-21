import ApiClient from "./ApiClient";
import type { AuthResult, MeResult, LogoutResult } from "@/domain/auth";

class AuthService {
    static get i() { return new AuthService(); }

    login(email: string, password: string) {
        return ApiClient.i.post<AuthResult>("/api/auth/login", { email, password });
    }

    register(name: string, email: string, password: string) {
        return ApiClient.i.post<AuthResult>("/api/auth/register", { name, email, password });
    }

    me() {
        return ApiClient.i.get<MeResult>("/api/auth/me");
    }

    logout() {
        return ApiClient.i.post<LogoutResult>("/api/auth/logout", {});
    }
}
export default AuthService;
