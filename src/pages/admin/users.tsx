import { useCallback, useEffect, useState } from "react"
import { useAppSelector } from "@/redux/hooks"
import { UserType, PaginationType, fetchUsers, deleteUser, updateUser } from "@/services/user"
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
            <h1 className="text-2xl font-semibold mb-4">All Users</h1>

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
                                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
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
                                    colSpan={5}
                                    className="p-4 text-center text-gray-500"
                                >
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
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

            {/* Pagination */}
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
        </div>
    )
}
