/**
 * Bulletproof sitemap generator for Vercel + Vite + Supabase
 * - Never crashes build
 * - Handles missing env vars
 * - Handles Supabase errors
 * - Generates sitemap even if DB fails
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

/* ---------------------------------- */
/* Fix __dirname for ES modules        */
/* ---------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------------------------- */
/* Environment variables               */
/* ---------------------------------- */
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// ⚠️ CHANGE THIS TO YOUR REAL DOMAIN WHEN YOU BUY IT (e.g., https://kaviarts.com)
const SITE_URL = "https://kaviarts.com";

/* ---------------------------------- */
/* Helpers                             */
/* ---------------------------------- */


const makeSlug = (text) =>
  (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");


/* ---------------------------------- */
/* Main function                       */
/* ---------------------------------- */
async function generateSitemap() {
  console.log("🧭 Generating sitemap...");

  /* ---------- Static routes ---------- */
  const staticUrls = [
    "/",
    "/category/wallpaper",
    "/category/ringtone",
    "/category/video",
  ].map(
    (route) => `
  <url>
    <loc>${SITE_URL}${route}</loc>
  </url>`
  );

  let dynamicUrls = [];

  /* ---------- Supabase check ---------- */
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn(
      "⚠️ Supabase env vars missing. Generating static sitemap only."
    );
  } else {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


// ✅ FIX: Changed 'updated_at' to 'created_at' to match your DB
      const { data, error } = await supabase
        .from("files")
        .select("id, file_name, created_at");

      // ---> PASTE THIS LINE HERE:
      if (data) console.log(`📊 Supabase returned ${data.length} rows.`); 
      // <---

      if (error) {


        console.error("❌ Supabase error:", error.message);
      }

      if (Array.isArray(data)) {
        dynamicUrls = data.map((item) => {
          const slug = makeSlug(item.file_name);
          // ✅ FIX: Use 'created_at' for the last modified date
          const lastmod = item.created_at
            ? new Date(item.created_at).toISOString()
            : new Date().toISOString();

          return `
  <url>
    <loc>${SITE_URL}/item/${item.id}/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
        });
      }
    } catch (err) {
      console.error("❌ Sitemap generation failed:", err.message);
    }
  }

  /* ---------- Final sitemap ---------- */
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.join("")}
${dynamicUrls.join("")}
</urlset>`.trim();

  /* ---------- Ensure dist exists ---------- */
  const distPath = path.join(__dirname, "..", "dist");
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }

  /* ---------- Write file ---------- */
  fs.writeFileSync(path.join(distPath, "sitemap.xml"), sitemap);

  console.log(
    `✅ sitemap.xml generated (${staticUrls.length + dynamicUrls.length} URLs)`
  );
}

/* ---------------------------------- */
/* Run safely                          */
/* ---------------------------------- */
generateSitemap().catch((err) => {
  console.error("❌ Fatal sitemap error:", err.message);
  process.exit(0);
});