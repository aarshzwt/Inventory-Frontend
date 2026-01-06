import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { fetchItemById, ItemType } from "@/services/item"
import { useAppSelector } from "@/redux/hooks"
import { showSuccessToast } from "@/components/toast"
import { addToCart } from "@/services/cart"

export default function ItemDetailPage() {
    const router = useRouter()
    const { id } = router.query

    const { user } = useAppSelector((state) => state.auth)

    const [item, setItem] = useState<ItemType | null>(null)
    const [loading, setLoading] = useState(true)
    const [qty, setQty] = useState(0)
    const [buying, setBuying] = useState(false)

    useEffect(() => {
        if (!router.isReady || !id) return

        const getItem = async () => {
            try {
                const res = await fetchItemById(Number(id))
                setItem(res.item)
                setQty(0)
            } catch {

            } finally {
                setLoading(false)
            }
        }

        getItem()
    }, [router.isReady, id])

    const increase = () => {
        if (!item) return
        setQty((prev) => Math.min(prev + 1, item.stock))
    }

    const decrease = () => {
        setQty((prev) => Math.max(prev - 1, 0))
    }

    const handleAddToCart = async () => {
        if (!item || qty <= 0 || qty > item.stock) return

        try {
            setBuying(true)
            await addToCart(item.id, qty)
            setQty(0)
            showSuccessToast("Item added to cart")
        } catch {

        } finally {
            setBuying(false)
        }
    }


    if (loading) {
        return <p className="p-6">Loading...</p>
    }

    if (!item) {
        return <p className="p-6 text-red-500">Item not found</p>
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">

                    {/* IMAGE SECTION */}
                    {item.image && (
                        <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={item.image}
                                alt={item.name}
                                className="rounded-lg object-contain max-h-80 w-full"
                            />
                        </div>
                    )}

                    {/* DETAILS SECTION */}
                    <div className="flex flex-col space-y-4">

                        {/* Title */}
                        <h1 className="text-3xl font-semibold text-gray-900">
                            {item.name}
                        </h1>

                        {/* Brand & Category */}
                        <div className="flex flex-wrap gap-2 text-sm">
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                                {item.brand}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                                {item.categoryName}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                                {item.subCategoryName}
                            </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 leading-relaxed">
                            {item.description}
                        </p>

                        {/* Price */}
                        <div className="text-2xl font-bold text-gray-900">
                            ${item.price}
                        </div>

                        {/* Stock (Admin Only) */}
                        {user?.role === "admin" && (
                            <div>
                                <span className="text-sm font-medium mr-2">
                                    Stock:
                                </span>
                                <span
                                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${item.stock === 0
                                        ? "bg-red-100 text-red-700"
                                        : "bg-green-100 text-green-700"
                                        }`}
                                >
                                    {item.stock === 0 ? "Out of stock" : item.stock}
                                </span>
                            </div>
                        )}

                        {user?.role === "admin" && (
                            <>
                                {/* BUY SECTION */}
                                <div className="border-t pt-5 space-y-4">

                                    <label className="block text-sm font-medium text-gray-700">
                                        Quantity
                                    </label>

                                    <div className="flex items-center gap-3">

                                        {/* Decrease */}
                                        <button
                                            onClick={decrease}
                                            disabled={qty <= 0 || user?.role === "admin"}
                                            className="w-9 h-9 border rounded-lg flex items-center justify-center
                                disabled:opacity-40 hover:bg-gray-100 transition"
                                        >
                                            −
                                        </button>

                                        {/* Input */}
                                        <input
                                            type="number"
                                            min={0}
                                            max={item.stock}
                                            value={qty}
                                            onChange={(e) => {
                                                const value = Number(e.target.value)
                                                if (value >= 0 && value <= item.stock) {
                                                    setQty(value)
                                                }
                                            }}
                                            className="w-20 text-center border rounded-lg py-1.5
                                focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />

                                        {/* Increase */}
                                        <button
                                            onClick={increase}
                                            disabled={qty >= item.stock || user?.role === "admin"}
                                            className="w-9 h-9 border rounded-lg flex items-center justify-center
                                disabled:opacity-40 hover:bg-gray-100 transition"
                                        >
                                            +
                                        </button>

                                        {/* Add to Cart */}
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={
                                                buying ||
                                                qty === 0 ||
                                                item.stock === 0 ||
                                                qty > item.stock ||
                                                user?.role === "admin"
                                            }
                                            className="ml-3 bg-blue-600 text-white px-6 py-2 rounded-lg
                                font-medium hover:bg-blue-700 transition
                                disabled:opacity-40 disabled:hover:bg-blue-600"
                                        >
                                            {buying ? "Adding..." : "Add to Cart"}
                                        </button>
                                    </div>

                                    {/* Subtotal */}
                                    {qty > 0 && (
                                        <p className="text-sm text-gray-600">
                                            Subtotal:{" "}
                                            <strong className="text-gray-900">
                                                ${Number(item.price) * qty}
                                            </strong>
                                        </p>
                                    )}

                                    {/* Sold Out */}
                                    {item.stock === 0 && (
                                        <p className="text-sm text-red-500 font-medium">
                                            Sold Out
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
