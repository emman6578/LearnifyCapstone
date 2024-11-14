import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding Database...");

    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.units);
    await db.delete(schema.lessons);
    await db.delete(schema.challenges);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);

    await db.insert(schema.courses).values([
      {
        id: 1,
        title: "Recognize Rhyming Words",
        imageSrc: "/learn1.svg",
      },
      {
        id: 2,
        title: "Recognize Rhyming Words in Poems Heard",
        imageSrc: "/learn2.svg",
      },
    ]);

    await db.insert(schema.units).values([
      //module number 1
      {
        id: 1,
        courseId: 1,
        title: "Lesson 1",
        description: "Recognizing Rhyming Words in Nursery Rhymes Heard",
        order: 1,
      },
      {
        id: 2,
        courseId: 1,
        title: "Lesson 2",
        description: "Recognizing Rhyming Words in Poems Heard",
        order: 2,
      },
      //end of module number 1

      //start of module 2
      {
        id: 3,
        courseId: 2,
        title: "Lesson 3",
        description: "Recognizing Telling Sentence",
        order: 3,
      },
      {
        id: 4,
        courseId: 2,
        title: "Lesson 4",
        description: "Recognizing Asking Sentence",
        order: 4,
      },
      //end of module 2
    ]);

    //Lesson #1 Module 1
    await db.insert(schema.lessons).values([
      {
        id: 1,
        unitId: 1,
        order: 1,
        title: "Look for the rhyme words.",
      },
      {
        id: 2,
        unitId: 1,
        order: 2,
        title: "Type the words that rhyme",
      },
    ]);

    //Lesson #2 Module 1
    await db.insert(schema.lessons).values([
      {
        id: 3,
        unitId: 2,
        order: 3,
        title: "Select Yes or No",
      },
      {
        id: 4,
        unitId: 2,
        order: 4,
        title: "Read and understand the poem",
      },
      {
        id: 5,
        unitId: 2,
        order: 5,
        title: "Sing the song Jack and Jill",
      },
    ]);

    //Lesson #3 Module 2
    await db.insert(schema.lessons).values([
      {
        id: 6,
        unitId: 3,
        order: 1,
        title: "same ending sound",
      },
      {
        id: 7,
        unitId: 3,
        order: 2,
        title: "Re write sentences",
      },
    ]);

    //1st lesson challenges Module 1
    await db.insert(schema.challenges).values([
      {
        id: 1,
        lessonId: 1,
        type: "SELECT",
        order: 1,
        question:
          "Instructions: Identify the pair of words that rhymes. Choose the correct answer.",
        hasInstructionalMaterials: true,
        instructions:
          "two-blue<br/>morning-shining<br/>look-book<br/>long-song<br/><br/>Words having the same ending sound are called <u>Rhyming words.</u>",
      },
      {
        id: 2,
        lessonId: 1,
        type: "SELECT",
        order: 2,
        question:
          "Instructions: Identify the pair of words that rhymes. Choose the correct answer.",
      },
      {
        id: 3,
        lessonId: 1,
        type: "SELECT",
        order: 3,
        question: "Find the words that rhyme.",
      },
      {
        id: 4,
        lessonId: 2,
        type: "UNDERLINED",
        order: 4,
        instructions: "Instructions: Type the words that rhyme",
        question: "Rick caught a big fish,<br/> He placed it on a dish.",
      },
      {
        id: 5,
        lessonId: 2,
        type: "UNDERLINED",
        order: 5,
        instructions: "Instructions: Type the words that rhyme",
        question: "Mike did not use his bike,<br/>He said he wanted to hike.",
      },
      {
        id: 6,
        lessonId: 2,
        type: "UNDERLINED",
        order: 6,
        instructions: "Instructions: Type the words that rhyme",
        question: "Rain rain, go away,<br/>Come again another day",
      },
    ]);

    //Options for 1st lesson Module 1
    await db.insert(schema.challengeOptions).values([
      {
        id: 1,
        challengeId: 1,
        // imageSrc: "/man.svg",
        correct: true,
        text: "long – song",
      },
      {
        id: 2,
        challengeId: 1,
        // imageSrc: "/woman.svg",
        correct: false,
        text: "two - look",
      },
      {
        id: 3,
        challengeId: 2,
        // imageSrc: "/man.svg",
        correct: false,
        text: "come - book",
      },
      {
        id: 4,
        challengeId: 2,
        // imageSrc: "/woman.svg",
        correct: true,
        text: "morning - shining",
      },
      {
        id: 5,
        challengeId: 3,
        imageSrc: "/book.svg",
        correct: true,
        text: "Book",
      },
      {
        id: 6,
        challengeId: 3,
        imageSrc: "/paper.svg",
        correct: false,
        text: "Paper",
      },
      {
        id: 7,
        challengeId: 3,
        imageSrc: "/hook.svg",
        correct: true,
        text: "Hook",
      },
      {
        id: 8,
        challengeId: 4,
        imageSrc: "/man.svg",
        correct: true,
        text: "fish",
      },
      {
        id: 9,
        challengeId: 4,
        imageSrc: "/woman.svg",
        correct: true,
        text: "dish",
      },
      {
        id: 10,
        challengeId: 5,
        imageSrc: "/man.svg",
        correct: true,
        text: "bike",
      },
      {
        id: 11,
        challengeId: 5,
        imageSrc: "/woman.svg",
        correct: true,
        text: "hike",
      },
      {
        id: 12,
        challengeId: 6,
        imageSrc: "/man.svg",
        correct: true,
        text: "away",
      },
      {
        id: 13,
        challengeId: 6,
        imageSrc: "/woman.svg",
        correct: true,
        text: "day",
      },
    ]);

    //2nd lesson challenges Module 1
    await db.insert(schema.challenges).values([
      {
        id: 7,
        lessonId: 3,
        type: "SELECT",
        order: 7,
        question: " Look at the <u>pig</u>. It’s dancing like a <u>kid</u>",
        instructions:
          "Instructions: Choose <u>Yes</u> on the choices if the pair of words rhyme and <u>No</u> if does not.",
      },
      {
        id: 8,
        lessonId: 3,
        type: "SELECT",
        order: 8,
        question: "It is <u>fun</u> to run <u>fast</u>.",
        instructions:
          "Instructions: Choose <u>Yes</u> on the choices if the pair of words rhyme and <u>No</u> if does not.",
      },
      {
        id: 9,
        lessonId: 3,
        type: "SELECT",
        order: 9,
        question:
          "It’s been raining. All day <u>long</u> All the frogs break into <u>song</u>",
        instructions:
          "Instructions: Choose <u>Yes</u> on the choices if the pair of words rhyme and <u>No</u> if does not.",
      },
      {
        id: 10,
        lessonId: 4,
        type: "SELECT",
        order: 10,
        question: "Instructions: Match the word <u>HARM</u>.",
        hasInstructionalMaterials: true,
        instructions:
          "bell-well<br/>in-green<br/>out-stout<br/>that-cat<br/>harm-farm<br/><br/>These are the words that rhyme in the poem",
      },
      {
        id: 11,
        lessonId: 4,
        type: "SELECT",
        order: 11,
        question: "Instructions: Match the word <u>STOUT</u>.",
        instructions:
          "bell-well<br/>in-green<br/>out-stout<br/>that-cat<br/>harm-farm<br/><br/>These are the words that rhyme in the poem",
      },
      {
        id: 12,
        lessonId: 4,
        type: "SELECT",
        order: 12,
        question: "Instructions: Match the word <u>BELL</u>.",
        instructions:
          "bell-well<br/>in-green<br/>out-stout<br/>that-cat<br/>harm-farm<br/><br/>These are the words that rhyme in the poem",
      },
      {
        id: 13,
        lessonId: 5,
        type: "SELECT",
        order: 13,
        question: "Come, let us go out and play under the <u>sun</u>.",
        instructions:
          "Instructions: Choose the word that rhymes with the underlined word.",
      },
      {
        id: 14,
        lessonId: 5,
        type: "SELECT",
        order: 14,
        question:
          "Soft are the moon <u>beams</u>.<br/>I hear sweet sounds in my ______",
        instructions:
          "Instructions: Choose the word that rhymes with the underlined word.",
      },
      {
        id: 15,
        lessonId: 5,
        type: "SELECT",
        order: 15,
        question:
          "Let us run to the <u>hill</u>.<br/>Join us if you  <u>will</u>.<br/>Be with Kim, Lyn, and ______",
        instructions:
          "Instructions: Choose the word that rhymes with the underlined word.",
      },
    ]);

    //Options for 2nd lesson Module 1
    await db.insert(schema.challengeOptions).values([
      {
        id: 14,
        challengeId: 7,
        // imageSrc: "/man.svg",
        correct: false,
        text: "YES",
      },
      {
        id: 15,
        challengeId: 7,
        // imageSrc: "/woman.svg",
        correct: true,
        text: "NO",
      },
      {
        id: 16,
        challengeId: 8,
        // imageSrc: "/man.svg",
        correct: false,
        text: "YES",
      },
      {
        id: 17,
        challengeId: 8,
        // imageSrc: "/woman.svg",
        correct: true,
        text: "NO",
      },
      {
        id: 18,
        challengeId: 9,
        // imageSrc: "/book.svg",
        correct: true,
        text: "YES",
      },
      {
        id: 19,
        challengeId: 9,
        // imageSrc: "/paper.svg",
        correct: false,
        text: "NO",
      },
      //harm - farm
      {
        id: 20,
        challengeId: 10,
        // imageSrc: "/paper.svg",
        correct: true,
        text: "Farm",
      },
      {
        id: 21,
        challengeId: 10,
        // imageSrc: "/paper.svg",
        correct: false,
        text: "Stout",
      },
      {
        id: 22,
        challengeId: 10,
        // imageSrc: "/paper.svg",
        correct: false,
        text: "Well",
      },
      // stout - out
      {
        id: 23,
        challengeId: 11,
        // imageSrc: "/paper.svg",
        correct: false,
        text: "Harm",
      },
      {
        id: 24,
        challengeId: 11,
        // imageSrc: "/paper.svg",
        correct: false,
        text: "Bell",
      },
      {
        id: 25,
        challengeId: 11,
        // imageSrc: "/paper.svg",
        correct: true,
        text: "Out",
      },
      // well - bell
      {
        id: 26,
        challengeId: 12,
        // imageSrc: "/paper.svg",
        correct: false,
        text: "Stout",
      },
      {
        id: 27,
        challengeId: 12,
        // imageSrc: "/paper.svg",
        correct: false,
        text: "Farm",
      },
      {
        id: 28,
        challengeId: 12,
        // imageSrc: "/paper.svg",
        correct: true,
        text: "Well",
      },
      {
        id: 29,
        challengeId: 13,
        imageSrc: "/drum.png",
        correct: false,
        text: "Drum",
      },
      {
        id: 30,
        challengeId: 13,
        imageSrc: "/fun.png",
        correct: true,
        text: "Fun",
      },
      {
        id: 31,
        challengeId: 14,
        imageSrc: "/dance.png",
        correct: false,
        text: "Dance",
      },
      {
        id: 32,
        challengeId: 14,
        imageSrc: "/dreams.png",
        correct: true,
        text: "Dreams",
      },
      {
        id: 33,
        challengeId: 15,
        imageSrc: "/Jill.png",
        correct: true,
        text: "Jill",
      },
      {
        id: 34,
        challengeId: 15,
        imageSrc: "/mary.png",
        correct: false,
        text: "Mary",
      },
    ]);

    //Test INSTRUCTIONS============================
    await db.insert(schema.instructionalMaterials).values([
      {
        id: 1,
        challengeId: 1,
        title: "Recognizing Rhyming Words in Nursery Rhymes Heard",
        description: "Identify rhyming words in nursery rhymes heard",
        content:
          "One, <u>two</u>, the sky is <u>blue</u>.<br/>Good <u>morning</u>, Good morning, The sun is <u>shining</u>.<br/>Come and <u>look</u>, I have a new <u>book</u>.<br/>It’s been raining all day <u>long</u>, All the frogs break into <u>song!</u>",
      },
      {
        id: 2,
        challengeId: 10,
        title: "Ding Dong Bell",
        description: "Listen and understand the poem.",
        content:
          "Ding Dong <u>Bell</u><br/>Pussy’s in the <u>well.</u><br/>Who put her <u>in?</u><br/>Little Tommy <u>green.</u><br/>Who pulled her <u>out?</u><br/>Little Tommy <u>stout.</u><br/>What a mighty boy was <u>that</u><br/>To try to drown poor pussy <u>cat.</u><br/>Who we are did him any <u>harm</u><br/>But killed all the mice in the farmers’ <u>farm.</u><br/>",
      },
    ]);
    //==============END INSTRUCTIONS||=============================

    console.log("Database Seeded.");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed the database");
  }
};

void main();
