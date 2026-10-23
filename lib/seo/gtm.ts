/** Official GTM container ID and snippets for Search Console placement. */
export const GTM_ID = "GTM-5R64F7P4";

/** Inline head snippet — must sit immediately after `<head>`. */
export const GTM_HEAD_SNIPPET = `<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');</script><!-- End Google Tag Manager -->`;

/** Noscript snippet — must sit immediately after `<body>` (comments only in between). */
export const GTM_BODY_SNIPPET = `<!-- Google Tag Manager (noscript) --><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript><!-- End Google Tag Manager (noscript) -->`;

const GTM_SCRIPT_RE =
  /<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->|<script>\(function\(w,d,s,l,i\)\{w\[l\]=w\[l\]\|\|\[\][\s\S]*?GTM-5R64F7P4'\);<\/script>/g;

const GTM_NOSCRIPT_RE =
  /<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->|<noscript><iframe[^>]*googletagmanager\.com\/ns\.html\?id=GTM-5R64F7P4[\s\S]*?<\/noscript>/g;

/**
 * Next.js inserts meta/preloads and a hidden body div before React children,
 * which fails Search Console GTM checks. Re-place snippets at the exact spots Google requires.
 */
export function placeGtmSnippets(html: string): string {
  const withoutDuplicates = html
    .replace(GTM_SCRIPT_RE, "")
    .replace(GTM_NOSCRIPT_RE, "");

  return withoutDuplicates
    .replace(/<head([^>]*)>/i, `<head$1>${GTM_HEAD_SNIPPET}`)
    .replace(/<body([^>]*)>/i, `<body$1>${GTM_BODY_SNIPPET}`);
}

export function isGoogleSiteVerifier(userAgent: string | null): boolean {
  return /Google-Site-Verification/i.test(userAgent ?? "");
}
