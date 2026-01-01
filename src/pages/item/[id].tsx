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
        <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image */}
                {item.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={item.image}
                        alt={item.name}
                        className="rounded object-cover w-full max-h-80"
                    />
                )}

                {/* Details */}
                <div className="space-y-3">
                    <h1 className="text-2xl font-semibold">{item.name}</h1>

                    <p><strong>Description:</strong> {item.description}</p>
                    <p><strong>Brand:</strong> {item.brand}</p>
                    <p><strong>Category:</strong> {item.categoryName}</p>
                    <p><strong>Sub Category:</strong> {item.subCategoryName}</p>
                    <p><strong>Price:</strong> ${item.price}</p>
                    {user?.role === "admin" && (
                        <p>
                            <strong>Stock:</strong>{" "}
                            <span
                                className={
                                    item.stock === 0
                                        ? "text-red-600"
                                        : "text-green-600"
                                }
                            >
                                {item.stock}
                            </span>
                        </p>
                    )}

                    {/* BUY SECTION – USER ONLY */}
                    {item && (
                        <>
                            {/* ADD TO CART – USER ONLY */}
                            <div className="border-t pt-4 space-y-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Quantity
                                </label>

                                <div className="flex items-center gap-3">
                                    {/* Decrease */}
                                    <button
                                        onClick={decrease}
                                        disabled={qty <= 0}
                                        className="w-8 h-8 border rounded flex items-center justify-center
                                        disabled:opacity-40 hover:bg-gray-100"
                                    >
                                        −
                                    </button>

                                    {/* Manual Input */}
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
                                        className="w-16 text-center border rounded py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />

                                    {/* Increase */}
                                    <button
                                        onClick={increase}
                                        disabled={qty >= item.stock}
                                        className="w-8 h-8 border rounded flex items-center justify-center
                                        disabled:opacity-40 hover:bg-gray-100"
                                    >
                                        +
                                    </button>

                                    {/* Add to cart */}
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={
                                            buying ||
                                            qty === 0 ||
                                            item.stock === 0 ||
                                            qty > item.stock
                                        }
                                        className="ml-2 bg-blue-600 text-white px-4 py-1.5 rounded
                                        hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600"
                                    >
                                        {buying ? "Adding..." : "Add to Cart"}
                                    </button>
                                </div>

                                {/* Price preview */}
                                {qty > 0 && (
                                    <p className="text-sm text-gray-600">
                                        Subtotal:{" "}
                                        <strong className="text-gray-900">
                                            ${Number(item.price) * qty}
                                        </strong>
                                    </p>
                                )}

                                {item.stock === 0 && (
                                    <p className="text-red-500 text-sm">Sold Out!</p>
                                )}

                                {/* {qty === item.stock && (
                                    <p className="text-red-500 text-sm">
                                        No more stock available
                                    </p>
                                )} */}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
