// pages/_app.tsx
import "regenerator-runtime/runtime";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ParentModeProvider } from "../app/context/ParentModeContext";
import GlobalLayout from "./components/GlobalLayout"; // Adjust the path if needed

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ParentModeProvider>
      <GlobalLayout> {/* Wrap the app with GlobalLayout */}
        <Component {...pageProps} />
      </GlobalLayout>
    </ParentModeProvider>
  );
}

export default MyApp;
