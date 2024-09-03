import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import "../__server__";

export const runtime = 'edge';

const montserrat = Montserrat({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated with create app",
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="en">
      <body className={montserrat.className}>
        {children}
      </body>
    </html>
  );
}
