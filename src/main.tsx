import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { HelmetProvider } from "react-helmet-async";
import { SpeedInsights } from "@vercel/speed-insights/react"; // ⚡ Performance
import { Analytics } from "@vercel/analytics/react";       // 📊 Visitor Views

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
    <SpeedInsights />
    <Analytics />
  </HelmetProvider>
);