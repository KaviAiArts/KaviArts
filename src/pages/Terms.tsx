import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Terms = () => (
  <>
    {/* ✅ SEO METADATA (PROPS-ONLY, SSG SAFE) */}
    <SEO
      title="Terms & Conditions"
      description="Terms of Service for Kavi Arts. Read our policies regarding content usage, downloads, and user responsibilities."
      url="https://kaviarts.com/terms"
    />

    <Header />

    <main className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

      <section className="space-y-6 text-muted-foreground">
        <p className="leading-relaxed text-lg">
          Welcome to Kavi Arts. By accessing this website, you agree to be bound
          by the following terms and conditions. Please read them carefully.
        </p>

        {/* 1. Usage Policy */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            1. Content Usage Policy 📄
          </h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>
              All content (wallpapers, ringtones, media) is provided strictly
              for <strong>personal, non-commercial use</strong>.
            </li>
            <li>
              <strong>Redistribution, resale, or re-uploading</strong> of our
              content to other platforms or websites is strictly prohibited
              without explicit permission.
            </li>
          </ul>
        </div>

        {/* 2. Data & Analytics */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            2. Data & Analytics 📊
          </h2>
          <p className="leading-relaxed">
            We value your privacy. Download counts are tracked for internal
            analytical and ranking purposes only to help us provide better
            content.
          </p>
        </div>

        {/* 3. Disclaimers */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            3. Disclaimers ⚠️
          </h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>
              Kavi Arts is <strong>not responsible</strong> for any data loss,
              device issues, or compatibility problems caused by downloading or
              using our content.
            </li>
            <li>
              Content may be updated, modified, or removed at any time without
              prior notice.
            </li>
          </ul>
        </div>

        {/* 4. Acceptance */}
        <div className="space-y-3 border-t pt-6">
          <h2 className="text-xl font-semibold text-foreground">
            4. Acceptance of Terms
          </h2>
          <p className="leading-relaxed">
            Continued use of this website signifies your full acceptance of
            these terms.
            <span className="block mt-2 text-red-500/80 text-sm font-medium">
              * Violation of these terms may result in restricted access to our
              services.
            </span>
          </p>
        </div>
      </section>
    </main>

    <Footer />
  </>
);

export default Terms;
