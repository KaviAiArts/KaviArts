import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SITE_URL = "https://kavi-arts.vercel.app/"; // ⚠️ CHANGE THIS

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function generateSitemap() {
  const { data: files } = await supabase
    .from("files")
    .select("id, file_name, updated_at");

  const urls = files.map((item) => {
    const slug = item.file_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return `
  <url>
    <loc>${SITE_URL}/item/${item.id}/${slug}</loc>
    <lastmod>${item.updated_at}</lastmod>
  </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}</loc></url>
  <url><loc>${SITE_URL}/category/wallpaper</loc></url>
  <url><loc>${SITE_URL}/category/ringtone</loc></url>
  <url><loc>${SITE_URL}/category/video</loc></url>
  ${urls.join("")}
</urlset>`;

  fs.writeFileSync(
    path.join("dist", "sitemap.xml"),
    sitemap.trim()
  );

  console.log("✅ sitemap.xml generated");
}

generateSitemap();
