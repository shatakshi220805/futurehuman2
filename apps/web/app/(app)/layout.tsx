import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncUser } from "@/lib/auth";
import { AppShell } from "@/components/app/app-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const user = await syncUser();
  return <AppShell onboardingComplete={user?.onboardingComplete ?? false}>{children}</AppShell>;
}
