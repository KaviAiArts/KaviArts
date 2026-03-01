import { Card } from "@/components/ui/card";
import { Download, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // ✅ Changed: We use Link instead of useNavigate for SEO
import { getOptimizedDisplayUrl } from "@/lib/utils";

const ringtoneThumbnails = [
  "/ringtone-thumbs/1.jpg",
  "/ringtone-thumbs/2.jpg",
  "/ringtone-thumbs/3.jpg",
  "/ringtone-thumbs/4.jpg",
  "/ringtone-thumbs/5.jpg",
  "/ringtone-thumbs/6.jpg",
  "/ringtone-thumbs/7.jpg",
  "/ringtone-thumbs/8.jpg",
  "/ringtone-thumbs/9.jpg",
  "/ringtone-thumbs/10.jpg",
  "/ringtone-thumbs/11.jpg",
  "/ringtone-thumbs/12.jpg",
];

const getThumbnailIndex = (id: number | string) => {
  const str = id.toString();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % ringtoneThumbnails.length;
};

const getVideoThumbnail = (url: string) => {
  if (!url) return "";
  // Only apply Cloudinary transformations to Cloudinary URLs
  if (url.includes("cloudinary.com")) {
    return url
      .replace("/video/upload/", "/video/upload/so_0/")
      .replace(/\.(mp4|webm|mov)$/i, ".jpg");
  }
  return url; // Return as-is if it's R2, so it doesn't break
};

// Helper to safely format the thumbnail URL
const getSafeThumbnailUrl = (thumbPath: string | null | undefined) => {
  if (!thumbPath) return null;
  // If the path already has http in it, use it directly to avoid double URLs
  if (thumbPath.startsWith("http")) return thumbPath;
  return `https://cdn.kaviarts.com/${thumbPath}`;
};

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
              src={
                getSafeThumbnailUrl(item.file_path_thumb) || 
                getOptimizedDisplayUrl(item.file_url, priority ? 400 : 500)
              }
              width="500"
              height="888"
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
                src={
                  getSafeThumbnailUrl(item.file_path_thumb) || 
                  getVideoThumbnail(item.file_url)
                }
                alt={`${item.file_name} video thumbnail`}
                loading={priority ? "eager" : "lazy"}
                // @ts-ignore
                fetchPriority={priority ? "high" : "auto"}
                decoding="async"
                className="w-full h-full object-cover"
              />
            </>
          )}



        {item.file_type === "ringtone" && (
  <img
    src={ringtoneThumbnails[getThumbnailIndex(item.id)]}
    alt={`${item.file_name} ringtone thumbnail`}
    loading={priority ? "eager" : "lazy"}
    decoding="async"
    className="w-full h-full object-cover"
  />
)}

          {/* Hover overlay — unfocusable button */}
          <div
className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            aria-hidden="true"
          >
            <Button
              size="sm"
className="bg-transparent border border-white text-white hover:bg-white/10 transition-all duration-300 pointer-events-none"
              tabIndex={-1}
            >
{item.file_type === "video"
  ? "Watch"
  : item.file_type === "ringtone"
  ? "Listen"
  : "Download"}
            </Button>
          </div>

          {/* Badge with translucent contrast layer */}
          <div className="absolute top-2 left-2">
            <span
              className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full"
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