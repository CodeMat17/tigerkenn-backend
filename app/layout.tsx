import SideNav from "@/components/SideNav";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";
import { createClient } from "@/utils/supabase/server";

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
  title: "Tigerkenn Homes Backend",

};

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
        </div>
      </body>
    </html>
  );
}
