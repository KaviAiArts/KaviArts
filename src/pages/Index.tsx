import { lazy, Suspense, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getOptimizedDisplayUrl } from "@/lib/utils";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

/* ✅ Lazy load heavy card component */
const ContentItemImport = import("@/components/ContentItem");
const ContentItem = lazy(() => ContentItemImport);

/* ------------------------------ */
/* SKELETON CARD (UI ONLY)        */
/* ------------------------------ */

const SkeletonCard = ({ aspect = "portrait" }: { aspect?: "portrait" | "square" }) => {
  const ratio = aspect === "square" ? "aspect-square" : "aspect-[9/16]";

  return (
    <div className="glass-card overflow-hidden animate-pulse">
      <div className={`${ratio} bg-muted`} />
      <div className="p-3">
        <div className="h-3 w-3/4 bg-muted rounded" />
      </div>
    </div>
  );
};


/* ------------------------------ */
/* CONTENT SECTION COMPONENT      */
/* ------------------------------ */

const ContentSection = ({
  title,
  items,
  category,
  view,
  loading,
  skeletonCount,
  skeletonAspect,
}: {
  title: string;
  items: any[];
  category: string;
  view?: string;
  loading: boolean;
  skeletonCount: number;
  skeletonAspect?: "portrait" | "square";
}) => {
  const targetUrl = `/category/${category}` + (view ? `?view=${view}&from=section` : "");
  
  // ✅ SMART CSS: Only apply content-visibility to sections below the fold
  const isAboveFold = title === "Newest Wallpapers";
  const visibilityStyle = isAboveFold 
    ? {} 
    // @ts-ignore - React types sometimes complain about contentVisibility
    : { contentVisibility: "auto", containIntrinsicSize: "auto 400px" };

  return (
    <>
      {/* MOBILE */}
      <section className="md:hidden py-4" style={visibilityStyle}>
        <div className="px-4 flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            className="neon-btn btn-viewall border-2 rounded px-3 py-1 text-sm"
            onClick={() => (window.location.href = targetUrl)}
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 px-4 w-max">
            {loading
              ? Array.from({ length: skeletonCount }).map((_, i) => (
                  <div key={i} className="flex-shrink-0" style={{ width: "42vw", maxWidth: "190px" }}>
                    <SkeletonCard aspect={skeletonAspect} />
                  </div>
                ))
              : items.map((item, index) => (
                  <div key={item.id} className="flex-shrink-0" style={{ width: "42vw", maxWidth: "190px" }}>
                    {index === 0 && isAboveFold ? (
                      <Suspense fallback={<SkeletonCard aspect={skeletonAspect} />}>
                        <ContentItem item={item} priority />
                      </Suspense>
                    ) : (
                      <Suspense fallback={<SkeletonCard aspect={skeletonAspect} />}>
                        <ContentItem item={item} />
                      </Suspense>
                    )}
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* DESKTOP */}
      <section className="hidden md:block py-4" style={visibilityStyle}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              className="neon-btn btn-viewall border-2 rounded px-3 py-1 text-sm"
              onClick={() => (window.location.href = targetUrl)}
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-6 gap-3">
            {loading
              ? Array.from({ length: skeletonCount }).map((_, i) => (
                  <SkeletonCard key={i} aspect={skeletonAspect} />
                ))
              : (category === "ringtone" ? items : items.slice(0, 6)).map((item, index) =>
                  index < 2 && isAboveFold ? (
                    <ContentItem key={item.id} item={item} priority />
                  ) : (
                    <Suspense key={item.id} fallback={<SkeletonCard aspect={skeletonAspect} />}>
                      <ContentItem item={item} />
                    </Suspense>
                  )
                )}
          </div>
        </div>
      </section>
    </>
  );
};


/* ------------------------------ */
/* MAIN HOMEPAGE                  */
/* ------------------------------ */

const Index = () => {
  const [newest, setNewest] = useState<any[]>([]);
  const [popularWallpapers, setPopularWallpapers] = useState<any[]>([]);
  const [ringtones, setRingtones] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

// SMART LCP PRELOAD: Preloads the exact thumbnail the user will actually see
const getLcpImage = () => {
  const lcpItem = newest.length > 0 ? newest[0] : null;
  if (!lcpItem) return undefined;

  if (lcpItem.file_url?.includes("cloudinary")) {
    return getOptimizedDisplayUrl(lcpItem.file_url, 320);
  } else if (lcpItem.file_path_thumb) {
    const path = lcpItem.file_path_thumb;
    return path.startsWith("http") ? path : `https://cdn.kaviarts.com/${path}`;
  }
  return lcpItem.file_url;
};

const lcpImage = getLcpImage();

useEffect(() => {
  ContentItemImport; // preload component
  loadData();
}, []);


const loadData = async () => {
    setLoading(true);
    
    // ✅ OPTIMIZED COLUMNS: Only fetching what the card actually uses (added 'title' for alt text)
    const selectColumns = "id, title, file_name, file_type, file_url, file_path_thumb, description";

    const { data: newestData } = await supabase
      .from("files")
      .select(selectColumns)
      .eq("file_type", "wallpaper")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(6); // Limited to 6 to save DOM nodes

    const { data: popularData } = await supabase
      .from("files")
      .select(selectColumns)
      .eq("file_type", "wallpaper")
      .eq("is_published", true)
      .order("downloads", { ascending: false })
      .limit(6);

    const { data: ringtoneData } = await supabase
      .from("files")
      .select(selectColumns)
      .eq("file_type", "ringtone")
      .eq("is_published", true)
      .order("downloads", { ascending: false })
      .limit(12); // Kept at 12 because audio cards are tiny UI elements

    const { data: videoData } = await supabase
      .from("files")
      .select(selectColumns)
      .eq("file_type", "video")
      .eq("is_published", true)
      .order("downloads", { ascending: false })
      .limit(6);

    if (newestData) setNewest(newestData);
    if (popularData) setPopular(popularData);
    if (ringtoneData) setRingtones(ringtoneData);
    if (videoData) setVideos(videoData);

    setLoading(false);
  };


  return (
    <div className="home-page">
      {/* ✅ HOMEPAGE SEO */}
      <SEO
        title="Free 4K Wallpapers, Ringtones & Videos"
        description="Download high-quality 4K wallpapers, trending ringtones, and stock videos for free. No account required."
        url="https://kaviarts.com/"
image={lcpImage}
      />

      <Header />

      <main id="main-content">
  <div className="hidden md:block">
    <Hero />
  </div>

  <CategoryNav />

<ContentSection
  title="Newest Wallpapers"
  items={newest}
  category="wallpaper"
  view="newest"
  loading={loading}
  skeletonCount={6}
  skeletonAspect="portrait"
/>

        <ContentSection
          title="Popular Wallpapers"
          items={popularWallpapers}
          category="wallpaper"
          view="popular"
          loading={loading}
          skeletonCount={6}
          skeletonAspect="portrait"
        />

        <ContentSection
          title="Popular Ringtones"
          items={ringtones}
          category="ringtone"
          view="popular"
          loading={loading}
          skeletonCount={6}
          skeletonAspect="square"
        />

        <ContentSection
          title="Popular Videos"
          items={videos}
          category="video"
          view="popular"
          loading={loading}
          skeletonCount={6}
          skeletonAspect="portrait"
        />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
