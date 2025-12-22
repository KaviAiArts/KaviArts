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

    // 🔥 IMPORTANT FIX:
    // Fetch rows WITHOUT text filtering
    let query = supabase.from("files").select("*").limit(500);

    if (type) {
      query = query.eq("file_type", type);
    }

    const { data } = await query;

    // 🔒 ALL LOGIC HAPPENS HERE (SAFE)
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
