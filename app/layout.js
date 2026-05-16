import "./globals.css";

export const metadata = {
  title: "AM-Connecting",
  description: "Cross-department collaboration experiences for hybrid organisations."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
