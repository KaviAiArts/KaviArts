import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Play, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ---------------- HELPERS ---------------- */

const makeSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const getAltText = (item: any) =>
  item.description
    ? item.description.split(".")[0]
    : `${item.file_name} ${item.file_type}`;

const optimizeCloudinary = (url: string, width = 600) => {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,w_${width}/`
  );
};

const getVideoThumbnail = (url: string) =>
  optimizeCloudinary(
    url
      .replace("/video/upload/", "/video/upload/so_0/")
      .replace(/\.(mp4|webm|mov)$/i, ".jpg"),
    600
  );

/* ---------------- COMPONENT ---------------- */

const ContentItem = ({ item }: { item: any }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const slug = makeSlug(item.file_name);
    navigate(`/item/${item.id}/${slug}`);
  };

  const aspect =
    item.file_type === "ringtone"
      ? "aspect-square"
      : "aspect-[9/16]";

  return (
    <Card
      onClick={handleClick}
      className="group glass-card hover-lift cursor-pointer overflow-hidden"
    >
      <div className={`relative ${aspect} overflow-hidden`}>
        {/* WALLPAPER */}
        {item.file_type === "wallpaper" && (
          <img
            src={optimizeCloudinary(item.file_url, 600)}
            alt={getAltText(item)}
            width={300}
            height={500}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        )}

        {/* VIDEO */}
        {item.file_type === "video" && (
          <>
            <img
              src={getVideoThumbnail(item.file_url)}
              alt={getAltText(item)}
              width={300}
              height={500}
              loading="lazy"
              decoding="async"
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
            <Music className="w-14 h-14 text-primary/80" />
          </div>
        )}

        {/* LABEL */}
        <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
          {item.file_type}
        </span>

        {/* HOVER ACTION */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <Button size="sm" className="bg-gradient-primary text-white">
            {item.file_type === "video" ? "Watch" : "Download"}
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
