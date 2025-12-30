import { Category, fetchCategories, fetchSubCategories } from "../services/category"
import { ItemFormType } from "../services/item"
import { Formik, Form, Field } from "formik"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import * as Yup from "yup"

type Props = {
  mode: "create" | "update"
  role: "admin" | "user"
  initialValues?: ItemFormType
  onSubmit: (values: ItemFormType) => void
  onClose: () => void
}

const schema = Yup.object({
  name: Yup.string().required("Name is required"),
  category_id: Yup.number().required("Category is required"),
  sub_category_id: Yup.number().required("Sub category is required"),
  brand: Yup.string().optional(),
  stock: Yup.number().min(0).max(100),
})

export default function ItemForm({
  mode,
  role,
  initialValues,
  onSubmit,
  onClose
}: Props) {
  const isAdmin = role === "admin"

  const defaultValues: ItemFormType = {
    name: "",
    brand: "",
    category_id: null,
    sub_category_id: null,
    stock: 0,
  }

  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<Category[]>([])

  /* Load categories once */
  useEffect(() => {
    fetchCategories()
      .then((res) => res.categories && setCategories(res.categories))
      .catch(() => { })
  }, [])

  /* Load subcategories when editing existing item */
  useEffect(() => {
    if (initialValues?.category_id) {
      fetchSubCategories(initialValues.category_id)
        .then((res) => res.subCategories && setSubCategories(res.subCategories))
        .catch(() => { })
    }
  }, [initialValues?.category_id])

  return (
    <div className="bg-white shadow rounded p-4 mb-6">
      <h2 className={`text-lg font-semibold mb-3 ${mode === "update" ? "flex justify-between items-center" : ""}`}>
        {mode === "create" ? "Create Item" : "Update Item"}
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
        {({ errors, setFieldValue, values }) => (
          <Form className="space-y-3">

            {/* Name */}
            <Field
              name="name"
              placeholder="Item Name"
              className="w-full border px-3 py-2 rounded"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

            {/* Brand */}
            <Field
              name="brand"
              placeholder="Brand"
              className="w-full border px-3 py-2 rounded"
            />

            {/* Category */}
            <Field
              as="select"
              name="category_id"
              className="w-full border px-3 py-2 rounded"
              onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
                const categoryId = Number(e.target.value) || null

                setFieldValue("category_id", categoryId)
                setFieldValue("sub_category_id", null)

                if (!categoryId) {
                  setSubCategories([])
                  return
                }

                try {
                  const res = await fetchSubCategories(categoryId)
                  if (res.subCategories) setSubCategories(res.subCategories)
                } catch { }
              }}
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

            {/* Sub Category */}
            <Field
              as="select"
              name="sub_category_id"
              disabled={!values.category_id}
              className="w-full border px-3 py-2 rounded disabled:bg-gray-100"
            >
              <option value="">Select Sub Category</option>
              {subCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </Field>
            {errors.sub_category_id && (
              <p className="text-red-500 text-sm">{errors.sub_category_id}</p>
            )}

            {/* Stock (ADMIN ONLY) */}
            {isAdmin && (
              <>
                <Field
                  name="stock"
                  type="number"
                  min={0}
                  max={100}
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm">{errors.stock}</p>
                )}
              </>
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
