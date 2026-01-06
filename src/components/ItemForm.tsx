/* eslint-disable @typescript-eslint/no-explicit-any */

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

const getSchema = (mode: "create" | "update") =>
  Yup.object({
    name: Yup.string().required("Name is required"),
    category_id: Yup.number().required("Category is required"),
    sub_category_id: Yup.number().required("Sub category is required"),
    brand: Yup.string().required("Brand is required"),
    stock: Yup.number().min(1).max(100),
    price: Yup.number().min(1),
    description: Yup.string().required("Description is required"),
    image:
      mode === "create"
        ? Yup.mixed()
          .required("Image is required")
          .test("fileSize", "Image must be less than 2MB", (value: any) =>
            value ? value.size <= 2 * 1024 * 1024 : true
          )
          .test("fileType", "Only JPG/PNG allowed", (value: any) =>
            value
              ? ["image/jpeg", "image/jpg", "image/png"].includes(value.type)
              : true
          )
        : Yup.mixed().notRequired(),
  })

export default function ItemForm({
  mode,
  role,
  initialValues,
  onSubmit,
  onClose,
}: Props) {
  const isAdmin = role === "admin"

  const defaultValues: ItemFormType = {
    name: "",
    brand: "",
    category_id: null,
    sub_category_id: null,
    stock: 0,
    image: null,
    price: 0,
    description: "",
  }

  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<Category[]>([])
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
      .then((res) => res.categories && setCategories(res.categories))
      .catch(() => { })
  }, [])


  useEffect(() => {
    if (initialValues?.category_id) {
      fetchSubCategories(initialValues.category_id)
        .then((res) => res.subCategories && setSubCategories(res.subCategories))
        .catch(() => { })
    }
  }, [initialValues?.category_id])


  useEffect(() => {
    if (mode === "update" && initialValues?.image) {
      if (typeof initialValues.image === "string") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPreview(initialValues.image)
      } else if (initialValues.image instanceof File) {
        setPreview(URL.createObjectURL(initialValues.image))
      }
    }
  }, [mode, initialValues])


  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleFiles = (
    files: FileList | null,
    setFieldValue: any
  ) => {
    if (files && files[0]) {
      const file = files[0]
      setFieldValue("image", file)
      setPreview(URL.createObjectURL(file))
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800">
            {mode === "create" ? "Create Item" : "Update Item"}
          </h2>

          {mode === "update" && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-gray-500 hover:bg-gray-100 transition"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <Formik
          initialValues={initialValues || defaultValues}
          validationSchema={getSchema(mode)}
          enableReinitialize
          onSubmit={onSubmit}
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <Field
                  name="name"
                  className={`w-full rounded-lg border px-3 py-2 text-sm
                    focus:outline-none focus:ring-1
                    ${errors.name && touched.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                    }`}
                />
                {errors.name && touched.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Field
                  name="description"
                  as="textarea"
                  rows={3}
                  className={`w-full rounded-lg border px-3 py-2 text-sm
                    focus:outline-none focus:ring-1
                    ${errors.description && touched.description
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                    }`}
                />
                {errors.description && touched.description && (
                  <p className="mt-1 text-xs text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Brand & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <Field
                    name="brand"
                    className={`w-full rounded-lg border px-3 py-2 text-sm
                    focus:outline-none focus:ring-1
                    ${errors.brand && touched.brand
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-indigo-500"
                      }`}
                  />
                  {errors.brand && touched.brand && (
                    <p className="mt-1 text-xs text-red-500">{errors.brand}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <Field
                    name="price"
                    type="number"
                    min={0}
                    className={`w-full rounded-lg border px-3 py-2 text-sm
                    focus:outline-none focus:ring-1 ${errors.price && touched.price ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-indigo-500"
                      }`}
                  />
                  {errors.price && touched.price && (
                    <p className="mt-1 text-xs text-red-500">{errors.price}</p>
                  )}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <Field
                  as="select"
                  name="category_id"
                  className={`w-full rounded-lg border px-3 py-2 text-sm
                    focus:outline-none focus:ring-1
                    ${errors.category_id && touched.category_id
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                    }`}
                  onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
                    const categoryId = Number(e.target.value) || null
                    setFieldValue("category_id", categoryId)
                    setFieldValue("sub_category_id", null)

                    if (!categoryId) {
                      setSubCategories([])
                      return
                    }

                    const res = await fetchSubCategories(categoryId)
                    if (res.subCategories) setSubCategories(res.subCategories)
                  }}
                >
                  <option value="">Select Category</option>
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

              {/* Sub Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                <Field
                  as="select"
                  name="sub_category_id"
                  disabled={!values.category_id}
                  className={`w-full rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100
                    focus:outline-none focus:ring-1
                    ${errors.sub_category_id && touched.sub_category_id
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                    }`}
                >
                  <option value="">Select Sub Category</option>
                  {subCategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </Field>
                {errors.sub_category_id && touched.sub_category_id && (
                  <p className="mt-1 text-xs text-red-500">{errors.sub_category_id}</p>
                )}
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={(e) =>
                    handleFiles(e.target.files, setFieldValue)
                  }
                  className={`w-full rounded-lg border border-dashed px-3 py-2 text-sm disabled:bg-gray-100
                    focus:outline-none focus:ring-1
                    ${errors.image && touched.image
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                    }`}
                />
                {errors.image && touched.image && (
                  <p className="mt-1 text-xs text-red-500">{errors.image as string}</p>
                )}

                {preview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-3 h-24 w-24 object-cover rounded-lg border"
                  />
                )}
              </div>

              {/* Stock */}
              {isAdmin && (
                <div>
                  <label className="form-label">Stock</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFieldValue("stock", Math.max(values.stock - 1, 0))
                      }
                      className="stock-btn"
                    >
                      −
                    </button>

                    <Field
                      name="stock"
                      type="number"
                      className={`w-20 rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100
                    focus:outline-none focus:ring-1
                    ${errors.stock && touched.stock
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-indigo-500"
                        }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setFieldValue("stock", Math.min(values.stock + 1, 100))
                      }
                      className="stock-btn"
                    >
                      +
                    </button>
                  </div>
                  {errors.stock && touched.stock && (
                    <p className="mt-1 text-xs text-red-500">{errors.stock as string}</p>
                  )}
                </div>
              )}

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
                  {mode === "create" ? "Create Item" : "Update Item"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
