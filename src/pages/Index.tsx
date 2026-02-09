import { lazy, Suspense, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
<<<<<<< HEAD
import { Helmet } from "react-helmet-async";
=======
>>>>>>> node20-upgrade

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

/* ✅ Lazy load heavy card component */
const ContentItem = lazy(() => import("@/components/ContentItem"));

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
  const targetUrl =
    `/category/${category}` + (view ? `?view=${view}&from=section` : "");

  return (
    <>
      {/* MOBILE */}
      <section className="md:hidden py-4">
        <div className="px-4 flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            className="border rounded px-3 py-1 text-sm"
            onClick={() => (window.location.href = targetUrl)}
          >
            View All
          </button>
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
              : items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0"
                    style={{ width: "42vw", maxWidth: "190px" }}
                  >
                    {index < 2 ? (
<<<<<<< HEAD
                      // 🔥 LCP-safe: render immediately
=======
>>>>>>> node20-upgrade
                      <ContentItem item={item} priority />
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
      <section className="hidden md:block py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              className="border rounded px-3 py-1 text-sm"
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
              : items.map((item, index) =>
                  index < 2 ? (
<<<<<<< HEAD
                    // 🔥 LCP-safe items
                    <ContentItem key={item.id} item={item} priority />
                  ) : (
                    <Suspense
                      key={item.id}
                      fallback={<SkeletonCard aspect={skeletonAspect} />}
                    >
=======
                    <ContentItem key={item.id} item={item} priority />
                  ) : (
                    <Suspense key={item.id} fallback={<SkeletonCard aspect={skeletonAspect} />}>
>>>>>>> node20-upgrade
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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

    setNewest(newestData || []);
    setPopularWallpapers(popularData || []);
    setRingtones(ringtoneData || []);
    setVideos(videoData || []);
    setLoading(false);
  };

  return (
    <div>
<<<<<<< HEAD
      <Helmet>
        <title>KaviArts | Free 4K Wallpapers, Ringtones & Videos</title>
        <meta
          name="description"
          content="Download high-quality 4K wallpapers, trending ringtones, and stock videos for free. No account required."
        />
        <link rel="canonical" href="https://kaviarts.com/" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kaviarts.com" />
        <meta property="og:site_name" content="Kavi Arts" />
        <meta property="og:title" content="KaviArts | Free Media Downloads" />
        <meta
          property="og:description"
          content="Download high-quality 4K wallpapers, trending ringtones, and stock videos for free."
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dbrhsfdle/image/upload/v1768036035/bzptb3m7zdahlmtesvix.jpg"
        />

        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
=======
      {/* ✅ HOMEPAGE SEO */}
      <SEO
        title="Free 4K Wallpapers, Ringtones & Videos"
        description="Download high-quality 4K wallpapers, trending ringtones, and stock videos for free. No account required."
        url="https://kaviarts.com/"
        image="https://res.cloudinary.com/dbrhsfdle/image/upload/v1768036035/bzptb3m7zdahlmtesvix.jpg"
      />
>>>>>>> node20-upgrade

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
