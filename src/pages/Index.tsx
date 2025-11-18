import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Import your components
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import ContentItem from "@/components/ContentGrid"; // This provides the card UI
import { Button } from "@/components/ui/button";

// ------------------------------
// REUSABLE CONTENT SECTION
// ------------------------------

const ContentSection = ({ title, items, category }) => {
  return (
    <section className="py-6 md:py-10 px-3">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = `/category/${category}`)}
          >
            View All
          </Button>
        </div>

        {/* Desktop Grid (6 items per row) */}
        <div className="hidden lg:grid lg:grid-cols-6 gap-6">
          {items.map((item) => (
            <ContentItem key={item.id} item={item} />
          ))}
        </div>

        {/* Mobile → 2.5 cards scroll */}
        <div className="lg:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 pb-4" style={{ width: "max-content" }}>
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`flex-shrink-0 ${
                  index === 0 ? "ml-2" : ""
                } ${index === items.length - 1 ? "mr-4" : ""}`}
                style={{ width: "calc((100vw - 2rem) / 2.5)" }}
              >
                <ContentItem item={item} />
              </div>
            ))}
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
    // 1. Newest Wallpapers
    const { data: newestData } = await supabase
      .from("files")
      .select("*")
      .eq("file_type", "wallpaper")
      .order("created_at", { ascending: false })
      .limit(12);

    // 2. Popular Wallpapers
    const { data: popularData } = await supabase
      .from("files")
      .select("*")
      .eq("file_type", "wallpaper")
      .order("likes", { ascending: false })
      .limit(12);

    // 3. Popular Ringtones
    const { data: ringtoneData } = await supabase
      .from("files")
      .select("*")
      .eq("file_type", "ringtone")
      .order("likes", { ascending: false })
      .limit(12);

    // 4. Popular Videos
    const { data: videoData } = await supabase
      .from("files")
      .select("*")
      .eq("file_type", "video")
      .order("likes", { ascending: false })
      .limit(12);

    setNewest(newestData || []);
    setPopularWallpapers(popularData || []);
    setRingtones(ringtoneData || []);
    setVideos(videoData || []);
  };

  return (
    <div>

      {/* Your original layout restored */}
      <Header />

      <Hero />

      <CategoryNav />

      <ContentSection
        title="Newest Wallpapers"
        items={newest}
        category="wallpapers"
      />

      <ContentSection
        title="Popular Wallpapers"
        items={popularWallpapers}
        category="wallpapers"
      />

      <ContentSection
        title="Popular Ringtones"
        items={ringtones}
        category="ringtones"
      />

      <ContentSection
        title="Popular Videos"
        items={videos}
        category="videos"
      />

      <Footer />

    </div>
  );
};

export default Index;
