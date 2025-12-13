import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Components
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import ContentItem from "@/components/ContentItem";  // ✅ correct
import { Button } from "@/components/ui/button";

// ------------------------------
// REUSABLE CONTENT SECTION
// ------------------------------

const ContentSection = ({ title, items, category }) => {
  return (
    <section className="py-4 md:py-4">
      {/* ================= MOBILE (FULL WIDTH, ZEDGE STYLE) ================= */}
      <div className="lg:hidden">
        {/* Title row */}
        <div className="px-4 flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = `/category/${category}`)}
          >
            View All
          </Button>
        </div>

        {/* Horizontal scroll */}
        <div className="overflow-x-auto scrollbar-hide">
          <div
            className="flex gap-4 px-4"
            style={{ width: "max-content" }}
          >
            {items.length > 0 ? (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0"
                  /* 2 cards + peek of 3rd */
                  style={{ width: "42vw", maxWidth: "190px" }}
                >
                  <ContentItem item={item} />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                No content available yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ================= DESKTOP (UNCHANGED) ================= */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{title}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = `/category/${category}`)}
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-6 gap-6">
            {items.length > 0 ? (
              items.map((item) => (
                <ContentItem key={item.id} item={item} />
              ))
            ) : (
              <p className="text-muted-foreground col-span-6">
                No content available yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// ------------------------------
// MAIN HOMEPAGE
// ------------------------------

const Index = () => {
  const [newest, setNewest] = useState([]);
  const [popularWallpapers, setPopularWallpapers] = useState([]);
  const [ringtones, setRingtones] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    // 1. NEWEST WALLPAPERS (OK)
    const { data: newestData } = await supabase
      .from("files")
      .select("*")
      .eq("file_type", "wallpaper")
      .order("created_at", { ascending: false })
      .limit(6);

    // 2. POPULAR WALLPAPERS (FIXED: removed .order("likes"))
    const { data: popularData } = await supabase
      .from("files")
      .select("*")
      .eq("file_type", "wallpaper")
      .order("created_at", { ascending: false })
      .limit(6);

    // 3. POPULAR RINGTONES (FIXED)
    const { data: ringtoneData } = await supabase
      .from("files")
      .select("*")
      .eq("file_type", "ringtone")
      .order("created_at", { ascending: false })
      .limit(6);

    // 4. POPULAR VIDEOS (FIXED)
    const { data: videoData } = await supabase
      .from("files")
      .select("*")
      .eq("file_type", "video")
      .order("created_at", { ascending: false })
      .limit(6);

    setNewest(newestData || []);
    setPopularWallpapers(popularData || []);
    setRingtones(ringtoneData || []);
    setVideos(videoData || []);
  };

  return (
    <div>
      <Header />
      <Hero />
      <CategoryNav />

      <ContentSection 
        title="Newest Wallpapers" 
        items={newest} 
        category="wallpaper" 
      />

      <ContentSection 
        title="Popular Wallpapers" 
        items={popularWallpapers} 
        category="wallpaper" 
      />

      <ContentSection 
        title="Popular Ringtones" 
        items={ringtones} 
        category="ringtone" 
      />

      <ContentSection 
        title="Popular Videos" 
        items={videos} 
        category="video" 
      />

      <Footer />
    </div>
  );
};

export default Index;
