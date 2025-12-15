import {
  Instagram,
  Youtube,
  Music,
  Music2,
  ArrowUp,
} from "lucide-react";

/* Pinterest SVG — SAFE INLINE */
const PinterestIcon = () => (
  <svg
    viewBox="-2 -2 28 28"
    fill="currentColor"
    className="w-6 h-6 mb-1"
    style={{ overflow: "visible" }}
  >
    <path d="M12.04 2C6.58 2 3 5.64 3 9.98c0 2.62 1.52 4.88 3.99 5.74.37.16.35.01.5-.5.04-.13.12-.47.16-.61.05-.17.03-.24-.11-.4-.82-.97-1.35-2.22-1.35-3.55 0-4.57 3.42-8.65 8.91-8.65 4.86 0 7.54 2.97 7.54 6.93 0 5.22-2.31 9.63-5.74 9.63-1.89 0-3.31-1.56-2.86-3.48.54-2.29 1.6-4.76 1.6-6.42 0-1.48-.79-2.71-2.44-2.71-1.94 0-3.5 2.01-3.5 4.7 0 1.72.58 2.89.58 2.89s-2 8.48-2.35 9.96c-.7 2.99-.11 6.66-.06 7.04.03.23.33.28.46.11.18-.24 2.48-3.08 3.27-5.97.22-.82 1.26-4.92 1.26-4.92.62 1.18 2.42 2.21 4.34 2.21 5.72 0 9.6-5.21 9.6-12.18C21.92 6.1 17.47 2 12.04 2z" />
  </svg>
);

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
              <a href="https://instagram.com/" target="_blank" className="flex flex-col items-center text-muted-foreground hover:text-foreground hover:font-semibold transition">
                <Instagram className="w-6 h-6 mb-1" />
                <span className="text-xs">Instagram</span>
              </a>

              <a href="https://youtube.com/" target="_blank" className="flex flex-col items-center text-muted-foreground hover:text-foreground hover:font-semibold transition">
                <Youtube className="w-6 h-6 mb-1" />
                <span className="text-xs">YouTube</span>
              </a>

              <a href="https://pinterest.com/" target="_blank" className="flex flex-col items-center text-muted-foreground hover:text-foreground hover:font-semibold transition">
                <PinterestIcon />
                <span className="text-xs">Pinterest</span>
              </a>

              <a href="https://open.spotify.com/" target="_blank" className="flex flex-col items-center text-muted-foreground hover:text-foreground hover:font-semibold transition">
                <Music className="w-6 h-6 mb-1" />
                <span className="text-xs">Spotify</span>
              </a>

              <a href="https://music.apple.com/" target="_blank" className="flex flex-col items-center text-muted-foreground hover:text-foreground hover:font-semibold transition">
                <Music2 className="w-6 h-6 mb-1" />
                <span className="text-xs">Apple Music</span>
              </a>
            </div>
          </div>

          {/* POPULAR CATEGORIES */}
          <div>
            <h4 className="font-semibold mb-4">Popular Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground mb-4">
              <li><a href="/search?query=nature&from=footer" className="hover:text-foreground hover:font-semibold">Nature Wallpapers</a></li>
              <li><a href="/search?query=anime&from=footer" className="hover:text-foreground hover:font-semibold">Anime Wallpapers</a></li>
              <li><a href="/search?query=aesthetic&from=footer" className="hover:text-foreground hover:font-semibold">Aesthetic Ringtones</a></li>
              <li><a href="/search?query=cinematic&from=footer" className="hover:text-foreground hover:font-semibold">Cinematic Videos</a></li>
            </ul>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:font-semibold transition"
            >
              <ArrowUp className="w-4 h-4" />
              Back to top
            </button>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/about" className="hover:text-foreground hover:font-semibold">About Us</a></li>
              <li><a href="/terms" className="hover:text-foreground hover:font-semibold">Terms & Conditions</a></li>
              <li><a href="/privacy" className="hover:text-foreground hover:font-semibold">Privacy Policy</a></li>
              <li><a href="/contact" className="hover:text-foreground hover:font-semibold">Contact Us</a></li>
              <li><a href="/app" className="hover:text-foreground hover:font-semibold">Get Our App</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 text-center text-sm text-muted-foreground">
          © 2025 KaviArts. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
