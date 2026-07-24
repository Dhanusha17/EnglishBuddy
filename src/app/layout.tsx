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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
