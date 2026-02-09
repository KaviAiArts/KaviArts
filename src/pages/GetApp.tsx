import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const GetApp = () => (
  <>
    <SEO
      title="Download App"
      description="The Kavi Arts mobile app is coming soon. Get ready for exclusive 4K wallpapers, live loops, and custom ringtones."
      url="https://kaviarts.com/app"
    />

    <Header />

    <main className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">
          Get the Kavi Arts App 📱
        </h1>
        <p className="text-xl text-muted-foreground">
          The ultimate customization experience is coming to your pocket.
        </p>
      </div>

      <section className="space-y-8 text-muted-foreground">
        <div className="bg-secondary/10 p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What to Expect?
          </h2>

          <ul className="grid gap-4 md:grid-cols-2">
            <li>✨ Exclusive 4K Wallpapers</li>
            <li>🎵 One-Tap Ringtones</li>
            <li>🎨 AI Art Gallery</li>
            <li>⚡ Fast & Ad-Free Options</li>
          </ul>
        </div>

        <div className="text-center space-y-4 pt-4">
          <h2 className="text-xl font-semibold text-foreground">
            Stay Tuned for Updates
          </h2>

          <p>
            Coming soon to Google Play Store and Apple App Store.
          </p>
        </div>
      </section>
    </main>

    <Footer />
  </>
);

export default GetApp;
