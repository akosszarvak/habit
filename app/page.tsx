import { auth0 } from "../lib/auth0";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth0.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-indigo-100">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">Habit Tracker</h1>
        <p className="text-gray-600">Build better habits, one day at a time</p>
        <div className="flex gap-4 justify-center">
          <Link href="/api/login?screen_hint=signup">
            <Button size="lg">Sign up</Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="outline">
              Log in
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
