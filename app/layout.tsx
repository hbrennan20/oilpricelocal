import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Petrol Price Map — Crowdsourced Fuel Prices",
  description: "Find the cheapest petrol prices near you. Updated by your neighbours in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
