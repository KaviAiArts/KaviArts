import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentGrid from "@/components/ContentGrid";

import { supabase } from "@/lib/supabaseClient";

import fuzzySearch from "@/utils/fuzzyEngine";
import highlight from "@/utils/highlight";

import { Button } from "@/components/ui/button";

// ---------------------------------------------------------
// Extract ?query= from URL
// ---------------------------------------------------------
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

  // ---------------------------------------------------------
  // PERFORM SEARCH
  // ---------------------------------------------------------
  const performSearch = async () => {
    if (!searchText.trim()) return;

    setLoading(true);

    let combined: any[] = [];

    // 1️⃣ Title match
    const { data: titleMatches } = await supabase
      .from("files")
      .select("*")
      .ilike("file_name", `%${searchText}%`)
      .limit(200);

    // 2️⃣ Tag match
    const { data: tagMatches } = await supabase
      .from("files")
      .select("*")
      .contains("tags", [searchText.toLowerCase()])
      .limit(200);

    // 3️⃣ Category match
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

    // 4️⃣ Fuzzy fallback
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

  // Run search
  useEffect(() => {
    performSearch();
  }, [searchText]);

  // ---------------------------------------------------------
  // Pagination: Load More
  // ---------------------------------------------------------
  const loadMore = () => {
    const nextPage = page + 1;
    const end = nextPage * ITEMS_PER_PAGE;
    setVisibleResults(results.slice(0, end));
    setPage(nextPage);
  };

  // ---------------------------------------------------------
  // Highlighting — only used in the header text display
  // ---------------------------------------------------------
  const highlightTrimmed = highlight(searchText, searchText);

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">

        {/* Page Title */}
        <h1 className="text-3xl font-bold">Search results for:</h1>

        {/* Query text — truncated (clean UI) */}
        <p className="text-xl text-primary font-semibold truncate max-w-[80%] mt-1">
          {searchText}
        </p>

        {/* Back Button */}
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => window.history.back()}
        >
          ← Back
        </Button>

        {/* RESULTS */}
        {loading ? (
          <p className="text-center py-16">Searching...</p>
        ) : visibleResults.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-xl mb-2">No results found</h2>
            <p className="text-muted-foreground">
              Try another keyword or refine your search.
            </p>
          </div>
        ) : (
          <>
            {/* Render results using your existing grid */}
            <ContentGrid
              items={visibleResults}
            />

            {/* Load More */}
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
