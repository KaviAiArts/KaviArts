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

    const highlighted = results.map((item) => ({
      ...item,
      highlightName: highlight(item.file_name, text),
      highlightCategory: highlight(item.category || "", text),
      highlightTags: item.tags ? highlight(item.tags.join(", "), text) : null,
    }));

    setSuggestions(highlighted);
    setShowDropdown(true);
    setActiveIndex(0);
  };

  const debouncedFetch = debounce(fetchSuggestions, 250);

  const handleKeyDown = (e: any) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((p) => (p + 1 < suggestions.length ? p + 1 : p));
    } else if (e.key === "ArrowUp") {
      setActiveIndex((p) => (p - 1 >= 0 ? p - 1 : p));
    } else if (e.key === "Enter") {
      performFullSearch();
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

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

          {/* LOGO */}
          <h1
            onClick={() => navigate("/")}
            className="text-xl font-bold gradient-text cursor-pointer"
          >
            KaviArts
          </h1>

          {/* DESKTOP SEARCH */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                debouncedFetch(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => query.trim() && setShowDropdown(true)}
              placeholder="Search wallpapers, ringtones..."
              className="h-12 pr-12 bg-secondary border-border"
            />

            {/* SEARCH ICON (NO JUMP, PERFECT CENTER) */}
            <button
              onClick={() => performFullSearch()}
              className="
                absolute right-1 top-1/2 -translate-y-1/2
                h-9 w-9 rounded-md
                flex items-center justify-center
                bg-secondary border border-border
                transition-colors transition-transform
                hover:bg-secondary/80 hover:scale-105
                active:scale-95
              "
            >
              <Search className="w-4 h-4" />
            </button>

            <Autocomplete
              suggestions={suggestions}
              visible={showDropdown}
              activeIndex={activeIndex}
              onSelect={(item) => {
                setQuery(item.file_name);
                performFullSearch(item.file_name);
              }}
            />
          </div>

          {/* NAV BUTTONS */}
          <nav className="flex items-center gap-2">
            <Button variant="outline" className="h-11 hover-lift">
              <Smartphone className="w-4 h-4" />
              <span className="hidden md:inline ml-2">Wallpapers</span>
            </Button>

            <Button variant="outline" className="h-11 hover-lift">
              <Music className="w-4 h-4" />
              <span className="hidden md:inline ml-2">Ringtones</span>
            </Button>

            <Button variant="outline" className="h-11 hover-lift">
              <Video className="w-4 h-4" />
              <span className="hidden md:inline ml-2">Videos</span>
            </Button>
          </nav>
        </div>

        {/* MOBILE SEARCH */}
        <div className="md:hidden mt-4 relative">
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              debouncedFetch(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim() && setShowDropdown(true)}
            placeholder="Search wallpapers, ringtones..."
            className="h-12 pr-12 bg-secondary border-border"
          />

          <button
            onClick={() => performFullSearch()}
            className="
              absolute right-1 top-1/2 -translate-y-1/2
              h-9 w-9 rounded-md
              flex items-center justify-center
              bg-secondary border border-border
              active:scale-95
            "
          >
            <Search className="w-4 h-4" />
          </button>

          <Autocomplete
            suggestions={suggestions}
            visible={showDropdown}
            activeIndex={activeIndex}
            onSelect={(item) => {
              setQuery(item.file_name);
              performFullSearch(item.file_name);
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
