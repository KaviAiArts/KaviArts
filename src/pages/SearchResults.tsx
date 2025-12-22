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

const SearchResults = () => {
  const queryParams = useQuery();
  const searchText = queryParams.get("query") || "";
  const fromChip = queryParams.get("from") === "chip";

  const [results, setResults] = useState<any[]>([]);
  const [visibleResults, setVisibleResults] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const performSearch = async () => {
    if (!searchText.trim()) return;
    setLoading(true);

    const normalized = searchText.toLowerCase().replace(/s$/, "");

    const { data } = await supabase
      .from("files")
      .select("*")
      .or(
        [
          `file_name.ilike.%${normalized}%`,
          `description.ilike.%${normalized}%`,
          `tags.cs.{${normalized}}`,
        ].join(",")
      )
      .limit(300);

    const filtered =
      data?.filter((item: any) => {
        const text =
          `${item.file_name} ${item.description || ""}`.toLowerCase();
        return new RegExp(`\\b${normalized}s?\\b`).test(text);
      }) || [];

    filtered.sort(
      (a: any, b: any) => (b.downloads || 0) - (a.downloads || 0)
    );

    setResults(filtered);
    setVisibleResults(filtered.slice(0, ITEMS_PER_PAGE));
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

      {/* ✅ MATCHES CategoryView spacing exactly */}
      <main className="container mx-auto px-4 py-6">
        {!fromChip && (
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              className="font-semibold"
              onClick={() => window.history.back()}
            >
              ← Back
            </Button>

            <h1 className="text-3xl font-bold truncate">
              Search results for:{" "}
              <span className="text-primary">{searchText}</span>
            </h1>
          </div>
        )}

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
