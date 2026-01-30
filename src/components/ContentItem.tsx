import { Card } from "@/components/ui/card";
import { Download, Play, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // ✅ Changed: We use Link instead of useNavigate for SEO
import { getOptimizedDisplayUrl } from "@/lib/utils";

const getVideoThumbnail = (url: string) =>
  url
    .replace("/video/upload/", "/video/upload/so_0/")
    .replace(/\.(mp4|webm|mov)$/i, ".jpg");

// ✅ UPDATED CLEAN SLUG FUNCTION
const makeSlug = (text: string) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars (like ')
    .replace(/\-\-+/g, '-');  // Replace multiple - with single -
};

const getAltText = (item: any) =>
  item.description
    ? item.description.split(".")[0]
    : `${item.file_name} ${item.file_type}`;

const ContentItem = ({ item, priority = false }: { item: any, priority?: boolean }) => {
  // ✅ SEO FIX: Pre-calculate the URL
  const slug = makeSlug(item.file_name);
  const itemUrl = `/item/${item.id}/${slug}`;

  const aspect =
    item.file_type === "ringtone" ? "aspect-square" : "aspect-[9/16]";

  return (
    // ✅ SEO FIX: Wrap the entire card in a Link component.
    // This renders a real <a> tag that Google can crawl.
    <Link 
      to={itemUrl} 
      className="block group h-full focus:outline-none"
      aria-label={`Open ${item.file_name}`}
    >
      <Card
        className="glass-card hover-lift overflow-hidden h-full"
        // Removed onClick, role, and tabIndex because Link handles them now
      >
        <div className={`relative ${aspect} overflow-hidden`}>
          {item.file_type === "wallpaper" && (
            <img
  src={getOptimizedDisplayUrl(item.file_url, 500)}
  alt={getAltText(item)}
  loading={priority ? "eager" : "lazy"}
  // @ts-ignore
  fetchPriority={priority ? "high" : "auto"}
  decoding="async"
  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
/>
          )}

          {item.file_type === "video" && (
            <>
              <img
  src={getVideoThumbnail(item.file_url)}
  alt={`${item.file_name} video thumbnail`}
  loading={priority ? "eager" : "lazy"}
  // @ts-ignore
  fetchPriority={priority ? "high" : "auto"}
  decoding="async"
  className="w-full h-full object-cover"
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
              className="bg-gradient-primary text-white pointer-events-none" // pointer-events-none prevents button conflict
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
          <h3 className="text-sm font-semibold truncate text-foreground">
            {item.file_name}
          </h3>
        </div>
      </Card>
    </Link>
  );
};

export default ContentItem;