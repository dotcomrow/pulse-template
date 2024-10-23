import type { Metadata } from "next";
import 'tailwindcss/tailwind.css';
import { Providers } from "./Providers";
import { cookies } from 'next/headers'
import Header from "@component/layout/header/Header";
import Footer from "@component/layout/footer/Footer";
import "ol/ol.css";
import { GoogleAnalytics } from '@next/third-parties/google'

export const runtime = 'edge';

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated with create app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies()
  var token = cookieStore.get('token')?.value || ''
  return (
    <html lang="en">
      <body>
        <Providers token={token}>
            <Header />
            <main className="text-foreground bg-background">
              {children}
            </main>
            <Footer />
        </Providers>
      </body>
      <GoogleAnalytics gaId="G-8MHBD6Z0FG" />
    </html>
  );
}
