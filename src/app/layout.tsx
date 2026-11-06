import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dubriani Yachts",
  description: "Premium luxury yacht charter in Dubai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
