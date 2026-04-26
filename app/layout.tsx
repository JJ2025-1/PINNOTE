import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Player } from "@/components/Player";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pinnote AI | Soundcore Edition",
  description: "Experience music and notes like never before.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground selection:bg-primary/30 h-full overflow-hidden`}
      >
        <div className="flex h-full overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex flex-col min-w-0 relative h-full">
            <div className="flex-1 overflow-y-auto pb-32 h-full">
              {children}
            </div>
          </main>
        </div>
        <Player />
      </body>
    </html>
  );
}
