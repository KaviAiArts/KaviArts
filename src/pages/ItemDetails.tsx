import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Download, Music, Share2, Play, Pause, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { supabase } from "@/lib/supabaseClient";
import { getOptimizedDisplayUrl } from "@/lib/utils";
import NotFound from "@/pages/NotFound";

/* ------------------------------ */
/* SLUG HELPER                    */
/* ------------------------------ */
const makeSlug = (text: string) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

/* ------------------------------ */
/* VIDEO THUMBNAIL HELPER         */
/* ------------------------------ */
const getVideoThumbnail = (url: string) => {
  if (!url) return "";
  return url
    .replace("/video/upload/", "/video/upload/so_0/")
    .replace(/\.(mp4|webm|mov)$/i, ".jpg");
};

const ItemDetails = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }

      const correctSlug = makeSlug(data.file_name);
      if (!slug || slug !== correctSlug) {
        navigate(`/item/${data.id}/${correctSlug}`, { replace: true });
        return;
      }

      setItem(data);
      setLoading(false);
    };

    fetchItem();

    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [id, slug, navigate]);

  const handleDownload = async () => {
    if (!item || downloading) return;
    setDownloading(true);

    try {
      const response = await fetch(item.file_url);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = item.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      const { error } = await supabase.rpc("increment_downloads", {
        row_id: item.id,
      });

      if (!error) {
        setItem((prev: any) => ({
          ...prev,
          downloads: (prev.downloads || 0) + 1,
        }));
      }
    } catch (err) {
      console.error(err);
      window.open(item.file_url, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(item.file_url);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!item) return <NotFound />;

  const canonicalUrl = `https://kaviarts.com/item/${item.id}/${makeSlug(item.file_name)}`;

  const seoDescription =
    item.description?.slice(0, 160) ||
    `Download ${item.file_name} for free on KaviArts.`;

  const resolutionInfo =
    item.width && item.height
      ? `${item.width}x${item.height} Pixels`
      : item.file_type === "wallpaper"
      ? "High Resolution"
      : "HD Quality";

  return (
    <div className="min-h-screen bg-background">
      {/* ✅ ITEM PAGE SEO */}
      <SEO
        title={item.file_name}
        description={seoDescription}
        url={canonicalUrl}
        image={
          item.file_type === "video"
            ? getVideoThumbnail(item.file_url)
            : item.file_url
        }
        type={item.file_type === "video" ? "video.other" : "website"}
      />

      <Header />

      <main className="container mx-auto px-4 py-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="relative flex flex-col items-center justify-center bg-muted/40 min-h-[260px] gap-4 p-4">
            <Badge className="absolute top-3 left-3 capitalize shadow-md">
              {item.file_type}
            </Badge>

            {item.file_type === "wallpaper" && (
              <img
                src={getOptimizedDisplayUrl(item.file_url, 1200)}
                width={item.width}
                height={item.height}
                alt={item.description || item.file_name}
                className="max-w-full max-h-[70vh] object-contain rounded shadow-md"
              />
            )}

            {item.file_type === "ringtone" && (
              <>
                <div className="p-8 bg-secondary rounded-full">
                  <Music className="w-16 h-16 text-primary" />
                </div>
                <Button onClick={togglePlay} variant="outline" className="rounded-full px-6">
                  {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isPlaying ? "Pause" : "Play Preview"}
                </Button>
              </>
            )}

            {item.file_type === "video" && (
              <video
                controls
                src={item.file_url}
                className="max-h-[70vh] rounded shadow-md w-full"
              />
            )}
          </Card>

          <div className="flex flex-col space-y-4">
            <div>
              <h1 className="text-3xl font-bold">{item.file_name}</h1>
              <div className="text-sm text-muted-foreground mt-2 flex gap-2">
                <span>{item.downloads || 0} Downloads</span>
                <span>•</span>
                <span>{resolutionInfo}</span>
              </div>
            </div>

            <p className="text-muted-foreground whitespace-pre-wrap">
              {item.description || "No description available."}
            </p>

            <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() =>
                  navigator.share
                    ? navigator.share({ title: item.file_name, url: canonicalUrl })
                    : navigator.clipboard.writeText(canonicalUrl)
                }
              >
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>

              <Button
                onClick={handleDownload}
                disabled={downloading}
                className="bg-primary text-primary-foreground"
              >
                <Download className="w-4 h-4 mr-2" />
                {downloading ? "Downloading..." : "Download"}
              </Button>
            </div>

            <div className="pt-4 border-t text-xs text-muted-foreground flex justify-end">
              <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
              Free for Personal Use
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ItemDetails;
