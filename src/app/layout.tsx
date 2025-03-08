import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProjectPulse - Modern Project Management",
  description: "A high-performance, scalable, and secure Project Management System for teams of all sizes",
  manifest: "/manifest.json",
  themeColor: "#8B5CF6",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  applicationName: "ProjectPulse",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ProjectPulse",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://projectpulse.app",
    title: "ProjectPulse - Modern Project Management",
    description: "A high-performance, scalable, and secure Project Management System for teams of all sizes",
    siteName: "ProjectPulse",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-icon-180x180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#8B5CF6" />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Script src="/sw-register.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
