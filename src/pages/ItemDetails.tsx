import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Download, Music, Share2, Play, Pause, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { Helmet } from "react-helmet-async";
import { getOptimizedDisplayUrl, getOriginalDownloadUrl } from "@/lib/utils";
import NotFound from "@/pages/NotFound";

const makeSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const ItemDetails = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
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
    // 1. Start Download IMMEDIATELY
    // We execute this first so the user gets the file no matter what.
    const downloadUrl = getOriginalDownloadUrl(item.file_url, item.file_name);
    window.location.href = downloadUrl;

    // 2. Update local state (Visual feedback)
    setItem((prev: any) => ({
      ...prev,
      downloads: (prev.downloads || 0) + 1,
    }));

    // 3. Track in Supabase
    // We try the Secure RPC call first. 
    const { error } = await supabase.rpc("increment_downloads", { row_id: item.id });
    
    if (error) {
        // Fallback: Try standard update (works only if RLS is off)
        await supabase
            .from("files")
            .update({ downloads: (item.downloads || 0) + 1 })
            .eq("id", item.id);
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

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  if (!item) return <NotFound />;

  const seoDescription = item.description 
    ? item.description.slice(0, 160) 
    : `Download ${item.file_name} for free on KaviArts.`;

  // UI: Resolution Logic
  const resolutionInfo = item.width && item.height 
    ? `${item.width}x${item.height} Pixels` 
    : item.file_type === "wallpaper" ? "High Resolution" : "HD Quality";

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${item.file_name} | Download Free on KaviArts`}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={item.file_name} />
        <meta property="og:image" content={item.file_url} />
        <link rel="canonical" href={`https://kaviarts.com/item/${item.id}/${makeSlug(item.file_name)}`} />
      </Helmet>

      <Header />

      <main className="container mx-auto px-4 py-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PREVIEW SECTION */}
          <Card className="relative flex flex-col items-center justify-center bg-muted/40 min-h-[260px] gap-4 p-4">
            <Badge className="absolute top-3 left-3 z-10 capitalize shadow-md">{item.file_type}</Badge>
            
            {item.file_type === "wallpaper" && (
              <img
                src={getOptimizedDisplayUrl(item.file_url, 1200)}
                width={item.width} height={item.height}
                alt={item.description || item.file_name}
                className="max-w-full max-h-[70vh] object-contain shadow-md rounded"
              />
            )}

            {item.file_type === "ringtone" && (
              <>
                <div className="p-8 bg-secondary rounded-full"><Music className="w-16 h-16 text-primary" /></div>
                <Button variant="outline" onClick={togglePlay} className="rounded-full px-6 min-w-[140px]">
                  {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isPlaying ? "Pause" : "Play Preview"}
                </Button>
              </>
            )}

            {item.file_type === "video" && (
              <video controls src={item.file_url} className="max-h-[70vh] rounded shadow-md w-full" />
            )}
          </Card>

          {/* DETAILS SECTION */}
          <div className="flex flex-col h-full space-y-4">
            <div>
                <h1 className="text-3xl font-bold leading-tight">{item.file_name}</h1>
                
                {/* RESTORED UI: Downloads & Resolution */}
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                  <span>{(item.downloads || 0).toLocaleString()} Downloads</span>
                  <span>•</span>
                  <span>{resolutionInfo}</span>
                </div>
            </div>

            <div className="prose prose-sm dark:prose-invert text-muted-foreground leading-relaxed">
              <p className="whitespace-pre-wrap font-sans">{item.description || "No description available."}</p>
            </div>

            {item.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigator.share ? navigator.share({ title: item.file_name, url: window.location.href }) : navigator.clipboard.writeText(window.location.href)}
                className="h-11 px-6 rounded-full border flex-1 sm:flex-none"
                variant="outline"
              >
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>

              <Button onClick={handleDownload} className="h-11 px-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex-1">
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
            </div>

            {/* RESTORED UI: License */}
            <div className="pt-4 border-t mt-4 flex items-center justify-end text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                   <CheckCircle2 className="w-3 h-3 text-green-500" /> License: Free for Personal Use
                </span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ItemDetails;