import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "AI Mock Interview",
  description: "Practice interviews with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <html lang="en">
          <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
            {children}
          </body>
        </html>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
