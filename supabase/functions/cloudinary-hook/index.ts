// supabase/functions/cloudinary-hook/index.ts

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ENV VARIABLES FROM SUPABASE 
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  try {
    const payload = await req.json();

    // VALIDATION
    if (!payload || !payload.secure_url) {
      return new Response("Invalid Cloudinary payload", { status: 400 });
    }

    // Detect file_type automatically
    let file_type = "wallpaper";
    if (payload.resource_type === "video") file_type = "video";
    if (payload.resource_type === "raw") file_type = "ringtone";

    // Detect category from folder
    const folder = payload.folder || "general";

    // Extract metadata
    const width = payload.width || null;
    const height = payload.height || null;
    const format = payload.format || null;
    const duration = payload.duration || null;

    const colors = payload.colors
      ? payload.colors.map((c: any) => c[0])
      : null;

    // Tags from Cloudinary AI or user upload
    const tags = payload.tags || [];

    // Prepare row for DB
    const row = {
      file_name: payload.original_filename,
      file_type,
      file_url: payload.secure_url,
      public_id: payload.public_id,
      width,
      height,
      format,
      duration,
      colors,
      tags,
      category: folder,
    };

    // Insert into Supabase
    const { error } = await supabase.from("files").insert([row]);

    if (error) {
      console.error("DB Insert Error:", error);
      return new Response("Database insert failed", { status: 500 });
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Webhook Error:", err);
    return new Response("Internal Error", { status: 500 });
  }
});
