export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/registration",
          "/privacy",
          "/my-group",
          "/snapshot"
        ],
        disallow: [
          "/admin",
          "/api",
          "/follow-up",
          "/submission",
          "/final-submission",
          "/survey"
        ]
      }
    ],
    sitemap: "https://am-connecting.com/sitemap.xml",
    host: "https://am-connecting.com"
  };
}
