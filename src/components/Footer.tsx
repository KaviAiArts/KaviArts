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
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12.04 2C6.58 2 3 5.64 3 9.98c0 2.62 1.52 4.88 3.99 5.74.37.16.35.01.5-.5.04-.13.12-.47.16-.61.05-.17.03-.24-.11-.4-.82-.97-1.35-2.22-1.35-3.55 0-4.57 3.42-8.65 8.91-8.65 4.86 0 7.54 2.97 7.54 6.93 0 5.22-2.31 9.63-5.74 9.63-1.89 0-3.31-1.56-2.86-3.48.54-2.29 1.6-4.76 1.6-6.42 0-1.48-.79-2.71-2.44-2.71-1.94 0-3.5 2.01-3.5 4.7 0 1.72.58 2.89.58 2.89s-2 8.48-2.35 9.96c-.7 2.99-.11 6.66-.06 7.04.03.23.33.28.46.11.18-.24 2.48-3.08 3.27-5.97.22-.82 1.26-4.92 1.26-4.92.62 1.18 2.42 2.21 4.34 2.21 5.72 0 9.6-5.21 9.6-12.18C21.92 6.1 17.47 2 12.04 2z" />
  </svg>
);

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="bg-card border-t border-border mt-6"
      role="contentinfo"
    >
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
            <div className="flex flex-wrap gap-6" aria-label="Social links">
              <a
                href="https://www.instagram.com/kavitunez/"
                target="_blank"
                className="flex flex-col items-center text-muted-foreground hover:text-foreground hover:font-semibold transition"
                aria-label="KaviArts on Instagram"
                title="Instagram"
              >
                <Instagram className="w-6 h-6 mb-1" aria-hidden="true" />
                <span className="text-xs">Instagram</span>
              </a>

              <a
                href="https://youtube.com/@kavitunez?si=QrbqS0Y9ibD7Cm43"
                target="_blank"
                className="flex flex-col items-center text-muted-foreground hover:text-foreground hover:font-semibold transition"
                aria-label="KaviArts on YouTube"
                title="YouTube"
              >
                <Youtube className="w-6 h-6 mb-1" aria-hidden="true" />
                <span className="text-xs">YouTube</span>
              </a>

              <a
                href="https://in.pinterest.com/Kavi_Pics/"
                target="_blank"
                className="flex flex-col items-center text-muted-foreground hover:text-foreground hover:font-semibold transition"
                aria-label="KaviArts on Pinterest"
                title="Pinterest"
              >
                <PinterestIcon />
                <span className="text-xs">Pinterest</span>
              </a>

              <a
                href="https://open.spotify.com/artist/2Yn6quG4CSQl01LcLPU4yu"
                target="_blank"
                className="flex flex-col items-center text-muted-foreground hover:text-foreground hover:font-semibold transition"
                aria-label="Kavi Tunez on Spotify"
                title="Spotify"
              >
                <Music className="w-6 h-6 mb-1" aria-hidden="true" />
                <span className="text-xs">Spotify</span>
              </a>

              <a
                href="https://music.apple.com/us/artist/kavi-tunez/1826128201"
                target="_blank"
                className="flex flex-col items-center text-muted-foreground hover:text-foreground hover:font-semibold transition"
                aria-label="Kavi Tunez on Apple Music"
                title="Apple Music"
              >
                <Music2 className="w-6 h-6 mb-1" aria-hidden="true" />
                <span className="text-xs">Apple Music</span>
              </a>
            </div>
          </div>

          {/* POPULAR CATEGORIES */}
          <div>
            <h4 className="font-semibold mb-4">Popular Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground mb-4">
              <li>
                <a href="/search?query=nature&type=wallpaper&title=Nature%20Wallpapers">
                  Nature Wallpapers
                </a>
              </li>
              <li>
                <a href="/search?query=anime&type=wallpaper&title=Anime%20Wallpapers">
                  Anime Wallpapers
                </a>
              </li>
              <li>
                <a href="/search?query=romantic&type=ringtone&title=Romantic%20Ringtones">
                  Romantic Ringtones
                </a>
              </li>
              <li>
                <a href="/search?query=cinematic&type=video&title=Cinematic%20Videos">
                  Cinematic Videos
                </a>
              </li>
            </ul>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:font-semibold transition"
              aria-label="Scroll back to top"
              title="Back to top"
              type="button"
            >
              <ArrowUp className="w-4 h-4" aria-hidden="true" />
              Back to top
            </button>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/about">About Us</a></li>
              <li><a href="/terms">Terms & Conditions</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/app">Get Our App</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 text-center text-sm text-muted-foreground">
          © 2026 KaviArts. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
