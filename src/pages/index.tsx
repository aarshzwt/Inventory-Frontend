import Router from "next/router";
import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";

export default function Home() {
  const { user, isLoggedIn } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!isLoggedIn || !user) Router.push("/user/items");
    else if (user.role === "admin") Router.push("/admin/items");
    else Router.push("/user/items");
  }, [isLoggedIn, user]);

  return null;
}
