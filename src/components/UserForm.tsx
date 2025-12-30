import { UserFormType } from "@/services/user"
import { Formik, Form, Field } from "formik"
import { X } from "lucide-react"
import * as Yup from "yup"

type Props = {
    mode: "create" | "update"
    role: "admin" | "user"
    initialValues?: UserFormType
    onClose?: () => void
    onSubmit: (values: UserFormType) => void
}

export default function UserForm({
    mode,
    role,
    initialValues,
    onClose,
    onSubmit,
}: Props) {
    const isAdmin = role === "admin"

    const defaultValues: UserFormType = {
        username: "",
        email: "",
        password: "",
        role: "user",
    }

    const schema = Yup.object({
        username: Yup.string().required("Username is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password:
            mode === "create"
                ? Yup.string().min(6).required("Password is required")
                : Yup.string().min(6).optional(),
        role: isAdmin ? Yup.string().oneOf(["admin", "user"]) : Yup.mixed().strip(),
    })

    return (
        <div className="flex justify-center items-center mt-8">
            <div className="bg-white shadow rounded p-4 mb-6 max-w-md">
                <h2 className={`text-lg font-semibold mb-3 ${mode === "update" ? "flex justify-between items-center" : ""}`}>
                    {mode === "create" ? "Register User" : "Update User"}
                    {mode === "update" && (
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-primary-500 p-1"
                        >
                            <X />
                        </button>
                    )}
                </h2>

                <Formik
                    initialValues={initialValues || defaultValues}
                    validationSchema={schema}
                    enableReinitialize
                    onSubmit={onSubmit}
                >
                    {({ errors }) => (
                        <Form className="space-y-3">

                            {/* Username */}
                            <Field
                                name="username"
                                placeholder="Username"
                                className="w-full border px-3 py-2 rounded"
                            />
                            {errors.username && (
                                <p className="text-red-500 text-sm">{errors.username}</p>
                            )}

                            {/* Email */}
                            <Field
                                name="email"
                                type="email"
                                placeholder="Email"
                                className="w-full border px-3 py-2 rounded"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm">{errors.email}</p>
                            )}

                            {/* Password */}
                            <Field
                                name="password"
                                type="password"
                                placeholder={mode === "create" ? "Password" : "New Password (optional)"}
                                className="w-full border px-3 py-2 rounded"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm">{errors.password}</p>
                            )}

                            {/* Role (ADMIN ONLY) */}
                            {isAdmin && mode === "create" && (
                                <>
                                    <Field
                                        as="select"
                                        name="role"
                                        className="w-full border px-3 py-2 rounded"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </Field>
                                </>
                            )}

                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                            >
                                {mode === "create" ? "Register" : "Update"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}
