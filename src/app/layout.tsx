import type { Metadata } from "next";
import 'tailwindcss/tailwind.css';
import { Providers } from "./Providers";
import { cookies } from 'next/headers'
import Header from "@component/layout/header/Header";
import Footer from "@component/layout/footer/Footer";

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
      <body>
        <Providers token={token}>
          <div className="flex flex-col h-screen justify-between">
            <Header />
            <main className="mb-auto h-80">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
