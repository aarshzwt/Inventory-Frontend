import { DELETE, GET, PATCH, POST } from "@/utils/axiosInstance"

export type CartItemType = {
    id: number
    item_id: number
    item_name: string
    item_image: string | null
    item_brand: string
    category_name: string
    sub_category_name: string
    quantity: number
    price: number
    item_stock: number
}

export type Cart = {
    id: number;
    status: string;
    items: CartItemType[]
    createdAt: string
}

export type CartResponseType = {
    cart: Cart
}

export type AddToCartRespose = {
    message: string,
    item: CartItemType
}

export const addToCart = (itemId: number, quantity: number) =>
    POST<AddToCartRespose>("/cart", {
        item_id: itemId,
        quantity,
    })

export const getCart = () =>
    GET<CartResponseType>("/cart")

export const getOrderHistory = () =>
    GET<{ orders: Cart[] }>("/cart/orders")

export const updateCartItem = (cartItemId: number, quantity: number) =>
    PATCH(`/cart/${cartItemId}`, { quantity })

export const removeCartItem = (cartItemId: number) =>
    DELETE(`/cart/${cartItemId}`)

export const checkoutCart = () =>
    POST("/cart/checkout")

export const getGuestCart = () => {
    return JSON.parse(localStorage.getItem("guest_cart") || "[]")
}

export const saveGuestCart = (cart: unknown[]) => {
    localStorage.setItem("guest_cart", JSON.stringify(cart))
}

export const clearGuestCart = () => {
    localStorage.removeItem("guest_cart")
}
