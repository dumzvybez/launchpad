import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { AchievementWatcher } from "@/components/pwa/AchievementWatcher";
import { CalendarNotifier } from "@/components/pwa/CalendarNotifier";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const APP_NAME = "Launchpad";
const APP_DESCRIPTION =
  "Launchpad is a free, privacy-first coding education platform with a personalized learning engine, 30+ built-in lessons, a code playground, and an AI tutor. All data stays on your device.";

export const metadata: Metadata = {
  metadataBase: new URL("https://launchpad.app/"),
  applicationName: APP_NAME,
  title: {
    default: `${APP_NAME} — Coding Education Platform`,
    template: `%s · ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "learn to code",
    "coding education",
    "programming roadmap",
    "Python lessons",
    "JavaScript lessons",
    "coding tutor",
    "AI tutor",
    "software engineering",
    "web development",
    "data science",
    "personalized learning",
    "code playground",
    "free coding course",
    "privacy-first",
  ],
  authors: [{ name: "Launchpad" }],
  creator: "Launchpad",
  publisher: "Launchpad",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    title: `${APP_NAME} — Coding Education Platform`,
    description: APP_DESCRIPTION,
    type: "website",
    siteName: APP_NAME,
    url: "https://launchpad.app/",
    images: [
      {
        url: "/icons/logo-1024.png",
        width: 1024,
        height: 1024,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — Coding Education Platform`,
    description: APP_DESCRIPTION,
    images: ["/icons/logo-1024.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://launchpad.app/",
  },
  category: "education",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

// JSON-LD structured data
const structuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: APP_NAME,
  description: APP_DESCRIPTION,
  url: "https://launchpad.app/",
  logo: "https://launchpad.app/icons/logo-1024.png",
  sameAs: ["https://launchpad.app/"],
  knowsAbout: [
    "Python", "JavaScript", "TypeScript", "React", "Next.js",
    "Web Development", "Data Science", "AI/ML", "Cybersecurity",
    "Cloud/DevOps", "Mobile Development", "Game Development",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free to use, no account required, all data on-device.",
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
        {/* PWA meta tags for iOS */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
        {/* Structured data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrains.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
          <ServiceWorkerRegister />
          <InstallPrompt />
          <AchievementWatcher />
          <CalendarNotifier />
        </ThemeProvider>
      </body>
    </html>
  );
}
