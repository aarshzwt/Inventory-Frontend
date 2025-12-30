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

  const loadCategories = async () => {
    try {
      const res = await fetchCategories()
      setCategories(res.categories || [])
    } catch {

    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCategories()
  }, [])

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <button
          onClick={() => setShowCreate((p) => !p)}
          className="px-4 py-2 rounded"
        >
          {showCreate ? "Close" : "+ Create Category"}
        </button>
      </div>

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

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="text-center">
              <td className="border p-2">{c.id}</td>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => setEditingCategory(c)}
                  className="bg-indigo-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCategory(c.id).then(loadCategories)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td
                colSpan={3}
                className="p-4 text-center text-gray-500"
              >
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
