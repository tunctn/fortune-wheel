import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ViewportContent } from "./viewport-content";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fortune Wheel",
  description: "Fortune Wheel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <ViewportContent>
        <body className={cn(inter.className, "antialiased")}>
          <Providers>
            <div vaul-drawer-wrapper="" className="min-h-[100vh] bg-white">
              {children}
              <Toaster />
            </div>
          </Providers>
        </body>
      </ViewportContent>
    </html>
  );
}
