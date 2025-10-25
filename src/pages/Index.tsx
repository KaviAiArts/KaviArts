import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryNav from "@/components/CategoryNav";
import ContentGrid from "@/components/ContentGrid";
import Footer from "@/components/Footer";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const Index = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title =
      "AnythingForYou - Free Wallpapers & Ringtones | Download HD Mobile Content";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Download millions of free HD wallpapers, ringtones, and customization content for your mobile devices. Personalize your phone with beautiful backgrounds and sounds."
      );
    }

    // Fetch public items from Supabase
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("user_files")
        .select("*")
        .eq("is_public", true)
        .order("id", { ascending: false }); // newest first

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <CategoryNav />
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading content...</p>
        ) : (
          <ContentGrid items={items} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
