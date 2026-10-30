import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import db from "@/db/drizzle";
import { users } from "@/db/schema";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "duolingo_super_secret_jwt_key_2026_local_database"
);

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function signSession(userId: string): Promise<string> {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySession(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { userId: payload.userId as string };
  } catch {
    return null;
  }
}

export async function getSessionUserId(): Promise<string | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) return null;
    const session = await verifySession(token);
    return session?.userId || null;
  } catch {
    return null;
  }
}

export async function auth(): Promise<{ userId: string | null }> {
  const userId = await getSessionUserId();
  return { userId };
}

export async function currentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return null;

    return {
      id: user.id,
      firstName: user.name.split(" ")[0],
      name: user.name,
      email: user.email,
      imageUrl: user.imageSrc || "/mascot.svg",
      emailAddresses: [{ emailAddress: user.email }],
    };
  } catch {
    return null;
  }
}

