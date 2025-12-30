import { POST } from "@/utils/axiosInstance";

export interface User {
    id: number;
    username: string;
    email: string;
    role: string
}
export interface AuthResponse {
    message: string;
    user: User;
    token: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
}

export const loginApi = (data: LoginPayload) =>
    POST<AuthResponse, LoginPayload>("/user/login", data);

export const registerApi = (data: RegisterPayload) =>
    POST<AuthResponse, RegisterPayload>("/user/register", data);
