import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const About = () => (
  <>
    {/* ✅ SEO METADATA (PROPS-ONLY, SSG SAFE) */}
    <SEO
      title="About Us"
      description="Learn about Kavi Arts, your source for high-quality, aesthetic wallpapers, ringtones, and creative media for device customization."
      url="https://kaviarts.com/about"
    />

    <Header />

    <main className="container mx-auto px-4 py-10 max-w-3xl">
      {/* H1 */}
      <h1 className="text-3xl font-bold mb-6">About Kavi Arts</h1>

      <section className="space-y-8 text-muted-foreground">
        {/* Intro */}
        <div className="space-y-3">
          <p className="leading-relaxed text-lg">
            Welcome to <strong>Kavi Arts</strong>, a premier digital platform
            dedicated to personal device customization. We specialize in
            offering high-quality <strong>wallpapers</strong>,{" "}
            <strong>ringtones</strong>, and creative media downloads that bring
            your screen to life.
          </p>
        </div>

        {/* Mission */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Our Mission 🚀
          </h2>
          <p className="leading-relaxed">
            Our goal is simple: to deliver visually appealing, lightweight, and
            easy-to-download content that works seamlessly across all devices.
            We believe that customization should be effortless and accessible
            to everyone.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Why Choose Us?
          </h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>
              <strong>Fresh Content:</strong> We regularly update our collection
              to keep up with the latest trends.
            </li>
            <li>
              <strong>Optimized Quality:</strong> Media designed to look great
              without slowing down your device.
            </li>
            <li>
              <strong>Seamless Experience:</strong> Easy downloads with no hidden
              hassles.
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div className="space-y-3 border-t pt-6">
          <h2 className="text-xl font-semibold text-foreground">
            Usage & Rights ⚖️
          </h2>
          <p className="leading-relaxed">
            All content available on Kavi Arts is intended for{" "}
            <strong>personal use only</strong>. We respect intellectual property
            rights and are committed to maintaining a compliant platform. If you
            have valid concerns regarding specific content, we are ready to
            remove it upon request.
          </p>
          <p className="text-sm mt-2 italic">
            By using Kavi Arts, you agree to browse and download content
            responsibly.
          </p>
        </div>
      </section>
    </main>

    <Footer />
  </>
);

export default About;
