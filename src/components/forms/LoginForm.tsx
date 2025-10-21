"use client";

import {LoginSchema, LoginInput} from "@/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AuthService from "@/services/AuthService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function LoginForm() {
    const { register, handleSubmit, formState:{errors} } =
        useForm<LoginInput>({ resolver: zodResolver(LoginSchema) });

    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const router = useRouter();
    const { push } = useToast();

    const onSubmit = async (data: LoginInput) => {
        try {
            setLoading(true);
            const r = await AuthService.i.login(data.email, data.password);
            if (r.ok) {
                push({ type: "success", message: "Login berhasil 🎉" });
                router.replace("/admin");
            } else {
                push({ type: "error", message: "Login gagal" });
            }
        } catch (e) {
            push({ type: "error", message: "Login gagal, periksa email/password." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-zinc-700">Email</label>
                <input
                    {...register("email")}
                    inputMode="email"
                    autoComplete="email"
                    className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    placeholder="you@company.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-medium text-zinc-700">Password</label>
                <div className="mt-1 relative">
                    <input
                        {...register("password")}
                        type={show ? "text" : "password"}
                        autoComplete="current-password"
                        className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 pr-10
                       focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                        placeholder="••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShow(v => !v)}
                        className="absolute cursor-pointer inset-y-0 right-0 px-3 text-zinc-500 hover:text-zinc-700"
                        aria-label={show ? "Sembunyikan password" : "Lihat password"}
                    >
                        {show ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-amber-400 text-zinc-900 font-semibold py-2
                   hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
                {loading ? (
                    <span className="inline-flex items-center gap-2">
            <Loader2 className="animate-spin" size={16}/> Memproses…
          </span>
                ) : "Login"}
            </button>
        </form>
    );
}
