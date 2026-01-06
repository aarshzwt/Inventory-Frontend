import { useEffect, useState } from "react"
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  Category,
} from "@/services/category"
import CategoryForm from "@/components/CategoryForm"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadCategories = async () => {
    try {
      setLoading(true)
      const res = await fetchCategories()
      setCategories(res.categories || [])
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Categories
        </h1>

        <button
          onClick={() => setShowCreate((p) => !p)}
          className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
        >
          {showCreate ? "Close" : "+ Create Category"}
        </button>
      </div>

      {/* CREATE FORM */}
      {showCreate && (
        <CategoryForm
          mode="create"
          onSubmit={async (values) => {
            await createCategory(values)
            setShowCreate(false)
            loadCategories()
          }}
          onClose={() => setShowCreate(false)}
        />
      )}

      {/* TABLE */}
      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full min-w-150 text-sm">
          <thead className="sticky top-0 bg-gray-50 border-b">
            <tr className="text-left text-gray-600">
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  Loading categories...
                </td>
              </tr>
            )}

            {!loading &&
              categories.map((c) => (
                <tr
                  key={c.id}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-gray-500">
                    #{c.id}
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-900">
                    {c.name}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setEditingCategory(c)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={async () => {
                          await deleteCategory(c.id)
                          loadCategories()
                        }}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && categories.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT FORM */}
      {editingCategory && (
        <CategoryForm
          mode="update"
          initialValues={{ name: editingCategory.name }}
          onSubmit={async (values) => {
            await updateCategory(editingCategory.id, values)
            setEditingCategory(null)
            loadCategories()
          }}
          onClose={() => setEditingCategory(null)}
        />
      )}
    </div>
  )
}
