
export const runtime = 'edge';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-3 py-3 w-full">
      {children}
    </div>
  );
}
