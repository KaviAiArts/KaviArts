import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentGrid from "@/components/ContentGrid";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ITEMS_PER_PAGE = 12;

/* ================================
   Helpers (NO GUESSWORK)
================================ */

// singularize cats → cat
const normalize = (text: string) => {
  const t = text.toLowerCase().trim();
  return t.endsWith("s") ? t.slice(0, -1) : t;
};

// word boundary for title / description / category
const wordMatch = (source: string, word: string) => {
  const re = new RegExp(`\\b${word}\\b`, "i");
  return re.test(source);
};

// tag match (handles: cat, cats, animal)
const tagMatch = (tags: string[], word: string) => {
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
  const rawQuery = queryParams.get("query") || "";
  const searchWord = normalize(rawQuery);
  const type = queryParams.get("type");
  const customTitle = queryParams.get("title");

  const [results, setResults] = useState<any[]>([]);
  const [visibleResults, setVisibleResults] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const performSearch = async () => {
    if (!searchWord) return;
    setLoading(true);

    // 1️⃣ Fetch broad candidates ONLY
    let query = supabase
      .from("files")
      .select("*")
      .or(
        `file_name.ilike.%${searchWord}%,description.ilike.%${searchWord}%,category.ilike.%${searchWord}%,tags.cs.{${searchWord},${searchWord}s}`
      )
      .limit(300);

    if (type) {
      query = query.eq("file_type", type);
    }

    const { data } = await query;

    // 2️⃣ Precise filtering (THIS FIXES EVERYTHING)
    const filtered =
      data?.filter((item) => {
        const title = item.file_name?.toLowerCase() || "";
        const desc = item.description?.toLowerCase() || "";
        const category = item.category?.toLowerCase() || "";
        const tags = item.tags || [];

        return (
          wordMatch(title, searchWord) ||
          wordMatch(desc, searchWord) ||
          wordMatch(category, searchWord) ||
          tagMatch(tags, searchWord)
        );
      }) || [];

    setResults(filtered);
    setVisibleResults(filtered.slice(0, ITEMS_PER_PAGE));
    setPage(1);
    setLoading(false);
  };

  useEffect(() => {
    performSearch();
  }, [rawQuery, type]);

  const loadMore = () => {
    const nextPage = page + 1;
    setVisibleResults(results.slice(0, nextPage * ITEMS_PER_PAGE));
    setPage(nextPage);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="font-semibold"
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
                <Button variant="outline" onClick={loadMore}>
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
