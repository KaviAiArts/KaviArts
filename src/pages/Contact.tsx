import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const Contact = () => (
  <>
    {/* ✅ SEO METADATA (VITE SAFE) */}
    <Helmet>
      <title>Contact Us | Kavi Arts - Get In Touch</title>
      <meta
        name="description"
        content="Reach out to Kavi Arts for feedback, content inquiries, technical support, or copyright removal requests."
      />
    </Helmet>

    <Header />

    <main className="container mx-auto px-4 py-10 max-w-3xl">
      {/* H1 */}
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <section className="space-y-6 text-muted-foreground">

        <p className="leading-relaxed">
          We appreciate your interest in Kavi Arts. Whether you have feedback,
          a content request, or a critical inquiry, we're here to help.
          Please use the appropriate method below to ensure a prompt response.
        </p>

        {/* GENERAL INQUIRIES */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            General Inquiries & Feedback 📧
          </h2>

          <p className="leading-relaxed">
            For general questions, content-related feedback, or technical support
            regarding our AI Art, Wallpapers, or Music, please contact us via email.
          </p>

          <p className="mt-2 font-bold text-lg text-primary">
            Email:{" "}
            <a
              href="mailto:tunezkavi@gmail.com"
              className="underline hover:opacity-80"
            >
              kavitunez@gmail.com
            </a>
          </p>
        </div>

        {/* COPYRIGHT / DMCA */}
        <div className="space-y-3 pt-4 border-t">
          <h2 className="text-xl font-semibold text-foreground">
            Copyright & Legal Requests ⚖️
          </h2>

          <p className="leading-relaxed">
            For <strong>DMCA takedown notices</strong>, <strong>copyright removal</strong>,
            or official legal inquiries, please include the following details in your email:
          </p>

          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>A detailed description of the copyrighted work.</li>
            <li>The exact URL (link) to the infringing content.</li>
            <li>Your contact information and digital or physical signature.</li>
          </ul>
        </div>

        {/* SOCIAL LINKS */}
        <div className="space-y-3 pt-4 border-t">
          <h2 className="text-xl font-semibold text-foreground">
            Connect with Us
          </h2>

          <p className="leading-relaxed">
            Want to see our latest creations? Follow us on our social media platforms.
          </p>

          <p className="mt-2 text-md">
            <a
              href="https://www.instagram.com/kavitunez/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline mr-4"
            >
              Instagram
            </a>

            <a
              href="https://youtube.com/@kavitunez?si=jA1hrHFJsU0WhPf3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              YouTube
            </a>
          </p>
        </div>

      </section>
    </main>

    <Footer />
  </>
);

export default Contact;
