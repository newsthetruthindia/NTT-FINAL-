import type { Metadata } from "next";
import { Poppins, League_Spartan } from "next/font/google";
import Script from "next/script";
import dynamic from "next/dynamic";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import StructuredData from "@/components/StructuredData";
import WebMCPProvider from "@/components/WebMCPProvider";
import { TickerProvider } from "@/components/TickerProvider";
import { fetchLatestPosts } from "@/lib/api";

// Lazy-load SplashAd — it only shows on homepage after 1.5s delay anyway.
// Loading it eagerly wastes CPU + bandwidth on every page navigation.
// Note: No { ssr: false } needed — SplashAd is 'use client' with useEffect guard.
const SplashAd = dynamic(() => import("@/components/SplashAd"));

// Reduced from 7 weights (300-900) to 4 weights (400,600,700,800).
// Eliminates 3 font file downloads (~30-50KB on mobile).
// Saves: Origin Transfer (11.03GB / 10GB exceeded) + faster LCP.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: 'swap',
});

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  display: 'swap',
});

export const viewport = {
  themeColor: "#0a0a0a",
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
  alternates: {
    canonical: 'https://newsthetruth.com',
    types: {
      'application/rss+xml': [
        { url: '/feed.xml', title: 'NTT | News The Truth — RSS Feed' },
      ],
    },
    languages: {
      'en-IN': 'https://newsthetruth.com',
    },
  },
  openGraph: {
    title: "NTT | News The Truth",
    description: "NTT: Authentic storytelling and citizen journalism. Questions will be asked.",
    url: "https://newsthetruth.com",
    siteName: "NTT",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NTT — News The Truth",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NTT | News The Truth",
    description: "NTT: Authentic storytelling and citizen journalism. Questions will be asked.",
    images: ["/og-image.png"],
    creator: "@newsthetruthin",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NTT",
  },
  verification: {
    other: {
      'msvalidate.01': '4D023AEA285FF0CDAA1ACEB2258129A7',
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const latest = await fetchLatestPosts(5).catch(() => []);
  const tickerItems =
    latest.length > 0
      ? latest.map((post) => ({
          title: post.title,
          href: `/news/${post.slug}`,
        }))
      : [{ title: "Latest news from NTT Desk", href: "/" }];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') || "https://backend.newsthetruth.com"} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') || "https://backend.newsthetruth.com"} />
        {/* Theme init — must run synchronously before paint to prevent FOUC */}
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
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLMs-full.txt" />
      </head>
      <body
        className={`${poppins.variable} ${leagueSpartan.variable} antialiased`}
      >
        {/* OneSignal Web Push SDK — loaded with lazyOnload strategy.
            Previously loaded with <script defer>, which competed with hero image
            for bandwidth. lazyOnload defers to after page is fully interactive.
            Saves: CPU time + bandwidth for initial load. */}
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          strategy="lazyOnload"
        />
        <Script
          id="onesignal-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.OneSignalDeferred = window.OneSignalDeferred || [];
              OneSignalDeferred.push(async function(OneSignal) {
                const appId = "${process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || ''}";
                if (!appId) {
                  console.warn('OneSignal not initialized: NEXT_PUBLIC_ONESIGNAL_APP_ID is missing.');
                  return;
                }
                await OneSignal.init({
                  appId: appId,
                  safari_web_id: "${process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID || ''}",
                  notifyButton: {
                    enable: true,
                    size: 'small',
                    position: 'bottom-left',
                    showCredit: false,
                    text: {
                      'tip.state.unsubscribed': 'Subscribe for Breaking News',
                      'tip.state.subscribed':   'You are subscribed ✓',
                      'tip.state.blocked':      'Notifications blocked',
                      'message.prenotify':      '🔔 Subscribe for breaking news alerts',
                      'message.action.subscribed':   'Thanks for subscribing!',
                      'message.action.resubscribed': 'You are subscribed.',
                      'message.action.unsubscribed': 'Unsubscribed.',
                      'dialog.main.title':      'Manage Notifications',
                      'dialog.main.button.subscribe': 'Subscribe',
                      'dialog.main.button.unsubscribe': 'Unsubscribe',
                    }
                  },
                });
              });
            `,
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:rounded-full focus:text-sm focus:font-bold focus:shadow-lg"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <AuthProvider>
            <TickerProvider items={tickerItems}>
              <div id="main-content">
                {children}
              </div>
              <SplashAd />
              <WebMCPProvider />
            </TickerProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
