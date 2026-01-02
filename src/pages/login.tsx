"use client";

import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { loginApi } from "@/services/auth";
import { useAppDispatch } from "@/redux/hooks";
import { login } from "@/redux/slices/authSlice";

const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
});

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Formik
                initialValues={{
                    email: "",
                    password: "",
                }}
                validationSchema={schema}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        const res = await loginApi(values);

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
                        setSubmitting(false);
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="w-full max-w-sm space-y-4 border p-6 rounded">
                        <h1 className="text-xl font-semibold">Login</h1>

                        {/* Email */}
                        <div>
                            <Field
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="w-full border px-3 py-2 rounded"
                            />
                            <ErrorMessage
                                name="email"
                                component="p"
                                className="text-sm text-red-500 mt-1"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <Field
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="w-full border px-3 py-2 rounded"
                            />
                            <ErrorMessage
                                name="password"
                                component="p"
                                className="text-sm text-red-500 mt-1"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-black text-white py-2 rounded disabled:opacity-60"
                        >
                            {isSubmitting ? "Logging in..." : "Login"}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
