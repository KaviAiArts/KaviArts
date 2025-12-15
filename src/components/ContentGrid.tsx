import { Card } from "@/components/ui/card";
import { Download, Play, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

/* -------------------- Helpers -------------------- */

const getVideoThumbnail = (url: string) => {
  // Cloudinary video → thumbnail at first frame
  return url
    .replace("/video/upload/", "/video/upload/so_0/")
    .replace(/\.(mp4|webm|mov)$/i, ".jpg");
};

/* -------------------- Content Item -------------------- */

const ContentItem = ({ item }: { item: any }) => {
  const navigate = useNavigate();

  const handleItemClick = () => {
    navigate(`/item/${item.id}`);
  };

  const getAspectClass = () => {
    if (item.file_type === "ringtone") return "aspect-square"; // 1:1
    return "aspect-[9/16]"; // wallpapers & videos
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
      <div className={`relative ${getAspectClass()} overflow-hidden`}>
        {/* WALLPAPER */}
        {item.file_type === "wallpaper" && (
          <img
            src={item.file_url}
            alt={item.file_name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        )}

        {/* VIDEO */}
        {item.file_type === "video" && (
          <>
            <img
              src={getVideoThumbnail(item.file_url)}
              alt={item.file_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 rounded-full p-3">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
          </>
        )}

        {/* RINGTONE */}
        {item.file_type === "ringtone" && (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Music className="w-12 h-12 text-primary/80" />
          </div>
        )}

        {/* HOVER ACTION */}
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

        {/* TYPE BADGE */}
        <div className="absolute top-2 left-2">
          <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full">
            {item.file_type}
          </span>
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm truncate">
          {item.file_name}
        </h3>
      </div>
    </Card>
  );
};

/* -------------------- Content Grid -------------------- */

const ContentGrid = ({ items = [] }: { items?: any[] }) => {
  if (!items.length) {
    return (
      <p className="text-center text-gray-500 py-10">
        No content available yet.
      </p>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-3
        md:grid-cols-4
        lg:grid-cols-6
        gap-3
      "
    >
      {items.map((item) => (
        <ContentItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default ContentGrid;
