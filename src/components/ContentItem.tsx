import { Card } from "@/components/ui/card";
import { Download, Play, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const getVideoThumbnail = (url: string) =>
  url
    .replace("/video/upload/", "/video/upload/so_0/")
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

const ContentItem = ({ item }: { item: any }) => {
  const navigate = useNavigate();

  const handleItemClick = () => {
    const slug = makeSlug(item.file_name);
    navigate(`/item/${item.id}/${slug}`);
  };

  const aspect =
    item.file_type === "ringtone" ? "aspect-square" : "aspect-[9/16]";

  return (
    <Card
      onClick={handleItemClick}
      className="group glass-card hover-lift cursor-pointer overflow-hidden"
      role="button"
      tabIndex={0}
      aria-label={`Open ${item.file_name}`}
    >
      <div className={`relative ${aspect} overflow-hidden`}>
        {item.file_type === "wallpaper" && (
          <img
            src={item.file_url}
            alt={getAltText(item)}
            loading="lazy"    // ⚡ FIX
            decoding="async"  // ⚡ FIX
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        )}

        {item.file_type === "video" && (
          <>
            <img
              src={getVideoThumbnail(item.file_url)}
              alt={`${item.file_name} video thumbnail`}
              loading="lazy"    // ⚡ FIX
              decoding="async"  // ⚡ FIX
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 rounded-full p-3">
                <Play
                  className="w-8 h-8 text-white fill-white"
                  aria-hidden="true"
                />
              </div>
            </div>
          </>
        )}

        {item.file_type === "ringtone" && (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Music
              className="w-12 h-12 text-primary/80"
              aria-hidden="true"
            />
          </div>
        )}

        {/* Hover overlay — unfocusable button */}
        <div
          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          aria-hidden="true"
        >
          <Button
            size="sm"
            className="bg-gradient-primary text-white"
            tabIndex={-1}
          >
            {item.file_type === "video" ? "Watch" : "Download"}
          </Button>
        </div>

        {/* Badge with translucent contrast layer */}
        <div className="absolute top-2 left-2">
          <span
            className="bg-black/60 text-white text-xs px-2 py-1 rounded-full"
            aria-hidden="true"
          >
            {item.file_type}
          </span>
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold truncate">
          {item.file_name}
        </h3>
      </div>
    </Card>
  );
};

export default ContentItem;