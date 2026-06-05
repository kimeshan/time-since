import "./globals.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

const title = "Time Since — your club won a real trophy";
const description =
  "A live count-up of how long it's been since football clubs last won a real trophy — the league or the Champions League. The FA Cup doesn't count.";

// Resolve the canonical site URL: explicit override → Vercel production domain →
// Vercel deployment (preview) URL → localhost. Used to make the OG image URL
// absolute so WhatsApp/social fetch the right preview.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  // og:image / twitter:image are wired up automatically from app/opengraph-image.tsx
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Time Since",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
