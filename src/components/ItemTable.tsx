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
    const router = useRouter();
    // quantity per itemId
    const [editingItem, setEditingItem] = useState<ItemType | null>(null)

    const restockMax = async (id: number) => {
        await updateItem(id, { stock: 100 })
        if (onRestock) {
            await onRestock(id)
        }
    }

    const handleDeleteItem = async (id: number) => {
        try {
            await deleteItem(id)
            if (onDelete) {
                await onDelete(id)
            }
        } catch {

        }
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Brand</th>
                        <th className="p-2 border">Category</th>
                        <th className="p-2 border">Sub Category</th>
                        <th className="border p-2">price</th>
                        {isAdmin && (
                            <th className="p-2 border">Stock</th>
                        )}
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {items.map((item: ItemType) => {
                        return (
                            <tr key={item.id} className="text-center">
                                <td className="border p-2">{item.name}</td>
                                <td className="border p-2">{item.brand}</td>
                                <td className="border p-2">{item.categoryName}</td>
                                <td className="border p-2">{item.subCategoryName}</td>
                                <td className="border p-2">${item.price}</td>

                                {isAdmin && (
                                    <td className="border p-2">{item.stock}</td>
                                )}
                                <td className="border p-2 text-center">
                                    {isAdmin ? (
                                        <div className="flex flex-col items-center gap-3">
                                            {/* Admin Actions */}
                                            <div className="flex flex-wrap justify-center gap-2">
                                                <button
                                                    onClick={() => router.push(`../item/${item.id}`)}
                                                    className="ml-2 bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-40"
                                                >
                                                    Details
                                                </button>
                                                <button
                                                    onClick={() => setEditingItem(item)}
                                                    className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => restockMax(item.id)}
                                                    className="bg-emerald-700 text-white px-3 py-1 rounded text-sm disabled:opacity-40 hover:bg-emerald-800 "
                                                    disabled={item.stock === 100}
                                                >
                                                    Restock MAX
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </div>

                                        </div>
                                    ) : (
                                        /* USER VIEW */
                                        <>
                                            <div className="flex items-center justify-center gap-2">
                                                {/* Buy */}
                                                <button
                                                    onClick={() => router.push(`../item/${item.id}`)}
                                                    className="ml-2 bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-40"
                                                >
                                                    Details
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </td>

                            </tr>
                        )
                    })}

                    {items.length === 0 && (
                        <tr>
                            <td
                                colSpan={6}
                                className="p-4 text-center text-gray-500"
                            >
                                No items found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {editingItem && (
                <ItemForm
                    mode="update"
                    role="admin"
                    initialValues={{
                        name: editingItem.name,
                        brand: editingItem.brand || "",
                        category_id: editingItem.category_id,
                        sub_category_id: editingItem.sub_category_id,
                        stock: editingItem.stock,
                        description: editingItem.description,
                        price: Number(editingItem.price),
                        image: editingItem.image
                    }}
                    onSubmit={async (values) => {
                        const formData = new FormData()
                        formData.append("name", values.name)
                        formData.append("brand", values.brand)
                        formData.append("category_id", String(values.category_id))
                        formData.append("sub_category_id", String(values.sub_category_id))
                        formData.append("stock", String(values.stock))
                        formData.append("description", values.description)
                        formData.append("price", String(values.price))

                        // Append image ONLY if it's a File
                        if (values.image instanceof File) {
                            formData.append("image", values.image)
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
