/**
 * Bulletproof sitemap generator for Vercel + Vite + Supabase
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SITE_URL = "https://kaviarts.com";

const makeSlug = (text) =>
  (text || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ✅ CRITICAL FIX: Escapes special characters like "&" to prevent XML errors
const escapeXml = (unsafe) => {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

async function generateSitemap() {
  console.log("🧭 Generating sitemap...");

  const staticUrls = [
    "/", "/category/wallpaper", "/category/ringtone", "/category/video"
  ].map(route => `
  <url>
    <loc>${SITE_URL}${route}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`);

  let dynamicUrls = [];

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("⚠️ Supabase env vars missing. Generating static sitemap only.");
  } else {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      const { data, error } = await supabase
        .from("files")
        .select("id, file_name, created_at, file_url");

      if (error) console.error("❌ Supabase error:", error.message);

      if (Array.isArray(data)) {
        dynamicUrls = data.map((item) => {
          const slug = makeSlug(item.file_name);
          const lastmod = item.created_at ? new Date(item.created_at).toISOString() : new Date().toISOString();

          // ✅ WRAP URLS AND TITLES IN escapeXml()
          return `
  <url>
    <loc>${SITE_URL}/item/${item.id}/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <image:image>
      <image:loc>${escapeXml(item.file_url)}</image:loc>
      <image:title>${escapeXml(item.file_name)}</image:title>
    </image:image>
  </url>`;
        });
      }
    } catch (err) {
      console.error("❌ Sitemap generation failed:", err.message);
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticUrls.join("")}
${dynamicUrls.join("")}
</urlset>`.trim();

  const distPath = path.join(__dirname, "..", "dist");
  if (!fs.existsSync(distPath)) fs.mkdirSync(distPath, { recursive: true });

  fs.writeFileSync(path.join(distPath, "sitemap.xml"), sitemap);
  console.log(`✅ sitemap.xml generated (${staticUrls.length + dynamicUrls.length} URLs)`);
}

generateSitemap().catch((err) => {
  console.error("❌ Fatal sitemap error:", err.message);
  process.exit(0);
});