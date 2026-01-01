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
}

export type CartResponseType = {
    cart: Cart
}

export const addToCart = (itemId: number, quantity: number) =>
    POST("/cart", {
        item_id: itemId,
        quantity,
    })

export const getCart = () =>
    GET<CartResponseType>("/cart")

export const updateCartItem = (cartItemId: number, quantity: number) =>
    PATCH(`/cart/${cartItemId}`, { quantity })

export const removeCartItem = (cartItemId: number) =>
    DELETE(`/cart/${cartItemId}`)

export const checkoutCart = () =>
    POST("/cart/checkout")

