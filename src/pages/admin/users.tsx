import { useCallback, useEffect, useState } from "react"
import { useAppSelector } from "@/redux/hooks"
import { UserType, PaginationType, fetchUsers, deleteUser, updateUser, registerUser } from "@/services/user"
import { Pagination } from "@/components/Pagination"
import UserForm from "@/components/UserForm"

export default function AdminUsersPage() {
    const { user, isHydrated } = useAppSelector((state) => state.auth)

    const [users, setUsers] = useState<UserType[]>([])
    const [pagination, setPagination] = useState<PaginationType>({
        page: 1,
        total: 0,
        itemsPerPage: 10,
        totalPages: 1,
    })
    const [loading, setLoading] = useState(true)
    const [editingUser, setEditingUser] = useState<UserType | null>(null)
    const [showCreateForm, setShowCreateForm] = useState(false)

    const loadUsers = useCallback(
        async (page = pagination.page, limit = pagination.itemsPerPage) => {
            try {
                setLoading(true)
                const res = await fetchUsers({ page, limit })
                setUsers(res.users)
                setPagination(res.pagination)
            } catch {
            } finally {
                setLoading(false)
            }
        },
        [pagination.page, pagination.itemsPerPage]
    )

    useEffect(() => {
        if (user?.role === "admin") {
            loadUsers()
        }
    }, [loadUsers, user])

    const handleDeleteUser = async (id: number) => {
        await deleteUser(id)
        loadUsers()
    }

    if (!isHydrated) return null

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-4">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Users
                </h1>

                <button
                    onClick={() => setShowCreateForm((prev) => !prev)}
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
                >
                    {showCreateForm ? "Close" : "+ Create User"}
                </button>
            </div>

            {/* CREATE FORM */}
            {showCreateForm && (
                <UserForm
                    mode="create"
                    role="admin"
                    onSubmit={async (values) => {
                        await registerUser(values)
                        setShowCreateForm(false)
                        loadUsers()
                    }}
                    onClose={() => setShowCreateForm(false)}
                />
            )}

            {/* TABLE */}
            <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full min-w-225 text-sm">
                    <thead className="sticky top-0 bg-gray-50 border-b">
                        <tr className="text-left text-gray-600">
                            <th className="px-4 py-3 font-semibold">ID</th>
                            <th className="px-4 py-3 font-semibold">Username</th>
                            <th className="px-4 py-3 font-semibold">Email</th>
                            <th className="px-4 py-3 font-semibold">Role</th>
                            <th className="px-4 py-3 font-semibold">Created</th>
                            <th className="px-4 py-3 font-semibold text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-10 text-center text-gray-500"
                                >
                                    Loading users...
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            users.map((u) => (
                                <tr
                                    key={u.id}
                                    className="border-b last:border-none hover:bg-gray-50 transition"
                                >
                                    <td className="px-4 py-3 text-gray-500">
                                        #{u.id}
                                    </td>

                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {u.username}
                                    </td>

                                    <td className="px-4 py-3 text-gray-600">
                                        {u.email}
                                    </td>

                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${u.role === "admin"
                                                ? "bg-purple-100 text-purple-700"
                                                : "bg-blue-100 text-blue-700"
                                                }`}
                                        >
                                            {u.role}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 text-gray-500">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => setEditingUser(u)}
                                                className="px-3 py-1.5 rounded-md text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDeleteUser(u.id)}
                                                disabled={user !== null && u.id === user!.id}
                                                className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-40"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                        {!loading && users.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-10 text-center text-gray-500"
                                >
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            {users.length !== 0 && (
                <Pagination
                    paginationData={pagination}
                    contentType="User"
                    onPageChange={(page) =>
                        loadUsers(page, pagination.itemsPerPage)
                    }
                    onPageSizeChange={(size) =>
                        loadUsers(1, size)
                    }
                />
            )}

            {/* EDIT FORM */}
            {editingUser && (
                <UserForm
                    mode="update"
                    role="admin"
                    initialValues={{
                        username: editingUser.username,
                        email: editingUser.email,
                    }}
                    onSubmit={async (values) => {
                        await updateUser(editingUser.id, values)
                        setEditingUser(null)
                        loadUsers()
                    }}
                    onClose={() => setEditingUser(null)}
                />
            )}
        </div>
    )
}
