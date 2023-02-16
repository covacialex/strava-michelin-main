import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { StateContext } from "../context/StateContext";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <StateContext>
        <Component {...pageProps} />
      </StateContext>
    </SessionProvider>
  );
}
