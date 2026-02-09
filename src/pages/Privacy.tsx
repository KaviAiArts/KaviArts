import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Privacy = () => (
  <>
    <SEO
      title="Privacy Policy"
      description="Privacy Policy for Kavi Arts. Learn how we collect and protect your data."
      url="https://kaviarts.com/privacy"
    />

    <Header />

    <main className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <section className="space-y-6 text-muted-foreground">
        <p className="leading-relaxed">
          Your privacy matters to us. Kavi Arts collects limited, non-personal
          data to improve website performance, analyze downloads, and ensure
          site security.
        </p>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Information We May Collect
          </h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Anonymous usage data (pages visited, downloads)</li>
            <li>Device and browser type (non-identifiable)</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Information We Do NOT Collect
          </h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Personal identification details</li>
            <li>Payment information</li>
            <li>User accounts or passwords</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Third-Party Services
          </h2>
          <p className="leading-relaxed">
            Third-party services may use cookies according to their own privacy
            policies.
          </p>
        </div>

        <p className="text-sm border-t pt-4 mt-8">
          By using this website, you consent to this privacy policy.
          <br />
          <span className="opacity-70">Last Updated: December 2025</span>
        </p>
      </section>
    </main>

    <Footer />
  </>
);

export default Privacy;
