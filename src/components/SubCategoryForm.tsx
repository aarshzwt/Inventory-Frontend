import { Category, fetchCategories } from "@/services/category"
import { Formik, Form, Field } from "formik"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import * as Yup from "yup"

export type SubCategoryFormType = {
  name: string
  category_id: number | null
}

type Props = {
  mode: "create" | "update"
  initialValues?: SubCategoryFormType
  onSubmit: (values: SubCategoryFormType) => void
  onClose: () => void
}

const schema = Yup.object({
  name: Yup.string().required("Sub category name is required"),
  category_id: Yup.number().required("Category is required"),
})

export default function SubCategoryForm({
  mode,
  initialValues,
  onSubmit,
  onClose,
}: Props) {
  const defaultValues: SubCategoryFormType = {
    name: "",
    category_id: null,
  }

  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchCategories()
      .then((res) => res.categories && setCategories(res.categories))
      .catch(() => { })
  }, [])

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800">
          {mode === "create" ? "Create Sub Category" : "Update Sub Category"}
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
            {/* Sub Category Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub Category Name
              </label>
              <Field
                name="name"
                placeholder="Enter sub category name"
                className={`w-full rounded-lg border px-3 py-2 text-sm
                  focus:outline-none focus:ring-1
                  ${errors.name && touched.name ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"}`}
              />
              {errors.name && touched.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <Field
                as="select"
                name="category_id"
                className={`w-full rounded-lg border px-3 py-2 text-sm bg-white
                  focus:outline-none focus:ring-1
                  ${errors.category_id && touched.category_id ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"}`}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Field>
              {errors.category_id && touched.category_id && (
                <p className="mt-1 text-xs text-red-500">{errors.category_id}</p>
              )}
            </div>

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
                {mode === "create" ? "Create Sub Category" : "Update Sub Category"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
