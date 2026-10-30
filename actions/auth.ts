"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import crypto from "crypto";

import db from "@/db/drizzle";
import { users } from "@/db/schema";
import { hashPassword, signSession, verifyPassword } from "@/lib/auth";

function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caractères.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Le mot de passe doit contenir au moins une lettre majuscule (A-Z).";
  }
  if (!/[0-9]/.test(password)) {
    return "Le mot de passe doit contenir au moins un chiffre (0-9).";
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Le mot de passe doit contenir au moins un caractère spécial / symbole (ex: @, #, $, %, !).";
  }
  return null;
}

export async function register(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Tous les champs sont requis." };
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return { error: passwordError };
  }

  const normalizedEmail = email.toLowerCase().trim();

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail));

  if (existingUser) {
    return { error: "Cet email est déjà utilisé." };
  }

  const hashedPassword = await hashPassword(password);
  const userId = `user_${crypto.randomUUID().replace(/-/g, "")}`;

  await db.insert(users).values({
    id: userId,
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    imageSrc: "/mascot.svg",
    onboardingCompleted: false,
  });

  const token = await signSession(userId);

  cookies().set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/onboarding");
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Veuillez renseigner votre email et mot de passe." };
  }

  const normalizedEmail = email.toLowerCase().trim();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail));

  if (!user) {
    return { error: "Identifiants incorrects." };
  }

  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    return { error: "Identifiants incorrects." };
  }

  const token = await signSession(user.id);

  cookies().set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  if (!user.onboardingCompleted) {
    redirect("/onboarding");
  }

  redirect("/learn");
}

export async function logout() {
  cookies().delete("session");
  redirect("/");
}
