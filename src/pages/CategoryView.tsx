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
  const from = params.get("from"); // section | null

  useEffect(() => {
    loadItems();
  }, [category, view]);

  const loadItems = async () => {
    let query = supabase
      .from("files")
      .select("*")
      .eq("file_type", category);

    // ✅ SORT ALWAYS FOLLOWS VIEW
    if (view === "newest") {
      query = query.order("created_at", { ascending: false });
    } else if (view === "popular") {
      query = query.order("downloads", { ascending: false });
    }
    // else → discovery (no enforced order)

    const { data } = await query;
    setItems(data || []);
  };

  const capitalize = (t?: string) =>
    t ? t.charAt(0).toUpperCase() + t.slice(1) : "";

  const title =
    from === "section" && view === "newest"
      ? `Newest ${capitalize(category)}s`
      : from === "section" && view === "popular"
      ? `Popular ${capitalize(category)}s`
      : `${capitalize(category)}s`;

  const showFilters = from !== "section";

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
          <h1 className="text-3xl font-bold">{title}</h1>

          {showFilters && (
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
