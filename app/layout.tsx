import SideNav from "@/components/SideNav";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";
import { createClient } from "@/utils/supabase/server";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "Tigerkenn Homes Backend",

};

export const viewport: Viewport = {
  themeColor: "#3367D6"
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

const supabase = createClient();

const {
  data: { user },
} = await supabase.auth.getUser();




  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className='flex min-h-screen'>
          {user && <SideNav />}
          <main className='flex-grow h-screen overflow-y-auto bg-gray-50'>
            <Header />
            {children}
          </main>
          <Toaster />
          <PWAInstallPrompt />
        </div>
      </body>
    </html>
  );
}
