import { Card } from "@/components/ui/card";
import { Download, Play, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

/* ---------- Helpers ---------- */

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

/* ---------- Item ---------- */

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
    >
      <div className={`relative ${aspect} overflow-hidden`}>
        {item.file_type === "wallpaper" && (
          <img
            src={item.file_url}
            alt={getAltText(item)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        )}

        {item.file_type === "video" && (
          <>
            <img
              src={getVideoThumbnail(item.file_url)}
              alt={getAltText(item)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 rounded-full p-3">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
          </>
        )}

        {item.file_type === "ringtone" && (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Music className="w-12 h-12 text-primary/80" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button size="sm" className="bg-gradient-primary text-white">
            {item.file_type === "video" ? "Watch" : "Download"}
          </Button>
        </div>

        <div className="absolute top-2 left-2">
          <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
            {item.file_type}
          </span>
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold truncate">{item.file_name}</h3>
      </div>
    </Card>
  );
};

/* ---------- Grid ---------- */

const ContentGrid = ({ items = [] }: { items?: any[] }) => {
  if (!items.length) {
    return (
      <p className="text-center text-muted-foreground py-10">
        No content available.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {items.map((item) => (
        <ContentItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default ContentGrid;
