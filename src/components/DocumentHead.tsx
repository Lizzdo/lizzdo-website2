import { useEffect } from "react";
import { getSingle } from "../lib/content";

interface DocumentHeadProps {
  title?: string;
  description?: string;
  image?: string;
  canonicalUrl?: string;
  schemaData?: any;
}

export default function DocumentHead({ title, description, image, canonicalUrl, schemaData }: DocumentHeadProps) {
  const globalData = getSingle(import.meta.glob('../content/settings/global.json', { eager: true }));
  const siteTitle = globalData?.site_name || "LIZZDO - Next-Gen Digital Studio";
  const defaultTitle = globalData?.default_title || siteTitle;
  const defaultDescription = globalData?.default_description || "Professional 3D Modeling, Animation, Game Assets, 3D Printing, Roblox & Unity Development.";
  const defaultImage = globalData?.default_og_image || "";
  
  const finalTitle = title ? `${title} | ${siteTitle}` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalImage = image || defaultImage;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Update document title
    document.title = finalTitle;

    // Helper to update or create meta tag
    const updateMeta = (selector: string, attrName: string, attrVal: string, contentVal: string) => {
      if (!contentVal) return;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentVal);
    };

    updateMeta('meta[name="description"]', 'name', 'description', finalDescription);
    updateMeta('meta[property="og:title"]', 'property', 'og:title', finalTitle);
    updateMeta('meta[property="og:description"]', 'property', 'og:description', finalDescription);
    updateMeta('meta[property="og:image"]', 'property', 'og:image', finalImage);
    updateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', finalTitle);
    updateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', finalDescription);
    updateMeta('meta[name="twitter:image"]', 'name', 'twitter:image', finalImage);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);
  }, [finalTitle, finalDescription, finalImage]);

  return (
    <>
      {globalData?.ga_id && (
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${globalData.ga_id}`}></script>
      )}
      {globalData?.ga_id && (
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${globalData.ga_id}');
          `
        }} />
      )}
      {globalData?.gtm_id && (
        <script dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${globalData.gtm_id}');
          `
        }} />
      )}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="icon" type="image/x-icon" href={globalData?.favicon || "/favicon.ico"} />
      <link rel="shortcut icon" href={globalData?.favicon || "/favicon.ico"} />
      <link rel="apple-touch-icon" href={globalData?.favicon || "/apple-touch-icon.png"} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      {finalImage && <meta property="og:image" content={finalImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      {finalImage && <meta name="twitter:image" content={finalImage} />}
      {schemaData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData)
        }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: `
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "${siteTitle}",
            "url": "https://lizzdo.com",
            "logo": "${globalData?.logo || ''}",
            "sameAs": [
              ${(globalData?.social || []).map((s: any) => `"${s.url}"`).join(', ')}
            ]
          }
        `
      }} />
    </>
  );
}
