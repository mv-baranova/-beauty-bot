require('dotenv').config();
const { Bot, Keyboard } = require('grammy');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fetch = require('node-fetch');

// Инициализация бота
const bot = new Bot(process.env.BOT_TOKEN);

// Инициализация Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: `gemini-1.5-flash` });

// Клавиатура
const mainKeyboard = new Keyboard()
  .text(`О боте`)
  .text(`Помощь`)
  .row()
  .text(`Совет по стилю`)
  .resized();

// Команда /start
bot.command(`start`, async (ctx) => {
  await ctx.reply(`Привет! Я Кира, твой личный AI бьюти-стилист. 🌸\n\nПришли мне текст с вопросом или фото, и я помогу тебе с образом!`, {
    reply_markup: mainKeyboard,
  });
});

// Обработка текстовых кнопок меню
bot.hears(`О боте`, async (ctx) => {
  await ctx.reply(`Я — Кира, AI-ассистент, созданный для того, чтобы помогать тебе выглядеть и чувствовать себя великолепно. Я использую передовые технологии Google Gemini для анализа стиля.`);
});

bot.hears(`Помощь`, async (ctx) => {
  await ctx.reply(`Просто отправь мне сообщение с вопросом о красоте или загрузи фото, чтобы я могла проанализировать твой образ и дать советы.`);
});

bot.hears(`Совет по стилю`, async (ctx) => {
  await ctx.reply(`Пришли мне свое фото, и я проанализирую твой стиль, макияж или прическу!`);
});

// Функция для получения base64 фото
async function getFileAsBase64(fileUrl) {
  const response = await fetch(fileUrl);
  const buffer = await response.buffer();
  return buffer.toString(`base64`);
}

// Обработка фото
bot.on(`message:photo`, async (ctx) => {
  try {
    await ctx.reply(`Анализирую фото, подожди немного... ⏳`);

    // Берем самое качественное фото
    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    const file = await ctx.getFile();
    const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

    const base64Data = await getFileAsBase64(fileUrl);

    const prompt = `Проанализируй это фото как бьюти-стилист. Дай советы по макияжу, прическе и общему стилю. Отвечай на русском языке.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: `image/jpeg`,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    await ctx.reply(text);
  } catch (error) {
    console.error(error);
    await ctx.reply(`Произошла ошибка при анализе фото. Попробуй позже.`);
  }
});

// Обработка текстовых сообщений
bot.on(`message:text`, async (ctx) => {
  // Если это не команда и не кнопка меню
  if (ctx.message.text.startsWith(`/`) || [`О боте`, `Помощь`, `Совет по стилю`].includes(ctx.message.text)) {
    return;
  }

  try {
    await ctx.reply(`Думаю... 🤔`);

    const prompt = `Ты — Кира, эксперт в области красоты и стиля. Ответь на следующий вопрос пользователя: ${ctx.message.text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    await ctx.reply(text);
  } catch (error) {
    console.error(error);
    await ctx.reply(`Извини, я не смогла обработать твой запрос. Попробуй еще раз.`);
  }
});

// Запуск бота
bot.start();
console.log(`Bot started!`);
