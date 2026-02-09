import { ViteSSG } from "vite-plugin-ssg";
import App from "./App";
import routes from "./routes"; // your react-router config
import { HelmetProvider } from "react-helmet-async";

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app }) => {
    app.use(HelmetProvider);
  }
);
