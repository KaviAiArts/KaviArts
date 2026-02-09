import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import Sitemap from "vite-plugin-sitemap";
import { createClient } from "@supabase/supabase-js";

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // ------------------------------
  // STATIC ROUTES (SAFE FOR SSG)
  // ------------------------------
  const staticRoutes = [
    "/",
    "/about",
    "/terms",
    "/privacy",
    "/contact",
    "/app",
    "/category/wallpaper",
    "/category/ringtone",
    "/category/video",
  ];

  // ------------------------------
  // SITEMAP ROUTES
  // ------------------------------
  const sitemapRoutes: string[] = [...staticRoutes];

  console.log("📦 Sitemap: Fetching Supabase items…");

  try {
    if (env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY) {
      const supabase = createClient(
        env.VITE_SUPABASE_URL,
        env.VITE_SUPABASE_ANON_KEY
      );

      const { data } = await supabase
        .from("files")
        .select("id, file_name")
        .order("id", { ascending: false });

      if (data) {
        data.forEach((item) => {
          const slug = item.file_name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, "")
            .replace(/\-\-+/g, "-");

          sitemapRoutes.push(`/item/${item.id}/${slug}`);
        });

        console.log(`✅ Sitemap: ${data.length} item URLs added`);
      }
    }
  } catch (e) {
    console.warn("⚠️ Sitemap Supabase fetch skipped:", e);
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },

    plugins: [
      react(),

      // ✅ SITEMAP (SAFE)
      Sitemap({
        hostname: "https://kaviarts.com",
        dynamicRoutes: sitemapRoutes,
        readable: true,
      }),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    build: {
      cssCodeSplit: true,
      sourcemap: false,
    },
  };
});
