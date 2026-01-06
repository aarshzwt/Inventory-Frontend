import { Formik, Form, Field } from "formik"
import { X } from "lucide-react"
import * as Yup from "yup"

export type CategoryFormType = {
  name: string
}

type Props = {
  mode: "create" | "update"
  initialValues?: CategoryFormType
  onSubmit: (values: CategoryFormType) => void
  onClose: () => void
}

const schema = Yup.object({
  name: Yup.string().required("Category name is required"),
})

export default function CategoryForm({
  mode,
  initialValues,
  onSubmit,
  onClose,
}: Props) {
  const defaultValues: CategoryFormType = {
    name: "",
  }

  return (
    <div className="bg-white shadow rounded p-4 mb-6 w-full max-w-md">
      <h2
        className={`text-lg font-semibold mb-3 ${mode === "update" ? "flex justify-between items-center" : ""
          }`}
      >
        {mode === "create" ? "Create Category" : "Update Category"}
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
        {({ errors, touched }) => (
          <Form className="space-y-3">
            <Field
              name="name"
              placeholder="Category Name"
              className={`w-full rounded-lg border px-3 py-2 text-sm
                    focus:outline-none focus:ring-1
                    ${errors.name && touched.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
                }`}
            />
            {errors.name && touched.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
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
