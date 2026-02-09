import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import Sitemap from "vite-plugin-sitemap";
import prerender from "vite-plugin-prerender";
import { createClient } from "@supabase/supabase-js";

// ------------------------------
// SLUG HELPER (SEO SAFE)
// ------------------------------
const slugify = (text: string) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

// ------------------------------
// PRERENDER ROUTES (SAFE ONLY)
// ------------------------------
const prerenderRoutes = [
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

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // ------------------------------
  // SITEMAP ROUTES
  // ------------------------------
  const dynamicRoutes: string[] = [...prerenderRoutes];

  console.log("📦 Generating sitemap: Connecting to Supabase…");

  try {
    if (env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY) {
      const supabase = createClient(
        env.VITE_SUPABASE_URL,
        env.VITE_SUPABASE_ANON_KEY
      );

      const { data: files, error } = await supabase
        .from("files")
        .select("id, file_name")
        .order("id", { ascending: false });

      if (!error && files) {
        const itemRoutes = files.map((file) => {
          const slug = slugify(file.file_name);
          return `/item/${file.id}/${slug}`;
        });

        dynamicRoutes.push(...itemRoutes);

        console.log(
          `✅ Sitemap: Added ${itemRoutes.length} item pages`
        );
      } else {
        console.error("⚠️ Supabase sitemap error:", error?.message);
      }
    } else {
      console.warn(
        "⚠️ Supabase ENV missing — skipping dynamic sitemap fetch"
      );
    }
  } catch (err) {
    console.error("❌ Sitemap fetch failed:", err);
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },

    plugins: [
      react(),

      // ✅ PRERENDER (SEO BOOST)
      prerender({
        staticDir: "dist",
        routes: prerenderRoutes,
        renderAfterTime: 3000, // wait for React hydration
      }),

      // ✅ SITEMAP
      Sitemap({
        hostname: "https://kaviarts.com",
        dynamicRoutes,
        readable: true,
      }),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    optimizeDeps: {
      include: ["fuse.js"],
    },

    build: {
      cssCodeSplit: true,
      sourcemap: false,

      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            ui: [
              "@radix-ui/react-slot",
              "lucide-react",
              "clsx",
              "tailwind-merge",
            ],
          },
        },
      },
    },
  };
});
