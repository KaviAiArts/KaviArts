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
      setShowDropdown(false);
      return;
    }

    const q = text.toLowerCase();

    const { data } = await supabase
      .from("files")
      .select("*")
      .or(
        `file_name.ilike.%${q}%,description.ilike.%${q}%,tags.cs.{${q}}`
      )
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
      highlightTags: item.tags
        ? highlight(item.tags.join(", "), text)
        : null,
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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-card border-b" role="banner">
      <div className="container mx-auto px-4 py-4" ref={containerRef}>
        <div className="flex items-center justify-between">

          {/* Logo already had aria-label, keeping it */}
          <h1
            onClick={() => navigate("/")}
            className="text-xl font-bold gradient-text cursor-pointer"
            role="link"
            aria-label="Go to homepage"
            tabIndex={0}
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
              onKeyDown={handleKeyDown}
              onFocus={() => query.trim() && setShowDropdown(true)}
              placeholder="Search wallpapers, ringtones..."
              className="h-12 pr-12 bg-secondary border-border"
            />

            {/* FIX 1: Added aria-label to Desktop Search Button */}
            <button
              onClick={() => performFullSearch()}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-md flex items-center justify-center bg-secondary border border-border"
              type="button"
              aria-label="Search content"
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

          <nav className="flex items-center gap-2">
            {/* FIX 2: Added aria-labels to Category Buttons 
               (Because the text span is hidden on mobile, these become icon-only buttons there) */}
            
            <Button 
              variant="outline" 
              onClick={() => navigate("/category/wallpaper")}
              aria-label="View Wallpapers"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden md:inline ml-2">Wallpapers</span>
            </Button>

            <Button 
              variant="outline" 
              onClick={() => navigate("/category/ringtone")}
              aria-label="View Ringtones"
            >
              <Music className="w-4 h-4" />
              <span className="hidden md:inline ml-2">Ringtones</span>
            </Button>

            <Button 
              variant="outline" 
              onClick={() => navigate("/category/video")}
              aria-label="View Videos"
            >
              <Video className="w-4 h-4" />
              <span className="hidden md:inline ml-2">Videos</span>
            </Button>
          </nav>
        </div>

        <div className="md:hidden mt-4 relative">
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              debouncedFetch(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim() && setShowDropdown(true)}
            placeholder="Search found here..."
            className="h-12 pr-12 bg-secondary border-border"
          />

          {/* FIX 3: Added aria-label to Mobile Search Button */}
          <button
            onClick={() => performFullSearch()}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-md flex items-center justify-center bg-secondary border border-border"
            type="button"
            aria-label="Search content"
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