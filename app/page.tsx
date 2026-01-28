import { auth0 } from "../lib/auth0";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <main className="">
        <div className="flex justify-center align-center max-h gap-4">
          <Link href="/auth/login?screen_hint=signup">
            <Button>Sign up</Button>
          </Link>

          <Link href="/auth/login">
            <Button variant="outline">Log in</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <h1>Welcome, {session.user.name}</h1>
      <Link href="/auth/logout">
        <Button variant="outline">Log out HARD</Button>
      </Link>
    </main>
  );
}
