'use client'

import { deleteItem, ItemType, updateItem } from '../services/item'
import { useState } from 'react'
import ItemForm from './ItemForm'

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
    onBuy,
}: ItemTableProps) {
    // quantity per itemId
    const [quantities, setQuantities] = useState<Record<number, number>>({})
    const [editingItem, setEditingItem] = useState<ItemType | null>(null)

    const increaseStock = (id: number, existingQuantity: number) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: Math.min((prev[id] || 0) + 1, 100 - existingQuantity),
        }))
    }

    const increase = (id: number, max: number) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: Math.min((prev[id] || 0) + 1, max),
        }))
    }

    const decrease = (id: number) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: Math.max((prev[id] || 1) - 1, 0),
        }))
    }

    const handleBuy = (id: number, quantity: number) => {
        if (onBuy)
            onBuy(id, quantity)
        setQuantities((prev) => ({
            ...prev,
            [id]: 0,
        }))
    }

    const restock = async (id: number, existingQuantity: number, quantity: number) => {
        await updateItem(id, { stock: existingQuantity + quantity })
        if (onRestock) {
            await onRestock(id)
        }
        setQuantities((prev) => ({
            ...prev,
            [id]: 0,
        }))
    }

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
                        <th className="p-2 border">Stock</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {items.map((item: ItemType) => {
                        const qty = quantities[item.id] || 0

                        return (
                            <tr key={item.id} className="text-center">
                                <td className="border p-2">{item.name}</td>
                                <td className="border p-2">{item.brand}</td>
                                <td className="border p-2">{item.categoryName}</td>
                                <td className="border p-2">{item.subCategoryName}</td>
                                <td className="border p-2">{item.stock}</td>

                                <td className="border p-2 text-center">
                                    {isAdmin ? (
                                        <div className="flex flex-col items-center gap-3">

                                            {/* Quantity Selector (for custom restock) */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => decrease(item.id)}
                                                    disabled={qty <= 0 || item.stock === 0}
                                                    className="w-8 h-8 flex items-center justify-center border rounded disabled:opacity-40"
                                                >
                                                    −
                                                </button>

                                                <span className="w-10 text-center font-medium">
                                                    {qty}
                                                </span>

                                                <button
                                                    onClick={() => increaseStock(item.id, item.stock)}
                                                    disabled={qty >= 100 || item.stock === 100 || 100 - item.stock === qty}
                                                    className="w-8 h-8 flex items-center justify-center border rounded disabled:opacity-40"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() => restock(item.id, item.stock, qty)}
                                                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-40"
                                                    disabled={qty === 0}
                                                >
                                                    Restock
                                                </button>
                                            </div>

                                            {/* Admin Actions */}
                                            <div className="flex flex-wrap justify-center gap-2">
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
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => decrease(item.id)}
                                                disabled={qty <= 0}
                                                className="w-8 h-8 flex items-center justify-center border rounded disabled:opacity-40"
                                            >
                                                −
                                            </button>

                                            <span className="w-8 text-center font-medium">{qty}</span>

                                            <button
                                                onClick={() => increase(item.id, item.stock)}
                                                disabled={qty >= item.stock}
                                                className="w-8 h-8 flex items-center justify-center border rounded disabled:opacity-40"
                                            >
                                                +
                                            </button>

                                            <button
                                                onClick={() => handleBuy(item.id, qty)}
                                                disabled={item.stock === 0}
                                                className="ml-2 bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-40"
                                            >
                                                Buy
                                            </button>
                                        </div>
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
                    }}
                    onSubmit={async (values) => {
                        await updateItem(editingItem.id, values)
                        setEditingItem(null)
                        if (onRestock) await onRestock(editingItem.id)
                    }}
                    onClose={() => setEditingItem(null)}
                />
            )}

        </div>
    )
}
