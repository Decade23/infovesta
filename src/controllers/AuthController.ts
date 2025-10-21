"use client";
import { authLoadingState, authUserState } from "@/state/authState";
import { SetterOrUpdater } from "recoil";
import AuthService from "@/services/AuthService";

export default class AuthController {
    static async login(setLoading: SetterOrUpdater<boolean>, setUser: SetterOrUpdater<any>, email: string, pw: string) {
        try {
            setLoading(true);
            const r = await AuthService.i.login(email, pw);
            if (r.ok && r.user) setUser(r.user);
            return r;
        } finally { setLoading(false); }
    }
    static async register(name: string, email: string, pw: string) {
        return AuthService.i.register(name, email, pw);
    }
}
