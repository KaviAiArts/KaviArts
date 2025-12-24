import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentGrid from "@/components/ContentGrid";
import { Button } from "@/components/ui/button";

/* ✅ ADDED: Skeleton Loader Component (Same style as Homepage) */
const SkeletonCard = ({ aspect = "portrait" }: { aspect?: "portrait" | "square" }) => {
  const ratio = aspect === "square" ? "aspect-square" : "aspect-[9/16]";
  return (
    <div className="glass-card overflow-hidden animate-pulse rounded-xl border bg-card/50">
      <div className={`${ratio} bg-muted/50`} />
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 bg-muted/50 rounded" />
        <div className="h-3 w-1/2 bg-muted/50 rounded" />
      </div>
    </div>
  );
};

const CategoryView = () => {
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  
  /* ✅ ADDED: Loading State */
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(location.search);
  const view = params.get("view"); // newest | popular | null
  const from = params.get("from"); // section | null

  useEffect(() => {
    loadItems();
  }, [category, view]);

  const loadItems = async () => {
    setLoading(true); // Start loading

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
    setLoading(false); // Stop loading
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

  // Determine skeleton shape based on category
  const isRingtone = category === "ringtone";
  const skeletonAspect = isRingtone ? "square" : "portrait";

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

        {/* ✅ FIXED: Show Skeleton while loading, Content when done */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} aspect={skeletonAspect} />
            ))}
          </div>
        ) : (
          <ContentGrid items={items} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryView;