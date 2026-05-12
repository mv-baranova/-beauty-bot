require("dotenv").config();
const { Bot, Keyboard } = require("grammy");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fetch = require("node-fetch");

const bot = new Bot(process.env.BOT_TOKEN);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const users = {};

function getUser(id) {
  if (!users[id]) users[id] = { history: [], mode: null };
  return users[id];
}

const SYSTEM_PROMPT = `Ты — профессиональный AI-стилист и бьюти-консультант. Твоё имя — Kira. Ты дружелюбная, современная, разбираешься в моде и красоте. Отвечай на русском языке. Давай конкретные советы. Если пользователь отправил фото — анализируй внешность, цветотип, форму лица. Предлагай конкретные решения: цвета, стили, продукты. Будь краткой но полезной. Используй эмодзи умеренно.`;

function mainMenu() {
  return new Keyboard()
    .text("📸 Анализ внешности").text("🎨 Цветовая палитра").row()
    .text("✨ Подбор стиля").text("💅 Уход за собой").row()
    .text("👗 Образ для события").text("💬 Свободный вопрос").resized();
}

bot.command("start", async (ctx) => {
  const name = ctx.from.first_name || "красотка";
  await ctx.reply(`Привет, ${name}! 💫\n\nЯ Kira — твой персональный AI-стилист.\n\nЯ могу:\n📸 Проанализировать внешность по фото\n🎨 Подобрать цветовую палитру\n✨ Помочь со стилем\n💅 Дать советы по уходу\n👗 Собрать образ для события\n\nВыбери что тебя интересует 👇`, { reply_markup: mainMenu() });
});

const MODE_MAP = {
  "📸 Анализ внешности": { mode: "photo_analysis", reply: "Отправь мне своё фото (селфи или в полный рост), и я проанализирую цветотип, форму лица и подскажу что тебе подходит 📸" },
  "🎨 Цветовая палитра": { mode: "colors", reply: "Расскажи о себе: цвет волос, глаз, кожи — или просто отправь фото. Я подберу твою идеальную палитру 🎨" },
  "✨ Подбор стиля": { mode: "style", reply: "Какой у тебя стиль жизни? Работа в офисе, фриланс, студентка? Какие вещи нравятся? Расскажи — подберу стиль ✨" },
  "💅 Уход за собой": { mode: "skincare", reply: "Какой у тебя тип кожи? Есть ли проблемы (сухость, акне, пигментация)? Расскажи — дам рекомендации 💅" },
  "👗 Образ для события": { mode: "event", reply: "Какое событие? (свидание, собеседование, вечеринка, свадьба) Какой бюджет и дресс-код? 👗" },
  "💬 Свободный вопрос": { mode: "free", reply: "Спрашивай что угодно о стиле, красоте, моде — я помогу 💬" },
};

bot.hears(Object.keys(MODE_MAP), async (ctx) => {
  const { mode, reply } = MODE_MAP[ctx.message.text];
  getUser(ctx.from.id).mode = mode;
  await ctx.reply(reply, { reply_markup: mainMenu() });
});

bot.on("message:photo", async (ctx) => {
  const user = getUser(ctx.from.id);
  await ctx.reply("Анализирую фото... ⏳");
  try {
    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    const file = await ctx.api.getFile(photo.file_id);
    const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
    const response = await fetch(url);
    const buffer = await response.buffer();
    const base64 = buffer.toString("base64");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = user.mode === "colors"
      ? `${SYSTEM_PROMPT}\n\nПользователь хочет узнать свою цветовую палитру. Проанализируй фото: определи цветотип (весна/лето/осень/зима), подходящие цвета в одежде, макияже, аксессуарах.`
      : `${SYSTEM_PROMPT}\n\nПроанализируй фото человека. Определи: цветотип, форму лица, тип фигуры (если видно). Дай конкретные рекомендации по стилю, причёске, макияжу и цветам.`;
    const result = await model.generateContent([prompt, { inlineData: { mimeType: "image/jpeg", data: base64 } }]);
    const text = result.response.text();
    user.history.push({ role: "model", text });
    await ctx.reply(text, { reply_markup: mainMenu() });
  } catch (err) {
    console.error(err);
    await ctx.reply("Не удалось обработать фото 😔 Попробуй ещё раз или задай вопрос текстом.");
  }
});

bot.on("message:text", async (ctx) => {
  const user = getUser(ctx.from.id);
  const userText = ctx.message.text;
  let modeContext = "";
  switch (user.mode) {
    case "style": modeContext = "Пользователь спрашивает о стиле одежды."; break;
    case "skincare": modeContext = "Пользователь спрашивает об уходе за кожей/волосами."; break;
    case "event": modeContext = "Пользователь хочет собрать образ для события."; break;
    case "colors": modeContext = "Пользователь хочет узнать подходящие цвета."; break;
    default: modeContext = "Свободный вопрос о красоте и стиле.";
  }
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const history = user.history.slice(-6).map((h) => h.text).join("\n");
    const prompt = `${SYSTEM_PROMPT}\n\nКонтекст: ${modeContext}\n\nПредыдущий диалог:\n${history}\n\nВопрос пользователя: ${userText}`;
    const result = await model.generateContent(prompt);
    const reply = result.response.text();
    user.history.push({ role: "user", text: userText });
    user.history.push({ role: "model", text: reply });
    if (user.history.length > 20) user.history = user.history.slice(-20);
    await ctx.reply(reply, { reply_markup: mainMenu() });
  } catch (err) {
    console.error(err);
    await ctx.reply("Произошла ошибка 😔 Попробуй ещё раз.");
  }
});

bot.start();
console.log("✅ Бот Kira запущен!");
