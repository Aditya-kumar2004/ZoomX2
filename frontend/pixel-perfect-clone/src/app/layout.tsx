import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zoom - Video Conferencing, Cloud Phone, Webinars, Chat, Virtual Events",
  description: "Bridge the gap between talking and doing with the AI-first work platform built for you.",
  authors: [{ name: "Zoom" }],
  openGraph: {
    title: "Zoom",
    description: "Zoom Application",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
