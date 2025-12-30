import { paginationDataType } from "@/components/Pagination";
import { DELETE, GET, PATCH, POST } from "@/utils/axiosInstance";

export type ItemType = {
    id: number;
    name: string;
    brand: string;
    sub_category_id: number,
    category_id: number,
    subCategoryName: string;
    categoryName: string;
    stock: number;
};

export interface FilterType {
    name: string,
    category_id: string,
    sub_category_id: string,
    minStock: string,
    maxStock: string
}

export interface ItemParamsType extends Partial<FilterType> {
    page?: number;
    limit?: number;
}

export type ItemFormType = {
    name: string;
    brand: string;
    category_id: number | null;
    sub_category_id: number | null;
    stock: number;
}

type ItemResponseType = {
    items: ItemType[];
    pagination: paginationDataType;
};

export const fetchItems = (params: ItemParamsType) => GET<ItemResponseType>("/item", { params });

export const createItem = (data: unknown) => POST("/item", data);

export const updateItem = (id: number, data: unknown) =>
    PATCH(`/item/${id}`, data);

export const deleteItem = (id: number) =>
    DELETE(`/item/${id}`);

export const buyItem = (id: number, quantity: number) =>
    PATCH(`/item/stock/${id}`, { quantity });
