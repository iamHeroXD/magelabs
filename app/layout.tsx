import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "MageLabs — Realistic Virtual Laboratory Platform",
  description: "An interactive, browser-based 3D virtual laboratory. Conduct electrical circuit experiments, measure Ohm's Law in real-time, collaborate with peers, and get intelligent AI guidance.",
  keywords: ["virtual lab", "science laboratory", "Ohm's law simulation", "interactive 3D laboratory", "STEM education", "physics lab online"],
  authors: [{ name: "MageLabs Team" }],
  openGraph: {
    title: "MageLabs — Realistic Virtual Laboratory Platform",
    description: "Interactive 3D Virtual Science Laboratory with Authentic Physics & Context-Aware AI Guidance.",
    url: "https://magelabs.vercel.app",
    siteName: "MageLabs",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-amber-500/20 selection:text-amber-300`}
      >
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
