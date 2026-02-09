import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentGrid from "@/components/ContentGrid";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";


// ✅ 1. Define Limit per page
const ITEMS_PER_PAGE = 18;

/* Skeleton Loader Component */
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

  // ✅ 2. Add State for Pagination
  const [allItems, setAllItems] = useState<any[]>([]);       // Stores everything fetched
  const [visibleItems, setVisibleItems] = useState<any[]>([]); // Stores what user sees
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(location.search);
  const view = params.get("view"); // newest | popular | null
  const from = params.get("from"); // section | null

  useEffect(() => {
    loadItems();
  }, [category, view]);

  const loadItems = async () => {
    setLoading(true);
    // Reset page on new category load
    setPage(1); 

    let query = supabase
      .from("files")
      .select("*")
      .eq("file_type", category);

    // SORTING LOGIC
    if (view === "newest") {
      query = query.order("created_at", { ascending: false });
    } else if (view === "popular") {
      query = query.order("downloads", { ascending: false });
    }

    const { data } = await query;
    const fullData = data || [];

    // ✅ 3. Set Initial Data (First 12 items)
    setAllItems(fullData);
    setVisibleItems(fullData.slice(0, ITEMS_PER_PAGE));
    
    setLoading(false);
  };

  // ✅ 4. Load More Function (Same logic as SearchResults)
  const loadMore = () => {
    const nextPage = page + 1;
    const newLimit = nextPage * ITEMS_PER_PAGE;
    
    // Show next batch of items
    setVisibleItems(allItems.slice(0, newLimit));
    setPage(nextPage);
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

  // SEO Description logic
  const seoDescription = `Browse and download the best free ${category}s. High quality collection updated daily.`;
  const seoTitle = `${title} | KaviArts Free Downloads`;

  return (
    <div className="min-h-screen bg-background">


     <SEO
  title={seoTitle}
  description={seoDescription}
  url={`https://kaviarts.com/category/${category}`}
/>




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

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} aspect={skeletonAspect} />
            ))}
          </div>
        ) : (
          <>
            {/* Show Visible Items */}
            <ContentGrid items={visibleItems} />

            {/* ✅ 5. Render Load More Button if there are more items hidden */}
            {visibleItems.length < allItems.length && (
              <div className="text-center mt-10">
                <Button 
                  variant="outline" 
                  onClick={loadMore}
                  className="min-w-[150px]"
                >
                  Load More
                </Button>
              </div>
            )}

            {/* Empty State Check */}
            {visibleItems.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                No items found in this category.
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryView;