import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://am-connecting.com"),
  title: {
    default: "AM-Connecting | Connect. Collaborate. Grow Together.",
    template: "%s | AM-Connecting"
  },
  description: "AM-Connecting creates collaborative business simulations that help organisations strengthen internal connection, shared decision-making and cross-team understanding.",
  keywords: [
    "AM-Connecting",
    "employee engagement",
    "collaboration experience",
    "business simulation",
    "internal connection",
    "People and Culture",
    "HR collaboration",
    "team collaboration"
  ],
  authors: [{ name: "AM-Connecting" }],
  creator: "AM-Connecting",
  publisher: "AM-Connecting",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "AM-Connecting | Connect. Collaborate. Grow Together.",
    description: "Collaborative business simulations for internal connection, shared decision-making and cross-team understanding.",
    url: "https://am-connecting.com",
    siteName: "AM-Connecting",
    images: [
      {
        url: "/am-connecting-logo.png",
        width: 1200,
        height: 1200,
        alt: "AM-Connecting logo"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
