import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Play, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";

const getVideoThumb = (url: string) => {
  if (!url.includes("/upload/")) return url;
  return url.replace("/upload/", "/upload/so_0/") + ".jpg";
};

const ContentItem = ({ item }: any) => {
  const navigate = useNavigate();

  const handleItemClick = () => {
    navigate(`/item/${item.id}`);
  };

  return (
    <Card
      onClick={handleItemClick}
      className="group glass-card hover-lift cursor-pointer overflow-hidden"
    >
      <div
        className={`relative overflow-hidden ${
          item.file_type === "ringtone"
            ? "aspect-square"
            : "aspect-[9/16]"
        }`}
      >
        {/* VIDEO */}
        {item.file_type === "video" && (
          <>
            <img
              src={getVideoThumb(item.file_url)}
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
            <Music className="w-16 h-16 opacity-80" />
          </div>
        )}

        {/* WALLPAPER */}
        {item.file_type === "wallpaper" && (
          <img
            src={item.file_url}
            alt={item.file_name}
            className="w-full h-full object-cover"
          />
        )}

        {/* HOVER CTA */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <Button size="sm">
            {item.file_type === "video"
              ? "Watch"
              : item.file_type === "ringtone"
              ? "Listen"
              : "Download"}
          </Button>
        </div>

        {/* TAG */}
        <span className="absolute top-2 left-2 bg-primary text-xs px-2 py-1 rounded-full">
          {item.file_type}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold truncate">{item.file_name}</h3>
      </div>
    </Card>
  );
};

export default ContentItem;
