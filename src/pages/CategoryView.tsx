import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentGrid from "@/components/ContentGrid";
import { Button } from "@/components/ui/button";

const CategoryView = () => {
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);

  const params = new URLSearchParams(location.search);
  const sort = params.get("sort"); // popular | newest | null

  useEffect(() => {
    loadItems();
  }, [category, sort]);

  const loadItems = async () => {
    let query = supabase
      .from("files")
      .select("*")
      .eq("file_type", category);

    if (sort === "popular") {
      query = query.order("downloads", { ascending: false });
    } else if (sort === "newest") {
      query = query.order("created_at", { ascending: false });
    } else {
      // header click = discovery
      query = query.order("created_at", { ascending: false });
    }

    const { data } = await query;
    setItems(data || []);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold capitalize">
            {category}
          </h1>

          <div className="flex gap-2">
            {category === "wallpaper" && (
              <Button
                variant="outline"
                onClick={() =>
                  navigate(`/category/${category}?sort=newest`)
                }
              >
                Newest
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() =>
                navigate(`/category/${category}?sort=popular`)
              }
            >
              View All
            </Button>
          </div>
        </div>

        {/* 🔑 THIS IS THE KEY FIX */}
        <ContentGrid items={items} />
      </main>

      <Footer />
    </div>
  );
};

export default CategoryView;
