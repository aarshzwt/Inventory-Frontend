'use client'

import { deleteItem, ItemType, updateItem } from '../services/item'
import { useState } from 'react'
import ItemForm from './ItemForm'
import { useRouter } from 'next/router'

type ItemTableProps = {
  items: ItemType[]
  isAdmin: boolean
  onDelete?: (id: number) => Promise<void>
  onRestock?: (id: number) => Promise<void>
  onBuy?: (itemId: number, quantity: number) => Promise<void>
}
export default function ItemTable({
  items,
  isAdmin,
  onDelete,
  onRestock,
}: ItemTableProps) {
  const router = useRouter()
  const [editingItem, setEditingItem] = useState<ItemType | null>(null)

  const restockMax = async (id: number) => {
    await updateItem(id, { stock: 100 })
    if (onRestock) await onRestock(id)
  }

  const handleDeleteItem = async (id: number) => {
    try {
      await deleteItem(id)
      if (onDelete) await onDelete(id)
    } catch {}
  }

  const stockBadge = (stock: number) => {
    if (stock === 0)
      return 'bg-red-100 text-red-700'
    if (stock < 10)
      return 'bg-orange-100 text-orange-700'
    return 'bg-green-100 text-green-700'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
      <table className="w-full min-w-225 text-sm">
        {/* HEADER */}
        <thead className="sticky top-0 bg-gray-50 border-b">
          <tr className="text-left text-gray-600">
            <th className="px-4 py-3 font-semibold">Item</th>
            <th className="px-4 py-3 font-semibold">Brand</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Sub Category</th>
            <th className="px-4 py-3 font-semibold">Price</th>
            {isAdmin && (
              <th className="px-4 py-3 font-semibold text-center">
                Stock
              </th>
            )}
            <th className="px-4 py-3 font-semibold text-center">
              Actions
            </th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {items.map(item => (
            <tr
              key={item.id}
              className="border-b last:border-none hover:bg-gray-50 transition"
            >
              <td className="px-4 py-3 font-medium text-gray-900">
                {item.name}
              </td>

              <td className="px-4 py-3 text-gray-500">
                {item.brand || '—'}
              </td>

              <td className="px-4 py-3">
                {item.categoryName}
              </td>

              <td className="px-4 py-3">
                {item.subCategoryName}
              </td>

              <td className="px-4 py-3 font-medium">
                ₹{Number(item.price).toFixed(2)}
              </td>

              {isAdmin && (
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${stockBadge(
                      item.stock
                    )}`}
                  >
                    {item.stock}
                  </span>
                </td>
              )}

              <td className="px-4 py-3">
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => router.push(`../item/${item.id}`)}
                    className="px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Details
                  </button>

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => setEditingItem(item)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => restockMax(item.id)}
                        disabled={item.stock === 100}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40"
                      >
                        Max
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {items.length === 0 && (
            <tr>
              <td
                colSpan={isAdmin ? 7 : 6}
                className="px-6 py-10 text-center text-gray-500"
              >
                No items found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* EDIT MODAL */}
      {editingItem && (
        <ItemForm
          mode="update"
          role="admin"
          initialValues={{
            name: editingItem.name,
            brand: editingItem.brand || '',
            category_id: editingItem.category_id,
            sub_category_id: editingItem.sub_category_id,
            stock: editingItem.stock,
            description: editingItem.description,
            price: Number(editingItem.price),
            image: editingItem.image,
          }}
          onSubmit={async values => {
            const formData = new FormData()
            formData.append('name', values.name)
            formData.append('brand', values.brand)
            formData.append('category_id', String(values.category_id))
            formData.append('sub_category_id', String(values.sub_category_id))
            formData.append('stock', String(values.stock))
            formData.append('description', values.description)
            formData.append('price', String(values.price))

            if (values.image instanceof File) {
              formData.append('image', values.image)
            }

            await updateItem(editingItem.id, formData)
            setEditingItem(null)
            if (onRestock) await onRestock(editingItem.id)
          }}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  )
}
