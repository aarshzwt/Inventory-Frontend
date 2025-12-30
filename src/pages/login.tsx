"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginApi } from "@/services/auth";
import { useAppDispatch } from "@/redux/hooks";
import { login } from "@/redux/slices/authSlice";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await loginApi({ email, password });

            dispatch(
                login({
                    user: {
                        email: res.user.email,
                        role: res.user.role,
                        id: res.user.id,
                    },
                    token: res.token,
                })
            );
            router.push("/");
        } catch {

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm space-y-4 border p-6 rounded"
            >
                <h1 className="text-xl font-semibold">Login</h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border px-3 py-2 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border px-3 py-2 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-2 rounded"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
