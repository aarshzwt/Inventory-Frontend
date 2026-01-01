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
    const [editingUser, setEditingUser] = useState<UserType | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false)

    const loadUsers = useCallback(async (
        page = pagination.page,
        limit = pagination.itemsPerPage
    ) => {
        try {
            setLoading(true)
            const res = await fetchUsers({ page, limit })
            setUsers(res.users)
            setPagination(res.pagination)
        } catch {
        } finally {
            setLoading(false)
        }
    }, [pagination.page, pagination.itemsPerPage])

    useEffect(() => {
        if (user?.role === "admin") {
            loadUsers()
        }
    }, [loadUsers, user])

    const handleDeleteUser = async (id: number) => {
        await deleteUser(id);
        loadUsers()
    }

    if (!isHydrated || loading) {
        return <p className="p-6">Loading...</p>
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-xl font-semibold">Users</h1>

                <button
                    onClick={() => setShowCreateForm((prev) => !prev)}
                    className="px-4 py-2 rounded hover:bg-primary-700"
                >
                    {showCreateForm ? "Close" : "+ Create user"}
                </button>
            </div>
            {/* Create Item Form */}
            {showCreateForm && (
                <UserForm
                    mode="create"
                    role="admin"
                    onSubmit={async (values) => {
                        await registerUser(values)
                        setShowCreateForm(false)
                        loadUsers();
                    }}
                    onClose={() => setEditingUser(null)}
                />
            )}
            <div className="overflow-x-auto border rounded">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Username</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Role</th>
                            <th className="p-2 border">Created</th>
                            <th className="p-2 border">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="text-center">
                                <td className="border p-2">{u.id}</td>
                                <td className="border p-2">{u.username}</td>
                                <td className="border p-2">{u.email}</td>
                                <td className="border p-2">
                                    <span
                                        className={`px-2 py-1 rounded text-sm capitalize ${u.role === "admin"
                                            ? "bg-purple-100 text-purple-700"
                                            : "bg-blue-100 text-blue-700"
                                            }`}
                                    >
                                        {u.role}
                                    </span>
                                </td>
                                <td className="border p-2">
                                    {new Date(u.createdAt).toLocaleDateString()}
                                </td>
                                <td className="border p-2">
                                    <div className="flex flex-wrap justify-center gap-2">
                                        <button
                                            onClick={() => setEditingUser(u)}
                                            className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDeleteUser(u.id)}
                                            disabled={u.id === user!.id}
                                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-40"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {users.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="p-4 text-center text-gray-500"
                                >
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
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

            {editingUser && (
                <div className="flex flex-wrap justify-center">
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
                            loadUsers();
                        }}
                        onClose={() => setEditingUser(null)}
                    />
                </div>
            )}
        </div>
    )
}
