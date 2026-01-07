import { useRouter } from "next/router"

type NavButtonProps = {
  label: string
  path: string
}

function NavButton({ label, path }: NavButtonProps) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push(path)}
      className="px-3 py-1.5 rounded-md text-sm
                 hover:bg-gray-100 transition"
    >
      {label}
    </button>
  )
}

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { logout } from "@/redux/slices/authSlice"

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
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">

        {/* LOGO / BRAND */}
        <div
          className="font-semibold text-lg cursor-pointer"
          onClick={() => router.push("/")}
        >
          InventoryApp
        </div>

        {/* NAV */}
        <div className="flex items-center gap-2">

          {/* NOT LOGGED IN */}
          {!isLoggedIn && (
            <>
              <NavButton label="My Cart" path="/cart" />
              <NavButton label="Login" path="/login" />
              <NavButton label="Register" path="/register" />
            </>
          )}

          {/* LOGGED IN */}
          {isLoggedIn && (
            <>
              {/* USER NAV */}
              {user?.role === "user" && (
                <>
                  <NavButton label="Items" path="/user/items" />
                  <NavButton label="My Cart" path="/cart" />
                  <NavButton label="My Orders" path="/orders" />
                </>
              )}

              {/* ADMIN NAV */}
              {user?.role === "admin" && (
                <>
                  <span className="text-xs text-gray-400 mx-2">
                    Admin
                  </span>
                  <NavButton label="Users" path="/admin/users" />
                  <NavButton label="Items" path="/admin/items" />
                  <NavButton label="Categories" path="/admin/categories" />
                  <NavButton label="SubCategories" path="/admin/subcategories" />
                </>
              )}
            </>
          )}
        </div>

        {/* RIGHT ACTIONS */}
        {isLoggedIn && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {user?.email}
            </span>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-md text-sm
                         text-red-600 border border-red-200
                         hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
