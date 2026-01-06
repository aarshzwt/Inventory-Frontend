import { useEffect, useState } from "react"
import { Cart, getOrderHistory } from "@/services/cart"

export default function OrdersPage() {
    const [orders, setOrders] = useState<Cart[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getOrderHistory()
                setOrders(res.orders)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    if (loading) {
        return <p className="p-6">Loading orders...</p>
    }

    if (orders.length === 0) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-semibold">
                    No previous orders
                </h2>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Order History</h1>

            {orders.map((order) => {
                const total = order.items.reduce(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (sum: number, i: any) =>
                        sum + Number(i.price) * i.quantity,
                    0
                )

                return (
                    <div
                        key={order.id}
                        className="border rounded-lg bg-white shadow-sm"
                    >
                        {/* Header */}
                        <div className="flex justify-between p-4 bg-gray-50 rounded-t-lg">
                            <span className="font-medium">
                                Order #{order.id}
                            </span>
                            <span className="text-sm text-gray-600">
                                {new Date(
                                    order.createdAt
                                ).toLocaleString()}
                            </span>
                        </div>

                        {/* Items */}
                        <div className="divide-y">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 p-4"
                                >
                                    {item.item_image && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={item.item_image}
                                            className="w-16 h-16 rounded object-cover"
                                            alt={item.item_name}
                                        />
                                    )}

                                    <div className="flex-1">
                                        <div className="font-medium">
                                            {item.item_name}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2 py-0.5 text-xs rounded-md bg-gray-100 text-gray-700">
                                                {item.category_name}
                                            </span>
                                            <span className="px-2 py-0.5 text-xs rounded-md bg-gray-100 text-gray-500">
                                                {item.sub_category_name}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-sm">
                                        {item.quantity} × $
                                        {item.price}
                                    </div>

                                    <div className="font-semibold">
                                        $
                                        {Number(item.price) *
                                            item.quantity}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end p-4 bg-gray-50 rounded-b-lg font-semibold">
                            Total: ${total}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
