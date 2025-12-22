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

const normalizeKeyword = (word: string) => {
  if (word.endsWith("s")) {
    return [word.slice(0, -1), word];
  }
  return [word, `${word}s`];
};

const SearchResults = () => {
  const queryParams = useQuery();
  const searchText = (queryParams.get("query") || "").trim();
  const fromChip = queryParams.get("from") === "chip";

  const [results, setResults] = useState<any[]>([]);
  const [visibleResults, setVisibleResults] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const performSearch = async () => {
    if (!searchText) return;
    setLoading(true);

    const allowedTypes = ["wallpaper", "video", "ringtone"];
    const keyword = searchText.toLowerCase();

    const forms = normalizeKeyword(keyword);
    const wordRegex = new RegExp(`\\b(${forms.join("|")})\\b`, "i");

    const { data } = await supabase
      .from("files")
      .select("*")
      .in("file_type", allowedTypes)
      .limit(300);

    const preciseResults = (data || []).filter((item) => {
      const name = item.file_name?.toLowerCase() || "";
      const desc = item.description?.toLowerCase() || "";
      const tags = Array.isArray(item.tags)
        ? item.tags.join(" ").toLowerCase()
        : "";

      return (
        wordRegex.test(name) ||
        wordRegex.test(desc) ||
        wordRegex.test(tags)
      );
    });

    preciseResults.sort(
      (a, b) => (b.downloads || 0) - (a.downloads || 0)
    );

    setResults(preciseResults);
    setVisibleResults(preciseResults.slice(0, ITEMS_PER_PAGE));
    setPage(1);
    setLoading(false);
  };

  useEffect(() => {
    performSearch();
  }, [searchText]);

  const loadMore = () => {
    const nextPage = page + 1;
    const end = nextPage * ITEMS_PER_PAGE;
    setVisibleResults(results.slice(0, end));
    setPage(nextPage);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {!fromChip && (
          <>
            <h1 className="text-3xl font-bold">Search results for:</h1>
            <p className="text-xl text-primary font-semibold truncate max-w-[80%] mt-1">
              {searchText}
            </p>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => window.history.back()}
        >
          ← Back
        </Button>

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
