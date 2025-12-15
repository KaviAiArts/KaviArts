import {
  Instagram,
  Youtube,
  Music,
  Music2,
  ArrowUp,
} from "lucide-react";
import { FaPinterest } from "react-icons/fa";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-card border-t border-border mt-6">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* BRAND */}
          <div className="col-span-2">
            <h3 className="text-xl font-bold gradient-text mb-3">
              KaviArts
            </h3>

            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              <strong className="block mb-1 text-foreground">
                Aesthetic Digital Worlds
              </strong>
              Your ultimate source for immersive creative content. We specialize
              in high-quality AI Art, 4K Wallpapers, and custom Music. Explore our
              library of Live Loops, Ringtones, and Video Edits designed to
              inspire.
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
                href="https://pinterest.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="Pinterest"
                aria-label="Pinterest"
                className="flex flex-col items-center text-muted-foreground hover:text-primary transition"
              >
                <FaPinterest className="w-6 h-6 mb-1" />
                <span className="text-xs">Pinterest</span>
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

            <ul className="space-y-2 text-sm text-muted-foreground mb-4">
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

            {/* BACK TO TOP */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
              Back to top
            </button>
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
