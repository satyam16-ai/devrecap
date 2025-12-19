import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit, Space_Grotesk, Press_Start_2P, Fira_Code } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start-2p",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://devrecap.site'),
  title: {
    default: "DevRecap - Your GitHub Year in Review | Developer Stats Visualizer",
    template: "%s | DevRecap"
  },
  description: "Transform your GitHub activity into stunning visual recaps. Showcase your coding journey, consistency, and achievements with beautiful shareable cards. Free developer stats tool for GitHub and LeetCode.",
  keywords: [
    "GitHub stats",
    "developer recap",
    "GitHub year in review",
    "coding statistics",
    "GitHub wrapped",
    "developer portfolio",
    "GitHub contributions",
    "LeetCode stats",
    "programming achievements",
    "developer analytics",
    "GitHub activity",
    "code visualization"
  ],
  authors: [{ name: "Satyam Tiwari", url: "https://github.com/satyam16-ai" }],
  creator: "Satyam Tiwari",
  publisher: "DevRecap",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
    shortcut: '/favicon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://devrecap.site',
    siteName: 'DevRecap',
    title: 'DevRecap - Your GitHub Year in Review',
    description: 'Transform your GitHub activity into stunning visual recaps. Showcase your coding journey with beautiful shareable cards.',
    images: [
      {
        url: '/favicon.png',
        width: 1200,
        height: 630,
        alt: 'DevRecap - Developer Stats Visualizer',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevRecap - Your GitHub Year in Review',
    description: 'Transform your GitHub activity into stunning visual recaps.',
    creator: '@devrecap',
    images: ['/favicon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification
  },
  alternates: {
    canonical: 'https://devrecap.site',
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
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${spaceGrotesk.variable} ${pressStart2P.variable} ${firaCode.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
