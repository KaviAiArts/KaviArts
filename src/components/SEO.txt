import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEO({ title, description, image, url, type = 'website' }: SEOProps) {
  const siteTitle = "Kavi Arts"; 
  const fullTitle = `${title} | ${siteTitle}`;
  
  // Create Structured Data (Schema) for Google Images/Products
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "name": title,
    "description": description,
    "contentUrl": image,
    "url": url
  };

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Facebook / Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Google Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}