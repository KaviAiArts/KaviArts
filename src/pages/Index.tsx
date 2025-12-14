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
// REUSABLE CONTENT SECTION (FIXED)
// ------------------------------

const ContentSection = ({ title, items, category }) => {
  return (
    <>
      {/* ================= MOBILE (SCROLL) ================= */}
      <section className="md:hidden py-4">
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

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-4 w-max">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0"
                style={{ width: "42vw", maxWidth: "190px" }}
              >
                <ContentItem item={item} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= DESKTOP (GRID 6 × 2) ================= */}
      <section className="hidden md:block py-6">
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

          {/* ✅ 12 ITEMS → 6 PER ROW → 2 ROWS */}
          <div className="grid grid-cols-6 gap-6 auto-rows-fr">
            {items.map((item) => (
              <ContentItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </>
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
