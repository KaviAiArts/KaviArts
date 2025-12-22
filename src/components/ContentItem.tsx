import { Card } from "@/components/ui/card";
import { Download, Play, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

/* ---------- Helpers ---------- */

const getVideoThumbnail = (url: string) =>
  url
    .replace("/video/upload/", "/video/upload/q_auto,f_auto,so_0/")
    .replace(/\.(mp4|webm|mov)$/i, ".jpg");

const makeSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const getAltText = (item: any) =>
  item.description
    ? item.description.split(".")[0]
    : `${item.file_name} ${item.file_type}`;

/* ---------- Component ---------- */

const ContentItem = ({ item }: { item: any }) => {
  const navigate = useNavigate();

  const handleItemClick = () => {
    const slug = makeSlug(item.file_name);
    navigate(`/item/${item.id}/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleItemClick();
    }
  };

  const aspect =
    item.file_type === "ringtone" ? "aspect-square" : "aspect-[9/16]";

  return (
    <Card
      onClick={handleItemClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Open ${item.file_name}`}
      className="group glass-card hover-lift cursor-pointer overflow-hidden"
    >
      <div className={`relative ${aspect} overflow-hidden`}>
        {/* WALLPAPER */}
        {item.file_type === "wallpaper" && (
          <img
            src={item.file_url}
            alt={getAltText(item)}
            loading="lazy"
            decoding="async"
            width={300}
            height={500}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        )}

        {/* VIDEO */}
        {item.file_type === "video" && (
          <>
            <img
              src={getVideoThumbnail(item.file_url)}
              alt={item.file_name}
              loading="lazy"
              decoding="async"
              width={300}
              height={500}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 flex items-center justify-center"
              aria-hidden="true"
            >
              <div className="bg-black/50 rounded-full p-3">
                <Play
                  className="w-8 h-8 text-white fill-white"
                  aria-hidden="true"
                />
              </div>
            </div>
          </>
        )}

        {/* RINGTONE */}
        {item.file_type === "ringtone" && (
          <div
            className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
            aria-hidden="true"
          >
            <Music className="w-12 h-12 text-primary/80" aria-hidden="true" />
          </div>
        )}

        {/* Hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            size="sm"
            className="bg-gradient-primary text-white"
            aria-label={
              item.file_type === "video" ? "Play video preview" : "Open item"
            }
          >
            <Play className="w-8 h-8" aria-hidden="true" />
          </Button>
        </div>

        <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
          {item.file_type}
        </span>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold truncate">{item.file_name}</h3>
      </div>
    </Card>
  );
};

export default ContentItem;
