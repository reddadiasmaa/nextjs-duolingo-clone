"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import db from "@/db/drizzle";
import { users, courses, userProgress } from "@/db/schema";
import { auth, currentUser } from "@/lib/auth";

export async function submitOnboarding(formData: FormData) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  const age = Number(formData.get("age"));
  const targetLanguage = formData.get("targetLanguage") as string;
  const learningReason = formData.get("learningReason") as string;
  const educationLevel = formData.get("educationLevel") as string;

  if (!age || !targetLanguage || !learningReason || !educationLevel) {
    return { error: "Veuillez remplir tous les champs du questionnaire." };
  }

  if (age < 5 || age > 120) {
    return { error: "Veuillez renseigner un âge valide." };
  }

  await db
    .update(users)
    .set({
      age,
      targetLanguage,
      learningReason,
      educationLevel,
      onboardingCompleted: true,
    })
    .where(eq(users.id, userId));

  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.title, targetLanguage));

  if (course) {
    const [existingProgress] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));

    if (existingProgress) {
      await db
        .update(userProgress)
        .set({ activeCourseId: course.id })
        .where(eq(userProgress.userId, userId));
    } else {
      await db.insert(userProgress).values({
        userId,
        userName: user.name || "User",
        userImageSrc: user.imageUrl || "/mascot.svg",
        activeCourseId: course.id,
      });
    }
  }

  redirect("/learn");
}

