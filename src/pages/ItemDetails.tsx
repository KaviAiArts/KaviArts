import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, Music, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

/* ---------------- HELPERS ---------------- */

const makeSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const optimizeCloudinary = (url: string, width = 1080) => {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,w_${width}/`
  );
};

const generateSchema = (item: any) => {
  const base = {
    "@context": "https://schema.org",
    name: item.file_name,
    description: item.description || item.file_name,
    contentUrl: item.file_url,
  };

  if (item.file_type === "wallpaper") {
    return { ...base, "@type": "ImageObject" };
  }

  if (item.file_type === "ringtone") {
    return { ...base, "@type": "AudioObject" };
  }

  if (item.file_type === "video") {
    return { ...base, "@type": "VideoObject" };
  }

  return null;
};

/* ---------------- COMPONENT ---------------- */

const ItemDetails = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    const fetchItem = async () => {
      const { data } = await supabase
        .from("files")
        .select("*")
        .eq("id", id)
        .single();

      if (!data) return;

      const correctSlug = makeSlug(data.file_name);
      if (!slug || slug !== correctSlug) {
        navigate(`/item/${data.id}/${correctSlug}`, { replace: true });
        return;
      }

      setItem(data);

      /* ---------- SEO ---------- */
      document.title = `${data.file_name} - KaviArts`;

      const metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      metaDesc.content =
        data.description ||
        `${data.file_name} high-quality wallpaper, ringtone, or video from KaviArts.`;

      const ogImage = document.createElement("meta");
      ogImage.setAttribute("property", "og:image");
      ogImage.content = optimizeCloudinary(data.file_url, 1200);

      document.head.append(metaDesc, ogImage);

      /* ---------- SCHEMA ---------- */
      const schema = generateSchema(data);
      let schemaScript: HTMLScriptElement | null = null;

      if (schema) {
        schemaScript = document.createElement("script");
        schemaScript.type = "application/ld+json";
        schemaScript.text = JSON.stringify(schema);
        document.head.appendChild(schemaScript);
      }

      return () => {
        document.head.removeChild(metaDesc);
        document.head.removeChild(ogImage);
        if (schemaScript) document.head.removeChild(schemaScript);
      };
    };

    fetchItem();
  }, [id, slug, navigate]);

  /* ---------------- DOWNLOAD (FIXED) ---------------- */

  const handleDownload = async () => {
    if (!item?.file_url) return;

    // 🔒 Force ORIGINAL Cloudinary asset (no compression)
    const originalUrl = item.file_url.replace(
      "/upload/",
      "/upload/fl_attachment/"
    );

    const a = document.createElement("a");
    a.href = originalUrl;
    a.setAttribute("download", item.file_name);
    a.setAttribute("target", "_blank");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    await supabase
      .from("files")
      .update({ downloads: (item.downloads || 0) + 1 })
      .eq("id", item.id);

    setItem((prev: any) => ({
      ...prev,
      downloads: (prev.downloads || 0) + 1,
    }));
  };

  if (!item) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="flex items-center justify-center bg-muted/40 min-h-[260px]">
            {item.file_type === "wallpaper" && (
              <img
                src={optimizeCloudinary(item.file_url, 1080)}
                alt={item.file_name}
                width={800}
                height={1200}
                decoding="async"
                className="max-w-full max-h-[70vh] object-contain"
              />
            )}

            {item.file_type === "ringtone" && (
              <Music className="w-16 h-16 text-primary" />
            )}

            {item.file_type === "video" && (
              <video
                controls
                src={item.file_url}
                className="max-h-[70vh]"
              />
            )}
          </Card>

          <div className="flex flex-col h-full">
            <Badge className="w-fit">{item.file_type}</Badge>

            <p className="text-sm text-muted-foreground mt-2">
              {(item.downloads || 0).toLocaleString()} Downloads
            </p>

            <h1 className="text-2xl font-bold mt-2">
              {item.file_name}
            </h1>

            <p className="text-muted-foreground mt-2">
              {item.description}
            </p>

            <div className="mt-auto pt-6 flex gap-3">
              <Button
                onClick={() =>
                  navigator.share
                    ? navigator.share({
                        title: item.file_name,
                        url: window.location.href,
                      })
                    : navigator.clipboard.writeText(window.location.href)
                }
                className="h-11 px-6 rounded-full border"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              <Button
                onClick={handleDownload}
                className="h-11 px-10 rounded-full bg-primary text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ItemDetails;
