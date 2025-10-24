import { Search, Menu, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 glass-card border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold gradient-text">KaviArts</h1>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search wallpapers, ringtones..."
                className="pl-10 bg-secondary border-border focus:ring-primary"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Wallpapers
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Ringtones
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Videos
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search wallpapers, ringtones..."
              className="pl-10 bg-secondary border-border focus:ring-primary"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;