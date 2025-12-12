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
// Read query string (?query=xxxx)
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
  // Perform multi-source search
  // ---------------------------------------------------------
  const performSearch = async () => {
    if (!searchText.trim()) return;

    setLoading(true);

    let finalResults: any[] = [];

    // -- 1) Exact / partial Supabase title match --
    const { data: titleMatches } = await supabase
      .from("files")
      .select("*")
      .ilike("file_name", `%${searchText}%`)
      .limit(200);

    // -- 2) Tag match --
    const { data: tagMatches } = await supabase
      .from("files")
      .select("*")
      .contains("tags", [searchText.toLowerCase()])
      .limit(200);

    // -- 3) Category match --
    const { data: catMatches } = await supabase
      .from("files")
      .select("*")
      .ilike("category", `%${searchText}%`)
      .limit(100);

    // Combine
    finalResults = [
      ...(titleMatches || []),
      ...(tagMatches || []),
      ...(catMatches || []),
    ];

    // Remove duplicates
    const map = new Map();
    finalResults.forEach((item) => map.set(item.id, item));
    finalResults = Array.from(map.values());

    // -- 4) Fuzzy fallback if needed --
    if (finalResults.length < 12) {
      const fuzzy = await fuzzySearch(searchText);
      fuzzy.forEach((item) => map.set(item.id, item));
      finalResults = Array.from(map.values());
    }

    // finalResults contains ALL matches now
    setResults(finalResults);
    setVisibleResults(finalResults.slice(0, ITEMS_PER_PAGE));

    setPage(1);
    setLoading(false);
  };

  // ---------------------------------------------------------
  // Run search on mount & when query changes
  // ---------------------------------------------------------
  useEffect(() => {
    performSearch();
  }, [searchText]);

  // ---------------------------------------------------------
  // Pagination: Load More button
  // ---------------------------------------------------------
  const loadMore = () => {
    const nextPage = page + 1;
    const start = 0;
    const end = nextPage * ITEMS_PER_PAGE;

    setVisibleResults(results.slice(start, end));
    setPage(nextPage);
  };

  // ---------------------------------------------------------
  // Highlight matches
  // ---------------------------------------------------------
  const prepareHighlighted = (items: any[]) => {
    return items.map((item) => ({
      ...item,
      file_name_highlight: highlight(item.file_name, searchText),
    }));
  };

  const finalVisible = prepareHighlighted(visibleResults);

  // ---------------------------------------------------------
  // UI output
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-3">
          Search results for:{" "}
          <span className="text-primary">{searchText}</span>
        </h1>

        {loading ? (
          <p className="text-center mt-10">Searching...</p>
        ) : finalVisible.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-xl mb-2">No results found</h2>
            <p className="text-muted-foreground">
              Try a different keyword or check spelling
            </p>
          </div>
        ) : (
          <>
            <ContentGrid
              items={finalVisible.map((item) => ({
                ...item,
                // The grid still shows the real name,
                // highlight only on autocomplete and results header
              }))}
            />

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
