import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url: string;              // 🔴 URL MUST BE REQUIRED
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

  // ✅ Structured Data (safe, optional image support)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": image ? "ImageObject" : "WebPage",
    name: fullTitle,
    description: description,
    ...(image && { contentUrl: image }),
    url: url,
  };

  return (
    <Helmet prioritizeSeoTags>
      {/* ✅ BASIC SEO */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* ✅ OPEN GRAPH */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}

      {/* ✅ TWITTER */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* ✅ STRUCTURED DATA */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}
