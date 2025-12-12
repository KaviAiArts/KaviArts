// src/pages/SearchResults.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentGrid from "@/components/ContentGrid";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const queryParams = useQuery();
  const q = queryParams.get("query") || "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = q ? `${q} - Search · KaviArts` : "Search · KaviArts";
  }, [q]);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    const fetchSearch = async () => {
      setLoading(true);

      // Search file_name case-insensitively
      // You can expand this query (tags, categories) later
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .ilike("file_name", `%${q}%`)
        .limit(200);

      if (error) {
        console.error("Search error:", error);
        setResults([]);
      } else {
        setResults(data || []);
      }

      setLoading(false);
    };

    fetchSearch();
  }, [q]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Search results for: <span className="text-primary">{q}</span></h1>
          <div>
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>Back</Button>
          </div>
        </div>

        {loading ? (
          <p className="text-center mt-10">Searching...</p>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <p className="mb-4">No results found for <strong>{q}</strong></p>
            <p className="text-sm text-muted-foreground">Try different keywords or check spelling</p>
          </div>
        ) : (
          <ContentGrid items={results} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;
