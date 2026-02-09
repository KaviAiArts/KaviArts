import React from "react";
import ReactDOM from "react-dom/client";
import { ViteSSG } from "vite-plugin-ssg";
import App from "./App";
import "./index.css";

export const createApp = ViteSSG(
  App,
  { routes: [] },
  ({ app }) => {
    // no helmet provider – SSR safe
  }
);

if (typeof window !== "undefined") {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
