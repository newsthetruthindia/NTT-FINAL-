import type { Metadata } from "next";
import { Poppins, League_Spartan } from "next/font/google";
import "./globals.css";
import LiveTicker from "@/components/LiveTicker";
import { AuthProvider } from "@/components/AuthProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${leagueSpartan.variable} antialiased`}
      >
        <AuthProvider>
          <div className="main-content">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
