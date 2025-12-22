import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const GetApp = () => (
  <>
    {/* ✅ SEO METADATA */}
    <Helmet>
      <title>Download App | Kavi Arts - Wallpapers & Ringtones</title>
      <meta
        name="description"
        content="The Kavi Arts mobile app is coming soon. Get ready for exclusive 4K wallpapers, live loops, and custom ringtones directly on your device."
      />
    </Helmet>

    <Header />

    <main className="container mx-auto px-4 py-10 max-w-3xl">
      {/* HERO */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">
          Get the Kavi Arts App 📱
        </h1>
        <p className="text-xl text-muted-foreground">
          The ultimate customization experience is coming to your pocket.
        </p>
      </div>

      <section className="space-y-8 text-muted-foreground">
        
        {/* FEATURES */}
        <div className="bg-secondary/10 p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What to Expect?
          </h2>

          <ul className="grid gap-4 md:grid-cols-2">
            <li className="flex items-start gap-2">
              <span className="text-xl">✨</span>
              <span>
                <strong>Exclusive 4K Wallpapers:</strong> Access high-resolution
                backgrounds not available on the website.
              </span>
            </li>

            <li className="flex items-start gap-2">
              <span className="text-xl">🎵</span>
              <span>
                <strong>One-Tap Ringtones:</strong> Set custom ringtones and
                notification sounds instantly.
              </span>
            </li>

            <li className="flex items-start gap-2">
              <span className="text-xl">🎨</span>
              <span>
                <strong>AI Art Gallery:</strong> Browse and save aesthetic
                AI-generated visuals.
              </span>
            </li>

            <li className="flex items-start gap-2">
              <span className="text-xl">⚡</span>
              <span>
                <strong>Fast & Ad-Free Options:</strong> A smoother experience
                optimized for your phone.
              </span>
            </li>
          </ul>
        </div>

        {/* CTA (Button Removed, Text Kept) */}
        <div className="text-center space-y-4 pt-4">
          <h2 className="text-xl font-semibold text-foreground">
            Stay Tuned for Updates
          </h2>

          <p className="leading-relaxed">
            We are working hard to bring this to the{" "}
            <strong>Google Play Store</strong> and{" "}
            <strong>Apple App Store</strong> soon.
            Follow us to get notified the moment we launch!
          </p>
        </div>
      </section>
    </main>

    <Footer />
  </>
);

export default GetApp;
