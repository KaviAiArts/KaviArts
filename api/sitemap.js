import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  // 1. Initialize Supabase
  // Ensure these Env Vars are set in your Vercel Project Settings
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
  const SITE_URL = "https://kaviarts.com";

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).send("Internal Server Error: Missing Environment Variables");
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // 2. Helpers
  const makeSlug = (text) =>
    (text || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

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
  };

  try {
    console.log("🧭 Generating dynamic sitemap...");

    // 3. Static Routes
    const staticUrls = [
      "/", "/category/wallpaper", "/category/ringtone", "/category/video"
    ].map(route => `
    <url>
      <loc>${SITE_URL}${route}</loc>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>`);

    // 4. Fetch Dynamic Data from Supabase
    const { data, error } = await supabase
      .from("files")
      .select("id, file_name, created_at, file_url");

    if (error) throw error;

    let dynamicUrls = [];
    if (Array.isArray(data)) {
      dynamicUrls = data.map((item) => {
        const slug = makeSlug(item.file_name);
        // Use the item's creation date or fallback to today
        const lastmod = item.created_at ? new Date(item.created_at).toISOString() : new Date().toISOString();

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

    // 5. Construct Final XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    ${staticUrls.join("")}
    ${dynamicUrls.join("")}
    </urlset>`.trim();

    // 6. Send Response
    // We tell the browser/bot that this is XML content
    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate'); // Cache for 1 day
    res.status(200).send(sitemap);

  } catch (err) {
    console.error("❌ Sitemap generation failed:", err.message);
    res.status(500).send(`Error generating sitemap: ${err.message}`);
  }
}