import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Play, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ContentItem = ({ item }: { item: any }) => {
  const navigate = useNavigate();

  const handleItemClick = () => {
    navigate(`/item/${item.id}`);
  };

  const getPreviewUrl = () => {
    // VIDEO → Cloudinary thumbnail (first frame)
    if (item.file_type === "video") {
      return item.file_url.replace(
        "/video/upload/",
        "/video/upload/so_0/"
      );
    }

    // WALLPAPER
    return item.file_url;
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
      onClick={handleItemClick}
      className="group glass-card hover-lift cursor-pointer overflow-hidden"
    >
      <div
        className={`relative overflow-hidden ${
          item.file_type === "ringtone" ? "aspect-square" : "aspect-[9/16]"
        }`}
      >
        {item.file_type !== "ringtone" ? (
          <img
            src={getPreviewUrl()}
            alt={item.file_name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Music className="w-16 h-16 opacity-80" />
          </div>
        )}

        {item.file_type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/60 rounded-full p-3">
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
        <h3 className="font-semibold text-sm truncate">
          {item.file_name}
        </h3>
      </div>
    </Card>
  );
};

export default ContentItem;
