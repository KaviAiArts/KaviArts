import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => (
  <>
    <Header />
    <main className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-muted-foreground leading-relaxed">

🔷 Privacy Policy

Your privacy matters to us.

Kavi Arts collects limited, non-personal data to:

Improve website performance

Analyze downloads and popular content

Ensure site security and functionality

Information We May Collect:

Anonymous usage data (pages visited, downloads)

Device and browser type (non-identifiable)

Information We Do NOT Collect:

Personal identification details

Payment information

User accounts or passwords

Third-party services (such as Google AdSense or analytics tools) may use cookies or similar technologies in accordance with their own privacy policies.

By using this website, you consent to this privacy policy.

      </p>
    </main>
    <Footer />
  </>
);

export default Privacy;
