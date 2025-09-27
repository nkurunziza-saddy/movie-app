import type { Metadata } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Header from "@/components/navbar-components/navigation-header";
import { Toaster } from "@/components/ui/sonner";
import { META_THEME_COLORS } from "@/lib/config";
import { Analytics } from "@vercel/analytics/next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: false,
});

const IbmMono = IBM_Plex_Mono({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-ibm",
  display: "swap",
  subsets: ["latin"],
  fallback: ["monospace"],
  adjustFontFallback: false,
});

const jetBrainsMono = JetBrains_Mono({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-jetbrains",
  display: "swap",
  subsets: ["latin"],
  fallback: ["monospace"],
  adjustFontFallback: false,
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  display: "swap",
  preload: true,
  fallback: ["monospace"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "AllMovies",
  description: "Watch and discover new movies and TV shows",
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${jetBrainsMono.variable} ${IbmMono.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                  }
                  if (localStorage.layout) {
                  document.documentElement.classList.add('layout-' + localStorage.layout)
                }
              } catch (_) {}
            `,
          }}
        />
        <meta name="theme-color" content={META_THEME_COLORS.light} />
      </head>
      <body
        className={`min-h-screen`}
        style={{
          fontOpticalSizing: "auto",
          fontVariationSettings: "normal",
        }}
      >
        <Providers>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">{children}</main>
            <Toaster position="top-center" className="rounded-md" richColors />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
