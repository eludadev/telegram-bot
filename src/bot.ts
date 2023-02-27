import { Bot, Context, InlineKeyboard, SessionFlavor, webhookCallback } from "https://deno.land/x/grammy@v1.14.1/mod.ts";
import { chunk } from 'https://raw.githubusercontent.com/lodash/lodash/4.17.21-es/lodash.js';
import express from "npm:express@4.18.2";
import { applyTextEffect, Variant } from "./textEffects.ts";
import { setTimeout } from "node:timers/promises";

import daily from "./data.json" assert { type: "json" }
import breathe from "./breathe.json" assert { type: "json" }
import neck from "./neck.json" assert { type: "json" }
import back from "./intensive.json" assert { type: "json" }
import office from "./office.json" assert { type: "json" }

import type { Variant as TextEffectVariant } from "./textEffects.ts";

interface SessionData {
  favoriteIds: string[]
}

interface Day {
  exercises: number[],
  description: string[]
}

type MyContext = Context & SessionFlavor<SessionData>

// Create a bot using the Telegram token
const bot = new Bot("1172030999:AAFL8vuB8CK7EOyn7_dlBAcZfAv1qqiJHYQ");
const sourceChatId = -1001398397423

// Handle the /yo command to greet the user
bot.command("yo", (ctx) => ctx.reply(`Yo ${ctx.from?.username}`));

//Working forward pattern

bot.command("daily", async (ctx) => {

  const day = getDayOfTheYear();
  const length = daily.length;
  const todaysNumber = day % length
  const pack = daily.at(todaysNumber) as Day

  for (let i = 0; i < pack.exercises.length; i++) {
    await bot.api.forwardMessage(
      ctx.chat.id,
      sourceChatId,
      pack.exercises[i],
    );
    await bot.api.sendMessage(
      ctx.chat.id,
      pack.description[i]
    );
    await setTimeout(500)
  }
});

bot.command("breathe", async (ctx) => {

  const day = getDayOfTheYear();
  const length = breathe.length;
  const todaysNumber = day % length
  const pack = breathe.at(todaysNumber) as Day

  for (let i = 0; i < pack.exercises.length; i++) {
    await bot.api.forwardMessage(
      ctx.chat.id,
      sourceChatId,
      pack.exercises[i],
    );
    await setTimeout(500)
  }
});

bot.command("back", async (ctx) => {

  const day = getDayOfTheYear();
  const length = back.length;
  const todaysNumber = day % length
  const pack = back.at(todaysNumber) as Day

  for (let i = 0; i < pack.exercises.length; i++) {
    await bot.api.forwardMessage(
      ctx.chat.id,
      sourceChatId,
      pack.exercises[i],
    );
    await setTimeout(500)
  }
});

bot.command("neck", async (ctx) => {

  const day = getDayOfTheYear();
  const length = neck.length;
  const todaysNumber = day % length
  const pack = neck.at(todaysNumber) as Day
  console.log("todays day ", todaysNumber)

  for (let i = 0; i < pack.exercises.length; i++) {
    console.log(pack.exercises[i])

    await bot.api.forwardMessage(
      ctx.chat.id,
      sourceChatId,
      pack.exercises[i],
    );
    await setTimeout(500)
  }
});

bot.command("office", async (ctx) => {

  const day = getDayOfTheYear();
  const length = office.length;
  const todaysNumber = day % length
  const pack = office.at(todaysNumber) as Day

  for (let i = 0; i < pack.exercises.length; i++) {
    await bot.api.forwardMessage(
      ctx.chat.id,
      sourceChatId,
      pack.exercises[i],
    );
    await setTimeout(500)
  }
});

function getDayOfTheYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  return day
}

// Return empty result list for other queries.
bot.on("inline_query", (ctx) => ctx.answerInlineQuery([]));


// Handle the /about command
const aboutUrlKeyboard = new InlineKeyboard().url(
  "в бабруйск жывотные",
  "https://updaff.com/"
);

// Suggest commands in the menu
bot.api.setMyCommands([
  { command: "daily", description: "Спина + шея 10 дней" },
  { command: "back", description: "Спина 7 дней" },
  { command: "neck", description: "Шея 7 дней" },
  { command: "office", description: "Упрежнения для офиса" },
  { command: "breathe", description: "Дыхательные упражнения" },
]);

// Handle all other messages and the /start command
const introductionMessage = `
<b>ВАЖНО!</b>
Этот бот создан для личного использования и не несёт цели
распространения или получения материальной выгоды.`;

const replyWithIntro = (ctx: any) =>
  ctx.reply(introductionMessage, {
    reply_markup: aboutUrlKeyboard,
    parse_mode: "HTML",
  });



bot.command("start", replyWithIntro);
// bot.on("message", processCommand);

// Start the server
// if (process.env.NODE_ENV === "production") {
//   // Use Webhooks for the production server
//   const app = express();
//   app.use(express.json());
//   app.use(webhookCallback(bot, "express"));

//   const PORT = 3000;
//   app.listen(PORT, () => {
//     console.log(`Bot listening on port ${PORT}`);
//   });
// } else {
if (true) {
  // Use Long Polling for development
  bot.start();
}
