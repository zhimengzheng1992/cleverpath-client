export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex-1 p-6 overflow-y-auto">{children}</main>;
}
