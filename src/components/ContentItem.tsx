import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Play, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";

const getVideoThumbnail = (url: string) => {
  // Cloudinary video → thumbnail
  return url.replace(
    "/video/upload/",
    "/video/upload/so_0/"
  ).replace(/\.(mp4|webm|mov)$/, ".jpg");
};

const ContentItem = ({ item }: { item: any }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/item/${item.id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      className="group glass-card hover-lift cursor-pointer overflow-hidden"
    >
      {/* IMAGE / VIDEO / RINGTONE PREVIEW */}
      <div
        className={`relative overflow-hidden ${
          item.file_type === "ringtone"
            ? "aspect-square"
            : "aspect-[9/16]"
        }`}
      >
        {/* WALLPAPER */}
        {item.file_type === "wallpaper" && (
          <img
            src={item.file_url}
            alt={item.file_name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
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
              <div className="bg-black/50 p-3 rounded-full">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
          </>
        )}

        {/* RINGTONE */}
        {item.file_type === "ringtone" && (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Music className="w-16 h-16 text-primary/80" />
          </div>
        )}

        {/* LABEL */}
        <span className="absolute top-2 left-2 bg-primary/90 text-xs px-2 py-1 rounded-full text-white">
          {item.file_type}
        </span>

        {/* HOVER ACTION */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <Button size="sm">
            {item.file_type === "ringtone" && <Music className="w-4 h-4 mr-2" />}
            {item.file_type === "video" && <Play className="w-4 h-4 mr-2" />}
            {item.file_type === "wallpaper" && <Download className="w-4 h-4 mr-2" />}
            {item.file_type === "ringtone"
              ? "Listen"
              : item.file_type === "video"
              ? "Watch"
              : "Download"}
          </Button>
        </div>
      </div>

      {/* TITLE */}
      <div className="p-3">
        <h3 className="text-sm font-semibold truncate">
          {item.file_name}
        </h3>
      </div>
    </Card>
  );
};

export default ContentItem;
