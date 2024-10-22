import type { Metadata } from "next";
import 'tailwindcss/tailwind.css';
import { Providers } from "./Providers";
import { cookies } from 'next/headers'
import Header from "@component/layout/header/Header";
import Footer from "@component/layout/footer/Footer";
import "ol/ol.css";

export const runtime = 'edge';

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated with create app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies()
  var token = cookieStore.get('token')?.value || ''
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Providers token={token}>
          <div className="justify-between">
            <Header />
            <main className="pt-5 text-foreground bg-background flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
