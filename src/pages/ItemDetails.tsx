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
import ContentGrid from "@/components/ContentGrid";

const ringtoneThumbnails = [
  "/ringtone-thumbs/1.jpg",
  "/ringtone-thumbs/2.jpg",
  "/ringtone-thumbs/3.jpg",
  "/ringtone-thumbs/4.jpg",
  "/ringtone-thumbs/5.jpg",
  "/ringtone-thumbs/6.jpg",
  "/ringtone-thumbs/7.jpg",
  "/ringtone-thumbs/8.jpg",
  "/ringtone-thumbs/9.jpg",
  "/ringtone-thumbs/10.jpg",
  "/ringtone-thumbs/11.jpg",
  "/ringtone-thumbs/12.jpg",
];

const getThumbnailIndex = (id: number | string) => {
  const str = id.toString();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % ringtoneThumbnails.length;
};

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
const [isVideoPlaying, setIsVideoPlaying] = useState(false);
const [isVideoReady, setIsVideoReady] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
const [similarItems, setSimilarItems] = useState<any[]>([]);
const [similarPage, setSimilarPage] = useState(0);
const [hasMoreSimilar, setHasMoreSimilar] = useState(true);

const SIMILAR_LIMIT = 6;

const fetchSimilarItems = async (currentItem: any, page = 0) => {
  const from = page * SIMILAR_LIMIT;
  const to = from + SIMILAR_LIMIT - 1;

let query = supabase
  .from("files")
  .select("*")
  .eq("is_published", true)
  .neq("id", currentItem.id)
  .eq("file_type", currentItem.file_type)
  .range(from, to);

  if (Array.isArray(currentItem.tags) && currentItem.tags.length > 0) {
    query = query.overlaps("tags", currentItem.tags);
  } else if (currentItem.category) {
    query = query.eq("category", currentItem.category);
  }

  const { data } = await query;

  if (data) {
    if (data.length < SIMILAR_LIMIT) {
      setHasMoreSimilar(false);
    }

    if (page === 0) {
      setSimilarItems(data);
    } else {
      setSimilarItems((prev) => [...prev, ...data]);
    }
  }
};


  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);

const { data, error } = await supabase
  .from("files")
  .select("*")
  .eq("id", id)
  .eq("is_published", true)
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

setIsVideoPlaying(false);
setIsVideoReady(false);

setSimilarPage(0);
setHasMoreSimilar(true);
await fetchSimilarItems(data, 0);

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

const uploadedDate = item.created_at
  ? new Date(item.created_at).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  : null;

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
        <Button
  variant="custom"
size="sm"
  onClick={() => navigate(-1)}
  className="neon-btn btn-back mb-4"
>
  <ArrowLeft className="w-4 h-4 mr-2" />
  Back
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
  <div className="relative w-full max-w-md">
    <img
      src={ringtoneThumbnails[getThumbnailIndex(item.id)]}
      alt={`${item.file_name} ringtone thumbnail`}
      className="w-full rounded shadow-md"
    />

    <div className="absolute inset-0 flex items-center justify-center">
      <Button
        variant="custom"
        onClick={togglePlay}
        className="neon-btn btn-preview relative"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 mr-2" />
        ) : (
          <Play className="w-4 h-4 mr-2" />
        )}
        {isPlaying ? "Pause" : "Play Preview"}
      </Button>
    </div>
  </div>
)}

{item.file_type === "video" && (
  <div className="relative w-full flex items-center justify-center min-h-[260px]">

    <div className="relative max-h-[70vh]">

      {/* Thumbnail */}
      <img
        src={getVideoThumbnail(item.file_url)}
        alt={`${item.file_name} video thumbnail`}
        className={`max-h-[70vh] object-contain rounded shadow-md transition-opacity duration-300 ${
          isVideoPlaying ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Play Button */}
      {!isVideoPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="custom"
            onClick={() => setIsVideoPlaying(true)}
            className="neon-btn btn-preview"
          >
            <Play className="w-4 h-4 mr-2" />
            Play Video
          </Button>
        </div>
      )}

      {/* Video (absolute, prevents layout shift) */}
      {isVideoPlaying && (
        <video
          controls
          autoPlay
          preload="metadata"
          src={item.file_url}
          className="absolute inset-0 max-h-[70vh] w-full object-contain rounded shadow-md"
        />
      )}

    </div>
  </div>
)}
          </Card>

          <div className="flex flex-col space-y-4">
            <div>
              <h1 className="text-3xl font-bold">{item.file_name}</h1>

              <div className="text-sm text-muted-foreground mt-2 flex items-center">
  <span>{item.downloads || 0} Downloads</span>
  <span className="mx-2">•</span>
  <span>{resolutionInfo}</span>

  {uploadedDate && (
    <span className="ml-auto">
      Uploaded {uploadedDate}
    </span>
  )}
</div>
            </div>

            <p className="text-muted-foreground whitespace-pre-wrap">
              {item.description || "No description available."}
            </p>

{Array.isArray(item.tags) && item.tags.length > 0 && (
  <div className="flex flex-wrap gap-2 pt-3">
    {item.tags.map((tag: string) => (
      <Badge
        key={tag}
        variant="secondary"
        className="cursor-pointer hover:scale-105 hover:bg-primary hover:text-primary-foreground transition-all"
        onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}
      >
        #{tag}
      </Badge>
    ))}
  </div>
)}

            <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-3">
<Button
  variant="custom"
  className="neon-btn btn-share"
  onClick={() =>
    navigator.share
      ? navigator.share({ title: item.file_name, url: canonicalUrl })
      : navigator.clipboard.writeText(canonicalUrl)
  }
>
  <Share2 className="w-4 h-4 mr-2" />
  Share
</Button>

             <Button
  variant="custom"
  onClick={handleDownload}
  disabled={downloading}
  className="neon-btn btn-download"
>
  <Download className="w-4 h-4 mr-2" />
  {downloading ? "Downloading..." : "Download"}
</Button>
            </div>

           <div className="pt-4 border-t text-sm md:text-base text-muted-foreground flex justify-end items-center gap-2">
  <CheckCircle2 className="w-4 h-4 text-green-500" />
  <span>
    Free for personal and social media use with credit. Commercial use requires a license
  </span>
</div>

          </div>
        </div>

{/* 🔥 SIMILAR ITEMS */}
{similarItems.length > 0 && (
  <div className="mt-4">
    <h2 className="text-2xl font-bold mb-4">
      Similar Items
    </h2>

    <ContentGrid items={similarItems} />

    {hasMoreSimilar && (
      <div className="text-center mt-8">
        <Button
  variant="custom"
className="neon-btn btn-loadmore min-w-[150px]"
          onClick={async () => {
            const nextPage = similarPage + 1;
            setSimilarPage(nextPage);
            await fetchSimilarItems(item, nextPage);
          }}
        >
          Load More
        </Button>
      </div>
    )}
  </div>
)}

      </main>

      <Footer />
    </div>
  );
};

export default ItemDetails;
