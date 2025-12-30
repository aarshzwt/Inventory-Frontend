'use client'

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { logout } from "@/redux/slices/authSlice"
import { useRouter } from "next/router"

export default function Header() {
  const { isLoggedIn, isHydrated, user } = useAppSelector(
    (state) => state.auth
  )

  const router = useRouter()
  const dispatch = useAppDispatch()

  if (!isHydrated) return null

  const handleLogout = () => {
    dispatch(logout())
    router.push("/login")
  }

  return (
    <header className="flex items-center gap-4 p-4 border-b">

      {/* NOT LOGGED IN */}
      {!isLoggedIn && (
        <>
          <button onClick={() => router.push("/login")}>Login</button>
          <button onClick={() => router.push("/register")}>Register</button>
        </>
      )}

      {/* LOGGED IN */}
      {isLoggedIn && (
        <>
          {/* USER */}
          {user?.role === "user" && (
            <button onClick={() => router.push("/user/items")}>
              My Items
            </button>
          )}

          {/* ADMIN */}
          {user?.role === "admin" && (
            <>
              <button onClick={() => router.push("/admin/items")}>
                Admin Items
              </button>
              <button onClick={() => router.push("/admin/users")}>
                Admin Users
              </button>
            </>
          )}

          <button
            onClick={handleLogout}
            className="text-red-600"
          >
            Logout
          </button>
        </>
      )}
    </header>
  )
}
