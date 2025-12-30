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
      .catch(() => {})
  }, [])

  return (
    <div className="bg-white shadow rounded p-4 mb-6 w-full max-w-md">
      <h2
        className={`text-lg font-semibold mb-3 ${
          mode === "update" ? "flex justify-between items-center" : ""
        }`}
      >
        {mode === "create" ? "Create Sub Category" : "Update Sub Category"}
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
            <Field
              name="name"
              placeholder="Sub Category Name"
              className="w-full border px-3 py-2 rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}

            <Field
              as="select"
              name="category_id"
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Field>
            {errors.category_id && (
              <p className="text-red-500 text-sm">{errors.category_id}</p>
            )}

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {mode === "create" ? "Create" : "Update"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
