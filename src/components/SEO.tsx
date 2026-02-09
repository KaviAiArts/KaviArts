import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url: string; // REQUIRED (same as before)
  type?: string;
}

export default function SEO({
  title,
  description,
  image,
  url,
  type = "website",
}: SEOProps) {
  const siteTitle = "Kavi Arts";
  const fullTitle = `${title} | ${siteTitle}`;

  useEffect(() => {
    // -----------------------------
    // TITLE
    // -----------------------------
    document.title = fullTitle;

    // -----------------------------
    // META HELPER
    // -----------------------------
    const setMeta = (
      key: string,
      content?: string,
      attr: "name" | "property" = "name"
    ) => {
      if (!content) return;

      let tag = document.querySelector(
        `meta[${attr}="${key}"]`
      ) as HTMLMetaElement | null;

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", content);
    };

    // -----------------------------
    // BASIC SEO
    // -----------------------------
    setMeta("description", description);

    // Canonical
    let canonical = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // -----------------------------
    // OPEN GRAPH
    // -----------------------------
    setMeta("og:type", type, "property");
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", url, "property");
    if (image) setMeta("og:image", image, "property");

    // -----------------------------
    // TWITTER
    // -----------------------------
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    if (image) setMeta("twitter:image", image);

    // -----------------------------
    // STRUCTURED DATA (JSON-LD)
    // -----------------------------
    const schemaData = {
      "@context": "https://schema.org",
      "@type": image ? "ImageObject" : "WebPage",
      name: fullTitle,
      description,
      ...(image && { contentUrl: image }),
      url,
    };

    let schemaScript = document.getElementById(
      "seo-schema"
    ) as HTMLScriptElement | null;

    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.id = "seo-schema";
      schemaScript.type = "application/ld+json";
      document.head.appendChild(schemaScript);
    }

    schemaScript.textContent = JSON.stringify(schemaData);
  }, [fullTitle, description, image, url, type]);

  return null;
}
