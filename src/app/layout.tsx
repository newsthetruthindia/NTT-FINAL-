import type { Metadata } from "next";
import { Poppins, League_Spartan } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
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

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${leagueSpartan.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:rounded-full focus:text-sm focus:font-bold focus:shadow-lg"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <AuthProvider>
            <div className="main-content" id="main-content">
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
