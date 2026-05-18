import "./globals.css";

export const metadata = {
  title: "AM-Connecting",
  description: "Collaborative business simulations for cross-team understanding, shared decision-making and internal connection."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
