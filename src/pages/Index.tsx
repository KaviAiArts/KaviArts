import { lazy, Suspense, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getOptimizedDisplayUrl } from "@/lib/utils";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PullToRefresh from "react-simple-pull-to-refresh";

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

// 🔥 GLOBAL CACHE: Keeps data in memory so the back button is instant
let cachedHomeData: any = null;

const Index = () => {
  // Use cached data instantly if it exists
  const [newest, setNewest] = useState<any[]>(cachedHomeData?.newest || []);
  const [popularWallpapers, setPopularWallpapers] = useState<any[]>(cachedHomeData?.popularWallpapers || []);
  const [ringtones, setRingtones] = useState<any[]>(cachedHomeData?.ringtones || []);
  const [videos, setVideos] = useState<any[]>(cachedHomeData?.videos || []);
  
  // If we have cached data, do NOT show the loading screen
  const [loading, setLoading] = useState(!cachedHomeData);

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
  // Only fetch from network if we haven't cached the data yet
  if (!cachedHomeData) {
    loadData();
  }
}, []);


const loadData = async () => {
    setLoading(true);
    
    // ✅ BUG 1 FIXED: Removed 'title' from the query so Supabase stops crashing
    const selectColumns = "id, file_name, file_type, file_url, file_path_thumb, description";

    const { data: newestData } = await supabase
      .from("files")
      .select(selectColumns)
      .eq("file_type", "wallpaper")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(6); 

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
      .limit(12); 

    const { data: videoData } = await supabase
      .from("files")
      .select(selectColumns)
      .eq("file_type", "video")
      .eq("is_published", true)
      .order("downloads", { ascending: false })
      .limit(6);

    // ✅ BUG 2 FIXED: Using your exact state setter names (setPopularWallpapers instead of setPopular)
    setNewest(newestData || []);
    setPopularWallpapers(popularData || []);
    setRingtones(ringtoneData || []);
    setVideos(videoData || []);

cachedHomeData = {
      newest: newestData || [],
      popularWallpapers: popularData || [],
      ringtones: ringtoneData || [],
      videos: videoData || [],
    };

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
        {/* ✅ ZERO-LOSS NATIVE FEATURE: Pull to refresh wrapped around the content */}
        <PullToRefresh 
          onRefresh={loadData} 
          pullingContent={""} // Hides the default text so it's just a clean spinner
          backgroundColor="#09090b" // Matches your dark theme background
        >
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
        </PullToRefresh>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
