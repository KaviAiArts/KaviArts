import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3";
import { getSignedUrl } from "npm:@aws-sdk/s3-request-presigner";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    if (!body.fileName || !body.folder || !body.contentType) {
      return new Response(
        JSON.stringify({ error: "Missing parameters" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { fileName, folder, contentType } = body;

    const s3 = new S3Client({
      region: "auto",
      endpoint: Deno.env.get("R2_ENDPOINT"),
      credentials: {
        accessKeyId: Deno.env.get("R2_ACCESS_KEY")!,
        secretAccessKey: Deno.env.get("R2_SECRET_KEY")!,
      },
    });

    const key = `${folder}/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: Deno.env.get("R2_BUCKET"),
      Key: key,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    return new Response(JSON.stringify({ signedUrl, key }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });

  } catch (err: any) {
    console.error("R2 ERROR:", err);

    return new Response(
      JSON.stringify({
        error: err.message ?? "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,   // ✅ THIS FIXES EVERYTHING
          "Content-Type": "application/json",
        },
      }
    );
  }
});