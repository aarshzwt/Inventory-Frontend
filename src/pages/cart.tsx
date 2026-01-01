import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import {
    getCart,
    updateCartItem,
    removeCartItem,
    checkoutCart,
    CartItemType,
} from "@/services/cart"
import { showSuccessToast } from "@/components/toast"

export default function CartPage() {
    const router = useRouter()

    const [items, setItems] = useState<CartItemType[]>([])
    const [loading, setLoading] = useState(true)
    const [checkingOut, setCheckingOut] = useState(false)

    const loadCart = async () => {
        try {
            setLoading(true)
            const res = await getCart()
            setItems(res.cart?.items || [])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCart()
    }, [])

    const changeQty = async (cartItemId: number, qty: number, max: number) => {
        if (qty < 1 || qty > max) return
        await updateCartItem(cartItemId, qty)
        loadCart()
    }


    const removeItem = async (cartItemId: number) => {
        try {
            await removeCartItem(cartItemId)
            loadCart()
        } catch {

        }
    }

    const totalPrice = items?.reduce(
        (sum, i) => sum + Number(i.price) * i.quantity,
        0
    ) || 0

    const handleCheckout = async () => {
        try {
            setCheckingOut(true)
            await checkoutCart()
            showSuccessToast("Order placed successfully")
            router.push("/")
        } finally {
            setCheckingOut(false)
        }
    }

    if (loading) {
        return <p className="p-6">Loading cart...</p>
    }

    if (items.length === 0) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                <button
                    onClick={() => router.push("/")}
                    className="text-blue-600 hover:underline"
                >
                    Continue shopping
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Your Cart</h1>

            {/* Cart Items */}
            <div className="space-y-4">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex gap-4 border rounded p-4 bg-white"
                    >
                        {/* Image */}
                        {item.item_image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={item.item_image}
                                alt={item.item_name}
                                className="w-24 h-24 object-cover rounded"
                            />
                        )}

                        {/* Details */}
                        <div className="flex-1 space-y-1">
                            <h3 className="font-semibold">{item.item_name}</h3>
                            <p className="text-sm text-gray-600">
                                {item.category_name} → {item.sub_category_name}
                            </p>
                            <p className="text-sm text-gray-600">
                                Brand: {item.item_brand}
                            </p>
                            <p className="text-sm">
                                Price: <strong>${item.price}</strong>
                            </p>
                        </div>

                        {/* Quantity */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-1">
                                {/* Decrease */}
                                <button
                                    onClick={() =>
                                        changeQty(item.id, item.quantity - 1, item.item_stock)
                                    }
                                    disabled={item.quantity <= 1}
                                    className="w-8 h-8 border rounded disabled:opacity-40"
                                >
                                    −
                                </button>

                                {/* Manual Input */}
                                <input
                                    type="number"
                                    min={1}
                                    max={item.item_stock}
                                    value={item.quantity}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    onChange={(e) =>
                                        changeQty(
                                            item.id,
                                            Number(e.target.value),
                                            item.item_stock
                                        )
                                    }
                                    className="w-16 text-center border rounded py-1"
                                />

                                {/* Increase */}
                                <button
                                    onClick={() =>
                                        changeQty(item.id, item.quantity + 1, item.item_stock)
                                    }
                                    disabled={item.quantity >= item.item_stock}
                                    className="w-8 h-8 border rounded disabled:opacity-40"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-600 text-sm hover:underline"
                            >
                                Remove
                            </button>
                        </div>


                        {/* Subtotal */}
                        <div className="flex items-center font-semibold">
                            ${Number(item.price) * item.quantity}
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="flex justify-end">
                <div className="w-full max-w-sm border rounded p-4 bg-gray-50 space-y-3">
                    <div className="flex justify-between">
                        <span>Total</span>
                        <strong>${totalPrice}</strong>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={checkingOut}
                        className="w-full bg-green-600 text-white py-2 rounded
                       hover:bg-green-700 disabled:opacity-50"
                    >
                        {checkingOut ? "Processing..." : "Proceed to Checkout"}
                    </button>
                </div>
            </div>
        </div>
    )
}
