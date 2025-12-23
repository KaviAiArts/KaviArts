import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: "Wallpapers", href: "/search?type=wallpaper" },
    { name: "Ringtones", href: "/search?type=ringtone" },
    { name: "Videos", href: "/search?type=video" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* LOGO - Added aria-label */}
        <Link to="/" className="flex items-center gap-2" aria-label="KaviArts Home">
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            KaviArts
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* SEARCH BAR (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-sm ml-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search wallpapers, ringtones..."
              className="w-full pl-9 rounded-full bg-secondary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search content" // Added Accessibility Label
            />
          </form>
        </div>

        {/* MOBILE MENU TRIGGER */}
        <div className="md:hidden flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              {/* FIX: Added aria-label for Screen Readers */}
              <Button variant="ghost" size="icon" aria-label="Open main menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              {/* Accessibility Requirement: Sheet must have a Title */}
              <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Navigate through categories and search for content.
              </SheetDescription>

              <div className="flex flex-col gap-6 mt-6">
                <Link 
                  to="/" 
                  className="font-bold text-xl" 
                  onClick={() => setIsOpen(false)}
                >
                  KaviArts
                </Link>

                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-9 h-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search mobile"
                  />
                </form>

                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="text-lg font-medium hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Link
                      to="/contact"
                      className="text-lg font-medium hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Contact
                    </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;