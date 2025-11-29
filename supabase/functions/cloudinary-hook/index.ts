import { serve } from "https://deno.land/std@0.195.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceKey) {
      return new Response("Missing Supabase env vars", { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    const contentType = req.headers.get("content-type") || "";

    let body: any = {};

    // Cloudinary sends x-www-form-urlencoded
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const form = await req.formData();
      body = Object.fromEntries(form);
      // Cloudinary nests JSON inside string → parse it
      if (typeof body.data === "string") {
        body = JSON.parse(body.data);
      }
    } else {
      return new Response("Unsupported content type", { status: 400 });
    }

    // Event type
    if (body?.notification_type !== "upload") {
      return new Response("ignored", { status: 200 });
    }

    const type =
      body.resource_type === "image"
        ? "wallpaper"
        : body.resource_type === "video"
        ? "video"
        : "ringtone";

    const record = {
      file_name: body.original_filename ?? "Untitled",
      file_type: type,
      file_url: body.secure_url,
      public_id: body.public_id,
      width: Number(body.width) || null,
      height: Number(body.height) || null,
      format: body.format ?? null,
      duration: body.duration ?? null,
      tags: body.tags ?? []
    };

    const { error } = await supabase.from("files").insert(record);

    if (error) {
      console.error(error);
      return new Response("DB error", { status: 500 });
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("fail", { status: 500 });
  }
});
