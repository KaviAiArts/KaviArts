import { Download, Instagram, Youtube, MapPin, Music, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <h3 className="text-xl font-bold gradient-text">KaviArts</h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Your ultimate destination for wallpapers, ringtones, and digital customization content. 
              Personalize your devices with millions of high-quality assets.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:text-primary w-12 h-12">
                <Instagram className="w-6 h-6" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary w-12 h-12">
                <Youtube className="w-6 h-6" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary w-12 h-12">
                <MapPin className="w-6 h-6" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary w-12 h-12">
                <Music className="w-6 h-6" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary w-12 h-12">
                <Music2 className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Browse</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Wallpapers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Ringtones</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Videos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Get Our App</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Extras</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 KaviArts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;