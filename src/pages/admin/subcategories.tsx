import { useEffect, useState } from "react"
import {
  createSubCategory,
  deleteSubCategory,
  fetchSubCategories,
  SubCategory,
  updateSubCategory,
} from "@/services/category"
import SubCategoryForm from "@/components/SubCategoryForm"

export default function AdminSubCategoriesPage() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [editingSubCategory, setEditingSubCategory] =
    useState<SubCategory | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadSubCategories = async () => {
    try {
      setLoading(true)
      const res = await fetchSubCategories()
      setSubCategories(res.subCategories || [])
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubCategories()
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Sub Categories
        </h1>

        <button
          onClick={() => setShowCreate((p) => !p)}
          className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
        >
          {showCreate ? "Close" : "+ Create Sub Category"}
        </button>
      </div>

      {/* CREATE FORM */}
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
                  Loading sub-categories...
                </td>
              </tr>
            )}

            {!loading &&
              subCategories.map((sc) => (
                <tr
                  key={sc.id}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-gray-500">
                    #{sc.id}
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-900">
                    {sc.name}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setEditingSubCategory(sc)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={async () => {
                          await deleteSubCategory(sc.id)
                          loadSubCategories()
                        }}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && subCategories.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No sub-categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT FORM */}
      {editingSubCategory && (
        <SubCategoryForm
          mode="update"
          initialValues={{
            name: editingSubCategory.name,
            category_id: editingSubCategory.category_id,
          }}
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
