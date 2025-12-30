import Header from "@/components/Header";
import { useAppSelector } from "@/redux/hooks";
import { subscribeUser } from "@/utils/push";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      if (user)
        subscribeUser(user.id);
    }
  }, [user]);

  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}
