require('dotenv').config();
const { Bot, Keyboard } = require('grammy');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fetch = require('node-fetch');

// Проверка переменных окружения
if (!process.env.BOT_TOKEN) {
  console.error(`ERROR: BOT_TOKEN is missing in environment variables!`);
  process.exit(1);
}
if (!process.env.GEMINI_API_KEY) {
  console.error(`ERROR: GEMINI_API_KEY is missing in environment variables!`);
  process.exit(1);
}

// Инициализация бота
const bot = new Bot(process.env.BOT_TOKEN);

// Инициализация Gemini
let genAI;
let model;
try {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: `gemini-1.5-flash` });
} catch (error) {
  console.error(`ERROR: Failed to initialize Gemini AI:`, error);
}

// Клавиатура
const mainKeyboard = new Keyboard()
  .text(`О боте`)
  .text(`Помощь`)
  .row()
  .text(`Совет по стилю`)
  .resized();

// Команда /start
bot.command(`start`, async (ctx) => {
  try {
    await ctx.reply(`Привет! Я Кира, твой личный AI бьюти-стилист. 🌸\n\nПришли мне текст с вопросом или фото, и я помогу тебе с образом!`, {
      reply_markup: mainKeyboard,
    });
  } catch (error) {
    console.error(`ERROR in /start command:`, error);
  }
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
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }
    const buffer = await response.buffer();
    return buffer.toString(`base64`);
  } catch (error) {
    console.error(`ERROR in getFileAsBase64:`, error);
    throw error;
  }
}

// Обработка фото
bot.on(`message:photo`, async (ctx) => {
  try {
    await ctx.reply(`Анализирую фото, подожди немного... ⏳`);

    // Берем самое качественное фото
    const photo = ctx.message.photo[ctx.message.photo.length - 1];

    let file;
    try {
      file = await ctx.api.getFile(photo.file_id);
    } catch (error) {
      console.error(`ERROR calling getFile from Telegram API:`, error);
      return await ctx.reply(`Не удалось получить информацию о файле от Telegram. Возможно, файл слишком большой.`);
    }

    const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

    let base64Data;
    try {
      base64Data = await getFileAsBase64(fileUrl);
    } catch (error) {
      console.error(`ERROR downloading or converting photo:`, error);
      return await ctx.reply(`Не удалось загрузить фото для анализа. Попробуй еще раз.`);
    }

    const prompt = `Проанализируй это фото как бьюти-стилист. Дай советы по макияжу, прическе и общему стилю. Отвечай на русском языке.`;

    try {
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

      if (!text) {
        throw new Error(`Gemini returned empty response for photo`);
      }

      await ctx.reply(text);
    } catch (error) {
      console.error(`ERROR in Gemini Vision request:`, error);
      let errorMessage = `Извини, я не смогла проанализировать это фото. `;
      if (error.message.includes(`SAFETY`)) {
        errorMessage += `Возможно, система безопасности Gemini заблокировала изображение.`;
      } else if (error.message.includes(`quota`)) {
        errorMessage += `Превышена квота запросов к API. Попробуй позже.`;
      } else {
        errorMessage += `Произошла техническая ошибка при обращении к AI.`;
      }
      await ctx.reply(errorMessage);
    }
  } catch (error) {
    console.error(`CRITICAL ERROR in message:photo handler:`, error);
    await ctx.reply(`Произошла непредвиденная ошибка при обработке фото.`);
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

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error(`Gemini returned empty response for text`);
      }

      await ctx.reply(text);
    } catch (error) {
      console.error(`ERROR in Gemini Text request:`, error);
      let errorMessage = `Извини, я не смогла обработать твой запрос. `;
      if (error.message.includes(`quota`)) {
        errorMessage += `Превышена квота запросов к API. Попробуй позже.`;
      } else {
        errorMessage += `Произошла ошибка при обращении к AI.`;
      }
      await ctx.reply(errorMessage);
    }
  } catch (error) {
    console.error(`CRITICAL ERROR in message:text handler:`, error);
    await ctx.reply(`Произошла непредвиденная ошибка при обработке твоего сообщения.`);
  }
});

// Запуск бота
bot.start()
  .then(() => console.log(`Bot started!`))
  .catch((error) => console.error(`ERROR starting bot:`, error));
