import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Download, Music, Share2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { Helmet } from "react-helmet-async"; // Added for SEO

const makeSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const ItemDetails = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      // We now handle document title via Helmet below
    };

    fetchItem();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [id, slug, navigate]);

  const handleDownload = async () => {
    try {
      const res = await fetch(item.file_url);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = item.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Increment download count
      await supabase
        .from("files")
        .update({ downloads: (item.downloads || 0) + 1 })
        .eq("id", item.id);

      setItem((prev: any) => ({
        ...prev,
        downloads: (prev.downloads || 0) + 1,
      }));
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(item.file_url);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  if (!item) return null; // You could add a Skeleton here if you wanted

  // 1. Construct dynamic SEO description
  const seoDescription = item.description 
    ? item.description.slice(0, 160) 
    : `Download ${item.file_name} for free on KaviArts. High quality ${item.file_type} available now.`;

  return (
    <div className="min-h-screen bg-background">
      {/* 2. SEO META TAGS (Crucial for AdSense/Google) */}
      <Helmet>
        <title>{`${item.file_name} | Download Free on KaviArts`}</title>
        <meta name="description" content={seoDescription} />
        
        {/* Open Graph / Social Media Preview Tags */}
        <meta property="og:title" content={item.file_name} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={item.file_url} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />

      <main className="container mx-auto px-4 py-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="flex flex-col items-center justify-center bg-muted/40 min-h-[260px] gap-4 p-4">
            
            {/* 3. LAYOUT SHIFT FIX: Added width/height props */}
            {item.file_type === "wallpaper" && (
              <img
                src={item.file_url}
                width={item.width}   // Prevents layout shift
                height={item.height} // Prevents layout shift
                alt={item.description || item.file_name}
                className="max-w-full max-h-[70vh] object-contain shadow-md rounded"
                loading="eager" // Load main image immediately
              />
            )}

            {item.file_type === "ringtone" && (
              <>
                <div className="p-8 bg-secondary rounded-full">
                    <Music className="w-16 h-16 text-primary" />
                </div>
                <Button
                  variant="outline"
                  onClick={togglePlay}
                  className="rounded-full px-6 min-w-[140px]"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 mr-2" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {isPlaying ? "Pause" : "Play Preview"}
                </Button>
              </>
            )}

            {item.file_type === "video" && (
              <video
                controls
                src={item.file_url}
                className="max-h-[70vh] rounded shadow-md w-full"
                width={item.width}
                height={item.height}
              />
            )}
          </Card>

          <div className="flex flex-col h-full space-y-4">
            <div>
                <Badge className="mb-2 capitalize">{item.file_type}</Badge>
                <h1 className="text-3xl font-bold leading-tight">
                {item.file_name}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                {(item.downloads || 0).toLocaleString()} Downloads • {item.width ? `${item.width}x${item.height}` : "HD"}
                </p>
            </div>

            {/* Content Description Area */}

            <div className="prose prose-sm dark:prose-invert text-muted-foreground leading-relaxed">
  {/* The 'whitespace-pre-line' class forces new lines to show up */}
  <p className="whitespace-pre-line">
    {item.description || "No description available for this item."}
  </p>
</div>

            {item.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() =>
                  navigator.share
                    ? navigator.share({
                        title: item.file_name,
                        url: window.location.href,
                      })
                    : navigator.clipboard.writeText(window.location.href)
                }
                className="h-11 px-6 rounded-full border flex-1 sm:flex-none"
                variant="outline"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              <Button
                onClick={handleDownload}
                className="h-11 px-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            
            {/* Technical Details (Good for "Valuable Content" checks) */}
            <div className="text-xs text-muted-foreground pt-4 border-t mt-4">
                <p>License: Free for Personal Use</p>
                <p>Format: {item.format?.toUpperCase() || "Unknown"}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ItemDetails;