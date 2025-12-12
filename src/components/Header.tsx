import { Search, Menu } from "lucide-react";
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

  // ----------------------------------------------------------
  // 🔍 Navigate to Search Page
  // ----------------------------------------------------------
  const performFullSearch = (value?: string) => {
    const q = (value ?? query).trim();
    if (!q) return;
    navigate(`/search?query=${encodeURIComponent(q)}`);
    setShowDropdown(false);
  };

  // ----------------------------------------------------------
  // 🔄 Fetch suggestions from Supabase + fuzzy fallback
  // ----------------------------------------------------------
  const fetchSuggestions = async (text: string) => {
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    // 🔹 Fetch title, tags, category matches
    const { data, error } = await supabase
      .from("files")
      .select("id, file_name, category, tags")
      .ilike("file_name", `%${text}%`)
      .limit(20);

    let results = data || [];

    // 🔹 If not enough results → fuzzy fallback
    if (results.length < 10) {
      const fuzzy = await fuzzySearch(text);
      results = [...results, ...fuzzy];
    }

    // 🔹 Remove duplicates
    const map = new Map();
    results.forEach((item) => map.set(item.id, item));
    results = Array.from(map.values());

    // 🔹 Highlight matched text
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

  // ----------------------------------------------------------
  // ⌨️ Keyboard Navigation
  // ----------------------------------------------------------
  const handleKeyDown = (e: any) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((prev) =>
        prev + 1 < suggestions.length ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (suggestions[activeIndex]) {
        performFullSearch(suggestions[activeIndex].file_name);
      } else {
        performFullSearch();
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  // ----------------------------------------------------------
  // 🖱 Click outside closes dropdown
  // ----------------------------------------------------------
  useEffect(() => {
    function handleClickOutside(e: any) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ----------------------------------------------------------
  // 📌 UI Rendering
  // ----------------------------------------------------------
  return (
    <header className="sticky top-0 z-50 glass-card border-b">
      <div className="container mx-auto px-4 py-4" ref={containerRef}>
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold gradient-text">KaviArts</h1>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8 relative h-[48px]">

            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 cursor-pointer"
              onClick={() => performFullSearch()}
            />

            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                debouncedFetch(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => query.trim() && setShowDropdown(true)}
              placeholder="Search wallpapers, ringtones..."
              className="pl-10 bg-secondary border-border focus:ring-primary truncate"
            />

            {/* Autocomplete */}
            <Autocomplete
  suggestions={suggestions}
  visible={showDropdown}
  activeIndex={activeIndex}
  // When user clicks a suggestion, search by what the user typed (query),
  // not by the long internal filename — this returns all matches for that keyword
  onSelect={() => performFullSearch()}
/>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost">Wallpapers</Button>
            <Button variant="ghost">Ringtones</Button>
            <Button variant="ghost">Videos</Button>
          </nav>

          {/* Mobile menu */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mt-4 relative">

          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 cursor-pointer"
            onClick={() => performFullSearch()}
          />

          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              debouncedFetch(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim() && setShowDropdown(true)}
            placeholder="Search wallpapers, ringtones..."
            className="pl-10 bg-secondary border-border focus:ring-primary"
          />

          <Autocomplete
  suggestions={suggestions}
  visible={showDropdown}
  activeIndex={activeIndex}
  // When user clicks a suggestion, search by what the user typed (query),
  // not by the long internal filename — this returns all matches for that keyword
  onSelect={() => performFullSearch()}
/>
        </div>
      </div>
    </header>
  );
};

export default Header;
