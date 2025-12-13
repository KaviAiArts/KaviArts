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

  // Navigate with typed keyword OR selected suggestion
  const performFullSearch = (value?: string) => {
    const q = (value ?? query).trim();
    if (!q) return;

    navigate(`/search?query=${encodeURIComponent(q)}`);
    setShowDropdown(false);
  };

  // Fetch autocomplete suggestions
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
      setActiveIndex((prev) =>
        prev + 1 < suggestions.length ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
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
            className="text-xl font-bold gradient-text cursor-pointer hover:opacity-80 transition"
          >
            KaviArts
          </h1>

          {/* DESKTOP SEARCH */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative h-[48px]">
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                debouncedFetch(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => query.trim() && setShowDropdown(true)}
              placeholder="Search wallpapers, ringtones..."
              className="pr-12 bg-secondary border-border truncate"
            />

            <Button
              size="icon"
              variant="outline"
              onClick={() => performFullSearch()}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 hover-lift"
            >
              <Search className="w-4 h-4" />
            </Button>

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
          <nav className="flex items-center gap-2 ml-3 shrink-0">
            <Button
              variant="outline"
              className="h-11 flex items-center gap-2 hover-lift active:scale-95"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden md:inline">Wallpapers</span>
            </Button>

            <Button
              variant="outline"
              className="h-11 flex items-center gap-2 hover-lift active:scale-95"
            >
              <Music className="w-4 h-4" />
              <span className="hidden md:inline">Ringtones</span>
            </Button>

            <Button
              variant="outline"
              className="h-11 flex items-center gap-2 hover-lift active:scale-95"
            >
              <Video className="w-4 h-4" />
              <span className="hidden md:inline">Videos</span>
            </Button>
          </nav>
        </div>

        {/* MOBILE SEARCH */}
        <div className="md:hidden mt-4 relative h-[48px]">
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              debouncedFetch(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim() && setShowDropdown(true)}
            placeholder="Search wallpapers, ringtones..."
            className="pr-12 bg-secondary border-border truncate"
          />

         

<Button
  size="icon"
  variant="outline"
  onClick={() => performFullSearch()}
  className="
    absolute right-1 inset-y-0 my-auto
    h-9 w-9
    flex items-center justify-center
    transition-transform
    hover:scale-105
    active:scale-95
  "
>
  <Search className="w-4 h-4" />
</Button>



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
