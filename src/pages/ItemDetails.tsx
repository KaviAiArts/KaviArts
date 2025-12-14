import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, Tag } from "lucide-react";
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
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch item
  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) {
        setItem(data);
        document.title = `${data.file_name} - KaviArts`;
      }
      setLoading(false);
    };

    fetchItem();
  }, [id]);

  // 🔹 Handle download (Zedge-style)
  const handleDownload = async () => {
    await supabase
      .from("files")
      .update({ downloads: (item.downloads || 0) + 1 })
      .eq("id", item.id);

    setItem((prev: any) => ({
      ...prev,
      downloads: (prev.downloads || 0) + 1,
    }));

    window.open(item.file_url, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          Loading...
        </main>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Item not found</h1>
          <Button onClick={() => navigate("/")}>Go Back Home</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Preview */}
          <Card className="overflow-hidden">
            {item.file_type === "wallpaper" && (
              <img
                src={item.file_url}
                alt={item.file_name}
                className="w-full h-auto object-cover"
              />
            )}
          </Card>

          {/* DETAILS */}
          <div className="space-y-6">
            {/* Type + Resolution */}
            <div className="flex gap-2">
              <Badge variant="secondary">{item.file_type}</Badge>
              {item.width && item.height && (
                <Badge variant="outline">
                  {item.width} × {item.height}
                </Badge>
              )}
            </div>

            {/* TITLE */}
            <h1 className="text-2xl font-bold">{item.file_name}</h1>

            {/* DESCRIPTION */}
            {item.description && (
              <p className="text-muted-foreground">{item.description}</p>
            )}

            {/* DOWNLOAD COUNT */}
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {(item.downloads || 0).toLocaleString()}
              </span>{" "}
              Downloads
            </p>

            {/* DOWNLOAD BUTTON (ZEDGE STYLE) */}
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
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags
                </h3>
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
