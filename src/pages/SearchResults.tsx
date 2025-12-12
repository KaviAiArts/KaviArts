import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentGrid from "@/components/ContentGrid";

import { supabase } from "@/lib/supabaseClient";
import fuzzySearch from "@/utils/fuzzyEngine";
import highlight from "@/utils/highlight";

import { Button } from "@/components/ui/button";

// Read query param
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ITEMS_PER_PAGE = 12;

const SearchResults = () => {
  const queryParams = useQuery();
  const searchText = queryParams.get("query") || "";

  const [results, setResults] = useState<any[]>([]);
  const [visibleResults, setVisibleResults] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Perform search
  const performSearch = async () => {
    if (!searchText.trim()) return;
    setLoading(true);

    let combined: any[] = [];

    // 1️⃣ Search by readable short name (file_name)
    const { data: titleMatches } = await supabase
      .from("files")
      .select("*") // ⭐ GET FULL DATA including file_url
      .ilike("file_name", `%${searchText}%`)
      .limit(200);

    // 2️⃣ Search by tags
    const { data: tagMatches } = await supabase
      .from("files")
      .select("*")
      .contains("tags", [searchText.toLowerCase()])
      .limit(200);

    // 3️⃣ Search by category
    const { data: categoryMatches } = await supabase
      .from("files")
      .select("*")
      .ilike("category", `%${searchText}%`)
      .limit(100);

    combined = [
      ...(titleMatches || []),
      ...(tagMatches || []),
      ...(categoryMatches || []),
    ];

    // Deduplicate
    const map = new Map();
    combined.forEach((item) => map.set(item.id, item));
    combined = Array.from(map.values());

    // 4️⃣ Fuzzy fallback using readable names
    if (combined.length < 12) {
      const fuzzy = await fuzzySearch(searchText);
      fuzzy.forEach((item) => map.set(item.id, item));
      combined = Array.from(map.values());
    }

    setResults(combined);
    setVisibleResults(combined.slice(0, ITEMS_PER_PAGE));
    setPage(1);
    setLoading(false);
  };

  // Trigger search
  useEffect(() => {
    performSearch();
  }, [searchText]);

  // Pagination
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
        <h1 className="text-3xl font-bold">Search results for:</h1>

        {/* Short readable title */}
        <p className="text-xl text-primary font-semibold truncate max-w-[80%] mt-1">
          {searchText}
        </p>

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
            {/* ⭐ FIXED: Full card data passed */}
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
