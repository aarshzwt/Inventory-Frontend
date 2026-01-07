import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import {
    getCart,
    updateCartItem,
    removeCartItem,
    checkoutCart,
    CartItemType,
    getGuestCart,
    saveGuestCart,
} from "@/services/cart"
import { showErrorToast, showSuccessToast } from "@/components/toast"
import { useAppSelector } from "@/redux/hooks"

export default function CartPage() {
    const router = useRouter()

    const { user, isLoggedIn } = useAppSelector((state) => state.auth)
    const isGuestUser = !user && !isLoggedIn
    const [items, setItems] = useState<CartItemType[]>([])
    const [loading, setLoading] = useState(true)
    const [checkingOut, setCheckingOut] = useState(false)
    const [orderSummary, setOrderSummary] = useState<CartItemType[] | null>(null)
    const [orderTotal, setOrderTotal] = useState<number>(0)

    const loadCart = async () => {
        try {
            setLoading(true)
            if (isGuestUser) {
                const cart = getGuestCart();
                setItems(cart)
            } else {
                const res = await getCart()
                setItems(res.cart?.items || [])
            }
        } catch {

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCart()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const changeQty = async (cartItemId: number, qty: number, max: number) => {
        if (qty < 1 || qty > max) return
        if (isGuestUser) {
            const cart = getGuestCart();
            const updatedCart = cart.map((item: { id: number }) =>
                item.id === cartItemId
                    ? { ...item, quantity: qty }
                    : item
            )
            saveGuestCart(updatedCart)
            setItems(updatedCart)
            return
        }
        await updateCartItem(cartItemId, qty)
        loadCart()
    }


    const removeItem = async (cartItemId: number) => {
        if (isGuestUser) {
            const cart = getGuestCart();
            const updatedCart = cart.filter(
                (item: { id: number }) => item.id !== cartItemId
            )
            saveGuestCart(updatedCart)
            setItems(updatedCart)
            showSuccessToast("Item removed from cart")
            return
        }
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
        if (!isLoggedIn && user === null) {
            showErrorToast("Login to proceed with Checkout process")
            router.push("/login?redirect=/cart")
            return
        }
        try {
            setCheckingOut(true)
            await checkoutCart()
            setOrderSummary(items)
            setOrderTotal(totalPrice)
            showSuccessToast("Order placed successfully")
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
    if (orderSummary) {
        return (
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                <h1 className="text-2xl font-semibold text-green-700">
                    Order Confirmed 🎉
                </h1>

                <div className="border rounded-lg overflow-hidden bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-3">Item</th>
                                <th className="text-center p-3">Qty</th>
                                <th className="text-right p-3">Price</th>
                                <th className="text-right p-3">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderSummary.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="p-3">
                                        <div className="font-medium">
                                            {item.item_name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {item.category_name} →{" "}
                                            {item.sub_category_name}
                                        </div>
                                    </td>
                                    <td className="text-center p-3">
                                        {item.quantity}
                                    </td>
                                    <td className="text-right p-3">
                                        ${item.price}
                                    </td>
                                    <td className="text-right p-3 font-semibold">
                                        ${Number(item.price) * item.quantity}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end">
                    <div className="text-lg font-semibold">
                        Total:{" "}
                        <span className="text-green-700">
                            ${orderTotal}
                        </span>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={() => router.push("/")}
                        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                    >
                        Continue Shopping
                    </button>
                </div>
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
                        className="flex flex-col md:flex-row gap-4 border rounded-lg p-4 bg-white shadow-sm"
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
                            <h3 className="font-semibold text-lg">{item.item_name}</h3>
                            <p className="text-sm text-gray-600">
                                {item.category_name} → {item.sub_category_name}
                            </p>
                            <p className="text-sm text-gray-600">
                                Brand: {item.item_brand}
                            </p>
                            <p className="text-sm text-gray-700">
                                Price: <span className="font-semibold">${item.price}</span>
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
                        <div className="flex items-center font-semibold text-lg text-green-700">
                            ${Number(item.price) * item.quantity}
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="flex justify-end sticky bottom-0 md:static bg-white">
                <div className="w-full max-w-sm border rounded-lg p-5 bg-gray-50 space-y-4 shadow-sm">
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
