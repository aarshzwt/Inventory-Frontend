import { paginationDataType } from "@/components/Pagination"
import { DELETE, GET, PATCH, POST } from "../utils/axiosInstance"

export type UserType = {
    id: number
    username: string
    email: string
    role: "admin" | "user"
    createdAt: string
    updatedAt: string
    deletedAt: string | null
}

export type PaginationType = {
    total: number
    page: number
    itemsPerPage: number
    totalPages: number
}

export interface UserParamsType {
    page?: number;
    limit?: number;
}

export type UserFormType = {
    username: string
    email: string
    password?: string
    role?: "admin" | "user"
}

type UserResponseType = {
    users: UserType[];
    pagination: paginationDataType;
};

export const fetchUsers = (params: UserParamsType) => GET<UserResponseType>("/user/all", { params });

export const registerUser = (data: unknown) =>
    POST(`/user/register`, data);

export const updateUser = (id: number, data: unknown) =>
    PATCH(`/user/${id}`, data);

export const deleteUser = (id: number) =>
    DELETE(`/user/${id}`);