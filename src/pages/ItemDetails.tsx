import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, Music, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    const fetchItem = async () => {
      const { data } = await supabase
        .from("files")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setItem(data);
        document.title = `${data.file_name} - KaviArts`;
      }
    };
    fetchItem();
  }, [id]);

  const handleDownload = async () => {
    try {
      const response = await fetch(item.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = item.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      await supabase
        .from("files")
        .update({ downloads: (item.downloads || 0) + 1 })
        .eq("id", item.id);

      setItem((prev: any) => ({
        ...prev,
        downloads: (prev.downloads || 0) + 1,
      }));
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  if (!item) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-4 overflow-x-hidden">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PREVIEW */}
          <Card className="flex items-center justify-center bg-muted/40 min-h-[260px]">
            {item.file_type === "wallpaper" && (
              <img
                src={item.file_url}
                alt={item.file_name}
                className="max-w-full max-h-[70vh] object-contain"
              />
            )}

            {item.file_type === "ringtone" && (
              <Music className="w-16 h-16 text-primary" />
            )}

            {item.file_type === "video" && (
              <video
                controls
                className="max-w-full max-h-[70vh]"
                src={item.file_url}
              />
            )}
          </Card>

          {/* DETAILS */}
          <div className="flex flex-col w-full h-full">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge>{item.file_type}</Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                {(item.downloads || 0).toLocaleString()} Downloads
              </p>

              <h1 className="text-2xl font-bold">{item.file_name}</h1>

              {item.description && (
                <p className="text-muted-foreground">{item.description}</p>
              )}

              {item.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
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
            </div>

            {/* ACTION BAR – ORIGINAL SIZE RESTORED */}
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
                className="h-11 px-6 rounded-full border hover:bg-primary hover:text-white"
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
