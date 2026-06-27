import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/ui/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobSniper",
  description: "精准狙击目标职位",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "JobSniper",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <main className="min-h-screen pb-16">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
