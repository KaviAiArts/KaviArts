import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Heart, Eye, Play, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Each file from Supabase looks like:
// { id, file_name, file_url, file_type, downloads, likes, views }

const ContentItem = ({ item }) => {
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

  return (
    <Card
      className="group glass-card hover-lift overflow-hidden cursor-pointer"
      onClick={handleItemClick}
    >
      <div className="relative aspect-[9/16] overflow-hidden">
        {item.file_type === "ringtone" ? (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-6xl">
            🎵
          </div>
        ) : (
          <img
            src={item.file_url}
            alt={item.file_name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        )}

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

const ContentGrid = ({ items = [] }) => {
  if (!items.length) {
    return (
      <p className="text-center text-gray-500 py-10">
        No content available yet.
      </p>
    );
  }

  return (
    <section className="py-6 md:py-10 px-3">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Latest Uploads
        </h2>

        <div className="flex gap-3 overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-6 scrollbar-hide px-2 md:px-0">
          {items.map((item) => (
            <div className="min-w-[48%] sm:min-w-[45%] md:min-w-0 md:w-full">
  <ContentItem key={item.id} item={item} />
</div>

          ))}
        </div>
      </div>
    </section>
  );
};

export default ContentGrid;
