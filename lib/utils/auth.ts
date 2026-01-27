import { auth0 } from "../auth0";
import prisma from "../db";

export async function getAuthenticatedUser() {
  const session = await auth0.getSession();

  if (!session?.user) {
    return null;
  }

  // Get or create user in our DB
  let user = await prisma.user.findFirst({
    where: { authId: session.user.sub },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { authId: session.user.sub },
    });
  }

  return user;
}
