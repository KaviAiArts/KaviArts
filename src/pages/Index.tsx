import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import ContentGrid from "@/components/ContentGrid";
import { useNavigate } from "react-router-dom";
import { Download, Heart, Eye, Play, Music } from "lucide-react";
import { Card } from "@/components/ui/card";

// ---------------------------------------------------------------
// REUSABLE CONTENT ITEM 
// (same as your original, kept exactly the same)
// ---------------------------------------------------------------

const ContentItem = ({ item }: { item: any }) => {
  const navigate = useNavigate();

  const handleItemClick = () => {
    navigate(`/item/${item.id}`);
  };

  const getIcon = () => {
    switch (item.file_type) {
      case "ringtone":
        return <Music className="w-4 h-4 mr-2" />;
      case "video":
        return <Play className="w-4 h-4 mr-2" />;
      default:
        return <Download className="w-4 h-4 mr-2" />;
    }
  };

  const renderPreview = () => {
    if (item.file_type === "ringtone") {
      return (
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-6xl">
          🎵
        </div>
      );
    }

    return (
      <img
        src={item.file_url}
        alt={item.file_name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
    );
  };

  return (
    <Card
      className="group glass-card hover-lift overflow-hidden cursor-pointer"
      onClick={handleItemClick}
    >
      <div className="relative aspect-[9/16] overflow-hidden">
        {renderPreview()}

        {item.file_type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 rounded-full p-3">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button size="sm" className="bg-gradient-primary text-primary-foreground shadow-glow">
            {getIcon()}
            {item.file_type === "video"
              ? "Watch"
              : item.file_type === "ringtone"
              ? "Listen"
              : "Download"}
          </Button>
        </div>

        <div className="absolute top-2 left-2">
          <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full">
            {item.file_type}
          </span>
        </div>

        {item.duration && (
          <div className="absolute top-2 right-2">
            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {item.duration}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-sm mb-3 truncate">{item.file_name}</h3>

        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Download className="w-3 h-3" />
            <span>{item.downloads || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="w-3 h-3" />
            <span>{item.likes || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{item.views || 0}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

// ---------------------------------------------------------------
// REUSABLE CONTENT SECTION (Matches original UI exactly)
// ---------------------------------------------------------------

const ContentSection = ({
  title,
  items,
  category,
}: {
  title: string;
  items: any[];
  category: string;
}) => {
  const navigate = useNavigate();

  return (
    <section className="py-6 md:py-10 px-3">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Button variant="outline" size="sm" onClick={() => navigate(`/category/${category}`)}>
            View All
          </Button>
        </div>

        {/* Desktop grid */}
        <div className="hidden lg:grid lg:grid-cols-6 gap-6">
          {items.map((item) => (
            <ContentItem key={item.id} item={item} />
          ))}
        </div>

        {/* Mobile: 2.5 items */}
        <div className="lg:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 pb-4" style={{ width: "max-content" }}>
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`flex-shrink-0 ${index === 0 ? "ml-2" : ""} ${
                  index === items.length - 1 ? "mr-4" : ""
                }`}
                style={{ width: "calc((100vw - 2rem) / 2.5)" }}
              >
                <ContentItem item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------
// MAIN HOMEPAGE – FULLY DYNAMIC
// ---------------------------------------------------------------

const Index = () => {
  const [newest, setNewest] = useState([]);
  const [popularWallpapers, setPopularWallpapers] = useState([]);
  const [ringtones, setRingtones] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    // Newest Wallpapers
    const { data: newestData } = await supabase
      .from("files")
      .select("*")
      .eq("file_type", "wallpaper")
      .order("created_at", { ascending: false })
      .limit(12);

    // Popular Wallpapers
    const { data: popularData } = await supabase
      .from("files")
      .select("*")
      .eq("file_type", "wallpaper")
      .order("likes", { ascending: false })
      .limit(12);

    // Ringtones
    const { data: ringtoneData } = await supabase
      .from("files")
      .select("*")
      .eq("file_type", "ringtone")
      .order("likes", { ascending: false })
      .limit(12);

    // Videos
    const { data: videoData } = await supabase
      .from("files")
      .select("*")
      .eq("file_type", "video")
      .order("likes", { ascending: false })
      .limit(12);

    setNewest(newestData || []);
    setPopularWallpapers(popularData || []);
    setRingtones(ringtoneData || []);
    setVideos(videoData || []);
  };

  return (
    <div className="pb-10">

      {/* Section 1 */}
      <ContentSection
        title="Newest Wallpapers"
        items={newest}
        category="wallpapers"
      />

      {/* Section 2 */}
      <ContentSection
        title="Popular Wallpapers"
        items={popularWallpapers}
        category="wallpapers"
      />

      {/* Section 3 */}
      <ContentSection
        title="Popular Ringtones"
        items={ringtones}
        category="ringtones"
      />

      {/* Section 4 */}
      <ContentSection
        title="Popular Videos"
        items={videos}
        category="videos"
      />
    </div>
  );
};

export default Index;
