import {
  Instagram,
  Youtube,
  Music,
  Music2,
  Pinterest,
  ArrowUp,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-8">
      <div className="container mx-auto px-4 py-10 space-y-6">
        <p className="text-sm text-muted-foreground max-w-xl">
          Kavi Arts is a creative platform offering high-quality wallpapers,
          ringtones, and short videos crafted for personalization and creative
          expression.
        </p>

        <div className="flex gap-5">
          <a
            href="https://www.instagram.com/kavi_pics/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our Instagram profile"
          >
            <Instagram />
          </a>

          <a
            href="https://www.youtube.com/@Kavitunez"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our YouTube channel"
          >
            <Youtube />
          </a>

          <a
            href="https://in.pinterest.com/Kavi_Pics/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our Pinterest profile"
          >
            <Pinterest />
          </a>

          <a
            href="https://open.spotify.com/artist/2Yn6quG4CSQl01LcLPU4yu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Listen on Spotify"
          >
            <Music />
          </a>

          <a
            href="https://music.apple.com/us/artist/kavi-tunez/1826128201"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Listen on Apple Music"
          >
            <Music2 />
          </a>
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="flex items-center gap-2 text-sm"
        >
          <ArrowUp aria-hidden="true" className="h-4 w-4" />
          Back to top
        </button>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Kavi Arts. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
