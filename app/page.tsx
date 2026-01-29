import { auth0 } from "../lib/auth0";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default async function Home() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <main >
        <div className="flex flex-row align-center justify-center gap-4 h-max">

       <Link href="/auth/login?screen_hint=signup">
       <Button>Sign up</Button>

       </Link> 

          <Link href="/auth/login">
       <Button>Log in</Button>

       </Link> 

        </div>
        
      </main>
    );
  }

  return (
    <main>
      <h1>Welcome, {session.user.name}!</h1>
    </main>
  );
}
