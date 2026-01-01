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
    stock: Yup.number().min(0).max(100),
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
        validationSchema={getSchema(mode)}
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

            <Field
              name="description"
              placeholder="Item Description"
              className="w-full border px-3 py-2 rounded"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

            {/* Brand */}
            <Field
              name="brand"
              placeholder="Brand"
              className="w-full border px-3 py-2 rounded"
            />
            {errors.brand && <p className="text-red-500 text-sm">{errors.brand}</p>}

            <Field
              name="price"
              type="number"
              min={0}
              className="w-20 text-center border px-2 py-1 rounded"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = Number(e.target.value)
                if (value >= 0) {
                  setFieldValue("price", value)
                }
              }}
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}


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

            {/* Image */}
            <div>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={(e) => handleFiles(e.target.files, setFieldValue)}
              />
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image as string}</p>
              )}

              {preview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-3 w-20 h-20 object-cover rounded border"
                />
              )}
            </div>

            {/* Stock (Admin Only) */}
            {isAdmin && (
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFieldValue("stock", Math.max((values.stock || 0) - 1, 0))
                    }
                    disabled={values.stock <= 0}
                    className="w-9 h-9 border rounded flex items-center justify-center disabled:opacity-40"
                  >
                    −
                  </button>

                  <Field
                    name="stock"
                    type="number"
                    min={0}
                    max={100}
                    className="w-20 text-center border px-2 py-1 rounded"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = Number(e.target.value)
                      if (value >= 0 && value <= 100) {
                        setFieldValue("stock", value)
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setFieldValue("stock", Math.min((values.stock || 0) + 1, 100))
                    }
                    disabled={values.stock >= 100}
                    className="w-9 h-9 border rounded flex items-center justify-center disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
                )}
              </div>
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
