import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentGrid from "@/components/ContentGrid";
import SEO from "@/components/SEO";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ITEMS_PER_PAGE = 18;

// 🔥 GLOBAL CACHE: Remembers search queries, page, and loaded results
const searchCache: Record<string, any> = {};

/* ================================
   SAFE HELPERS (NO GUESSWORK)
================================ */

// normalize plural → singular (cats → cat)
const normalize = (text: string) => {
  const t = text.toLowerCase().trim();
  return t.endsWith("s") ? t.slice(0, -1) : t;
};

// word boundary match (title / description)
const wordMatch = (source: string, word: string) => {
  const re = new RegExp(`\\b${word}\\b`, "i");
  return re.test(source);
};

// tag match (exact + plural/singular)
const tagMatch = (tags: string[] | null, word: string) => {
  if (!Array.isArray(tags)) return false;

  return tags.some((tag) => {
    const t = tag.toLowerCase();
    return (
      t === word ||
      t === `${word}s` ||
      word === `${t}s`
    );
  });
};



const SearchResults = () => {
  const queryParams = useQuery();
  const rawQuery = queryParams.get("q") || queryParams.get("query") || "";  
  const searchWord = normalize(rawQuery);
  const type = queryParams.get("type");
  const customTitle = queryParams.get("title");

  // Generate a unique cache key for this exact search
  const cacheKey = `${searchWord}-${type}`;
  const cached = searchCache[cacheKey];

  // Initialize from cache instantly if available
  const [results, setResults] = useState<any[]>(cached?.results || []);
  const [visibleResults, setVisibleResults] = useState<any[]>(cached?.visibleResults || []);
  const [page, setPage] = useState(cached?.page || 1);
  const [loading, setLoading] = useState(!cached);

  const performSearch = async () => {
    if (!searchWord) return;
    setLoading(true);

    let query = supabase.from("files").select("*").limit(500);

    if (type) {
      query = query.eq("file_type", type);
    }

    const { data } = await query;

    const filtered =
      data?.filter((item) => {
        const title = item.file_name?.toLowerCase() || "";
        const desc = item.description?.toLowerCase() || "";
        const tags = item.tags || [];

        return (
          wordMatch(title, searchWord) ||
          wordMatch(desc, searchWord) ||
          tagMatch(tags, searchWord)
        );
      }) || [];

    const initialVisible = filtered.slice(0, ITEMS_PER_PAGE);

    setResults(filtered);
    setVisibleResults(initialVisible);
    setPage(1);

    // Save to Cache
    searchCache[cacheKey] = {
      results: filtered,
      visibleResults: initialVisible,
      page: 1,
    };

    setLoading(false);
  };

  useEffect(() => {
    // Check if this exact search has already been done
    if (searchWord && searchCache[cacheKey]) {
      setResults(searchCache[cacheKey].results);
      setVisibleResults(searchCache[cacheKey].visibleResults);
      setPage(searchCache[cacheKey].page);
      setLoading(false);
    } else {
      performSearch();
    }
  }, [rawQuery, type]);

  const loadMore = () => {
    const nextPage = page + 1;
    const newLimit = nextPage * ITEMS_PER_PAGE;
    const newVisible = results.slice(0, newLimit);
    
    setVisibleResults(newVisible);
    setPage(nextPage);

    // Update Cache to remember the loaded items
    searchCache[cacheKey] = {
      results,
      visibleResults: newVisible,
      page: nextPage,
    };
  };

  return (



  <div className="min-h-screen bg-background">

    <SEO 
      title={`Search results for ${rawQuery}`}
      description="Browse our search results."
      url={`https://kaviarts.com/search?query=${rawQuery}`}
      noindex={true}  // ✅ TELLS GOOGLE NOT TO INDEX SEARCH PAGES
    />

    <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
         <Button
  variant="custom"
  size="sm"
  onClick={() => window.history.back()}
  className="neon-btn btn-back"
>
  ← Back
</Button>

          <h1 className="text-3xl font-bold">
            {customTitle || `Search results for: ${rawQuery}`}
          </h1>
        </div>

        {loading ? (
          <p className="text-center py-20">Searching...</p>
        ) : visibleResults.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-xl mb-2">No results found</h2>
            <p className="text-muted-foreground">
              Try another keyword.
            </p>
          </div>
        ) : (
          <>
            <ContentGrid items={visibleResults} />

           {visibleResults.length < results.length && (
  <div className="text-center mt-10">
    <Button
      variant="custom"
className="neon-btn btn-loadmore min-w-[150px]"
      onClick={loadMore}
    >
      Load More
    </Button>
  </div>
)}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;
