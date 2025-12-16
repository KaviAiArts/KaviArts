import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2 } from "lucide-react";

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      const { data } = await supabase
        .from("files")
        .select("*")
        .eq("id", id)
        .single();

      setItem(data);
      setLoading(false);
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return <p className="text-center py-20">Loading...</p>;
  }

  if (!item) {
    return <p className="text-center py-20">Item not found.</p>;
  }

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* BACK */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* PREVIEW */}
        <div className="rounded-xl overflow-hidden border mb-6">
          {item.file_type === "video" ? (
            <video
              src={item.file_url}
              controls
              className="w-full aspect-video bg-black"
            />
          ) : item.file_type === "ringtone" ? (
            <audio controls className="w-full p-4">
              <source src={item.file_url} type="audio/mpeg" />
            </audio>
          ) : (
            <img
              src={item.file_url}
              alt={item.title}
              className="w-full object-cover"
            />
          )}
        </div>

        {/* TITLE (H1) */}
        <h1 className="text-3xl font-bold mb-3">
          {item.title}
        </h1>

        {/* DOWNLOAD COUNT */}
        <p className="text-sm text-muted-foreground mb-4">
          {item.downloads || 0} downloads
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 mb-8">
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>

          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>

        {/* DESCRIPTION (CRITICAL FOR ADSENSE) */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            Description
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {item.description ||
              "This is a high-quality digital asset available for personal customization use. Download and enjoy this aesthetic content optimized for modern devices."}
          </p>
        </section>

        {/* TAGS */}
        {Array.isArray(item.tags) && item.tags.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* USAGE NOTICE (ADSENSE SAFE) */}
        <section className="border-t pt-6 text-sm text-muted-foreground">
          <p>
            This content is provided for <strong>personal use only</strong>.
            Redistribution or commercial use without permission is prohibited.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ItemDetails;
