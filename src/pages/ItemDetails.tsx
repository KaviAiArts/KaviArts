import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Download, Music, Share2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

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
      document.title = `${data.file_name} - KaviArts`;
    };

    fetchItem();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [id, slug, navigate]);

  const handleDownload = async () => {
    const res = await fetch(item.file_url);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = item.file_name;
    a.click();
    URL.revokeObjectURL(url);

    await supabase
      .from("files")
      .update({ downloads: (item.downloads || 0) + 1 })
      .eq("id", item.id);

    setItem((prev: any) => ({
      ...prev,
      downloads: (prev.downloads || 0) + 1,
    }));
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

  if (!item) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
          aria-label="Go back to previous page"
        >
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="flex flex-col items-center justify-center bg-muted/40 min-h-[260px] gap-4">
            {item.file_type === "wallpaper" && (
              <img
                src={item.file_url}
                alt={
                  item.description
                    ? item.description.split(".")[0]
                    : item.file_name
                }
                className="max-w-full max-h-[70vh] object-contain"
              />
            )}

            {item.file_type === "ringtone" && (
              <>
                <Music className="w-16 h-16 text-primary" aria-hidden="true" />
                <Button
                  variant="outline"
                  onClick={togglePlay}
                  className="rounded-full px-6"
                  aria-label={isPlaying ? "Pause preview" : "Play preview"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 mr-2" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {isPlaying ? "Pause Preview" : "Play Preview"}
                </Button>
              </>
            )}

            {item.file_type === "video" && (
              <video
                controls
                src={item.file_url}
                className="max-h-[70vh]"
                aria-label={`${item.file_name} video preview`}
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

            {item.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {item.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

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
                aria-label="Share this item"
              >
                <Share2 className="w-4 h-4 mr-2" aria-hidden="true" />
                Share
              </Button>

              <Button
                onClick={handleDownload}
                className="h-11 px-10 rounded-full bg-primary text-white"
                aria-label="Download this item"
              >
                <Download className="w-4 h-4 mr-2" aria-hidden="true" />
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
