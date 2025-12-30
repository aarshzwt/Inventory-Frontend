import "@/styles/globals.css";
import { Provider, useDispatch } from "react-redux";
import type { AppProps } from "next/app";
import { store } from "../redux/store";
import { useEffect } from "react";
import { hydrateAuth, login } from "../redux/slices/authSlice";
import ToastContainer from "@/components/toast";
import Layout from "./layout";

function AuthLoader() {
  const dispatch = useDispatch();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      dispatch(
        login({
          user: JSON.parse(storedUser),
          token: storedToken,
        })
      );
    } else {
      document.cookie = "role=; path=/; max-age=0;";
    }
    dispatch(hydrateAuth());
  }, [dispatch]);

  return null;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider store={store}>
        <AuthLoader />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
      <ToastContainer />
    </>
  );
}
