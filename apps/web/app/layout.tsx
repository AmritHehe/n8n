import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Autm8n — Node Based Automation",
  description:
    "Build complex workflows in minutes",
  keywords: [
    "automation",
    "workflow",
    "node-based",
    "n8n",
    "mini n8n",
    "productivity",
    "integration",
    "Autm8n",
  ],
  authors: [{ name: "Amrit" }],
  openGraph: {
    title: "Autm8n — Build, Automate, Scale",
    description:
      "Your go-to node-based automation platform. Connect your apps, automate your workflows, and scale your productivity with ease.",
    siteName: "Autm8n",
    type: "website",
    url: "https://autm8n.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Autm8n — Node Based Automation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Autm8n — Node Based Automation",
    description: "Connect your apps, automate your workflows, and scale your productivity with ease.",
    images: ["https://autm8n.com/og-image.png"],
  },
  other: {
    "theme-color": "#030303",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Analytics/>
      </body>
    </html>
  );
}
