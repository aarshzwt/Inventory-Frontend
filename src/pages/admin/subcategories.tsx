import { useEffect, useState } from "react"
import {
  createSubCategory,
  deleteSubCategory,
  fetchSubCategories,
  SubCategory,
  updateSubCategory,
} from "@/services/category"
import SubCategoryForm from "@/components/SubCategoryForm"

export default function AdminCategoriesPage() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const loadSubCategories = async () => {
    const res = await fetchSubCategories()
    setSubCategories(res.subCategories || [])
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSubCategories()
  }, [])

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">Sub Categories</h1>
        <button
          onClick={() => setShowCreate((p) => !p)}
          className="px-4 py-2 rounded"
        >
          {showCreate ? "Close" : "+ Create Sub Category"}
        </button>
      </div>

      {showCreate && (
        <SubCategoryForm
          mode="create"
          onSubmit={async (values) => {
            await createSubCategory(values)
            setShowCreate(false)
            loadSubCategories()
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
          {subCategories.map((c) => (
            <tr key={c.id} className="text-center">
              <td className="border p-2">{c.id}</td>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => setEditingSubCategory(c)}
                  className="bg-indigo-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteSubCategory(c.id).then(loadSubCategories)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingSubCategory && (
        <SubCategoryForm
          mode="update"
          initialValues={{ name: editingSubCategory.name, category_id: editingSubCategory.category_id }}
          onSubmit={async (values) => {
            await updateSubCategory(editingSubCategory.id, values)
            setEditingSubCategory(null)
            loadSubCategories()
          }}
          onClose={() => setEditingSubCategory(null)}
        />
      )}
    </div>
  )
}
