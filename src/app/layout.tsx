import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import LiveTicker from "@/components/LiveTicker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "News The Truth | Premium News Portal",
  description: "Questions will be asked.",
  manifest: "/manifest.json",
  themeColor: "#ff0000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NTT News",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        <div className={`main-content ${playfair.variable} font-serif`}>
          {children}
        </div>
      </body>
    </html>
  );
}
