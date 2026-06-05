import "./globals.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Time Since — your club won a real trophy",
  description:
    "A live count-up of how long it's been since football clubs last won a real trophy — the league or the Champions League. The FA Cup doesn't count.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          property="og:image"
          content="https://storage.googleapis.com/flyweight-cdn/timesince_screenshotV1.png"
        />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
