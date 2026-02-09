import { ViteSSG } from "vite-ssg";
import App from "./App";
import "./index.css";

export const createApp = ViteSSG(
  App,
  {
    routes: [],
  },
  ({ app }) => {
    // ✅ NO HelmetProvider
    // ✅ NO SSR-unsafe libraries
  }
);
