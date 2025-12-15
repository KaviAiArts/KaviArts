import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import ContentItem from "@/components/ContentItem";
import { Button } from "@/components/ui/button";

// ------------------------------
// CONTENT SECTION
// ------------------------------

const ContentSection = ({ title, items, category }) => {
  return (
    <>
      {/* MOBILE */}
      <section className="md:hidden py-4">
        <div className="px-4 flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = `/category/${category}`)}
          >
            View All
          </Button>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 px-4 w-max">
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

      {/* DESKTOP */}
      <section className="hidden md:block py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">{title}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = `/category/${category}`)}
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-6 gap-3">
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
      .order("created_at", { ascending: false })
      .limit(6);

    const { data: ringtoneData } = await supabase
      .from("files")
      .select("*")
      .eq("file_type", "ringtone")
      .order("created_at", { ascending: false })
      .limit(12);

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

      <ContentSection title="Newest Wallpapers" items={newest} category="wallpaper" />
      <ContentSection title="Popular Wallpapers" items={popularWallpapers} category="wallpaper" />
      <ContentSection title="Popular Ringtones" items={ringtones} category="ringtone" />
      <ContentSection title="Popular Videos" items={videos} category="video" />

      <Footer />
    </div>
  );
};

export default Index;
