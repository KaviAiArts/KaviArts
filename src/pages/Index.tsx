import { lazy, Suspense, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Helmet } from "react-helmet-async"; // ✅ SEO Import

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

/* ✅ Lazy load heavy card component */
const ContentItem = lazy(() => import("@/components/ContentItem"));

/* ------------------------------ */
/* CACHE CONFIGURATION            */
/* ------------------------------ */
const CACHE_KEY = "kaviarts_home_cache_v1";
const CACHE_TIME = 5 * 60 * 1000; // 5 Minutes (Data stays fresh for 5 mins)

/* ------------------------------ */
/* SKELETON CARD (UI ONLY)        */
/* ------------------------------ */

const SkeletonCard = ({ aspect = "portrait" }: { aspect?: "portrait" | "square" }) => {
  const ratio =
    aspect === "square" ? "aspect-square" : "aspect-[9/16]";

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
  const targetUrl =
    `/category/${category}` +
    (view ? `?view=${view}&from=section` : "");

  return (
    <>
      {/* MOBILE */}
      <section className="md:hidden py-4">
        <div className="px-4 flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = targetUrl)}
          >
            View All
          </Button>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 px-4 w-max">
            {loading
              ? Array.from({ length: skeletonCount }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0"
                    style={{ width: "42vw", maxWidth: "190px" }}
                  >
                    <SkeletonCard aspect={skeletonAspect} />
                  </div>
                ))
              : items.map((item) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0"
                    style={{ width: "42vw", maxWidth: "190px" }}
                  >
                    <Suspense fallback={<SkeletonCard aspect={skeletonAspect} />}>
                      <ContentItem item={item} />
                    </Suspense>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* DESKTOP */}
      <section className="hidden md:block py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">{title}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = targetUrl)}
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-6 gap-3">
            {loading
              ? Array.from({ length: skeletonCount }).map((_, i) => (
                  <SkeletonCard key={i} aspect={skeletonAspect} />
                ))
              : items.map((item) => (
                  <Suspense
                    key={item.id}
                    fallback={<SkeletonCard aspect={skeletonAspect} />}
                  >
                    <ContentItem item={item} />
                  </Suspense>
                ))}
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // 1. CHECK CACHE FIRST
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const isFresh = Date.now() - timestamp < CACHE_TIME;

      if (isFresh) {
        // Use cached data (INSTANT LOAD)
        setNewest(data.newest);
        setPopularWallpapers(data.popularWallpapers);
        setRingtones(data.ringtones);
        setVideos(data.videos);
        setLoading(false);
        return; 
      }
    }

    // 2. IF NO CACHE, FETCH FROM DB
    setLoading(true);

    const { data: newestData } = await supabase
      .from("files")
      .select("*")
      .eq("file_type", "wallpaper")
      .order("created_at", { ascending: false })
      .limit(6);

    const { data: popularData } = await supabase
      .from("files")
      .select("*")
      .eq("file_type", "wallpaper")
      .order("downloads", { ascending: false })
      .limit(6);

    const { data: ringtoneData } = await supabase
      .from("files")
      .select("*")
      .eq("file_type", "ringtone")
      .order("downloads", { ascending: false })
      .limit(12);

    const { data: videoData } = await supabase
      .from("files")
      .select("*")
      .eq("file_type", "video")
      .order("downloads", { ascending: false })
      .limit(6);

    const finalData = {
      newest: newestData || [],
      popularWallpapers: popularData || [],
      ringtones: ringtoneData || [],
      videos: videoData || [],
    };

    // 3. SET STATE & SAVE TO CACHE
    setNewest(finalData.newest);
    setPopularWallpapers(finalData.popularWallpapers);
    setRingtones(finalData.ringtones);
    setVideos(finalData.videos);
    
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({
      data: finalData,
      timestamp: Date.now()
    }));

    setLoading(false);
  };

  return (
    <div>
      {/* ✅ SEO TAGS */}
      <Helmet>
        <title>KaviArts | Free 4K Wallpapers, Ringtones & Videos</title>
        <meta 
          name="description" 
          content="Download high-quality 4K wallpapers, trending ringtones, and stock videos for free. No account required." 
        />
        <meta property="og:title" content="KaviArts | Free Media Downloads" />
        <meta property="og:description" content="Download high-quality 4K wallpapers, trending ringtones, and stock videos for free." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://kaviarts.com" />
      </Helmet>

      <Header />

      <main id="main-content">
        <Hero />
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