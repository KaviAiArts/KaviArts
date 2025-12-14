import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, Music, Play } from "lucide-react";
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

  // 🔥 ZEDGE-STYLE DIRECT DOWNLOAD
  const handleDownload = async () => {
    // increment count
    await supabase
      .from("files")
      .update({ downloads: (item.downloads || 0) + 1 })
      .eq("id", item.id);

    setItem((prev: any) => ({
      ...prev,
      downloads: (prev.downloads || 0) + 1,
    }));

    // force browser download
    const link = document.createElement("a");
    link.href = item.file_url;
    link.download = item.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!item) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />



      <main className="container mx-auto px-4 py-4 md:py-4">



        {/* Back */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* PREVIEW AREA */}


          <Card
  className="
    overflow-hidden
    flex items-center justify-center
    bg-muted/40
    max-h-[70vh]
    min-h-[260px]
  "
>


            {/* WALLPAPER */}
            {item.file_type === "wallpaper" && (


              <img
  src={item.file_url}
  alt={item.file_name}
  className="max-h-[70vh] w-auto object-contain"
/>



            )}

            {/* RINGTONE */}
            {item.file_type === "ringtone" && (
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Music className="w-16 h-16 text-primary" />
                <span className="text-sm">Audio Preview</span>
              </div>
            )}

            {/* VIDEO */}
            {item.file_type === "video" && (
              <video
                controls
                poster={item.thumbnail_url || undefined}
                className="w-full h-full object-contain"
              >
                <source src={item.file_url} />
              </video>
            )}
          </Card>

          {/* DETAILS */}
          <div className="space-y-6">
            <div className="flex gap-2">
              <Badge variant="secondary">{item.file_type}</Badge>
              {item.width && item.height && (
                <Badge variant="outline">
                  {item.width} × {item.height}
                </Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold">{item.file_name}</h1>

            {item.description && (
              <p className="text-muted-foreground">{item.description}</p>
            )}

            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {(item.downloads || 0).toLocaleString()}
              </span>{" "}
              Downloads
            </p>



            
          {/* ZEDGE-STYLE ACTION BUTTONS */}

  {/* ACTION BAR – CENTERED & LOWER */}
<div className="mt-10 flex justify-center">
  <div className="flex items-center gap-3">
    {/* SHARE BUTTON */}
    <Button
      variant="secondary"
      size="icon"
      onClick={() => {
        if (navigator.share) {
          navigator.share({
            title: item.file_name,
            url: window.location.href,
          });
        } else {
          navigator.clipboard.writeText(window.location.href);
        }
      }}
      className="h-11 w-11 rounded-full"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
        <path d="M12 3v14" />
        <path d="m7 8 5-5 5 5" />
      </svg>
    </Button>

    {/* DOWNLOAD BUTTON */}
    <Button
      onClick={handleDownload}
      className="
        h-11
        px-10
        rounded-full
        bg-primary
        text-primary-foreground
        hover:bg-primary/90
        font-medium
      "
    >
      <Download className="w-4 h-4 mr-2" />
      Download
    </Button>
  </div>
</div>







            {/* TAGS */}
            {item.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="
                      px-3 py-1
                      text-xs rounded-full
                      bg-secondary text-foreground
                    "
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ItemDetails;
