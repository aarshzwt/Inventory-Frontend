"use client";

import { useRouter } from "next/navigation";
import UserForm from "@/components/UserForm";
import { registerUser } from "@/services/user";

export default function RegisterPage() {
    const router = useRouter();

    return (
        <UserForm
            mode="create"
            role="user"
            onSubmit={async (values) => {
                await registerUser(values)
                router.push("/")
            }}
        />

    );
}
