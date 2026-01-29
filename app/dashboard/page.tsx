import { auth0 } from "../../lib/auth0";
import { redirect } from "next/navigation";
import HabitDashboard from "../components/HabitDashboard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/");
  }
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {session.user.name}
            </h1>
            <p className="text-gray-600">Track your daily habits</p>
            <Link href="/api/auth/logout">
              <Button variant="outline">Log out</Button>
            </Link>
          </div>
        </div>
        <HabitDashboard />
      </div>
    </main>
  );
}
