import {
  Instagram,
  Youtube,
  MapPin,
  Music,
  Music2,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-6">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* BRAND */}
          <div className="col-span-2">
            <h3 className="text-xl font-bold gradient-text mb-3">
              KaviArts
            </h3>

            <p className="text-muted-foreground mb-6 max-w-md">
              Your ultimate destination for wallpapers, ringtones, and digital
              customization content. Personalize your devices with high-quality
              assets.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex flex-wrap gap-6">
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                aria-label="Instagram"
                className="flex flex-col items-center text-muted-foreground hover:text-primary transition"
              >
                <Instagram className="w-6 h-6 mb-1" />
                <span className="text-xs">Instagram</span>
              </a>

              <a
                href="https://youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
                aria-label="YouTube"
                className="flex flex-col items-center text-muted-foreground hover:text-primary transition"
              >
                <Youtube className="w-6 h-6 mb-1" />
                <span className="text-xs">YouTube</span>
              </a>

              <a
                href="/contact"
                title="Contact"
                aria-label="Contact"
                className="flex flex-col items-center text-muted-foreground hover:text-primary transition"
              >
                <MapPin className="w-6 h-6 mb-1" />
                <span className="text-xs">Contact</span>
              </a>

              <a
                href="https://open.spotify.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="Spotify"
                aria-label="Spotify"
                className="flex flex-col items-center text-muted-foreground hover:text-primary transition"
              >
                <Music className="w-6 h-6 mb-1" />
                <span className="text-xs">Spotify</span>
              </a>

              <a
                href="https://music.apple.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="Apple Music"
                aria-label="Apple Music"
                className="flex flex-col items-center text-muted-foreground hover:text-primary transition"
              >
                <Music2 className="w-6 h-6 mb-1" />
                <span className="text-xs">Apple Music</span>
              </a>
            </div>
          </div>

          {/* POPULAR CATEGORIES */}
          <div>
            <h4 className="font-semibold mb-4">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="/search?query=nature&from=footer"
                  className="hover:text-primary"
                >
                  Nature Wallpapers
                </a>
              </li>
              <li>
                <a
                  href="/search?query=anime&from=footer"
                  className="hover:text-primary"
                >
                  Anime Wallpapers
                </a>
              </li>
              <li>
                <a
                  href="/search?query=aesthetic&from=footer"
                  className="hover:text-primary"
                >
                  Aesthetic Ringtones
                </a>
              </li>
              <li>
                <a
                  href="/search?query=cinematic&from=footer"
                  className="hover:text-primary"
                >
                  Cinematic Videos
                </a>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="font-semibold mb-4">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/about" className="hover:text-primary">
                  About Us
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-primary">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-primary">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-primary">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/app" className="hover:text-primary">
                  Get Our App
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-border mt-10 pt-6 text-center text-sm text-muted-foreground">
          © 2025 KaviArts. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
