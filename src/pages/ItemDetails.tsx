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
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
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

            {/* ZEDGE-STYLE DOWNLOAD BUTTON */}
            <Button
              size="lg"
              onClick={handleDownload}
              className="
                w-full h-12
                rounded-full
                bg-primary text-primary-foreground
                hover:bg-primary/90
                text-base font-semibold
              "
            >
              <Download className="w-5 h-5 mr-2" />
              Download
            </Button>

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
