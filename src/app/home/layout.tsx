
export const runtime = 'edge';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-3 pt-3 pb-10 w-full h-screen">
      {children}
    </div>
  );
}
