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
        <div className="flex justify-center mt-8">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {mode === "create" ? "Register User" : "Update User"}
                    </h2>

                    {mode === "update" && (
                        <button
                            onClick={onClose}
                            className="p-1 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                <Formik
                    initialValues={initialValues || defaultValues}
                    validationSchema={schema}
                    enableReinitialize
                    onSubmit={onSubmit}
                >
                    {({ errors, touched }) => (
                        <Form className="space-y-4">
                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <Field
                                    name="username"
                                    placeholder="Enter username"
                                    className={`w-full rounded-lg border px-3 py-2 text-sm
                    focus:outline-none focus:ring-1
                    ${errors.username && touched.username
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-indigo-500"
                                        }`}
                                />
                                {errors.username && touched.username && (
                                    <p className="mt-1 text-xs text-red-500">{errors.username}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <Field
                                    name="email"
                                    type="email"
                                    placeholder="Enter email address"
                                    className={`w-full rounded-lg border px-3 py-2 text-sm
                    focus:outline-none focus:ring-1
                    ${errors.email && touched.email
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-indigo-500"
                                        }`}
                                />
                                {errors.email && touched.email && (
                                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {mode === "create" ? "Password" : "New Password"}
                                </label>
                                <Field
                                    name="password"
                                    type="password"
                                    placeholder={
                                        mode === "create"
                                            ? "Enter password"
                                            : "Leave blank to keep existing"
                                    }
                                    className={`w-full rounded-lg border px-3 py-2 text-sm
                                            focus:outline-none focus:ring-1
                                            ${errors.password && touched.password
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-indigo-500"
                                        }`}
                                />
                                {errors.password && touched.password && (
                                    <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                                )}
                            </div>

                            {/* Role (ADMIN ONLY) */}
                            {isAdmin && mode === "create" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Role
                                    </label>
                                    <Field
                                        as="select"
                                        name="role"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white
                               focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </Field>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end gap-2 pt-2">
                                {mode === "update" && (
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-sm rounded-lg border border-gray-300
                               text-gray-700 hover:bg-gray-100 transition"
                                    >
                                        Cancel
                                    </button>
                                )}

                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white
                             hover:bg-indigo-700 transition"
                                >
                                    {mode === "create" ? "Register User" : "Update User"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}
