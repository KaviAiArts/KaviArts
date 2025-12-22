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
  const view = params.get("view"); // newest | popular | null

  useEffect(() => {
    loadItems();
  }, [category, view]);

  const loadItems = async () => {
    let query = supabase
      .from("files")
      .select("*")
      .eq("file_type", category);

    if (view === "popular") {
      query = query.order("downloads", { ascending: false });
    } else if (view === "newest") {
      query = query.order("created_at", { ascending: false });
    } else {
      // 🔀 RANDOM discovery (category button click)
      query = query.order("created_at", { ascending: false });
    }

    const { data } = await query;
    setItems(data || []);
  };

  const title =
    category?.charAt(0).toUpperCase() + category?.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {title}
          </h1>

          {/* ✅ FILTER BUTTONS ONLY FOR DIRECT CATEGORY VIEW */}
          {!view && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  navigate(`/category/${category}?view=newest`)
                }
              >
                Newest
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  navigate(`/category/${category}?view=popular`)
                }
              >
                Popular
              </Button>
            </div>
          )}
        </div>

        <ContentGrid items={items} />
      </main>

      <Footer />
    </div>
  );
};

export default CategoryView;
