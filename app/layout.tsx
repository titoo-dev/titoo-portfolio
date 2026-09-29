// The real root layout is app/[lang]/layout.tsx, which sets <html lang>. This
// pass-through only exists so app/not-found.tsx has a layout to render in.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
