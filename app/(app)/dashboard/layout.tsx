import { auth } from "@clerk/nextjs/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Unauthenticated → sign-in এ রিডাইরেক্ট
  await auth.protect();
  return children;
}