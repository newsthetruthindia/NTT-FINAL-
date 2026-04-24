import type { Metadata } from "next";
import { Poppins, League_Spartan } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import StructuredData from "@/components/StructuredData";
import SplashAd from "@/components/SplashAd";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: 'swap',
});

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  display: 'swap',
});

export const viewport = {
  themeColor: "#ff0000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "NTT | News The Truth",
    template: "%s | NTT"
  },
  description: "NTT: Authentic storytelling and citizen journalism. Questions will be asked.",
  metadataBase: new URL('https://newsthetruth.com'),
  manifest: "/manifest.json",
  keywords: ["news", "truth", "ntt", "citizen journalism", "india news", "exclusive reports"],
  authors: [{ name: "NTT Editorial Desk" }],
  openGraph: {
    title: "NTT | News The Truth",
    description: "NTT: Authentic storytelling and citizen journalism. Questions will be asked.",
    url: "https://newsthetruth.com",
    siteName: "NTT",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "NTT News Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NTT | News The Truth",
    description: "NTT: Authentic storytelling and citizen journalism. Questions will be asked.",
    images: ["/icon-512.png"],
    creator: "@newsthetruth",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NTT",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('themePreference') || 'dark';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <StructuredData />
      </head>
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
            <div id="main-content">
              {children}
            </div>
            <SplashAd />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
