import type { Metadata } from "next";
import { StoreProvider } from "./StoreProvider";

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

  return (
    <StoreProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </StoreProvider>
  );
}
