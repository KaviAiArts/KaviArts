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

// 🔥 GLOBAL CACHE: Remembers data, page, and loaded items per category/view combination
const categoryCache: Record<string, any> = {};

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

  const params = new URLSearchParams(location.search);
  const view = params.get("view"); // newest | popular | null
  const from = params.get("from"); // section | null

  // Generate a unique cache key for this exact page state
  const cacheKey = `${category}-${view}-${from}`;
  const cached = categoryCache[cacheKey];

  // ✅ 2. Initialize State (Instantly uses cache if available)
  const [allItems, setAllItems] = useState<any[]>(cached?.allItems || []);
  const [visibleItems, setVisibleItems] = useState<any[]>(cached?.visibleItems || []);
  const [page, setPage] = useState(cached?.page || 1);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    // If we have cached data for this specific URL, restore it instantly
    if (categoryCache[cacheKey]) {
      setAllItems(categoryCache[cacheKey].allItems);
      setVisibleItems(categoryCache[cacheKey].visibleItems);
      setPage(categoryCache[cacheKey].page);
      setLoading(false);
    } else {
      // Otherwise, fetch fresh data
      loadItems();
    }
  }, [category, view, from]);

  const loadItems = async () => {
    setLoading(true);
    setPage(1); 

    let query = supabase
      .from("files")
      .select("*")
      .eq("file_type", category)
      .eq("is_published", true);

    // SORTING LOGIC
    if (view === "newest") {
      query = query.order("created_at", { ascending: false });
    } else if (view === "popular") {
      query = query.order("downloads", { ascending: false });
    }

    const { data } = await query;
    const fullData = data || [];
    const initialVisible = fullData.slice(0, ITEMS_PER_PAGE);

    // ✅ 3. Set Data & Save to Cache
    setAllItems(fullData);
    setVisibleItems(initialVisible);
    
    categoryCache[cacheKey] = {
      allItems: fullData,
      visibleItems: initialVisible,
      page: 1,
    };
    
    setLoading(false);
  };

  // ✅ 4. Load More Function
  const loadMore = () => {
    const nextPage = page + 1;
    const newLimit = nextPage * ITEMS_PER_PAGE;
    const newVisible = allItems.slice(0, newLimit);
    
    // Show next batch of items
    setVisibleItems(newVisible);
    setPage(nextPage);

    // Update the cache so the "Back" button remembers how far down they scrolled!
    categoryCache[cacheKey] = {
      allItems,
      visibleItems: newVisible,
      page: nextPage,
    };
  };

  const capitalize = (t?: string) =>



    t ? t.charAt(0).toUpperCase() + t.slice(1) : "";

  const title =
    from === "section" && view === "newest"
      ? `Newest ${capitalize(category)}s`
      : from === "section" && view === "popular"
      ? `Popular ${capitalize(category)}s`
      : `${capitalize(category)}s`;

// ✅ Special Section Word Buttons
const showSpecialWords = from === "section";

let specialWords: string[] = [];

if (showSpecialWords) {
  if (category === "wallpaper" && view === "newest") {
    specialWords = ["Minimal", "Aesthetic", "Spiritual", "Flowers"];
  }

  if (category === "wallpaper" && view === "popular") {
    specialWords = ["Anime", "Festival", "Design", "3D"];
  }

  if (category === "ringtone" && view === "popular") {
    specialWords = ["Love", "Sad", "BGM", "Lofi"];
  }

  if (category === "video" && view === "popular") {
    specialWords = ["cinematic", "loop", "status", "animation"];
  }
}

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



<div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">

  {/* LEFT SIDE */}
<div className="flex items-center gap-3 w-full md:w-auto min-w-0">
    <Button
      variant="custom"
      size="sm"
      onClick={() => navigate(-1)}
      className="neon-btn btn-back"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back
    </Button>

<h1 className="text-2xl md:text-3xl font-bold whitespace-nowrap overflow-hidden text-ellipsis flex-1">
  {title}
</h1>

  </div>

  {/* RIGHT SIDE */}
<div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">

    {/* Default Newest / Popular */}
    {showFilters && (
      <>
        <Button
          variant="custom"
          size="sm"
          className="neon-btn btn-filter"
          onClick={() =>
            navigate(`/category/${category}?view=newest`)
          }
        >
          Newest
        </Button>

        <Button
          variant="custom"
          size="sm"
          className="neon-btn btn-filter"
          onClick={() =>
            navigate(`/category/${category}?view=popular`)
          }
        >
          Popular
        </Button>
      </>
    )}

    {/* Special Word Buttons */}
    {showSpecialWords &&
      specialWords.map((word, index) => (
        <Button
          key={index}
          variant="custom"
          size="sm"
          className="neon-btn btn-filter"
          onClick={() =>
            navigate(
              `/search?q=${word}&type=${category}&title=${word} ${capitalize(category)}s`
            )
          }
        >
          {word}
        </Button>
      ))}

  </div>
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
  variant="custom"
  onClick={loadMore}
  className="neon-btn btn-loadmore min-w-[150px]"
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