import { Search, Smartphone, Music, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Autocomplete from "./Autocomplete";
import debounce from "@/utils/debounce";
import fuzzySearch from "@/utils/fuzzyEngine";
import highlight from "@/utils/highlight";
import { supabase } from "@/lib/supabaseClient";

const Header = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const performFullSearch = (value?: string) => {
    const q = (value ?? query).trim();
    if (!q) return;
    navigate(`/search?query=${encodeURIComponent(q)}`);
    setShowDropdown(false);
  };

  const fetchSuggestions = async (text: string) => {
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    const { data } = await supabase
      .from("files")
      .select("*")
      .ilike("file_name", `%${text}%`)
      .limit(20);

    let results = data || [];
    if (results.length < 10) {
      const fuzzy = await fuzzySearch(text);
      results = [...results, ...fuzzy];
    }

    const map = new Map();
    results.forEach((i) => map.set(i.id, i));
    results = Array.from(map.values());

    setSuggestions(
      results.map((item) => ({
        ...item,
        highlightName: highlight(item.file_name, text),
      }))
    );

    setShowDropdown(true);
    setActiveIndex(0);
  };

  const debouncedFetch = debounce(fetchSuggestions, 250);

  useEffect(() => {
    function handleClickOutside(e: any) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-card border-b">
      <div className="container mx-auto px-4 py-4" ref={containerRef}>
        <div className="flex items-center justify-between">
          <h1
            onClick={() => navigate("/")}
            className="text-xl font-bold gradient-text cursor-pointer"
          >
            KaviArts
          </h1>

          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                debouncedFetch(e.target.value);
              }}
              placeholder="Search wallpapers, ringtones..."
            />

            <button
              onClick={() => performFullSearch()}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center"
            >
              <Search className="w-4 h-4" />
            </button>

            <Autocomplete
              suggestions={suggestions}
              visible={showDropdown}
              activeIndex={activeIndex}
              onSelect={(item) => performFullSearch(item.file_name)}
            />
          </div>

          <nav className="flex gap-2">
            <Button onClick={() => navigate("/category/wallpaper")}>
              <Smartphone className="w-4 h-4" />
            </Button>
            <Button onClick={() => navigate("/category/ringtone")}>
              <Music className="w-4 h-4" />
            </Button>
            <Button onClick={() => navigate("/category/video")}>
              <Video className="w-4 h-4" />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
