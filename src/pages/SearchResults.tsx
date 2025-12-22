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
  const type = queryParams.get("type"); // wallpaper | ringtone | video
  const customTitle = queryParams.get("title");

  const [results, setResults] = useState<any[]>([]);
  const [visibleResults, setVisibleResults] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const performSearch = async () => {
    if (!searchText.trim()) return;
    setLoading(true);

    let query = supabase.from("files").select("*");

    if (type) {
      query = query.eq("file_type", type);
    }

    query = query.or(
      `file_name.ilike.%${searchText}%,description.ilike.%${searchText}%,tags.cs.{${searchText.toLowerCase()}}`
    );

    const { data } = await query.limit(200);

    setResults(data || []);
    setVisibleResults((data || []).slice(0, ITEMS_PER_PAGE));
    setPage(1);
    setLoading(false);
  };

  useEffect(() => {
    performSearch();
  }, [searchText, type]);

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
            {customTitle || `Search results for: ${searchText}`}
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
