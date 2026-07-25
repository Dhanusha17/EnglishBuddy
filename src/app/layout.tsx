import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { RewardOverlay } from "@/components/shared/RewardOverlay";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "EnglishBuddy – English Language & Placement Platform",
    template: "%s | EnglishBuddy",
  },
  description: "Comprehensive AI-powered English language learning and campus placement preparation platform. Practice speaking, ace interviews, and earn certificates.",
  keywords: [
    "English Learning",
    "Placement Preparation",
    "AI Speaking Practice",
    "Mock Interviews",
    "Group Discussion",
    "Certificates",
    "Vocabulary",
    "Grammar",
  ],
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "EnglishBuddy – Speak Confidently & Ace Placements",
    description: "AI-powered English language mastery and technical placement preparation.",
    url: baseUrl,
    siteName: "EnglishBuddy",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "EnglishBuddy – Speak Confidently & Ace Placements",
    description: "AI-powered English language mastery and technical placement preparation.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "EnglishBuddy",
    url: baseUrl,
    description: "AI-powered English language learning & placement preparation platform.",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <RewardOverlay />
        </ThemeProvider>
      </body>
    </html>
  );
}
