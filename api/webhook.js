const { Bot, webhookCallback } = require("grammy");

const bot = new Bot(process.env.BOT_TOKEN);

bot.command("start", (ctx) =>
  ctx.reply("Привет! Я бьюти-бот 💅 Задай мне любой вопрос о красоте и уходе!")
);

bot.on("message:text", async (ctx) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: ctx.message.text }] }],
      }),
    }
  );
  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Не смогла ответить 😔";
  await ctx.reply(reply);
});

module.exports = webhookCallback(bot, "std/http");
