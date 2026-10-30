import "dotenv/config";
import db from "../db/drizzle";
import * as schema from "../db/schema";

async function main() {
  console.log("Adding English and Japanese courses...");

  // 1. Add English Course
  const [english] = await db
    .insert(schema.courses)
    .values({
      title: "English",
      imageSrc: "/en.svg",
    })
    .returning();

  // English Unit 1
  const [enUnit] = await db
    .insert(schema.units)
    .values({
      courseId: english.id,
      title: "Unit 1",
      description: "Learn the basics of English",
      order: 1,
    })
    .returning();

  // English Lesson 1
  const [enLesson1] = await db
    .insert(schema.lessons)
    .values({
      unitId: enUnit.id,
      title: "Nouns",
      order: 1,
    })
    .returning();

  // English Challenges
  const enChallenges = await db
    .insert(schema.challenges)
    .values([
      {
        lessonId: enLesson1.id,
        type: "SELECT",
        question: 'Which one of these is "the man"?',
        order: 1,
      },
      {
        lessonId: enLesson1.id,
        type: "SELECT",
        question: 'Which one of these is "the woman"?',
        order: 2,
      },
      {
        lessonId: enLesson1.id,
        type: "SELECT",
        question: 'Which one of these is "the robot"?',
        order: 3,
      },
      {
        lessonId: enLesson1.id,
        type: "ASSIST",
        question: '"the man"',
        order: 4,
      },
    ])
    .returning();

  await db.insert(schema.challengeOptions).values([
    { challengeId: enChallenges[0].id, correct: true, text: "the man", imageSrc: "/man.svg" },
    { challengeId: enChallenges[0].id, correct: false, text: "the woman", imageSrc: "/woman.svg" },
    { challengeId: enChallenges[0].id, correct: false, text: "the boy", imageSrc: "/boy.svg" },

    { challengeId: enChallenges[1].id, correct: true, text: "the woman", imageSrc: "/woman.svg" },
    { challengeId: enChallenges[1].id, correct: false, text: "the girl", imageSrc: "/girl.svg" },
    { challengeId: enChallenges[1].id, correct: false, text: "the robot", imageSrc: "/robot.svg" },

    { challengeId: enChallenges[2].id, correct: true, text: "the robot", imageSrc: "/robot.svg" },
    { challengeId: enChallenges[2].id, correct: false, text: "the zombie", imageSrc: "/zombie.svg" },
    { challengeId: enChallenges[2].id, correct: false, text: "the boy", imageSrc: "/boy.svg" },

    { challengeId: enChallenges[3].id, correct: true, text: "the man", imageSrc: "/man.svg" },
    { challengeId: enChallenges[3].id, correct: false, text: "the woman", imageSrc: "/woman.svg" },
    { challengeId: enChallenges[3].id, correct: false, text: "the boy", imageSrc: "/boy.svg" },
  ]);

  // 2. Add Japanese Course
  const [japanese] = await db
    .insert(schema.courses)
    .values({
      title: "Japanese",
      imageSrc: "/jp.svg",
    })
    .returning();

  // Japanese Unit 1
  const [jpUnit] = await db
    .insert(schema.units)
    .values({
      courseId: japanese.id,
      title: "Unit 1",
      description: "Learn the basics of Japanese",
      order: 1,
    })
    .returning();

  // Japanese Lesson 1
  const [jpLesson1] = await db
    .insert(schema.lessons)
    .values({
      unitId: jpUnit.id,
      title: "Basics & Nouns",
      order: 1,
    })
    .returning();

  // Japanese Challenges
  const jpChallenges = await db
    .insert(schema.challenges)
    .values([
      {
        lessonId: jpLesson1.id,
        type: "SELECT",
        question: 'Which one of these is "the man" (otoko)?',
        order: 1,
      },
      {
        lessonId: jpLesson1.id,
        type: "SELECT",
        question: 'Which one of these is "the woman" (onna)?',
        order: 2,
      },
      {
        lessonId: jpLesson1.id,
        type: "SELECT",
        question: 'Which one of these is "the robot"?',
        order: 3,
      },
      {
        lessonId: jpLesson1.id,
        type: "ASSIST",
        question: '"the man" (otoko)',
        order: 4,
      },
    ])
    .returning();

  await db.insert(schema.challengeOptions).values([
    { challengeId: jpChallenges[0].id, correct: true, text: "男 (otoko)", imageSrc: "/man.svg" },
    { challengeId: jpChallenges[0].id, correct: false, text: "女 (onna)", imageSrc: "/woman.svg" },
    { challengeId: jpChallenges[0].id, correct: false, text: "男の子 (otokonoko)", imageSrc: "/boy.svg" },

    { challengeId: jpChallenges[1].id, correct: true, text: "女 (onna)", imageSrc: "/woman.svg" },
    { challengeId: jpChallenges[1].id, correct: false, text: "女の子 (onnanoko)", imageSrc: "/girl.svg" },
    { challengeId: jpChallenges[1].id, correct: false, text: "ロボット (robotto)", imageSrc: "/robot.svg" },

    { challengeId: jpChallenges[2].id, correct: true, text: "ロボット (robotto)", imageSrc: "/robot.svg" },
    { challengeId: jpChallenges[2].id, correct: false, text: "ゾンビ (zonbi)", imageSrc: "/zombie.svg" },
    { challengeId: jpChallenges[2].id, correct: false, text: "男 (otoko)", imageSrc: "/man.svg" },

    { challengeId: jpChallenges[3].id, correct: true, text: "男 (otoko)", imageSrc: "/man.svg" },
    { challengeId: jpChallenges[3].id, correct: false, text: "女 (onna)", imageSrc: "/woman.svg" },
    { challengeId: jpChallenges[3].id, correct: false, text: "女の子 (onnanoko)", imageSrc: "/girl.svg" },
  ]);

  console.log("English and Japanese successfully added!");
}

main().catch(console.error);

